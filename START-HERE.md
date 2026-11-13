# START HERE — how to run this workshop (plain English)

This is a 2-hour hands-on workshop. Participants take a ready-made mobile test
project, **edit the tests by typing plain English** to an AI tool, and **watch
the tests run on a real Android phone** — without installing any Android tools on
their laptop. The phone runs in the cloud/Docker; the AI runs through **toklite**
which quietly cuts the token cost.

There are two roles: **you (the host)** set up two things once. **Participants**
just clone and type. Here's each, in order.

---

> **Zero-install, free option:** let the phone run in **GitHub Actions** — push
> your code and the emulator runs in GitHub's cloud, giving you a video of the
> test. Nothing on your machine, no account. See **`GITHUB-ACTIONS.md`**.
>
> **Low on memory, or on a Mac?** The easiest path is to NOT run the phone on
> your computer at all — use a free cloud phone instead. It needs almost no
> memory and skips the Android install entirely. See **`CLOUD-DEVICE.md`**.
> The rest of this guide covers running the phone yourself; the cloud path
> replaces just that part.

## PART 1 — What YOU set up once (before the workshop)

You provide two things so participants don't have to install anything heavy.

### 1a. The Android phone (emulator) in Docker
On one Linux computer that has KVM (a cloud VM is fine), run:
```
docker compose up -d
```
> **On an Apple Silicon (M-series) Mac, Docker won't work** for this — the image
> is x86-only. Use the native emulator instead: see `MAC-EMULATOR.md`. Everything
> else (the AI editing, `npm run android`) is identical.
This starts a real Android emulator + Appium. Two URLs come out of it:
- **Watch the phone:** open `http://localhost:6080` in a browser (wait 1–2 min for
  the Android home screen to appear). If it's on another machine, use that
  machine's IP: `http://<ip>:6080`.
- **Appium (what the tests connect to):** `http://localhost:4723` — you don't open
  this in a browser; the tests use it. Confirm it's ready with:
  ```
  node scripts/wait-for-appium.mjs
  ```

So the two values participants set are:
- `APPIUM_HOST` = `127.0.0.1` if they run Docker on their own laptop, otherwise the
  emulator computer's IP.
- `APPIUM_PORT` = `4723` (the default; only set it if you changed it).

### 1b. The AI access (a key)
Get one Anthropic API key for the workshop (set a small spend limit on it).
Write this on the board for the room:
```
export ANTHROPIC_API_KEY=<the key>
export APPIUM_HOST=<the emulator computer's IP>
```
That's all participants need from you.

> No Anthropic key? Use the free Groq option instead — see `TOKLITE.md`,
> "Path B". Participants run `npm run ai:groq` with a free Groq key.

---

## PART 2 — What each PARTICIPANT does

### Step 1 — Get the project and the tools (once, ~5 min)
```
git clone <your-repo-url> wdio-mobile-ai-lab
cd wdio-mobile-ai-lab
npm install
npm install -g toklite
python -m pip install aider-install && aider-install
```

### Step 2 — Point at the workshop (paste what's on the board)
```
export ANTHROPIC_API_KEY=<key from the board>
export APPIUM_HOST=<ip from the board>
```

### Step 3 — Check everything is ready
```
npm run verify
```
It prints a checklist and tells you your mode. If it says "FULL mode", you're set.

### Step 4 — Edit a test by typing English (the main activity)
```
npm run ai
```
This opens the AI (aider), running through toklite. Inside it, type:
```
/add test/specs/login.spec.js test/screenobjects/login.screen.js CONVENTIONS.md
```
then type, in plain English:
```
Complete the TODO: add a sign-up test that signs up with a fresh email and
checks the alert says 'signed up'. Follow CONVENTIONS.md. Then run npm run validate.
```
The AI writes the test, checks it, and saves each change. Type `/exit` when done.

### Step 5 — Run your test on the real phone
```
npm run android
```
Open `http://<APPIUM_HOST>:6080` in a browser and watch the AI-written test drive
the app on a real Android screen.

### Step 6 — See how much toklite saved
```
npm run tok:stats
```
This shows the tokens (and money) toklite saved during your session.

---

## The order of the 2 hours (your run sheet)
Full detail for each is in the `labs/` folder and `RUNBOOK.md`.

1. `labs/00-setup.md` — get running (Steps 1–3 above)
2. `labs/01-recon.md` — ask the AI what's missing
3. `labs/02-update-tests.md` — edit tests in English (Step 4)
4. `labs/03-run-docker.md` — run on the real phone (Step 5)
5. `labs/04-ci.md` — push and let CI run it
6. `labs/05-toklite.md` — the savings reveal (Step 6)

---

## Before you demo to the organizer
Do a full practice run once, on your emulator computer. The exact steps and the
expected result at each point are in **`REHEARSAL.md`**, plus an 8-minute script
for what to show and say.

Quick safety net: if wifi or the emulator misbehaves during the demo, run this —
it proves the toklite savings live with **no key and no phone needed**:
```
npm run demo:savings
```

## If you get stuck
- `FACILITATOR.md` — how you set up the emulator and key, plus common fixes.
- `TOKLITE.md` — the AI/token-saving setup (Anthropic or free Groq).
- `RUNBOOK.md` — the participant guide.
