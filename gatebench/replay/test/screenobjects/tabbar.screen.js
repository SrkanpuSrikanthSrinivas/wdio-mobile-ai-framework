class TabBar {
  get root() { return $('~tabbar'); }
  get logTab() { return $('~tab-log'); }
  get statsTab() { return $('~tab-stats'); }
  get recoveryTab() { return $('~tab-recovery'); }

  async openLog() { await this.logTab.click(); }
  async openStats() { await this.statsTab.click(); }
  async openRecovery() { await this.recoveryTab.click(); }
}

export default new TabBar();
