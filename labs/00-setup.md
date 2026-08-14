# Lab 00 - Get running (10 min)

## Goal
Clone, install, route the AI-CLI through toklite, point at the shared emulator,
and know your mode.

## Steps
1. Clone and install:
   ```bash
   git clone <this-repo-url> wdio-mobile-ai-lab
   cd wdio-mobile-ai-lab
   npm install
   ```
2. Install the two CLIs and the key your facilitator puts on the board:
   ```bash
   python -m pip install aider-install && aider-install    # the AI agent
   npm install -g toklite                                   # the token-cutting proxy
   export ANTHROPIC_API_KEY="<workshop-key>"                # from your facilitator
   ```
   You'll always launch the agent as `npm run ai` - that's `toklite run -- aider`,
   so every request is measured and reduced before it leaves your laptop.
3. Point at the shared Android emulator (Docker), also on the board:
   ```bash
   export APPIUM_HOST="<facilitator-ip>"   # or 127.0.0.1 if you run Docker locally
   export APPIUM_PORT="4723"
   ```
4. Verify - checks tools, toklite, key, and Appium:
   ```bash
   npm run verify
   ```
5. Run the device-free checks so you know the repo is healthy:
   ```bash
   npm run validate
   ```

## Modes (verify.mjs tells you which)
- **FULL** - aider + toklite + key + Appium reachable. Edit tests AND run on the emulator.
- **EDIT-ONLY** - aider + toklite + key, no emulator yet. Update tests and
  `npm run validate`; point `APPIUM_HOST` at Docker/CI later to run on a device.
- **OFFLINE** - read the code and run `npm run validate`.

## Done when
`npm run validate` is green and `npm run verify` shows your mode.
