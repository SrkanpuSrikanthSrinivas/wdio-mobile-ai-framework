# Lab 02 - Update the tests with the AI-CLI (35 min)

## The core skill
Update and add mobile test cases in plain English, with the agent following your
standards. Because `.aider.conf.yml` turns on auto-test, aider runs the
device-free checks (`npm run validate`) after each edit - instant feedback, no
emulator needed for the inner loop.

## FULL / EDIT-ONLY path (via `npm run ai`)
1. Launch the agent through toklite, then add the files you'll change:
   ```bash
   npm run ai
   ```
   ```
   /add test/specs/login.spec.js test/screenobjects/login.screen.js test/helpers/data.js
   ```
2. Complete the seeded TODO with one instruction:
   ```
   Complete the TODO in login.spec.js: add a test that switches to Sign up, signs
   up with a fresh unique email and matching passwords, and asserts the alert
   contains 'signed up'. Add any needed screen-object method. Follow CONVENTIONS.md.
   ```
   Watch aider edit the spec + screen object, run `npm run validate`, and commit
   each step. Check `git log --oneline`.
3. Add a second case yourself:
   ```
   Add a test for empty credentials: tapping LOGIN with both fields blank shows a
   validation error and no success alert.
   ```
4. **Review** the diffs. Does every new test assert something real? Are selectors
   accessibility ids (per CONVENTIONS.md)? Reject anything weak and commit cleanup.

## OFFLINE path
Hand-edit `login.spec.js` to add the sign-up test, then `npm run validate`.
Compare against `solutions/login.solution.spec.js`.

## Discuss
- The agent tested "your way" because the rules were a file it read. Change one
  rule in `CONVENTIONS.md`, re-run, and watch the style shift.

## Done when
Your new tests pass `npm run validate` and are committed. (They run on the real
device in the next lab.)
