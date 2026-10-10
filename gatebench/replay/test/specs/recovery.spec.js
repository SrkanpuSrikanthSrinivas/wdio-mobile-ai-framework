import { expect } from '@wdio/globals';
import SignInScreen from '../screenobjects/signin.screen.js';
import LandingScreen from '../screenobjects/landing.screen.js';
import TabBar from '../screenobjects/tabbar.screen.js';
import RecoveryScreen from '../screenobjects/recovery.screen.js';

describe('Recovery', () => {
  before(async () => {
    await LandingScreen.waitForLoaded();
    await LandingScreen.openSignIn();
    await SignInScreen.signIn('demo@example.test', 'Demo1234!');
    await TabBar.openRecovery();
  });

  it('shows the recovery screen', async () => {
    await expect(RecoveryScreen.title).toHaveText('Recovery');
    await expect(RecoveryScreen.score).toBeDisplayed();
  });

  it('suggests rest after little sleep', async () => {
    await RecoveryScreen.logSleep(3);
    await expect(RecoveryScreen.restDayBanner).toHaveText('Take a rest day');
  });
});
