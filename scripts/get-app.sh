#!/usr/bin/env bash
# get-app.sh — download the WDIO native demo app into ./apps (optional).
# Not required if you use the URL-based `appium:app` (the default): Appium
# downloads it for you. Use this only if you prefer a local/mounted APK.
set -euo pipefail
VER="${APP_VERSION:-2.2.0}"
URL="https://github.com/webdriverio/native-demo-app/releases/download/v${VER}/android.wdio.native.app.v${VER}.apk"
mkdir -p apps
echo "Downloading demo app v${VER} ..."
curl -fL "$URL" -o "apps/android.wdio.native.app.v${VER}.apk"
echo "Saved to apps/android.wdio.native.app.v${VER}.apk"
