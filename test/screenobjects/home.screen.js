import Screen from './screen.js';

/**
 * home.screen.js — the main app after login (tabbed: Log / Stats / Recovery).
 * Covers the welcome header, tab bar, and the Log tab's core controls.
 */
const SELECTORS = {
  welcome: '~text-welcome',
  logoutButton: '~button-logout',
  tabLog: '~tab-log',
  tabStats: '~tab-stats',
  tabRecovery: '~tab-recovery',
  // Log tab
  exercise: '~input-exercise',
  setReps: '~input-set-reps',
  setWeight: '~input-set-weight',
  addSet: '~button-add-set',
  setCount: '~text-set-count',
  saveEntry: '~button-save-entry',
  entryCount: '~text-entry-count',
  error: '~text-error',
  clearButton: '~button-clear',
};

class HomeScreen extends Screen {
  async waitForLoaded() { await this.waitFor(SELECTORS.welcome); }
  async openStats() { await (await $(SELECTORS.tabStats)).click(); }
  async openRecovery() { await (await $(SELECTORS.tabRecovery)).click(); }
  async logout() { await (await $(SELECTORS.logoutButton)).click(); }

  /** Log a strength exercise with one or more sets, then save. */
  async logStrength(exercise, sets = [{ reps: '10', weight: '50' }]) {
    await (await $(SELECTORS.exercise)).setValue(exercise);
    for (const s of sets) {
      await (await $(SELECTORS.setReps)).setValue(s.reps);
      await (await $(SELECTORS.setWeight)).setValue(s.weight);
      await (await $(SELECTORS.addSet)).click();
    }
    await (await $(SELECTORS.saveEntry)).click();
  }

  async clearAll() { await (await $(SELECTORS.clearButton)).click(); }
  get selectors() { return SELECTORS; }
}
export default new HomeScreen();
export { SELECTORS };
