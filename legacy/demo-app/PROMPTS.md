# Demo prompts for the AI-CLI

Prompts that give the model everything it needs: the exact file, the screen,
the steps, and the exact expected message. Vague prompts ("a new validation for
the sign-in page") make the model guess; these don't.

## Before the talk
```bash
npm run run:local -- solutions/demo.solution.spec.js   # proves every answer works on a device
npm run run:cloud -- solutions/demo.solution.spec.js   # same on BrowserStack
git tag demo-start                                      # clean point to reset to
```

## Start aider with the files it may edit
```bash
npm run ai:groq -- test/specs/<new-file>.spec.js test/screenobjects/login.screen.js
```
CONVENTIONS.md, APP-MAP.md, screen.js and data.js load automatically (read-only).
After each edit aider runs `npm run validate`; a failure goes straight back to the model.

## Prompt A — sign up  (file: `test/specs/signup.spec.js`)
> Create test/specs/signup.spec.js. On the Login tab switch to Sign up. Test 1: sign up
> with a fresh unique email and matching passwords, and assert the alert message is
> LoginScreen.messages.signupSuccess. Test 2: mismatched passwords show the
> passwordMismatch validation message and no alert. Follow CONVENTIONS.md and APP-MAP.md.

## Prompt B — login validation  (file: `test/specs/login.validation.spec.js`)
> Create test/specs/login.validation.spec.js. On the Login tab in Login mode.
> Test 1: log in with the email 'not-an-email' and a valid password; assert the
> invalidEmail validation message is displayed and no alert appears.
> Test 2: a 5-character password shows the shortPassword message and no alert.
> Follow CONVENTIONS.md and APP-MAP.md.

## Prompt C — successful login  (file: `test/specs/login.success.spec.js`)
> Create test/specs/login.success.spec.js. On the Login tab in Login mode, log in with
> buildCredentials() and assert the alert message is LoginScreen.messages.loginSuccess.
> Follow CONVENTIONS.md and APP-MAP.md.

## Then run what it wrote
```bash
npm run run:local -- test/specs/signup.spec.js
npm run run:cloud -- test/specs/signup.spec.js
```

## If it goes wrong live
- Gate keeps failing after 2 tries: `/undo` in aider, or `git reset --hard demo-start`.
- Good answer, bad device: run the matching block of `solutions/demo.solution.spec.js`.
- Compare what aider wrote with `solutions/demo.solution.spec.js` — that's the review.
