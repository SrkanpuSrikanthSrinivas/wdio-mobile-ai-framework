/**
 * screen.js — base screen. Tab-bar navigation, waits, and native alerts.
 * Locator strategy for this app: accessibility ids (the `~name` shorthand), which
 * are stable and cross-platform. See CONVENTIONS.md and APP-MAP.md.
 */

const TABS = {
  Home: '~Home',
  Webview: '~Webview',
  Login: '~Login',
  Forms: '~Forms',
  Swipe: '~Swipe',
  Drag: '~Drag',
};

class Screen {
  /** Tap a bottom-tab by name and wait for it to be shown. */
  async openTab(name) {
    const selector = TABS[name];
    if (!selector) throw new Error(`Unknown tab: ${name}`);
    const tab = await $(selector);
    await tab.waitForDisplayed({ timeout: 20000 });
    await tab.click();
  }

  /** Wait until a selector is displayed (default) or gone. */
  async waitFor(selector, { reverse = false, timeout = 20000 } = {}) {
    const el = await $(selector);
    await el.waitForDisplayed({ timeout, reverse });
    return el;
  }

  /** Close the on-screen keyboard if it is open, so it can't cover a button. */
  async hideKeyboard() {
    try {
      if (await driver.isKeyboardShown()) await driver.hideKeyboard();
    } catch { /* no keyboard: nothing to do */ }
  }

  /**
   * Wait for a native alert, return its message and close it.
   * The app shows a spinner first, so the default wait is generous (15s).
   * Returns '' if no alert appears within `timeout` — pass a short timeout for negative tests.
   */
  async readAlert({ timeout = 15000 } = {}) {
    const isOpen = async () => {
      try { await driver.getAlertText(); return true; } catch { return false; }
    };
    try {
      await driver.waitUntil(isOpen, { timeout, interval: 500 });
    } catch {
      return '';
    }
    const text = await driver.getAlertText();
    await driver.acceptAlert();
    return text;
  }
}

export default Screen;
export { TABS };
