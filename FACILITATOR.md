# FACILITATOR GUIDE

Running the 2-hour "Mobile Automation with an AI-CLI" lab. Not for participants.

## The pitch
A real WDIO + Appium framework where participants update mobile tests in plain
English and run them on a real emulator - without installing the Android SDK.
The memorable line: "you edited a mobile test in English and it ran on a real
device in CI, and you installed nothing." Two takeaways they rarely have:
rules-as-a-file (`CONVENTIONS.md`) and a device-free inner loop that keeps AI
editing fast.

## You run two things centrally
Participants set two env vars and nothing else. YOU provide:

### 1. The AI-CLI routing (toklite)
Every participant runs aider **through toklite** (`npm run ai`), so the workshop
doubles as a live demo of your tool - they install it, use it, and see their own
savings. Pick the provider path and put the key on the board.

**Path A - Anthropic (recommended for the savings reveal).** Exact, free-to-prove
numbers. Provide a spend-capped Anthropic key (create a dedicated key, set a low
budget, rotate after). Cost is tiny - small tasks on a cheap model, cut ~40-50% by
toklite. Board:
```
export ANTHROPIC_API_KEY="<workshop-key>"
```

**Path B - Groq through toklite (free; no Anthropic key).** For a zero-cost room.
Each participant makes a free Groq key (no card) and runs `npm run ai:groq`, which
points toklite's OpenAI upstream at Groq for them. Tell them to
`npm install -g js-tiktoken` so `tok:stats` shows an estimate, and be honest that
Path B's number is estimated while Path A's is provider-verified. Board:
```
export GROQ_API_KEY="gsk_..."      # https://console.groq.com/keys
npm install -g js-tiktoken
```

Full detail for both paths is in `TOKLITE.md`. **Pre-test your chosen path once:**
run a short `npm run ai` (or `ai:groq`) session, then `npm run tok:stats` - if it
shows 0 requests, aider bypassed the proxy; export `ANTHROPIC_API_BASE` /
`OPENAI_API_BASE` = `http://127.0.0.1:8787` and relaunch.

### The toklite reveal (Lab 05, the closing beat)
End on the tool: have everyone run `npm run tok:stats`, call out their saved %,
and tally the room ("dozens of agent sessions, one number"). Then the CTA -
`npm install -g toklite`, the npm/GitHub links, a star. The editing loop is
toklite's best case (repeated file reads → dedupe/diffReads), so the numbers land.

### 2. The Android emulator (Docker)
On a **Linux host with KVM**, run the shared emulator so the room points at it:
```bash
docker compose up -d
# noVNC to watch:  http://<your-ip>:6080
```
Board:
```
export APPIUM_HOST="<your-ip>"
export APPIUM_PORT="4723"
```
Notes:
- **KVM is required** - macOS/Windows laptops can't run the x86 emulator, which is
  exactly why you host it. A cloud dev box (GCP/AWS Linux, nested-virt on) works.
- One shared emulator serializes runs. For a big room, run 2-3 containers on
  different ports (4723/4733/4743) and split people across them, or give teams
  turns. The device-free `npm run validate` loop means most of the 35-min editing
  lab needs no device at all - only Lab 03 hits the emulator.
- First `npm run android` downloads the ~118 MB demo APK via Appium; pre-warm it
  once on your host so it's cached.

### Plan B (no Linux/KVM host)
Point `appium:app` and capabilities at a **cloud device farm** (BrowserStack /
Sauce Labs / LambdaTest free trial) instead of Docker. Set `APPIUM_HOST` to the
farm endpoint and add their auth caps. Participants change nothing else.

## Pre-workshop email (3-5 days ahead)
Clone, `npm install`, install `aider`. You'll get a proxy URL, token, and an
APPIUM_HOST at the start - nothing to buy or download. If a laptop can't do the
device parts, EDIT-ONLY mode still covers the core skill.

## Timing discipline
- Hard-stop setup at 0:10; anyone not FULL goes EDIT-ONLY and joins the device
  run in Lab 03 by watching noVNC.
- Lab 02 (update tests) is the heart - protect its 35 min. Make sure people SEE
  aider run `npm run validate` itself after each edit; that's the "it just works"
  moment.
- Lab 03 is the crowd-pleaser: the AI-written test driving a real app on screen
  via noVNC. Demo yours first if the shared emulator is a bottleneck.

## Live demo script (~4 min, up front)
```bash
aider
  /add test/specs/login.spec.js test/screenobjects/login.screen.js CONVENTIONS.md
  Complete the TODO: add a sign-up test that asserts the alert contains 'signed up'.
  Follow CONVENTIONS.md. Then run npm run validate.
/run npm run android      # then show it on noVNC
```

## The seeded task
`test/specs/login.spec.js` has a `TODO` for a sign-up test; the empty-field case
is a good second ask. Reference: `solutions/login.solution.spec.js`. The app's
success alerts contain "logged in" / "signed up".

## Common gotchas
- `aider: command not found` -> `python -m aider`.
- Appium unreachable -> laptop on room wifi? `npm run verify` pings `/status`.
  Docker host bound 0.0.0.0 and port 4723 published?
- Emulator black screen / won't boot -> KVM missing (`ls -l /dev/kvm`) or too
  little RAM; give Docker >= 4 GB and `shm_size: 2gb` (already set).
- Model alias mismatch -> `aider --model openai/<your-alias>`.
- Appium 1 vs 2 base path -> this config uses `/` (Appium 2). If your image is
  Appium 1, set `APPIUM_PATH=/wd/hub`.

## Reset between sessions
```bash
git checkout -- test/specs/login.spec.js
# remove any test the room added, e.g. test/specs/signup.spec.js
```
