import Screen from './screen.js';

const SELECTORS = {
  title: '~text-recovery-title',
  sleep: '~input-sleep',
  soreness: '~input-soreness',
  restingHr: '~input-resting-hr',
  calcButton: '~button-calc-recovery',
  score: '~text-recovery-score',
  label: '~text-recovery-label',
  advice: '~text-recovery-advice',
};

class RecoveryScreen extends Screen {
  async waitForLoaded() { await this.waitFor(SELECTORS.title); }
  async calculate({ sleep, soreness, restingHr }) {
    await (await $(SELECTORS.sleep)).setValue(sleep);
    await (await $(SELECTORS.soreness)).setValue(soreness);
    await (await $(SELECTORS.restingHr)).setValue(restingHr);
    await (await $(SELECTORS.calcButton)).click();
  }
  get selectors() { return SELECTORS; }
}
export default new RecoveryScreen();
export { SELECTORS };
