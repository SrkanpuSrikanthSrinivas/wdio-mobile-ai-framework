# Mobile testing conventions — GymProgress (loaded automatically by the AI-CLI)

The agent reads this on every prompt, with APP-MAP.md. Follow it exactly.
`npm run validate` runs after every edit and fails anything that breaks these rules.

## Hard rules (the gate enforces these)
1. **Where**: new tests are `test/specs/<feature>.spec.js`. Only `*.spec.js` files run.
2. **Modules**: ESM only. `import`, never `require()`. Relative imports keep `.js`.
   From a spec the paths are exactly:
   - `import LandingScreen from '../screenobjects/landing.screen.js';`
   - `import SignInScreen from '../screenobjects/signin.screen.js';`
   - `import SignUpScreen from '../screenobjects/signup.screen.js';`
   - `import HomeScreen from '../screenobjects/home.screen.js';`
   - `import StatsScreen from '../screenobjects/stats.screen.js';`
   - `import RecoveryScreen from '../screenobjects/recovery.screen.js';`
   - `import { DEMO, buildSignup, uniqueEmail } from '../helpers/data.js';`
3. **No extra libraries**: `describe`, `it`, `expect`, `$`, `driver` are WebdriverIO
   globals. Never import `chai`, `assert` or any package not in package.json.
4. **Native app, not a website**: no `browser.url()`, CSS selectors or DOM ideas.
5. **Only real locators**: only ids and texts in APP-MAP.md, through screen objects.
   Never invent a screen, selector or expected message. Missing? Stop and say so.
6. **Every `it` asserts** with at least one `await expect(...)`.
7. **No fixed waits** (`pause`/`sleep`). Screen objects already wait.
8. **Never route around the gate**: no helpers that build selectors (e.g. `byAccessibilityId`)
   in specs, no files outside `test/specs`, `test/screenobjects`, `test/helpers`.
9. **GymProgress has no alerts**: success = the next screen appears (e.g. the
   welcome header); failure = an inline error text. Never use `getAlertText`.

## Test structure
- Every test starts on the Landing screen (the app restarts for each spec file).
- One behavior per `it`; the title states it in plain language. Cover bad input too.
- Specs call intent-level screen methods; selectors live only in screen objects.
- Use `DEMO` for sign-in and `buildSignup()` / `uniqueEmail()` for new accounts.

## Screen methods you can use
| Screen | Method |
| --- | --- |
| LandingScreen | `waitForLoaded()`, `goToSignIn()`, `goToSignUp()` |
| SignInScreen | `waitForLoaded()`, `signIn({ email, password })`, `getError()`, `selectors.error` |
| SignUpScreen | `waitForLoaded()`, `signUp({ name, email, password, confirm })`, `selectors.error` |
| HomeScreen | `waitForLoaded()`, `logStrength(exercise, [{ reps, weight }])`, `openStats()`, `openRecovery()`, `logout()`, `clearAll()`, `selectors.welcome`, `selectors.entryCount`, `selectors.error` |

If a test needs a new step, add a method to the screen object (selector from
APP-MAP.md in its `SELECTORS` map) and call it from the spec.

## Golden example — copy this shape
```js
import LandingScreen from '../screenobjects/landing.screen.js';
import SignInScreen from '../screenobjects/signin.screen.js';
import HomeScreen from '../screenobjects/home.screen.js';
import { DEMO } from '../helpers/data.js';

describe('Sign in', () => {
  beforeEach(async () => {
    await LandingScreen.waitForLoaded();
    await LandingScreen.goToSignIn();
    await SignInScreen.waitForLoaded();
  });

  it('signs in with the demo account and greets the user', async () => {
    await SignInScreen.signIn(DEMO);
    await HomeScreen.waitForLoaded();
    await expect($(HomeScreen.selectors.welcome)).toHaveText('Hi, Demo User');
  });

  it('rejects a wrong password', async () => {
    await SignInScreen.signIn({ email: DEMO.email, password: 'WrongPass9' });
    await expect($(SignInScreen.selectors.error)).toHaveText('Invalid email or password');
  });
});
```

## What NOT to do
- Never weaken or delete an assertion to make a test pass; fix the steps instead.
- Don't change configs or parallelism. Don't edit files you weren't asked to,
  except adding a screen-object method.
