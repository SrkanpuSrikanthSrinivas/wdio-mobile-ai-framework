import LandingScreen from '../screenobjects/landing.screen.js';
import SignInScreen from '../screenobjects/signin.screen.js';
import HomeScreen from '../screenobjects/home.screen.js';
import { DEMO } from '../helpers/data.js';

describe('Login, workout logging, and logout flow', () => {
  beforeEach(async () => {
    await LandingScreen.waitForLoaded();
    await LandingScreen.goToSignIn();
    await SignInScreen.waitForLoaded();
  });

  it('signs in, logs a workout, and logs out', async () => {
    await SignInScreen.signIn(DEMO);
    await HomeScreen.waitForLoaded();
    await expect($(HomeScreen.selectors.welcome)).toHaveText('Hi, Demo User');

    await HomeScreen.logStrength('Bench Press', [{ reps: '10', weight: '135' }]);
    await expect($(HomeScreen.selectors.entryCount)).toHaveText('Workouts logged: 1');

    await HomeScreen.logout();
    await LandingScreen.waitForLoaded();
    await expect($(LandingScreen.selectors.title)).toBeDisplayed();
  });
});
