# AI drafts (not run)

AI-generated specs that failed review, kept as examples of what the gate should catch.
They are outside `test/`, so neither the WDIO spec glob nor `npm run validate` picks them up.

| File | Why it can't run |
| --- | --- |
| signin.test.js | imports `chai` (not installed), wrong relative paths, a `gym.screen` that doesn't exist, empty selectors |
| signup.test.js | CommonJS `require` in an ESM project; web selectors (`#email`, `browser.url`) for a native app |
| signinpage.validation.spec.js | CommonJS `require` of a `pageobjects/signin.page` that doesn't exist |

All three passed the old syntax-only gate. `scripts/check-imports.mjs` now fails them.
