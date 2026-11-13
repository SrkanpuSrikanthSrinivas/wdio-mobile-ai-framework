import Screen from './screen.js';

const SELECTORS = {
  title: '~text-landing-title',
  signupButton: '~button-goto-signup',
  signinButton: '~button-goto-signin',
};

class LandingScreen extends Screen {
  async waitForLoaded() { await this.waitFor(SELECTORS.title); }
  async goToSignUp() { await (await $(SELECTORS.signupButton)).click(); }
  async goToSignIn() { await (await $(SELECTORS.signinButton)).click(); }
  get selectors() { return SELECTORS; }
}
export default new LandingScreen();
export { SELECTORS };
