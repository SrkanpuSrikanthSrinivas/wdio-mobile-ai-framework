import Screen from './screen.js';

const SELECTORS = {
  title: '~text-signup-title',
  name: '~input-name',
  email: '~input-email',
  password: '~input-password',
  confirm: '~input-confirm',
  submit: '~button-signup',
  error: '~text-signup-error',
};

class SignUpScreen extends Screen {
  async waitForLoaded() { await this.waitFor(SELECTORS.title); }
  async signUp({ name = '', email = '', password = '', confirm = '' }) {
    await (await $(SELECTORS.name)).setValue(name);
    await (await $(SELECTORS.email)).setValue(email);
    await (await $(SELECTORS.password)).setValue(password);
    await (await $(SELECTORS.confirm)).setValue(confirm);
    await this.hideKeyboard();
    await (await $(SELECTORS.submit)).click();
  }
  async getError() {
    const el = await $(SELECTORS.error);
    return (await el.isExisting()) ? el.getText() : '';
  }
  get selectors() { return SELECTORS; }
}
export default new SignUpScreen();
export { SELECTORS };
