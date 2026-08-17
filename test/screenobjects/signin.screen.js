import Screen from './screen.js';

const SELECTORS = {
  title: '~text-signin-title',
  email: '~input-email',
  password: '~input-password',
  submit: '~button-signin',
  error: '~text-signin-error',
};

class SignInScreen extends Screen {
  async waitForLoaded() { await this.waitFor(SELECTORS.title); }
  async signIn({ email = '', password = '' }) {
    await (await $(SELECTORS.email)).setValue(email);
    await (await $(SELECTORS.password)).setValue(password);
    await (await $(SELECTORS.submit)).click();
  }
  async getError() {
    const el = await $(SELECTORS.error);
    return (await el.isExisting()) ? el.getText() : '';
  }
  get selectors() { return SELECTORS; }
}
export default new SignInScreen();
export { SELECTORS };
