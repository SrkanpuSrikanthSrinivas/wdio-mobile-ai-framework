import { expect } from '@wdio/globals';
import LandingScreen from '../screenobjects/landing.screen.js';
import SignUpScreen from '../screenobjects/signup.screen.js';
import SignInScreen from '../screenobjects/signin.screen.js';

describe('Landing', () => {
  beforeEach(async () => {
    await driver.reloadSession();
    await LandingScreen.waitForLoaded();
  });

  it('shows the welcome message', async () => {
    await expect(LandingScreen.welcome).toHaveText('Welcome to GymProgress');
    await expect(LandingScreen.tagline).toBeDisplayed();
  });

  it('opens sign-up from Get started', async () => {
    await LandingScreen.openSignUp();
    await SignUpScreen.waitForLoaded();
    await expect(SignUpScreen.title).toHaveText('Create your account');
  });

  it('opens sign-in from the account link', async () => {
    await LandingScreen.openSignIn();
    await SignInScreen.waitForLoaded();
    await expect(SignInScreen.title).toHaveText('Welcome back');
  });
});
