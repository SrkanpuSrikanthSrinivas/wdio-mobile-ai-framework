#!/usr/bin/env bash
# run-cloud.sh — run the specs on a real phone in BrowserStack App Automate.
# Loads credentials from .env (never printed), runs the gate, then the specs.
# Output is also saved to logs/run-cloud.log.
set -uo pipefail
cd "$(dirname "$0")/.."
mkdir -p logs
exec > >(tee logs/run-cloud.log) 2>&1

ok()   { printf "  \033[32m✓\033[0m %s\n" "$*"; }
bad()  { printf "  \033[31m✗\033[0m %s\n" "$*"; }
step() { printf "\n\033[1m== %s\033[0m\n" "$*"; }

step "1. Credentials"
[ -f .env ] && { set -a; . ./.env; set +a; }
[ -n "${BROWSERSTACK_USERNAME:-}" ]   && ok "BROWSERSTACK_USERNAME set"   || { bad "BROWSERSTACK_USERNAME missing (.env)"; exit 1; }
[ -n "${BROWSERSTACK_ACCESS_KEY:-}" ] && ok "BROWSERSTACK_ACCESS_KEY set" || { bad "BROWSERSTACK_ACCESS_KEY missing (.env)"; exit 1; }
code=$(curl -s -o /dev/null -w "%{http_code}" -u "$BROWSERSTACK_USERNAME:$BROWSERSTACK_ACCESS_KEY" https://api-cloud.browserstack.com/app-automate/plan.json)
[ "$code" = 200 ] && ok "credentials accepted by BrowserStack" || { bad "BrowserStack rejected the credentials (HTTP $code)"; exit 1; }

step "2. App"
APK="apps/android.wdio.native.app.v2.2.0.apk"
if [ -f "$APK" ]; then
  unset BSTACK_APP   # upload the local APK (custom_id avoids re-uploading the same build)
  ok "uploading $APK (first run only; later runs reuse it)"
elif [ -n "${BSTACK_APP:-}" ]; then
  ok "using app from .env ($BSTACK_APP)"
else
  bad "no APK and no BSTACK_APP → npm run get-app"; exit 1
fi

step "3. Device-free gate"
npm run -s validate || { echo "Gate failed — fix before spending a cloud session."; exit 1; }

step "4. Run on ${BSTACK_DEVICE:-Samsung Galaxy S23} (Android ${BSTACK_OS:-13.0})"
SPEC="${1:-}"; [ -n "$SPEC" ] && ok "spec: $SPEC"
npm run -s android:cloud -- ${SPEC:+--spec "$SPEC"}
code=$?
echo; [ $code = 0 ] && echo "CLOUD RUN: PASSED" || echo "CLOUD RUN: FAILED (exit $code) — full output in logs/run-cloud.log"
echo "Dashboard: https://app-automate.browserstack.com/dashboard/v2"
exit $code
