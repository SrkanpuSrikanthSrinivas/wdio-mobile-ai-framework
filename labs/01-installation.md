# Lab 01 — Step-by-step installation (~45 min)

We'll build the setup one piece at a time and understand *why* each piece exists.
By the end you'll know how to stand up an AI-driven WebdriverIO + Appium mobile
framework yourself — not just run a script.

> In a hurry later? `npm run setup` does Part A + B in one command. Today we do it
> by hand to learn it.

---

## Part A — The tools (what each one is)

### A1. Node.js and Git (the base)
Everything here is a Node project, and we use Git to clone it and to push work.
```bash
node --version    # need v18+
git --version
```
If either is missing: Node from https://nodejs.org, Git from https://git-scm.com.
**Check:** both print a version.

### A2. uv — a Python tool installer
Our AI tool (aider) is written in Python. `uv` installs it cleanly and brings the
*correct* Python version with it, so we avoid "wrong Python / build failed" errors.
```bash
# macOS / Linux
curl -LsSf https://astral.sh/uv/install.sh | sh
# Windows (PowerShell)
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"
```
**Check:** open a **new terminal**, then `uv --version` prints a version.

### A3. aider — the AI command-line assistant
aider is the tool you'll "talk to" in plain English to write tests. It reads your
files, makes edits, and can run commands.
```bash
uv tool install --python 3.12 aider-chat
```
**Check:** `aider --version` prints a version. (If "not found", open a new terminal.)

### A4. toklite — the token-saving proxy
Every request to the AI passes through toklite, which strips repeated content
(like the same file read twice) to cut token cost. It runs locally on your machine.
```bash
npm install -g toklite js-tiktoken
```
**Check:** `toklite --help` prints usage.

### A5. A Groq API key — the free AI engine
Groq runs the AI model for free (no credit card). Make a key at
https://console.groq.com/keys (it starts `gsk_`). Keep it handy for Part B.
> Your host may share one key for the room instead — either works.

---

## Part B — The project

### B1. Clone it
```bash
git clone <repo-url> wdio-mobile-ai-lab
cd wdio-mobile-ai-lab
```

### B2. Install the framework (the WebdriverIO client)
This pulls WebdriverIO and its runner — the tool that actually executes tests.
It's light because the phone runs in the cloud (BrowserStack), so no emulator here.
```bash
npm install
```
**Check:** a `node_modules` folder appears and there are no red errors.

### B3. Your settings in `.env`
`.env` holds your keys/values and is never committed. Copy the example and fill it:
```bash
cp .env.example .env
```
Open `.env` and set at least:
```
GROQ_API_KEY=gsk_your_or_the_shared_key
PARTICIPANT=YourName
BROWSERSTACK_USERNAME=<from the board>
BROWSERSTACK_ACCESS_KEY=<from the board>
BSTACK_APP=bs://<from the board>
```
`PARTICIPANT` is your label on the shared dashboard so the host can spot your run.

---

## Part C — Tour the framework (understand what you set up)

Open these and read them — this is the mental model you take home.

- **`config/wdio.shared.conf.js`** — settings common to every run (test framework
  = Mocha, reporters, timeouts).
- **`config/wdio.browserstack.conf.js`** — *capabilities*: which device/OS to use,
  the app to install, and your BrowserStack credentials. Capabilities are how you
  tell the runner "run my test on a Samsung Galaxy, Android 13, using this app."
- **`test/specs/`** — the *specs* (`signup`, `login`, `workout`): test cases that
  read like sentences and call screen objects. GymProgress has Landing, Sign up,
  Sign in, and a tabbed home (Log / Stats / Recovery).
- **`test/screenobjects/`** — a *screen object* per screen (landing, signup,
  signin, home). Selectors use *accessibility ids* (`~input-email`,
  `~button-signin`) — stable locators defined by the app in `/app`.
- **`CONVENTIONS.md`** — the team's rules the AI must follow (always assert, use
  accessibility ids, no fixed sleeps). The AI reads this automatically.

Two-minute discussion: why keep selectors in a screen object instead of the test?
(Answer: one place to fix when the app changes; tests stay readable.)

---

## Part D — Verify and first run

### D1. Check your machine
```bash
npm run verify
```
**Check:** Node, Git, aider, toklite all green; a Groq key detected.

### D2. Prove the tests are valid (no phone needed)
```bash
npm run validate
```
**Check:** the helper unit tests pass and all specs pass a syntax check.

You now have a complete, working AI-driven mobile framework. Next: **Lab 02** — do the actual task: write a test in plain English and run it.
