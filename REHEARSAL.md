# REHEARSAL — prove it works before the organizer demo

## What's already verified (ran green in a clean environment)
- `npm install` resolves all WDIO 9.30.1 + Appium 2.19 deps (1164 pkgs, ~1 min).
- `npx wdio --version` works; the Android config loads with correct Appium caps.
- `npm run validate` — 5 device-free unit tests pass, 9 files syntax-checked.
- `npm run verify` — reports mode correctly (tools, toklite, key, Appium).
- `npm run demo:savings` — toklite cut a re-read payload by ~82% live, no key.

## What only YOU can verify (needs a real host + a key)
Do these once on your KVM host before the demo — I can't run an emulator or a
live aider session here:
1. The Android emulator boots in Docker and Appium answers.
2. A real `npm run android` run passes against the emulator.
3. A live `npm run ai` (aider through toklite) edits a spec end-to-end, and
   `npm run tok:stats` shows real (Anthropic-exact) savings.

---

## Part 1 — Rehearsal checklist (~30 min on your KVM host)

```bash
# 0. clean machine test (do this on a second laptop too if you can)
git clone <repo> wdio-mobile-ai-lab && cd wdio-mobile-ai-lab
npm install
npm install -g toklite aider-install && aider-install

# 1. device-free health (must be green)
npm run validate
npm run demo:savings        # rehearse the savings moment

# 2. bring up the emulator
docker compose up -d
#    watch it boot: http://localhost:6080  (~1-2 min to Android home screen)
node scripts/wait-for-appium.mjs           # blocks until Appium answers

# 3. baseline device run (no AI yet) — proves the pipe works
export APPIUM_HOST=127.0.0.1
npm run android -- --spec ./test/specs/login.spec.js
#    EXPECT: 'logs in with valid credentials' passes; watch it on noVNC.
#    If the success-alert text differs on your image, note it (see gotcha below).

# 4. live AI edit through toklite
export ANTHROPIC_API_KEY=<your workshop key>
npm run ai
#    /add test/specs/login.spec.js test/screenobjects/login.screen.js CONVENTIONS.md
#    "Complete the TODO: add a sign-up test asserting the alert contains 'signed
#     up'. Follow CONVENTIONS.md. Then run npm run validate."
#    EXPECT: aider edits both files, runs validate itself, commits each step.

# 5. run the AI-written test on the device, then show savings
npm run android -- --spec ./test/specs/login.spec.js
npm run tok:stats           # real, provider-verified tokens + $ saved
```

If every step is green, you're demo-ready. Time each step now so you know your
pacing on the day.

---

## Part 2 — Organizer demo script (~8 min, what to show + say)

Keep it tight. You're selling "edit a mobile test in English → it runs on a real
device → and toklite made it cheaper," with zero SDK setup.

1. **Framing (30s).** "Participants install no Android SDK. The emulator lives in
   Docker; they edit tests in plain English and it runs on a real device — and
   every request is routed through toklite, which cuts the token bill."

2. **Show the emulator already up (30s).** noVNC at :6080 — a real Android phone
   on screen. "This is what the room points at; nobody set it up."

3. **The AI edit (3 min).** `npm run ai`, give the one-line sign-up instruction,
   let aider edit the spec + screen object and auto-run `npm run validate`. Point
   out `git log --oneline` — every step committed. "It followed our CONVENTIONS.md
   — accessibility ids, always assert — because our standards are a file it reads."

4. **Run on the device (2 min).** `npm run android -- --spec …/login.spec.js`.
   Switch to noVNC and let them watch the AI-written test drive the app.

5. **The toklite reveal (1.5 min).** `npm run tok:stats` — tokens and dollars
   saved this session. "This is my tool, toklite — open source, one npm install,
   works in front of any AI coding CLI." Mention the room-wide tally at the real
   workshop.

6. **CI in one line (30s).** Point at `.gitlab-ci.yml`: "push, and this same test
   runs on a containerized emulator in the pipeline."

### If the emulator or wifi misbehaves on the day
- Skip steps 2/4. Run `npm run demo:savings` (no key, no device) for the toklite
  moment, and play a 30-second screen recording of a prior noVNC device run.
- Record that clip during rehearsal (step 3–4 above) so you always have a fallback.

## Known gotchas to check in rehearsal (from FACILITATOR.md)
- `ollama`/model — n/a here; model is via toklite → provider.
- Alert text: this app pops "logged in" / "signed up"; confirm on your image and
  adjust the specs if your build differs.
- Appium base path: config uses `/` (Appium 2). If your docker image is Appium 1,
  set `APPIUM_PATH=/wd/hub`.
- toklite bypass: if `npm run tok:stats` shows 0 requests, export
  `ANTHROPIC_API_BASE=http://127.0.0.1:8787` and relaunch aider.
