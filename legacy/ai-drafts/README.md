# AI drafts (not run)

`loginAndUpdateWorkout.test.js` and `helpers.js` were written by aider on 29 Sep.
Kept as a real example for the talk: the model
- invented ids (`signinButton`, `addWorkoutButton`, `edit-<name>`) that the app doesn't have,
- used an account that doesn't exist (`test@example.com`) and an "edit workout" feature GymProgress doesn't have,
- put the test in `test/e2e/*.test.js`, which the normal run never picks up,
- and created `byAccessibilityId()` *"to avoid hard-coding the raw selectors (which triggers the
  locator-style checker)"*: it routed around the gate instead of using APP-MAP.md.

The gate now rejects all of these. The working version is `test/specs/login.workout.spec.js`.
