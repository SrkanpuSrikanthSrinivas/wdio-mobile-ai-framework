import GymScreen from '../test/screenobjects/gym.screen.js';
import { buildWorkout } from '../test/helpers/data.js';

/** Reference solution for the Lab 02 TODO (two workouts -> count 2). */
describe('GymProgress (solution)', () => {
  beforeEach(async () => {
    await GymScreen.waitForLoaded();
    await GymScreen.clearAll().catch(() => {});
  });

  it('logs two workouts and counts them', async () => {
    await GymScreen.addWorkout(buildWorkout({ exercise: 'Squats' }));
    await GymScreen.addWorkout(buildWorkout({ exercise: 'Bench', reps: '8' }));
    await expect($(GymScreen.selectors.count)).toHaveText('Workouts logged: 2');
  });
});
