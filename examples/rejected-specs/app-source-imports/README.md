# Importing the app's source as screen objects

`addWorkoutLoginLogout.spec.js` imports `../../app/src/screens/*.js`, the app's
React Native components, and calls methods that don't exist on them.
`AddWorkoutScreen.js` and `SettingsScreen.js` are screens added to the app only so
those imports would resolve, with invented ids (`~AddWorkoutScreen`). The spec
also uses an account that doesn't exist and reads a `data-volume` attribute that a
native view doesn't have.

Every imported file exists, so a plain import check passes it. The gate now
requires specs to import only `../screenobjects/*.js` and `../helpers/*.js`.
The correct version of this flow is `test/specs/login-workout-logout.spec.js`.
