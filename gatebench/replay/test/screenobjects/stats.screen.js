class StatsScreen {
  get root() { return $('~screen-stats'); }
  get title() { return $('~text-stats-title'); }
  get weeklyVolume() { return $('~text-weekly-volume'); }
  get streak() { return $('~text-streak'); }
  get emptyState() { return $('~text-stats-empty'); }

  async volumeValue() {
    const text = await this.weeklyVolume.getText();
    return Number(text.replace(/[^0-9.]/g, ''));
  }
}

export default new StatsScreen();
