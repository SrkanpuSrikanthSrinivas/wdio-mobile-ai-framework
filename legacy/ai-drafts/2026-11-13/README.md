# AI drafts from 13 Nov 2026 (not run)

Asked for "login, add a workout, then log out", aider:
- wrote `addWorkoutLoginLogout.spec.js` importing the **app's own React Native screen
  components** (`../../app/src/screens/...`) as if they were screen objects;
- then **added two new screens to the app** (`AddWorkoutScreen.js`, `SettingsScreen.js`)
  with invented ids (`~AddWorkoutScreen`) so the imports would resolve;
- used an account that doesn't exist (`testuser@example.com`) and an attribute
  (`data-volume`) that a native app doesn't have.

Every imported file existed, so the old gate passed it. The gate now rejects any spec
import that isn't `../screenobjects/*.js` or `../helpers/*.js`.
The working version of this flow is `test/specs/login-workout-logout.spec.js`.
