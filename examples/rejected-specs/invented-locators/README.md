# Invented locators

`loginAndUpdateWorkout.test.js` and `helpers.js` show a generated test that:
- uses ids the app doesn't have (`signinButton`, `addWorkoutButton`, `edit-<name>`);
- signs in with an account that doesn't exist (`test@example.com`) and edits a
  workout, a feature GymProgress doesn't have;
- lives in `test/e2e/*.test.js`, which the runner never picks up;
- adds a `byAccessibilityId()` helper so raw selectors no longer match the
  locator check, instead of using the ids in `APP-MAP.md`.

The gate rejects each of these. The correct version of this flow is
`test/specs/login.workout.spec.js`.
