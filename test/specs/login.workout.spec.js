import LandingScreen from '../screenobjects/landing.screen.js';
import SignInScreen from '../screenobjects/signin.screen.js';
import HomeScreen from '../screenobjects/home.screen.js';
import { DEMO } from '../helpers/data.js';

/**
 * login.workout.spec.js — sign in, then update the workout log:
 * add one small workout, check it is listed, remove it, check the count drops.
 * (GymProgress has no "edit" for a saved entry; add + delete is the real update.)
 */
describe('Log in and update a workout', () => {
  beforeEach(async () => {
    await LandingScreen.waitForLoaded();
    await LandingScreen.goToSignIn();
    await SignInScreen.waitForLoaded();
    await SignInScreen.signIn(DEMO);
    await HomeScreen.waitForLoaded();
  });

  it('logs a small workout and shows it in the list', async () => {
    await HomeScreen.logStrength('Squats', [{ reps: '10', weight: '50' }]);
    await expect($(HomeScreen.selectors.entryCount)).toHaveText('Workouts logged: 1');
    await expect($(HomeScreen.selectors.lastEntry)).toHaveText('Last: Squats — 1 sets');
  });

  it('removes the workout and updates the count', async () => {
    await HomeScreen.logStrength('Squats', [{ reps: '10', weight: '50' }]);
    await expect($(HomeScreen.selectors.entryCount)).toHaveText('Workouts logged: 1');
    await HomeScreen.deleteLatestEntry();
    await expect($(HomeScreen.selectors.entryCount)).toHaveText('Workouts logged: 0');
  });
});
