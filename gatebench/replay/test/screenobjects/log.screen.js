class LogScreen {
  get root() { return $('~screen-log'); }
  get title() { return $('~text-log-title'); }
  get inputExercise() { return $('~input-exercise'); }
  get inputSets() { return $('~input-sets'); }
  get inputReps() { return $('~input-reps'); }
  get inputWeight() { return $('~input-weight'); }
  get addButton() { return $('~button-add-entry'); }
  get emptyState() { return $('~text-log-empty'); }
  get entries() { return $$('~item-log-entry'); }

  async addEntry({ exercise, sets, reps, weight }) {
    await this.inputExercise.setValue(exercise);
    await this.inputSets.setValue(String(sets));
    await this.inputReps.setValue(String(reps));
    await this.inputWeight.setValue(String(weight));
    await this.addButton.click();
  }

  async entryCount() {
    const items = await this.entries;
    return items.length;
  }
}

export default new LogScreen();
