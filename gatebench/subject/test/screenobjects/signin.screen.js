class SignInScreen {
  get root() { return $('~screen-signin'); }
  get title() { return $('~text-signin-title'); }
  get inputEmail() { return $('~input-signin-email'); }
  get inputPassword() { return $('~input-signin-password'); }
  get error() { return $('~text-signin-error'); }
  get submitButton() { return $('~button-signin'); }

  async waitForLoaded() {
    await this.root.waitForDisplayed({ timeout: 15000 });
  }

  async signIn(email, password) {
    await this.inputEmail.setValue(email);
    await this.inputPassword.setValue(password);
    await this.submitButton.click();
  }
}

export default new SignInScreen();
