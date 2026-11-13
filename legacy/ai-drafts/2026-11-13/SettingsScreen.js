/**
 * Screen‑object for the Settings screen (where the logout button lives).
 *
 * Only the methods required by the test are implemented.  Extend as needed.
 */

import { $ } from '@wdio/globals';

class SettingsScreen {
  // -------------------------------------------------------------------------
  // Selectors
  // -------------------------------------------------------------------------
  get screenRoot() {
    return $('~SettingsScreen');
  }

  get logoutButton() {
    return $('~logoutButton');
  }

  // -------------------------------------------------------------------------
  // Helper methods
  // -------------------------------------------------------------------------
  async waitForIsShown() {
    await this.screenRoot.waitForDisplayed({ timeout: 5000 });
  }

  async tapLogoutButton() {
    await this.logoutButton.click();
  }
}

export default new SettingsScreen();
