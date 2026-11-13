# Mobile Automation with AI — Workshop

Write mobile app tests by typing plain English to an AI, then run them on a real
Android phone in the cloud. The app under test is **GymProgress** (source in
`app/`), which you build once into an APK — see `APP-BUILD.md`. Setup is one command. Nothing heavy runs on your
laptop — no Android SDK, no emulator. The AI runs through **toklite** (which cuts
token cost), and the phone runs in **GitHub Actions** (free).

---

## 1. Get the project
```bash
git clone <your-repo-url> wdio-mobile-ai-lab
cd wdio-mobile-ai-lab
```

## 2. Set up — two ways (pick one)

### Fastest: in the browser (no install) — recommended for the workshop
Open the project in a **GitHub Codespace**: on your fork, click **Code →
Codespaces → Create codespace**. Everything (aider, toklite) is already
installed. Skip to step 3. Full details: `CODESPACES.md`.

### Or set up on your own machine
For the **workshop** we do this by hand, step by step, to learn it — see
`labs/01-installation.md`. To do it all at once instead:
```bash
npm run setup
```
This installs **uv + aider** (the AI tool, on the correct Python — no version
errors) and **toklite**, then checks your machine. Works on macOS, Windows, and
Linux, and is safe to re-run. It does **not** download the big WebdriverIO
packages — you don't need them locally (the phone runs in the cloud), so this is
quick.

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
/add test/specs/login.spec.js test/screenobjects/signin.screen.js test/screenobjects/home.screen.js CONVENTIONS.md
```
then type your request in plain English, e.g.:
```
Complete the TODO in login.spec.js: sign in with the demo account, then log a
workout and assert the count reads 'Workouts logged: 1'. Follow CONVENTIONS.md.
```
aider writes the test, checks it, and saves each change. Type `/exit` when done.
See how much toklite saved with `npm run tok:stats`.

## 5. The tests
- They live in **`test/specs/`** — `signup.spec.js` and `login.spec.js` (login has a TODO).
- Check them any time — instant, no phone needed:
  ```bash
  npm run validate
  ```

## 6. Run on a real phone — on the shared dashboard
Everyone runs on a real device in the cloud using the host's account, so all runs
appear on **one dashboard** the host projects live (each tagged with your name).
1. In `.env`, add your name and the host's cloud values (from the board):
   ```
   PARTICIPANT=YourName
   BROWSERSTACK_USERNAME=...   BROWSERSTACK_ACCESS_KEY=...   BSTACK_APP=bs://...
   ```
2. Run it:
   ```bash
   npm run android:cloud
   ```
3. Your run shows up on the host's dashboard with live video + a recording.

Full setup (host uploads the app once, shares credentials): `CLOUD-DASHBOARD.md`.

_Prefer a free option with no farm account? `GITHUB-ACTIONS.md` runs the phone in
GitHub's cloud instead._

> **Want the room to watch the phone live instead?** Run one shared Android
> emulator in Docker that everyone connects to and watches in a browser — see
> `SHARED-EMULATOR.md`. (Needs one x86 Linux host with KVM; a Mac can't host it
> but can connect as a client.)

---

## Command cheat-sheet
| Command | What it does |
|---|---|
| `npm run setup` | Install the AI tools locally (uv+aider, toklite) |
| `npm run verify` | Check your machine is ready |
| `npm run ai:groq` | Edit tests with the AI (free Groq) through toklite |
| `npm run validate` | Check the tests are valid (instant, no phone) |
| `npm run tok:stats` | Show tokens saved by toklite |
| `npm run android:cloud` | Run on a real phone; shows on the shared dashboard |

**The whole flow:** clone → `npm run setup` → add key → `npm run ai:groq` → `npm run android:cloud`.

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
- `APP-BUILD.md` — build the GymProgress app (EAS) and put it on BrowserStack (host, once).
- `CLOUD-DASHBOARD.md` — everyone's runs on one BrowserStack dashboard (host + pre-flight).
- `labs/03-challenges.md` — extra tasks to fill the full 2 hours.
- `RUNBOOK.md` / `FACILITATOR.md` — schedule and host notes.
- `TOKLITE.md` / `GROQ-SETUP.md` — AI/token-saving details.
- `CODESPACES.md` — run setup in the browser (no local install).
- Other ways to run the phone (not needed with BrowserStack): `GITHUB-ACTIONS.md`,
  `SHARED-EMULATOR.md`, `grid/README.md`, `CLOUD-DEVICE.md`, `MAC-EMULATOR.md`.
