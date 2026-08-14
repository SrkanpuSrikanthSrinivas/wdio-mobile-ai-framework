# Mobile Automation with AI — Workshop

Write mobile app tests by typing plain English to an AI, then run them on a real
Android phone in the cloud. Setup is one command. Nothing heavy runs on your
laptop — no Android SDK, no emulator. The AI runs through **toklite** (which cuts
token cost), and the phone runs in **GitHub Actions** (free).

---

## 1. Get the project
```bash
git clone <your-repo-url> wdio-mobile-ai-lab
cd wdio-mobile-ai-lab
```

## 2. Run the one-command setup
```bash
npm run setup
```
This installs everything for you: **uv + aider** (the AI tool, on the correct
Python — no version errors), **toklite**, and the project dependencies. Then it
checks your machine. It works on macOS, Windows, and Linux, and is safe to re-run.

> If a command says "not found" afterward, open a **new terminal** (PATH updates
> after install) and run `npm run verify`.

## 3. Add your AI key (two options — pick one)

**Option A — use the shared workshop key (easiest).** The host will give you one
line. Create a file named **`.env`** (copy `.env.example`) and paste it in:
```
GROQ_API_KEY=gsk_the_key_the_host_shares
```

**Option B — use your own free key.** Make one at https://console.groq.com/keys
(no credit card) and put it in the same `.env` file.

Either way it's a Groq key and it's free to you. (Prefer `export GROQ_API_KEY=...`
over a file? That works too — on Windows use `setx GROQ_API_KEY gsk_...` and open
a new window.)

## 4. Edit a test with the AI
```bash
npm run ai:groq
```
This opens aider through toklite. Inside it, type:
```
/add test/specs/login.spec.js test/screenobjects/login.screen.js CONVENTIONS.md
```
then type your request in plain English, e.g.:
```
Complete the TODO: add a sign-up test that signs up with a fresh email and
checks the alert says 'signed up'. Follow CONVENTIONS.md. Then run npm run validate.
```
aider writes the test, checks it, and saves each change. Type `/exit` when done.
See how much toklite saved with `npm run tok:stats`.

## 5. The tests
- They live in **`test/specs/`** (start with `login.spec.js`, which has a TODO).
- Check them any time — instant, no phone needed:
  ```bash
  npm run validate
  ```

## 6. Run on a real phone (GitHub Actions)
1. Put this project in a **GitHub** repo (fork the host's repo) and, on your
   fork's **Actions** tab, click the green **enable** button once.
2. `git push` — the tests run on a real Android emulator in the cloud.
3. Open the **Actions** tab → the job → **Artifacts → android-results** →
   download **`demo.mp4`** to watch your test drive the app.

Fork + enable steps in detail: `GITHUB-ACTIONS.md`.

---

## Command cheat-sheet
| Command | What it does |
|---|---|
| `npm run setup` | Install everything (uv+aider, toklite, deps) |
| `npm run verify` | Check your machine is ready |
| `npm run ai:groq` | Edit tests with the AI (free Groq) through toklite |
| `npm run validate` | Check the tests are valid (instant, no phone) |
| `npm run tok:stats` | Show tokens saved by toklite |
| `git push` | Run the tests on a real phone in GitHub Actions |

**The whole flow:** clone → `npm run setup` → add key → `npm run ai:groq` → push.

---

## Shared key vs. your own key (for the host)
Both use the same `GROQ_API_KEY` — only where it comes from differs, so either
works with no code change.
- **Shared (your key for the room):** put your key on a slide; everyone pastes it
  into `.env`. Simplest, but one **free** Groq key shared by many people can hit
  rate limits — smoother if your Groq account is on a paid tier, and toklite's
  reduction/caching helps. Rotate or delete the key after the session.
- **Personal:** each person makes their own free key (2 minutes). No rate
  contention. Best for larger rooms.

---

## Troubleshooting
- **`aider: command not found`** → open a **new terminal**. Still missing?
  `uv tool update-shell`, then a new terminal, or use `python3 -m aider`.
- **`spawn aider ENOENT`** → aider isn't on PATH yet; new terminal, or re-run
  `npm run setup`.
- **aider warns "model not found"** → harmless, continue.
- **`npm run tok:stats` shows 0 requests** → `export OPENAI_API_BASE=http://127.0.0.1:8787/v1`
  and relaunch `npm run ai:groq`.
- **Windows** → use PowerShell; `setx VAR value` (new window) for env vars.

## Optional / advanced (ignore unless you need it)
- `PRE-WORKSHOP.md` — a day-before checklist (only if you choose to send one).
- `RUNBOOK.md` — the 2-hour schedule and lab-by-lab guide.
- `FACILITATOR.md` — host notes.
- `GITHUB-ACTIONS.md` — participants running the phone on their own GitHub.
- `CLOUD-DEVICE.md` / `MAC-EMULATOR.md` — other ways to run the phone.
- `TOKLITE.md` / `GROQ-SETUP.md` — AI/token-saving details.
