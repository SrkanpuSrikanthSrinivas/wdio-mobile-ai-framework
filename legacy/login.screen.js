import Screen from './screen.js';

/**
 * login.screen.js — the Login tab of the WDIO native demo app.
 * Accessibility ids are the app's own, taken from the WebdriverIO demo app.
 */

const SELECTORS = {
  loginContainerBtn: '~button-login-container',
  signupContainerBtn: '~button-sign-up-container',
  email: '~input-email',
  password: '~input-password',
  repeatPassword: '~input-repeat-password',
  loginButton: '~button-LOGIN',
  signupButton: '~button-SIGN UP',
};

class LoginScreen extends Screen {
  async open() {
    await this.openTab('Login');
    await this.waitFor(SELECTORS.loginContainerBtn);
  }

  async switchToLogin() {
    await (await $(SELECTORS.loginContainerBtn)).click();
    await this.waitFor(SELECTORS.loginButton);
  }

  async switchToSignup() {
    await (await $(SELECTORS.signupContainerBtn)).click();
    await this.waitFor(SELECTORS.signupButton);
  }

  /** Fill the login form and submit. */
  async login({ email, password }) {
    await (await $(SELECTORS.email)).setValue(email);
    await (await $(SELECTORS.password)).setValue(password);
    await (await $(SELECTORS.loginButton)).click();
  }

  get selectors() {
    return SELECTORS;
  }
}

export default new LoginScreen();
export { SELECTORS };
