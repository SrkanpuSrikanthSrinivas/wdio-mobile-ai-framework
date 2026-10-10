class SignUpScreen {
  get root() { return $('~screen-signup'); }
  get title() { return $('~text-signup-title'); }
  get inputEmail() { return $('~input-email'); }
  get inputPassword() { return $('~input-password'); }
  get error() { return $('~text-error'); }
  get submitButton() { return $('~button-signup'); }

  async waitForLoaded() {
    await this.root.waitForDisplayed({ timeout: 15000 });
  }

  async fillForm(email, password) {
    await this.inputEmail.setValue(email);
    await this.inputPassword.setValue(password);
  }

  async submit() {
    await this.submitButton.click();
  }
}

export default new SignUpScreen();
