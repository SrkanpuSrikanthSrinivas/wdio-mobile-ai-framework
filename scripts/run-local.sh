#!/usr/bin/env bash
# run-local.sh — run the specs on a local Android emulator (Apple Silicon, no Docker).
# Checks prerequisites, boots the emulator and starts Appium if they aren't already
# running, runs the gate, then the specs. Output is also saved to logs/run-local.log.
set -uo pipefail
cd "$(dirname "$0")/.."
mkdir -p logs
exec > >(tee logs/run-local.log) 2>&1

ok()   { printf "  \033[32m✓\033[0m %s\n" "$*"; }
bad()  { printf "  \033[31m✗\033[0m %s\n" "$*"; }
step() { printf "\n\033[1m== %s\033[0m\n" "$*"; }

# Find the Android SDK the way MAC-EMULATOR.md sets it up, or Android Studio's default.
for d in "${ANDROID_HOME:-}" "${ANDROID_SDK_ROOT:-}" "$HOME/Library/Android/sdk" "$(brew --prefix 2>/dev/null)/share/android-commandlinetools"; do
  if [ -n "$d" ] && [ -x "$d/platform-tools/adb" ]; then export ANDROID_HOME="$d"; break; fi
done
export PATH="${ANDROID_HOME:-}/platform-tools:${ANDROID_HOME:-}/emulator:${ANDROID_HOME:-}/cmdline-tools/latest/bin:$PATH"

step "1. Prerequisites"
missing=0
command -v node >/dev/null     && ok "node $(node -v)"                       || { bad "node not found"; missing=1; }
command -v java >/dev/null     && ok "java: $(java -version 2>&1 | head -1)"  || { bad "java not found  → brew install --cask temurin@17"; missing=1; }
[ -n "${ANDROID_HOME:-}" ]     && ok "Android SDK: $ANDROID_HOME"             || { bad "Android SDK not found → see MAC-EMULATOR.md"; missing=1; }
command -v adb >/dev/null      && ok "adb $(adb version | head -1 | awk '{print $5}')" || { bad "adb not found"; missing=1; }
command -v emulator >/dev/null && ok "emulator found"                         || { bad "emulator not found → sdkmanager emulator"; missing=1; }
command -v appium >/dev/null   && ok "appium $(appium --version 2>/dev/null)" || { bad "appium not found → npm install -g appium"; missing=1; }
if command -v appium >/dev/null; then
  appium driver list --installed 2>&1 | grep -qi uiautomator2 && ok "uiautomator2 driver installed" \
    || { bad "uiautomator2 driver missing → appium driver install uiautomator2"; missing=1; }
fi
[ "$missing" = 0 ] || { echo; echo "Fix the ✗ items above, then run this again."; exit 1; }

step "2. Device-free gate"
npm run -s validate || { echo "Gate failed — fix before touching a device."; exit 1; }

step "3. Android device"
if adb devices | awk 'NR>1 && $2=="device"' | grep -q .; then
  ok "already connected: $(adb devices | awk 'NR>1 && $2=="device"{print $1}' | head -1)"
else
  AVD="${AVD:-$(emulator -list-avds | grep -m1 -E '^wdio$' || emulator -list-avds | head -1)}"
  [ -n "$AVD" ] || { bad "no emulator (AVD) found → avdmanager create avd ... (MAC-EMULATOR.md)"; exit 1; }
  ok "booting emulator '$AVD' (a window opens)"
  nohup emulator -avd "$AVD" -no-snapshot-save -no-boot-anim >logs/emulator.log 2>&1 &
  EMU_PID=$!
  for i in $(seq 1 90); do
    if ! kill -0 "$EMU_PID" 2>/dev/null; then
      bad "the emulator stopped while starting. Its reason:"
      grep -E "FATAL|ERROR|PANIC" logs/emulator.log | tail -3 | sed 's/^/      /'
      grep -q "Not enough space" logs/emulator.log && \
        echo "      → free disk space, or shrink the AVD's disk: see MAC-EMULATOR.md (\"Low on disk space\")"
      exit 1
    fi
    [ "$(adb shell getprop sys.boot_completed 2>/dev/null | tr -d '\r')" = "1" ] && break
    [ $((i % 10)) = 0 ] && echo "    still booting… ($((i*2))s)"
    sleep 2
  done
  [ "$(adb shell getprop sys.boot_completed 2>/dev/null | tr -d '\r')" = "1" ] && ok "booted" || { bad "emulator didn't finish booting in 3 min"; exit 1; }
fi

step "4. Appium"
STARTED_APPIUM=0
if curl -sf http://127.0.0.1:4723/status >/dev/null; then
  ok "already running on :4723"
else
  nohup appium --log-level warn >logs/appium.log 2>&1 &
  APPIUM_PID=$!; STARTED_APPIUM=1
  for i in $(seq 1 30); do curl -sf http://127.0.0.1:4723/status >/dev/null && break; sleep 1; done
  curl -sf http://127.0.0.1:4723/status >/dev/null && ok "started on :4723 (log: logs/appium.log)" || { bad "Appium didn't start — see logs/appium.log"; exit 1; }
fi
trap '[ "$STARTED_APPIUM" = 1 ] && kill $APPIUM_PID 2>/dev/null' EXIT

step "5. Run the specs"
APK="$PWD/apps/android.wdio.native.app.v2.2.0.apk"
[ -f "$APK" ] && export APP_URL="$APK" && ok "app: apps/$(basename "$APK")"
SPEC="${1:-}"; [ -n "$SPEC" ] && ok "spec: $SPEC"
APPIUM_HOST=127.0.0.1 npm run -s android -- ${SPEC:+--spec "$SPEC"}
code=$?
echo; [ $code = 0 ] && echo "LOCAL RUN: PASSED" || echo "LOCAL RUN: FAILED (exit $code) — full output in logs/run-local.log"
exit $code
