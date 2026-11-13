/**
 * Screen‑object for the “Add Workout” screen.
 *
 * This is a minimal implementation that provides the methods used by the
 * end‑to‑end test `addWorkoutLoginLogout.spec.js`.  If the real app already
 * contains a richer screen object, replace this file with the actual one.
 *
 * The selectors are based on the accessibility identifiers (`testID`) that
 * are defined in the app source (see APP‑MAP.md).  Adjust them if the identifiers
 * differ in your project.
 */

import { $ } from '@wdio/globals';

class AddWorkoutScreen {
  // -------------------------------------------------------------------------
  // Selectors (using testID / accessibilityLabel)
  // -------------------------------------------------------------------------
  get screenRoot() {
    return $('~AddWorkoutScreen');
  }

  get nameInput() {
    return $('~addWorkoutName');
  }

  get setsInput() {
    return $('~addWorkoutSets');
  }

  get repsInput() {
    return $('~addWorkoutReps');
  }

  get weightInput() {
    return $('~addWorkoutWeight');
  }

  get saveButton() {
    return $('~addWorkoutSave');
  }

  // -------------------------------------------------------------------------
  // Helper methods used by the test
  // -------------------------------------------------------------------------
  async waitForIsShown() {
    await this.screenRoot.waitForDisplayed({ timeout: 5000 });
  }

  async setWorkoutName(name) {
    await this.nameInput.setValue(name);
  }

  async setSets(sets) {
    await this.setsInput.setValue(String(sets));
  }

  async setReps(reps) {
    await this.repsInput.setValue(String(reps));
  }

  async setWeight(weight) {
    await this.weightInput.setValue(String(weight));
  }

  async tapSaveButton() {
    await this.saveButton.click();
  }
}

export default new AddWorkoutScreen();
