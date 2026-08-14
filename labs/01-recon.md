# Lab 01 - Recon: understand the framework with the AI-CLI (15 min)

## Idea
Use the agent to learn the framework fast - screen objects, selectors, specs -
before you change anything.

## FULL / EDIT-ONLY path (via `npm run ai`)
```bash
npm run ai
  /add test/screenobjects/login.screen.js test/specs/login.spec.js CONVENTIONS.md
  /ask What does the login spec cover today, and which realistic case is missing?
  Answer in 3 bullets. Do not edit yet.
```
It should notice there's a happy path and an invalid-email case, but (for example)
no sign-up flow and no empty-field validation.

## OFFLINE path
Read `test/screenobjects/login.screen.js` and `test/specs/login.spec.js`, then
open `CONVENTIONS.md` - the standards the agent will follow when you edit.

## Discuss
- The whole repo is reachable from the terminal - no copy-paste into a browser.
- `CONVENTIONS.md` is loaded automatically; the agent already knows to use
  accessibility ids and to always assert.

## Done when
You can name one missing test case worth adding.
