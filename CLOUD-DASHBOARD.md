# Everyone on one dashboard (BrowserStack App Automate)

Every participant runs on a real device using **your** BrowserStack account, so
all runs appear on **one dashboard** you project live — each tagged with the
person's name, grouped under one build. Nothing installed locally but the WDIO
client.

## Why shared credentials
To see everyone's runs in one place, everyone uses **your** username + access
key. Runs are labelled by `PARTICIPANT` and share one `buildName`, so your
dashboard shows "Alice - …", "Bob - …" together.

> **Parallel note:** how many can run *at the same time* = your plan's parallel
> sessions. A trial is usually 1 (runs queue but still all appear). For a lively
> room, ask BrowserStack for enough parallels for your headcount (see the
> outreach message). All runs are visible either way.

---

## Host setup (once)

### 1. Upload the demo app → get the app URL
```bash
npm run get-app         # downloads the demo APK to ./apps
curl -u "USER:ACCESS_KEY" -X POST https://api-cloud.browserstack.com/app-automate/upload \
  -F "file=@apps/android.wdio.native.app.v2.2.0.apk" -F "custom_id=WdioDemoApp"
# the response has "app_url":"bs://<id>"  -> that's BSTACK_APP
```

### 2. Put these on the board
```
BROWSERSTACK_USERNAME=<your user>
BROWSERSTACK_ACCESS_KEY=<your key>
BSTACK_APP=bs://<id from step 1>
```

---

## Participant flow
1. Copy `.env.example` to `.env` and fill in your name + the host's three values.
2. `npm install` (once — light, no local Appium).
3. Edit a test with the AI (`npm run ai:groq`), then run it:
   ```bash
   npm run android:cloud
   ```
4. Your run appears on the host's dashboard with live video + a recording.

## Host during the workshop
Keep **App Automate → Builds** open on the projector, filtered to your build name.
As people run, their sessions appear with their names — call them out, play the
videos, celebrate green runs.

---

## Host pre-flight (~10 min, before the workshop)
Do this once your BrowserStack access is active, to prove the whole path:
1. `export BROWSERSTACK_USERNAME=... BROWSERSTACK_ACCESS_KEY=...`
2. Upload the app (step 1 above); note the `bs://` id.
3. `export BSTACK_APP=bs://<id>  PARTICIPANT="Host Test"`
4. `npm install` then `npm run android:cloud`.
5. Open **App Automate → Builds** and confirm your "Host Test" session appears
   with a video and a passing test. That's the exact thing 30 people will do.

If that session shows up green on your dashboard, you're ready.

## Notes
- `.env` is never committed; the shared key stays out of git. Rotate/delete it
  after the session.
- Change device/OS with `BSTACK_DEVICE` / `BSTACK_OS`.
