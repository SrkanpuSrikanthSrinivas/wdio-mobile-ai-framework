import GymScreen from '../screenobjects/gym.screen.js';

/**
 * gym.spec.js — the tests you'll grow with the AI during the workshop.
 * App under test: GymProgress (see /app). Selectors are accessibility ids.
 */

describe('GymProgress — logging workouts', () => {
  beforeEach(async () => {
    await GymScreen.waitForLoaded();
    // start each test from a clean list
    await GymScreen.clearAll().catch(() => {});
  });

  it('logs a valid workout and increments the count', async () => {
    await GymScreen.addWorkout({ exercise: 'Squats', sets: '3', reps: '10' });
    await expect($(GymScreen.selectors.count)).toHaveText('Workouts logged: 1');
    await expect($(GymScreen.selectors.last)).toHaveText(expect.stringContaining('Squats'));
  });

  it('rejects an empty exercise name', async () => {
    await GymScreen.addWorkout({ exercise: '', sets: '3', reps: '10' });
    await expect($(GymScreen.selectors.error)).toBeDisplayed();
    await expect($(GymScreen.selectors.count)).toHaveText('Workouts logged: 0');
  });

  // ---------------------------------------------------------------------
  // TODO(participant): add a test with the AI.
  // Ask aider: "Add a test that logs TWO workouts and asserts the count reads
  // 'Workouts logged: 2'. Follow CONVENTIONS.md. Then run npm run validate."
  // ---------------------------------------------------------------------
});
