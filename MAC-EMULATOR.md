# Running the emulator on Apple Silicon (no Docker)

`docker compose up` uses an **x86-only** Android image that can't run on an
M-series Mac. On Apple Silicon you run the emulator **natively** (fast, via
Hypervisor.framework) and start Appium locally. The lab framework doesn't change
— it connects to Appium through `APPIUM_HOST`/`APPIUM_PORT`, so this just becomes
the thing it points at.

Key rule: use an **arm64-v8a** system image. An x86_64 image would be emulated
and painfully slow.

## One-time setup
```bash
# JDK 17 (Appium's UiAutomator2 driver needs a JDK) + Android command-line tools
brew install --cask temurin@17
brew install --cask android-commandlinetools

export ANDROID_HOME="$(brew --prefix)/share/android-commandlinetools"
export PATH="$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$PATH"

yes | sdkmanager --licenses
sdkmanager "platform-tools" "emulator" "platforms;android-35" \
           "system-images;android-35;google_apis;arm64-v8a"

# create the virtual device (list options with: avdmanager list device)
avdmanager create avd -n wdio -k "system-images;android-35;google_apis;arm64-v8a" --device "pixel_8"

# Appium + the Android driver
npm install -g appium
appium driver install uiautomator2
```

## Every session
```bash
# 1. boot the phone (a window opens; wait for the home screen)
emulator -avd wdio -no-snapshot -no-boot-anim &

# 2. start Appium
appium &                       # local demo: listens on http://127.0.0.1:4723
# for a room pointing at YOUR mac, bind all interfaces:
# appium --address 0.0.0.0 --base-path / &

# 3. run the lab against it
export APPIUM_HOST=127.0.0.1    # participants use your Mac's LAN IP instead
node scripts/wait-for-appium.mjs
npm run android
```

## Notes
- Watch the phone in the emulator window (no noVNC needed — that was a Docker thing).
- `sdkmanager --list` shows exact package names if `android-35` isn't right on
  your machine; any recent API with an `arm64-v8a` image works.
- This replaces `docker compose up` **only on Apple Silicon / ARM hosts**. On an
  x86 Linux host with KVM, the Docker path in `docker-compose.yml` still works.

## Don't want to install the SDK at all?
Point the tests at a cloud device farm (BrowserStack / LambdaTest / Sauce Labs
free trial) instead — no local Android, works on any host. See
`config/wdio.browserstack.conf.js` and `CLOUD-DASHBOARD.md`.
