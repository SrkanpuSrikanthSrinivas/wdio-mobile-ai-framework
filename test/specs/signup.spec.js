import LandingScreen from '../screenobjects/landing.screen.js';
import SignUpScreen from '../screenobjects/signup.screen.js';
import HomeScreen from '../screenobjects/home.screen.js';
import { buildSignup } from '../helpers/data.js';

/**
 * signup.spec.js — sign-up flow for GymProgress.
 * Landing -> Sign Up -> (valid) Home, or an inline error for bad input.
 */
describe('Sign up', () => {
  beforeEach(async () => {
    await LandingScreen.waitForLoaded();
    await LandingScreen.goToSignUp();
    await SignUpScreen.waitForLoaded();
  });

  it('creates an account and lands on the home screen', async () => {
    const form = buildSignup({ name: 'Alex Carter' });
    await SignUpScreen.signUp(form);
    await expect($(HomeScreen.selectors.welcome)).toBeDisplayed();
    await expect($(HomeScreen.selectors.welcome)).toHaveText(expect.stringContaining('Alex'));
  });

  it('rejects mismatched passwords', async () => {
    await SignUpScreen.signUp(buildSignup({ password: 'Password123', confirm: 'Different1' }));
    await expect($(SignUpScreen.selectors.error)).toBeDisplayed();
    await expect($(SignUpScreen.selectors.error)).toHaveText(expect.stringContaining('match'));
  });

  it('rejects an invalid email', async () => {
    await SignUpScreen.signUp(buildSignup({ email: 'not-an-email' }));
    await expect($(SignUpScreen.selectors.error)).toBeDisplayed();
  });
});
