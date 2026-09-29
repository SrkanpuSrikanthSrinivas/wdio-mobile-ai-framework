import LoginScreen from '../screenobjects/login.screen.js';
import { buildCredentials } from '../helpers/data.js';

/**
 * login.spec.js - the test cases you'll UPDATE with the AI-CLI during the lab.
 *
 * On a valid login the demo app pops a native alert containing "logged in".
 * On sign-up it pops one containing "signed up".
 */

/** Return the current alert text, or '' if no alert is open. Dismisses it. */
async function readAndDismissAlert() {
  try {
    const text = await driver.getAlertText();
    await driver.dismissAlert();
    return text;
  } catch {
    return '';
  }
}

describe('Login', () => {
  beforeEach(async () => {
    await LoginScreen.open();
    await LoginScreen.switchToLogin();
  });

  it('logs in with valid credentials', async () => {
    await LoginScreen.login(buildCredentials());

    // Retrieve the alert text directly and assert its content.
    const alertText = await driver.getAlertText();
    await expect(alertText).toMatch(/logged in/);
    await driver.acceptAlert();
  });

  it('rejects an invalid email format', async () => {
    await LoginScreen.login(buildCredentials({ email: 'not-an-email' }));
    // The success alert must NOT appear for a malformed email.
    const alertText = await readAndDismissAlert();
    await expect(alertText).not.toContain('logged in');
  });

  // ---------------------------------------------------------------------
  // TODO(participant): add a test case with the AI-CLI.
  // Ask aider: "Add a test that switches to Sign up, signs up with a fresh
  // unique email and matching passwords, and asserts the alert contains
  // 'signed up'. Follow CONVENTIONS.md. Then run npm run validate."
  // ---------------------------------------------------------------------
});
