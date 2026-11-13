import Screen from './screen.js';

/**
 * gym.screen.js — the GymProgress screen. Selectors are the accessibility ids
 * set in the app (App.js), so they match by construction.
 */

const SELECTORS = {
  title: '~text-title',
  exercise: '~input-exercise',
  sets: '~input-sets',
  reps: '~input-reps',
  addButton: '~button-add',
  clearButton: '~button-clear',
  error: '~text-error',
  count: '~text-count',
  last: '~text-last',
  row: '~row-workout',
};

class GymScreen extends Screen {
  async waitForLoaded() {
    await this.waitFor(SELECTORS.exercise);
  }

  /** Fill the form and tap Add. Pass strings. */
  async addWorkout({ exercise = '', sets = '', reps = '' }) {
    if (exercise !== undefined) await (await $(SELECTORS.exercise)).setValue(exercise);
    if (sets !== undefined) await (await $(SELECTORS.sets)).setValue(sets);
    if (reps !== undefined) await (await $(SELECTORS.reps)).setValue(reps);
    await (await $(SELECTORS.addButton)).click();
  }

  async getCountText() {
    return (await $(SELECTORS.count)).getText();
  }

  async getErrorText() {
    const el = await $(SELECTORS.error);
    return (await el.isExisting()) ? el.getText() : '';
  }

  async clearAll() {
    await (await $(SELECTORS.clearButton)).click();
  }

  get selectors() {
    return SELECTORS;
  }
}

export default new GymScreen();
export { SELECTORS };
