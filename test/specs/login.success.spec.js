import LandingScreen from '../screenobjects/landing.screen.js';
import SignInScreen from '../screenobjects/signin.screen.js';
import HomeScreen from '../screenobjects/home.screen.js';
import { DEMO } from '../helpers/data.js';

/**
 * login.success.spec.js — the demo account signs in and lands in the app.
 * Success in GymProgress is the next screen appearing, not an alert (APP-MAP.md).
 */
describe('Login success', () => {
  it('signs in with the demo account and greets the user', async () => {
    await LandingScreen.waitForLoaded();
    await LandingScreen.goToSignIn();
    await SignInScreen.waitForLoaded();
    await SignInScreen.signIn(DEMO);
    await HomeScreen.waitForLoaded();
    await expect($(HomeScreen.selectors.welcome)).toHaveText('Hi, Demo User');
  });
});
