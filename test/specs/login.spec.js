import LandingScreen from '../screenobjects/landing.screen.js';
import SignInScreen from '../screenobjects/signin.screen.js';
import HomeScreen from '../screenobjects/home.screen.js';
import { DEMO } from '../helpers/data.js';

/**
 * login.spec.js — sign-in flow for GymProgress.
 * Uses the seeded demo account so it's deterministic on every device.
 */
describe('Login', () => {
  beforeEach(async () => {
    await LandingScreen.waitForLoaded();
    await LandingScreen.goToSignIn();
    await SignInScreen.waitForLoaded();
  });

  it('signs in with the demo account and reaches home', async () => {
    await SignInScreen.signIn(DEMO);
    await expect($(HomeScreen.selectors.welcome)).toBeDisplayed();
  });

  it('rejects a wrong password', async () => {
    await SignInScreen.signIn({ email: DEMO.email, password: 'WrongPass9' });
    await expect($(SignInScreen.selectors.error)).toBeDisplayed();
    await expect($(SignInScreen.selectors.error)).toHaveText(expect.stringContaining('Invalid'));
  });

  // TODO(participant): after signing in, log a strength exercise (Squats, one set
  // 10x50) via the Log tab and assert the count reads 'Workouts logged: 1'.
  // (Use the HomeScreen.logStrength helper.)
});
