import LoginScreen from '../screenobjects/login.screen.js';
import { buildCredentials } from '../helpers/data.js';

/**
 * login.spec.js - the test cases you'll UPDATE with the AI-CLI during the lab.
 *
 * On a valid login the demo app pops a native alert containing "logged in".
 * On sign-up it pops one containing "signed up".
 */

describe('Login', () => {
  beforeEach(async () => {
    await LoginScreen.open();
    await LoginScreen.switchToLogin();
  });

  it('logs in with valid credentials', async () => {
    await LoginScreen.login(buildCredentials());

    await expect(await LoginScreen.readAlert()).toBe(LoginScreen.messages.loginSuccess);
  });

  it('rejects an invalid email format', async () => {
    await LoginScreen.login(buildCredentials({ email: 'not-an-email' }));
    // The success alert must NOT appear for a malformed email.
    await expect(LoginScreen.validationMessage(LoginScreen.messages.invalidEmail)).toBeDisplayed();
    await expect(await LoginScreen.readAlert({ timeout: 3000 })).toBe('');
  });

  // ---------------------------------------------------------------------
  // TODO(participant): add a test case with the AI-CLI.
  // Ask aider: "Add a test that switches to Sign up, signs up with a fresh
  // unique email and matching passwords, and asserts the alert contains
  // 'signed up'. Follow CONVENTIONS.md. Then run npm run validate."
  // ---------------------------------------------------------------------
});
