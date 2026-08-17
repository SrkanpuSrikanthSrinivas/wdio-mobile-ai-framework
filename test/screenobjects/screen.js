/**
 * screen.js — base screen. Tab-bar navigation + a wait helper every screen uses.
 * Locator strategy for this app: accessibility ids (the `~name` shorthand), which
 * are stable and cross-platform. See CONVENTIONS.md.
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
}

export default Screen;
export { TABS };
