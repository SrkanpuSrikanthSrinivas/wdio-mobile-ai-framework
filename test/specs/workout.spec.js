import LandingScreen from '../screenobjects/landing.screen.js';
import SignInScreen from '../screenobjects/signin.screen.js';
import HomeScreen from '../screenobjects/home.screen.js';
import StatsScreen from '../screenobjects/stats.screen.js';
import { DEMO } from '../helpers/data.js';

/** Log a workout after login, and check it reflects in Stats. */
describe('Workout logging + stats', () => {
  beforeEach(async () => {
    await LandingScreen.waitForLoaded();
    await LandingScreen.goToSignIn();
    await SignInScreen.waitForLoaded();
    await SignInScreen.signIn(DEMO);
    await HomeScreen.waitForLoaded();
  });

  it('logs a strength exercise with two sets', async () => {
    await HomeScreen.logStrength('Squats', [{ reps: '10', weight: '50' }, { reps: '8', weight: '60' }]);
    await expect($(HomeScreen.selectors.entryCount)).toHaveText('Workouts logged: 1');
  });

  it('reflects the workout in the Stats tab', async () => {
    await HomeScreen.logStrength('Squats', [{ reps: '5', weight: '100' }]);
    await HomeScreen.openStats();
    await StatsScreen.waitForLoaded();
    await expect($(StatsScreen.selectors.totalWorkouts)).toHaveText('1');
  });

  // TODO(participant): open Recovery, enter sleep 8 / soreness 2 / resting HR 55,
  // calculate, and assert the recovery label reads 'Fresh'.
});
