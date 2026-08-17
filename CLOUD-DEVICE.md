# The light way: run on a cloud phone (no emulator, no Android SDK)

If your machine is low on memory, don't run the phone locally at all. Use a
**cloud device farm** (BrowserStack) — a real Android phone runs in the cloud and
you watch it in your browser. Locally you only need Node + this project + the AI
tools, which is light on RAM. This also avoids the Apple-Silicon Docker problem.

## What you install locally (light)
```bash
npm install                 # WDIO core only — NO heavy Appium/emulator
npm install -g toklite
python -m pip install aider-install && aider-install
```
That's it — no Android SDK, no emulator, no `appium` server.

## One-time cloud setup
1. Free trial + credentials: https://www.browserstack.com/users/sign_up
   (copy your Username and Access Key from Account → Settings)
2. Set them, and download the demo app once:
   ```bash
   export BROWSERSTACK_USERNAME=your_username
   export BROWSERSTACK_ACCESS_KEY=your_key
   npm run get-app          # downloads the demo APK to ./apps (one time)
   ```

## Run it
```bash
npm run android:cloud
```
The test runs on a real phone in the cloud. Open the **App Automate** dashboard
to watch the live video and see logs/screenshots. The APK uploads once (a
`custom_id` keeps later runs from re-uploading).

Pick a different device if you like:
```bash
BSTACK_DEVICE="Google Pixel 8" BSTACK_OS="14.0" npm run android:cloud
```

## Everything else is the same
The AI editing (`npm run ai` / `npm run ai:groq`), `npm run validate`, and the
labs are identical. Only *where the phone runs* changed.

## Good to know
- **For a whole room:** free trials usually allow **1 test at a time**. Great for
  your demo and for taking turns; for many people running at once you'd need a
  paid plan with parallels, or have the room edit locally and run in CI.
- Prefer LambdaTest or Sauce Labs? Same idea — tell me and I'll add that config.
- Want the phone to run for free in CI instead of a farm? GitHub Actions can run
  an emulator on every push (no local install, no farm account) — ask and I'll
  add the workflow.
