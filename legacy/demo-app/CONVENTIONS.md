# Mobile testing conventions (loaded automatically by the AI-CLI)

The agent reads this on every prompt, with APP-MAP.md. Follow it exactly.
`npm run validate` runs after every edit and fails anything that breaks these rules.

## Hard rules (the gate enforces these)
1. **Where**: new tests are `test/specs/<feature>.spec.js`. Only `*.spec.js` files run.
2. **Modules**: this project is ESM. Use `import`, never `require()`. Relative imports
   keep the `.js` extension. From a spec the paths are exactly:
   - `import LoginScreen from '../screenobjects/login.screen.js';`
   - `import FormsScreen from '../screenobjects/forms.screen.js';`
   - `import { buildCredentials, uniqueEmail } from '../helpers/data.js';`
3. **No extra libraries**: `describe`, `it`, `expect`, `$`, `driver` are WebdriverIO
   globals. Never import `chai`, `assert`, `expect` or any package not in package.json.
4. **Native app, not a website**: never use `browser.url()`, CSS selectors (`#id`,
   `.class`), or DOM ideas like "page", "toast" or "title". This is an Android app.
5. **Only real locators**: use only screens, ids and texts listed in APP-MAP.md,
   through the screen objects. Never invent a screen object, a selector, or an
   expected message. If something you need is missing, stop and say so.
6. **Every `it` asserts**: each test ends in at least one `await expect(...)`.
7. **No fixed waits**: never `pause()`/`sleep`. Screen objects already wait.

## Test structure
- One behavior per `it`; the title states the behavior in plain language.
- Cover the negative path (bad input), not just the happy path.
- Specs call intent-level screen methods; selectors live only in screen objects,
  in a `SELECTORS` map at the top.
- Use data builders from `test/helpers/data.js` (`buildCredentials`, `uniqueEmail`)
  instead of hard-coding emails and passwords.
- Assert on the exact texts in `LoginScreen.messages` (from APP-MAP.md).

## Screen methods you can use
| Screen | Method | Does |
| --- | --- | --- |
| LoginScreen | `open()` | Opens the Login tab |
| LoginScreen | `switchToLogin()` / `switchToSignup()` | Picks the form mode |
| LoginScreen | `login({ email, password })` | Fills and submits the login form |
| LoginScreen | `signup({ email, password, repeatPassword })` | Fills and submits sign up (`repeatPassword` defaults to `password`) |
| LoginScreen | `validationMessage(text)` | The on-screen validation text element |
| LoginScreen | `readAlert()` | Waits for a native alert, returns its message and closes it; `''` if none |
| LoginScreen | `messages` | Exact app texts: `loginSuccess`, `signupSuccess`, `invalidEmail`, `shortPassword`, `passwordMismatch` |
| FormsScreen | `open()`, `typeInto(text)`, `selectors` | Forms tab |

If a test needs a new step, add a method to the screen object (selector in
`SELECTORS`, from APP-MAP.md) and call it from the spec.

## Golden example — copy this shape
```js
import LoginScreen from '../screenobjects/login.screen.js';
import { buildCredentials, uniqueEmail } from '../helpers/data.js';

describe('Sign up', () => {
  beforeEach(async () => {
    await LoginScreen.open();
    await LoginScreen.switchToSignup();
  });

  it('signs up with a fresh email and matching passwords', async () => {
    await LoginScreen.signup({ email: uniqueEmail('signup'), password: 'Password123!' });
    await expect(await LoginScreen.readAlert()).toBe(LoginScreen.messages.signupSuccess);
  });

  it('rejects mismatched passwords', async () => {
    await LoginScreen.signup({ ...buildCredentials(), repeatPassword: 'Different123!' });
    await expect(LoginScreen.validationMessage(LoginScreen.messages.passwordMismatch)).toBeDisplayed();
    await expect(await LoginScreen.readAlert({ timeout: 2000 })).toBe('');
  });
});
```

## What NOT to do
- Do not weaken or delete an assertion to make a failing test pass. Fix the screen
  object or the steps instead.
- Do not change configs, parallelism or `maxInstances`; this lab runs one device.
- Do not edit files you weren't asked to edit, except adding a screen-object method.
