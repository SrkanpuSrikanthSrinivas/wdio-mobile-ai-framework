import { expect } from '@wdio/globals';
import LandingScreen from '../screenobjects/landing.screen.js';
import SignUpScreen from '../screenobjects/signup.screen.js';
import TabBar from '../screenobjects/tabbar.screen.js';
import { uniqueEmail } from '../helpers/data.js';

describe('Sign up', () => {
  beforeEach(async () => {
    await driver.reloadSession();
    await LandingScreen.waitForLoaded();
    await LandingScreen.openSignUp();
    await SignUpScreen.waitForLoaded();
  });

  it('rejects an invalid email', async () => {
    await SignUpScreen.fillForm('not-an-email', 'Password123!');
    await SignUpScreen.submit();
    await expect(SignUpScreen.error).toHaveText('Please enter a valid email address');
  });

  it('rejects a short password', async () => {
    await SignUpScreen.fillForm(uniqueEmail('signup'), 'short');
    await SignUpScreen.submit();
    await expect(SignUpScreen.error).toHaveText('Password must be at least 8 characters');
  });

  it('creates an account with valid details', async () => {
    await SignUpScreen.fillForm(uniqueEmail('signup'), 'Password123!');
    await SignUpScreen.submit();
    await expect(TabBar.root).toBeDisplayed();
  });
});
