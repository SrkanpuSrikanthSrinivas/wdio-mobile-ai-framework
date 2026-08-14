# RUNBOOK - Mobile Automation with an AI-CLI (2-hour hands-on lab)

You'll take a real **WebdriverIO + Appium** mobile framework, **update its test
cases in plain English** with an AI-CLI (aider), and run them on a **real Android
emulator** - first via Docker, then in CI. The twist that makes it easy: **you
never install the Android SDK.** The emulator and Appium live in a container;
model access runs through **toklite** (a local token-cutting proxy) - so the
workshop also shows off how much toklite saves. One key and you're in.

## Before you arrive (10 min)
1. Clone the repo, run `npm install`, install `aider`.
2. At the start you'll get, on the board: a **proxy URL + token** and an
   **APPIUM_HOST** (the shared emulator). Nothing to buy or download.

## Setup (Lab 00)
```bash
npm install -g toklite aider-install || true
export ANTHROPIC_API_KEY="<workshop-key>"     # from your facilitator (see TOKLITE.md)
export APPIUM_HOST="<facilitator-ip>"          # shared emulator
npm run verify        # checks tools, toklite, key, Appium; tells you your mode
npm run ai            # launch aider THROUGH toklite (Groq path: npm run ai:groq)
npm run validate      # device-free health check
```

## What makes this different
- **Powered by toklite**: `npm run ai` runs aider through toklite, a local proxy
  that cuts the tokens leaving your machine and reports the savings. Your editing
  loop (repeated file reads) is its best case - see `TOKLITE.md`.
- **Update tests in English**: the agent edits specs + screen objects for you,
  following `CONVENTIONS.md` - your standards are a file it reads, not a comment.
- **Fast inner loop**: after each edit aider runs device-free checks
  (`npm run validate`), so you get feedback without waiting on an emulator.
- **Real device, zero setup**: the emulator + Appium are in Docker/CI; you just
  point `APPIUM_HOST` at them and run.

## Schedule (120 min)

| Time | Lab | You'll produce |
|---|---|---|
| 0:00-0:10 | [00 Setup](labs/00-setup.md) | Verified env, mode known |
| 0:10-0:25 | [01 Recon](labs/01-recon.md) | A missing test case, named |
| 0:25-1:00 | [02 Update tests](labs/02-update-tests.md) | AI-written sign-up + empty-field tests |
| 1:00-1:25 | [03 Run on Docker](labs/03-run-docker.md) | Your tests passing on a real emulator |
| 1:25-1:40 | [04 CI](labs/04-ci.md) | Green pipeline + self-reviewed MR |
| 1:40-2:00 | [05 toklite reveal](labs/05-toklite.md) | Tokens + money toklite saved; Q&A |

## The one rule
Tests are the spec. Never let the agent weaken an assertion to make a test pass -
fix the screen object or the app path. (It's in `CONVENTIONS.md`, so the agent
follows it too.)

## Modes
- **FULL** - edit with aider + run on the emulator.
- **EDIT-ONLY / OFFLINE** - edit + `npm run validate`; watch the shared run or CI.
  See `offline-fallback/README.md`. Nobody is blocked.

Start at [Lab 00](labs/00-setup.md).
