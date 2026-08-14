# Lab 03 - Run on a real emulator via Docker (25 min)

## The wow
The tests you just wrote in plain English now run on a **real Android emulator** -
and you never installed the Android SDK. The emulator + Appium live in Docker.

## If your facilitator hosts the emulator (most common)
```bash
export APPIUM_HOST="<facilitator-ip>"   # on the board
npm run android
```
Open the facilitator's noVNC link (`http://<ip>:6080`) to watch your test drive
the app live.

## If you run Docker locally (Linux host with KVM)
```bash
docker compose up -d
open http://localhost:6080          # watch the emulator boot (~1-2 min)
APPIUM_HOST=127.0.0.1 npm run android
```

## Run it from inside the AI-CLI
You can also let the agent run it:
```
npm run ai
  /run npm run android
```
If a test fails on the device, ask aider to fix the screen object (not the
assertion), per CONVENTIONS.md, then re-run.

## OFFLINE path
No emulator access? Watch the facilitator's live run and read the spec you wrote -
it's the same code that executes on the device.

## Done when
Your login/sign-up tests pass against the emulator (or you watched them pass).
