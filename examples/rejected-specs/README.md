# Rejected specs

Real-world examples of generated tests that look plausible but are wrong for this
app. Each folder shows a failure mode and the gate rule (`npm run validate`) that
now rejects it. None of these files run: they live outside `test/`.

| Folder | Failure mode | Rejected by |
| --- | --- | --- |
| `invented-locators/` | Ids, accounts and features the app doesn't have; a selector helper written to get around the locator check; a test placed where the runner never looks | `check-locators.mjs` |
| `app-source-imports/` | A spec that imports the app's own React Native screen components as if they were screen objects, with matching new screens added to the app | `check-locators.mjs` (spec import rule) |

Use them in reviews and workshops to show what the gate is for.
