/**
 * screen.js — base screen: waits and the keyboard. Every GymProgress element is
 * found by accessibility id (`~id`), listed in APP-MAP.md. See CONVENTIONS.md.
 */
class Screen {
  /** Wait until a selector is displayed (default) or gone. */
  async waitFor(selector, { reverse = false, timeout = 20000 } = {}) {
    const el = await $(selector);
    await el.waitForDisplayed({ timeout, reverse });
    return el;
  }

  /** Scroll an element into view if needed, then tap it (the Log screen scrolls). */
  async tap(selector) {
    const el = await $(selector);
    if (!(await el.isDisplayed())) {
      try { await el.scrollIntoView(); } catch { /* already reachable */ }
    }
    await el.waitForDisplayed({ timeout: 20000 });
    await el.click();
  }

  /** Close the on-screen keyboard if it is open, so it can't cover a button. */
  async hideKeyboard() {
    try {
      if (await driver.isKeyboardShown()) await driver.hideKeyboard();
    } catch { /* no keyboard: nothing to do */ }
  }
}

export default Screen;
