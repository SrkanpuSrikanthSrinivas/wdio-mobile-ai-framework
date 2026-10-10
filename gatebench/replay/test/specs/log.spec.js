import { expect } from '@wdio/globals';
import SignInScreen from '../screenobjects/signin.screen.js';
import LandingScreen from '../screenobjects/landing.screen.js';
import TabBar from '../screenobjects/tabbar.screen.js';
import LogScreen from '../screenobjects/log.screen.js';

describe('Workout log', () => {
  before(async () => {
    await LandingScreen.waitForLoaded();
    await LandingScreen.openSignIn();
    await SignInScreen.signIn('demo@example.test', 'Demo1234!');
    await TabBar.openLog();
  });

  it('shows the empty state first', async () => {
    await expect(LogScreen.title).toHaveText('Workout log');
    await expect(LogScreen.emptyState).toHaveText('No workouts logged yet');
  });

  it('adds an entry', async () => {
    await LogScreen.addEntry({ exercise: 'Squat', sets: 3, reps: 5, weight: 100 });
    expect(await LogScreen.entryCount()).toBe(1);
  });
});
