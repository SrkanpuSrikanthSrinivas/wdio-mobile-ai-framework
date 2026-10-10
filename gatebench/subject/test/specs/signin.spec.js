import { expect } from '@wdio/globals';
import LandingScreen from '../screenobjects/landing.screen.js';
import SignInScreen from '../screenobjects/signin.screen.js';
import TabBar from '../screenobjects/tabbar.screen.js';

describe('Sign in', () => {
  beforeEach(async () => {
    await driver.reloadSession();
    await LandingScreen.waitForLoaded();
    await LandingScreen.openSignIn();
    await SignInScreen.waitForLoaded();
  });

  it('requires both fields', async () => {
    await SignInScreen.signIn('', '');
    await expect(SignInScreen.error).toHaveText('Email and password are required');
  });

  it('rejects wrong credentials', async () => {
    await SignInScreen.signIn('demo@example.test', 'WrongPass1!');
    await expect(SignInScreen.error).toHaveText('Invalid email or password');
  });

  it('signs in a known user', async () => {
    await SignInScreen.signIn('demo@example.test', 'Demo1234!');
    await expect(TabBar.root).toBeDisplayed();
  });
});
