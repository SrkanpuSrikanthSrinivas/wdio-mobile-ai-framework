class LandingScreen {
  get root() { return $('~screen-landing'); }
  get welcome() { return $('~text-welcome'); }
  get tagline() { return $('~text-tagline'); }
  get getStarted() { return $('~button-get-started'); }
  get signInLink() { return $('~link-sign-in'); }

  async waitForLoaded() {
    await this.root.waitForDisplayed({ timeout: 20000 });
  }

  async openSignUp() {
    await this.getStarted.click();
  }

  async openSignIn() {
    await this.signInLink.click();
  }
}

export default new LandingScreen();
