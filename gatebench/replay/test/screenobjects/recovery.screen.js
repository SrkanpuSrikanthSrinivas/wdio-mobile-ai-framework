class RecoveryScreen {
  get root() { return $('~screen-recovery'); }
  get title() { return $('~text-recovery-title'); }
  get score() { return $('~text-recovery-score'); }
  get advice() { return $('~text-recovery-advice'); }
  get logSleepButton() { return $('~button-log-sleep'); }
  get inputSleepHours() { return $('~input-sleep-hours'); }
  get restDayBanner() { return $('~text-rest-day'); }

  async logSleep(hours) {
    await this.inputSleepHours.setValue(String(hours));
    await this.logSleepButton.click();
  }
}

export default new RecoveryScreen();
