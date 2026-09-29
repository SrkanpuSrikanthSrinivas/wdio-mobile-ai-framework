import Screen from './screen.js';

/**
 * login.screen.js — the Login tab of the WDIO native demo app (see APP-MAP.md).
 * Accessibility ids are the app's own, taken from the WebdriverIO demo app.
 *
 * NOTE: All selectors must match the identifiers listed in APP-MAP.md.
 * The previous version used a guessed lower‑case selector (`~button-login`);
 * that selector does not exist in the official map, causing the
 * `LOCATOR/STYLE ERROR` during validation. The correct selector, as defined
 * in APP-MAP.md, is `~button-LOGIN` (upper‑case). The fallback selector has
 * been removed to enforce strict compliance with the conventions.
 */

const SELECTORS = {
  loginContainerBtn: '~button-login-container',
  signupContainerBtn: '~button-sign-up-container',
  email: '~input-email',
  password: '~input-password',
  repeatPassword: '~input-repeat-password',
  // Updated to the exact selector from APP-MAP.md.
  loginButton: '~button-LOGIN',
  // Keep the original selector for the sign‑up button as defined in the app.
  signupButton: '~button-SIGN UP',
};

/** Exact texts the app shows (APP-MAP.md). Assert on these, not on guesses. */
const MESSAGES = {
  loginSuccess: 'You are logged in!',
  signupSuccess: 'You successfully signed up!',
  invalidEmail: 'Please enter a valid email address',
  shortPassword: 'Please enter at least 8 characters',
  passwordMismatch: 'Please enter the same password',
};

class LoginScreen extends Screen {
  async open() {
    await this.openTab('Login');
    await this.waitFor(SELECTORS.loginContainerBtn);
  }

  async switchToLogin() {
    await (await $(SELECTORS.loginContainerBtn)).click();
    // Wait for the (correct) login button to appear.
    await this.waitFor(
      SELECTORS.loginButton,
      20000,
      `Login button (${SELECTORS.loginButton}) not displayed`
    );
  }

  async switchToSignup() {
    await (await $(SELECTORS.signupContainerBtn)).click();
    await this.waitFor(SELECTORS.signupButton);
  }

  /** Fill the login form and submit. Call switchToLogin() first. */
  async login({ email, password }) {
    await (await $(SELECTORS.email)).setValue(email);
    await (await $(SELECTORS.password)).setValue(password);
    await (await $(SELECTORS.loginButton)).click();
  }

  /** Fill the sign‑up form and submit. Call switchToSignup() first. */
  async signup({ email, password, repeatPassword = password }) {
    await (await $(SELECTORS.email)).setValue(email);
    await (await $(SELECTORS.password)).setValue(password);
    await (await $(SELECTORS.repeatPassword)).setValue(repeatPassword);
    await (await $(SELECTORS.signupButton)).click();
  }

  /**
   * The on‑screen validation text, e.g. MESSAGES.invalidEmail.
   * The app gives these no accessibility id, so they are found by exact text.
   */
  validationMessage(text) {
    return $(`android=new UiSelector().text("${text}")`);
  }

  get selectors() {
    return SELECTORS;
  }

  get messages() {
    return MESSAGES;
  }
}

export default new LoginScreen();
export { SELECTORS, MESSAGES };
