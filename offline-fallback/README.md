# OFFLINE / EDIT-ONLY mode

Mobile execution needs the emulator (Docker/CI), which not every laptop can run.
You can still do the core skill - updating mobile tests with the AI-CLI - without
a device:

- **Edit** specs and screen objects with aider exactly as in Lab 02.
- **Validate** instantly with the device-free checks:
  ```bash
  npm run validate      # unit tests for helpers + syntax check of all specs
  ```
- **Watch** the facilitator run your test on the shared emulator (noVNC), or push
  and let CI run it.

The auto-test loop in `.aider.conf.yml` already uses `npm run validate`, so your
AI-CLI editing experience is identical with or without a device attached. When
you can reach an emulator later, `npm run android` runs the very same specs.

Reference for the Lab 02 task: `solutions/login.solution.spec.js`.
