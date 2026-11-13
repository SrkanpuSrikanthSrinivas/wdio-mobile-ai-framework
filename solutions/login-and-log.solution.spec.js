import LandingScreen from '../test/screenobjects/landing.screen.js';
import SignInScreen from '../test/screenobjects/signin.screen.js';
import HomeScreen from '../test/screenobjects/home.screen.js';
import { DEMO } from '../test/helpers/data.js';

/** Reference solution: sign in, then log a workout with the multi-set logger. */
describe('Login then log a workout (solution)', () => {
  it('signs in and logs one exercise', async () => {
    await LandingScreen.waitForLoaded();
    await LandingScreen.goToSignIn();
    await SignInScreen.waitForLoaded();
    await SignInScreen.signIn(DEMO);
    await HomeScreen.waitForLoaded();
    await HomeScreen.logStrength('Squats', [{ reps: '10', weight: '50' }]);
    await expect($(HomeScreen.selectors.entryCount)).toHaveText('Workouts logged: 1');
  });
});
