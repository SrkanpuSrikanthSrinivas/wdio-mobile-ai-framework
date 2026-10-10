import { expect } from '@wdio/globals';
import SignInScreen from '../screenobjects/signin.screen.js';
import LandingScreen from '../screenobjects/landing.screen.js';
import TabBar from '../screenobjects/tabbar.screen.js';
import LogScreen from '../screenobjects/log.screen.js';
import StatsScreen from '../screenobjects/stats.screen.js';
import { entryVolume } from '../helpers/data.js';

describe('Stats', () => {
  before(async () => {
    await LandingScreen.waitForLoaded();
    await LandingScreen.openSignIn();
    await SignInScreen.signIn('demo@example.test', 'Demo1234!');
  });

  it('prompts to log before showing stats', async () => {
    await TabBar.openStats();
    await expect(StatsScreen.emptyState).toHaveText('Log a workout to see your stats');
  });

  it('shows weekly volume after logging', async () => {
    const entry = { exercise: 'Bench press', sets: 3, reps: 8, weight: 60 };
    await TabBar.openLog();
    await LogScreen.addEntry(entry);
    await TabBar.openStats();
    await expect(StatsScreen.title).toHaveText('Your stats');
    expect(await StatsScreen.volumeValue()).toBe(entryVolume(entry));
  });
});
