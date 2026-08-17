# Over-the-air updates with EAS Update (for JS-only changes)

Once this is set up, **JS-only** changes (copy, styling, test-app tweaks, most
logic) reach installed apps in seconds — no new APK, no re-upload to BrowserStack.
It does **not** cover native changes (adding a native module, changing app config,
bumping the SDK) — those still need `eas build`.

The config is already in place: `runtimeVersion` (appVersion policy) in `app.json`
and `channel`s in `eas.json`.

## One-time setup
```bash
cd app
npx expo install expo-updates      # the OTA runtime
eas update:configure               # writes your project's update URL/id into app.json
eas build -p android --profile preview   # ONE build that embeds expo-updates
```
Upload that APK to BrowserStack once. From now on, that installed build can pull
OTA updates on the `preview` channel.

## Every JS-only change after that
```bash
cd app
eas update --branch preview --message "what changed"
```
The next time the app launches (on BrowserStack or a phone), it fetches the new
JS. No rebuild, no re-upload.

## When you still need a full build (`eas build`)
- Adding/removing a native module (like when we added react-native-svg)
- Changing `app.json` native config (package name, permissions, icons)
- Bumping the Expo SDK
- Changing `version` (the appVersion runtimeVersion policy ties updates to it — a
  build on 1.1.0 only gets updates published while it stays 1.1.0)

## Quick mental model
- `eas build`  → new native binary (APK). Needed for native/config/version changes.
- `eas update` → new JS over the air. Great for fast iteration on everything else.
