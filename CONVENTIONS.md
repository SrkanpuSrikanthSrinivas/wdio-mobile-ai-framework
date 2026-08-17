# Mobile testing conventions (loaded automatically by the AI-CLI)

The agent reads this on every run. It's how you make an AI-CLI write mobile tests
*your* way — your standards become a file it follows, not a review comment.

## Locators
- Prefer **accessibility ids** (`~name`) — stable and cross-platform. Use the
  `byAccessibilityId` helper or the `~` shorthand.
- Never use brittle absolute XPath. If you must use XPath, anchor it on text or a
  resource-id, and add a comment explaining why an accessibility id wasn't available.

## Test structure
- One behavior per `it`; the title states the behavior in plain language.
- Every test ends in a real assertion (`expect(...)`). A test with no assertion
  is a bug.
- Cover the **negative path** (bad input, cancelled flows), not just the happy path.
- Put reusable steps in a screen object under `test/screenobjects/`, not in the spec.
- Reuse data builders from `test/helpers/data.js`; don't hard-code emails/passwords
  inline when a builder exists.

## Waits & stability
- Always wait for an element before acting: `waitForDisplayed` / the `waitFor`
  helper. Never use fixed `pause()`/`sleep` to "fix" flakiness.
- Keep timeouts reasonable (<= 20s) so a real failure fails fast in the workshop.

## Screen objects
- Selectors live in a `SELECTORS` map at the top of the screen object.
- Screens expose intent-level methods (`login({email, password})`), not raw taps.

## What NOT to do
- Do not weaken or delete an assertion to make a failing test pass — fix the
  screen object or the app path instead.
- Do not add parallel/maxInstances changes; this lab runs one emulator.
