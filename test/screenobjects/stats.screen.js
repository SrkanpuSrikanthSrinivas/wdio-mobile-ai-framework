import Screen from './screen.js';

const SELECTORS = {
  title: '~text-stats-title',
  totalWorkouts: '~text-total-workouts',
  totalVolume: '~text-total-volume',
  progressSummary: '~text-progress-summary',
  bodyweight: '~input-bodyweight',
  bestLift: '~input-best-lift',
  rateButton: '~button-rate',
  rating: '~text-strength-rating',
  statFor: (muscle) => `~stat-${muscle}`,
  liftChip: (lift) => `~chip-lift-${lift}`,
};

class StatsScreen extends Screen {
  async waitForLoaded() { await this.waitFor(SELECTORS.title); }
  async rateLift(lift, bodyweight, best) {
    await (await $(SELECTORS.liftChip(lift))).click();
    await (await $(SELECTORS.bodyweight)).setValue(bodyweight);
    await (await $(SELECTORS.bestLift)).setValue(best);
    await (await $(SELECTORS.rateButton)).click();
  }
  get selectors() { return SELECTORS; }
}
export default new StatsScreen();
export { SELECTORS };
