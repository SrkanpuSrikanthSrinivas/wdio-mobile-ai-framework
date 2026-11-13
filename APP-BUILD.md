# Build the GymProgress app (one time) and put it on BrowserStack

The app source is in `app/`. You build it into an installable **APK** once, using
Expo's free cloud build (EAS) — no Android SDK needed on your machine — then
upload that APK to BrowserStack. Everyone in the workshop tests against it.

## 1. Prerequisites
- A free **Expo account**: https://expo.dev/signup
- Node (you already have it)

## 2. Build the APK (Expo cloud build)
```bash
cd app
npm install
npx expo install react-native-svg   # aligns the chart lib to the Expo SDK
npm install -g eas-cli
eas login                       # your Expo account
eas build -p android --profile preview
```
- The `preview` profile (in `app/eas.json`) produces an **APK** (not an AAB).
- The build runs on Expo's servers (~10–15 min). When it finishes, the CLI prints
  a download URL, and it's also on https://expo.dev under your project's Builds.
- Download the `.apk`.

> First build only: EAS may ask to generate an Android keystore — answer **yes**
> (it manages signing for you).

## 3. Upload the APK to BrowserStack (once)
```bash
curl -u "USER:ACCESS_KEY" -X POST https://api-cloud.browserstack.com/app-automate/upload \
  -F "file=@GymProgress.apk" -F "custom_id=GymProgress"
# response has "app_url":"bs://<id>"  ->  that's BSTACK_APP for the room
```

## 4. Put on the board
```
BROWSERSTACK_USERNAME=<your user>
BROWSERSTACK_ACCESS_KEY=<your key>
BSTACK_APP=bs://<id from step 3>
```
Participants set these in `.env` and run `npm run android:cloud` — same as before.

## Verify once before the workshop
Run the pre-flight in `CLOUD-DASHBOARD.md`: one `npm run android:cloud` under your
account, and confirm the GymProgress test appears green on the dashboard.

## If a selector doesn't resolve on the device
The app sets each element's `accessibilityLabel` = its id, so Appium finds them as
`~<id>` on Android (e.g. `~input-email`, `~button-signin`). If any does not match,
open the relevant screen object in `test/screenobjects/` and switch that line to a
locator, e.g. `android=new UiSelector().resourceId("com.aiqeacademy.gymprogress:id/…")`.
Everything is centralised in that screen object, so it's a one-line fix.

## Try the app locally (optional)
```bash
cd app && npm install && npx expo start    # open in Expo Go on your phone
```
