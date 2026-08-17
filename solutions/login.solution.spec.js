import LoginScreen from '../test/screenobjects/login.screen.js';
import { buildCredentials, uniqueEmail } from '../test/helpers/data.js';

/**
 * Reference solution for Lab 02 - what a good AI-CLI session converges to.
 * (Facilitator / self-check. Do not ship into test/specs before the workshop.)
 */
async function readAndDismissAlert() {
  try {
    const text = await driver.getAlertText();
    await driver.dismissAlert();
    return text;
  } catch {
    return '';
  }
}

describe('Login (solution)', () => {
  beforeEach(async () => {
    await LoginScreen.open();
  });

  it('logs in with valid credentials', async () => {
    await LoginScreen.switchToLogin();
    await LoginScreen.login(buildCredentials());
    await expect(driver).toHaveAlertText(/logged in/);
    await driver.acceptAlert();
  });

  it('signs up with a fresh email', async () => {
    await LoginScreen.switchToSignup();
    await (await $(LoginScreen.selectors.email)).setValue(uniqueEmail());
    await (await $(LoginScreen.selectors.password)).setValue('Password123!');
    await (await $(LoginScreen.selectors.repeatPassword)).setValue('Password123!');
    await (await $(LoginScreen.selectors.signupButton)).click();
    await expect(driver).toHaveAlertText(/signed up/);
    await driver.acceptAlert();
  });

  it('rejects empty credentials', async () => {
    await LoginScreen.switchToLogin();
    await (await $(LoginScreen.selectors.loginButton)).click();
    const alertText = await readAndDismissAlert();
    await expect(alertText).not.toContain('logged in');
  });
});
