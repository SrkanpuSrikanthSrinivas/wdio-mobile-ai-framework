# Challenges — keep going for the full 2 hours

Once your first test passes, work through these with the AI (`npm run ai:groq`).
Each one: give aider the instruction, review what it writes, run `npm run validate`,
then run it on the dashboard (`npm run android:cloud`). Go at your own pace — the
later ones are harder. Always follow `CONVENTIONS.md` (accessibility ids, real
assertions, no fixed sleeps).

## Warm-up
1. **Sign up** — switch to Sign up, register with a fresh unique email and matching
   passwords, assert the alert contains "signed up".
2. **Empty login** — tap LOGIN with both fields blank; assert a validation error
   shows and no success alert appears.
3. **Invalid email** — enter `not-an-email`; assert the form rejects it.

## Build it out
4. **Forms screen** — open the Forms tab, type into the input, flip the switch,
   pick a value from the dropdown, and assert the result text updates.
5. **Data-driven login** — use `@pytest`-style parametrization... (in JS: a
   `for`/`it.each` pattern) to try 3 bad inputs and assert each is rejected.
6. **Screen object refactor** — ask the AI to move any raw selectors from a spec
   into the matching screen object, then re-run to prove nothing broke.

## Stretch
7. **Swipe** — open the Swipe tab, swipe through the carousel, assert the last
   card ("You found me!!!") appears.
8. **Negative + recovery** — log in with a wrong password, assert the error, then
   correct it and assert success — all in one test.
9. **Your own idea** — pick any flow in the app and have the AI write a test for
   it. Share the most creative one with the room.

## Reflection (last 10 min)
- Where did the AI save you time? Where did you have to correct it?
- Look at `npm run tok:stats` — how much did toklite save across your session?
- Which test are you proudest of? Show it on the dashboard.
