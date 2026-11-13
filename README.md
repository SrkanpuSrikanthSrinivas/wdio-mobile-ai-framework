# WDIO Mobile AI Framework

A WebdriverIO + Appium framework for Android that lets you write mobile tests in
plain English with a command-line AI assistant, and checks every generated test
against the real app before it reaches a device.

- **Contract-first locators.** Every element the tests may use is listed in
  `APP-MAP.md`, taken from the app source. Tests can't reference anything else.
- **A device-free gate.** `npm run validate` runs unit tests, syntax, import and
  locator checks in about a second, with no emulator.
- **AI-CLI loop.** [aider](https://aider.chat) reads the project rules on every
  prompt, runs the gate after every edit, and commits each change.
- **Run anywhere.** The same specs run on a local emulator, BrowserStack App
  Automate, LambdaTest, GitHub Actions or a Docker emulator grid.

The app under test is **GymProgress**, a small React Native (Expo) app in `app/`,
built so that every element has a stable accessibility id.

---

## How it works

```
prompt ─► aider ─► edits test/specs + test/screenobjects ─► npm run validate
            ▲                                                      │
            └──────────── errors go back to the model ◄── fail ────┤
                                                                   ▼ pass
                         run:local (emulator)  /  run:cloud (BrowserStack)
                                     │
                         WebdriverIO v9 ─► Appium + UiAutomator2 ─► GymProgress
```

| Layer | Tool |
| --- | --- |
| Test runner | WebdriverIO v9, Mocha (BDD) |
| Device automation | Appium 2+, UiAutomator2 driver |
| Devices | Android emulator, BrowserStack, LambdaTest, Docker (`budtmo/docker-android`) |
| AI-CLI | aider with Gemini, Groq, Ollama or Anthropic models |
| Token proxy (optional) | [toklite](https://www.npmjs.com/package/toklite), local proxy that removes repeated context |

---

## Quick start

**Requirements:** Node 18+ and Git. For local device runs you also need Java 17,
the Android SDK, an AVD, and Appium with the UiAutomator2 driver
(see `MAC-EMULATOR.md`).

```bash
git clone https://github.com/SrkanpuSrikanthSrinivas/wdio-mobile-ai-framework.git
cd wdio-mobile-ai-framework
npm install                   # WebdriverIO and the project packages
npm run setup                 # the AI tools: uv + aider (Python 3.12) and toklite
cp .env.example .env          # add your keys; .env is never committed
npm run verify                # check the machine is ready
npm run validate              # the gate: no device needed
```

`npm run setup` works on macOS, Linux and Windows and is safe to re-run. If a
command says "not found" afterwards, open a new terminal so the PATH update
takes effect. Prefer a browser-only setup? Open the repo in a GitHub Codespace
(`CODESPACES.md`); aider and toklite are installed there for you.

Build the app once (`APP-BUILD.md`) and place it at `apps/GymProgress.apk`.

### Run on a local emulator
```bash
npm run run:local -- test/specs/login-workout-logout.spec.js
```
The script checks prerequisites, runs the gate, boots the AVD, starts Appium and
runs the spec. Output is saved to `logs/run-local.log`.

### Run on a real device (BrowserStack)
Set `BROWSERSTACK_USERNAME` and `BROWSERSTACK_ACCESS_KEY` in `.env`, then:
```bash
npm run run:cloud -- test/specs/login-workout-logout.spec.js
```

### Write a test with the AI-CLI
```bash
npm run ai:gemini -- test/specs/signin.validation.spec.js
```
Then describe the test, naming the file, the steps and the exact expected text:
```
Create test/specs/signin.validation.spec.js. From Landing go to Sign in.
Test 1: a wrong password shows 'Invalid email or password'.
Test 2: the email 'not-an-email' shows 'Enter a valid email'.
Follow CONVENTIONS.md and APP-MAP.md.
```
More prompts: `PROMPTS.md`. Other providers: `npm run ai:groq`, `npm run ai:local` (Ollama).

---

## The gate

`npm run validate` must pass before any device run. It is wired into aider
(`test-cmd`), both run scripts and CI.

| Check | Rejects |
| --- | --- |
| Unit tests (`node:test`) | Broken test data helpers and app logic |
| `check-syntax.mjs` | Syntax errors; missing or gutted WDIO configs |
| `check-imports.mjs` | Missing files, missing `.js` extensions, undeclared packages, `require()`, calls to functions that are never imported or defined |
| `check-locators.mjs` | Ids not in `APP-MAP.md`, selectors in specs, web-only APIs, CSS selectors, fixed waits, absolute XPath, specs importing anything but screen objects and helpers, tests without assertions |

The gate checks structure, not meaning: a real locator with a wrong expected
value still needs human review. `examples/rejected-specs/` shows what it catches.

---

## Project structure

```
app/                  GymProgress source (React Native / Expo) and its unit tests
apps/                 Built APK (git-ignored)
APP-MAP.md            Every locator and message the tests may use
CONVENTIONS.md        Rules for tests, read by the AI-CLI on every prompt
.aider.conf.yml       AI-CLI context, test command and auto-commit settings
config/               wdio.shared, wdio.android (local), wdio.browserstack, wdio.lambdatest
test/screenobjects/   One screen object per screen; all selectors live here
test/helpers/         Test data (demo account, unique emails, form builders)
test/specs/           The tests; only *.spec.js files run
scripts/              Gate checks, run scripts, AI launcher, setup and verify
examples/             Rejected specs, with the rule that catches each one
grid/, docker-compose.yml   Self-hosted Android emulators in Docker
gatebench/            Replication package for the gate's mutation evaluation
labs/                 Hands-on workshop exercises
legacy/               Earlier versions (WebdriverIO demo app), not run
```

---

## Commands

| Command | Does |
| --- | --- |
| `npm run validate` | Unit tests + syntax + imports + locators, no device |
| `npm run run:local -- <spec>` | Gate, emulator, Appium, then the spec |
| `npm run run:cloud -- <spec>` | Credentials check, gate, then BrowserStack |
| `npm run android` / `android:cloud` | WebdriverIO only, local or BrowserStack |
| `npm run ai:gemini` / `ai:groq` / `ai:local` | Start aider with a free model |
| `npm run setup` | Install the AI tools: uv + aider (Python 3.12) and toklite |
| `npm run verify` | Check Node, Git, aider, toklite and an AI key |
| `npm run tok:stats` | Token savings from toklite |

---

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| `aider: command not found` after setup | Open a new terminal. Still missing: `uv tool update-shell`, then a new terminal, or use `python3 -m aider` |
| `spawn aider ENOENT` | aider is not on the PATH yet: new terminal, or re-run `npm run setup` |
| aider warns "model not found" | Harmless; continue |
| Groq "rate limit" | The free tier allows 8,000 tokens per minute: `/clear` between prompts, or use `npm run ai:gemini` |
| `npm run tok:stats` shows 0 requests | `export OPENAI_API_BASE=http://127.0.0.1:8787/v1`, then relaunch `npm run ai:groq` |
| Emulator stops while booting | Usually low disk space: see "Low on disk space" in `MAC-EMULATOR.md` |
| BrowserStack HTTP 401 | Check `BROWSERSTACK_USERNAME` and `BROWSERSTACK_ACCESS_KEY` in `.env` |
| Windows | Use PowerShell; set variables with `setx NAME value` and open a new window |

## Writing tests by hand

Follow `CONVENTIONS.md`. In short: start every test on the Landing screen, call
screen-object methods, take ids only from `APP-MAP.md`, assert with WebdriverIO's
`expect`, and never use fixed waits. The app restarts after every test, so each
`it` starts from a clean state.

## CI

- `.github/workflows/android.yml` boots an API 34 emulator on GitHub Actions and
  uploads a screen recording, the Appium log and screenshots.
- `.gitlab-ci.yml` runs the gate anywhere and the device job on a KVM runner.

## Workshop material

`START-HERE.md`, `RUNBOOK.md`, `FACILITATOR.md`, `PRE-WORKSHOP.md` and `labs/`
describe a two-hour hands-on session built on this framework.

## Contributing

Issues and pull requests are welcome. Run `npm run validate` before opening a PR,
and add new locators to `APP-MAP.md` together with the app change that creates them.

## License

MIT © 2026 Srikanth Srinivas. See `LICENSE`.
