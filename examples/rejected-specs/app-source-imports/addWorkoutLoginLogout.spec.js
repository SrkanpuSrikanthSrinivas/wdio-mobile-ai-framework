/**
 * Test case: Login → Add a workout (key‑in) → Logout
 *
 * This spec assumes the existence of screen‑object modules that expose
 * selectors and helper methods for the relevant screens.  The imports now
 * point to the newly added screen‑object files with the required `.js`
 * extensions.
 */

import SignInScreen from '../../app/src/screens/SignInScreen.js';
import MainScreen from '../../app/src/screens/MainScreen.js';
import AddWorkoutScreen from '../../app/src/screens/AddWorkoutScreen.js';
import SettingsScreen from '../../app/src/screens/SettingsScreen.js';

describe('GymProgress – Add workout after login and then logout', () => {
  const testUser = {
    email: 'testuser@example.com',
    password: 'TestPass123',
  };

  const workout = {
    name: 'Bench Press',
    sets: 3,
    reps: 10,
    weight: 50,
  };

  it('should log in, add a workout, verify it, and log out', async () => {
    // ---------- Login ----------
    await SignInScreen.waitForIsShown();
    await SignInScreen.signIn(testUser.email, testUser.password);
    await MainScreen.waitForIsShown();

    // ---------- Navigate to Add Workout ----------
    await MainScreen.tapAddWorkoutButton();
    await AddWorkoutScreen.waitForIsShown();

    // ---------- Fill in workout details ----------
    await AddWorkoutScreen.setWorkoutName(workout.name);
    await AddWorkoutScreen.setSets(workout.sets);
    await AddWorkoutScreen.setReps(workout.reps);
    await AddWorkoutScreen.setWeight(workout.weight);

    // ---------- Save workout ----------
    await AddWorkoutScreen.tapSaveButton();

    // ---------- Verify workout appears in list ----------
    await MainScreen.waitForIsShown(); // back to main after save
    const entry = await MainScreen.findWorkoutEntryByName(workout.name);
    await expect(entry).toBeDisplayed();

    // Optional deeper verification (volume, set count, etc.)
    const volume = await entry.getAttribute('data-volume'); // assumes attribute exists
    const expectedVolume = workout.sets * workout.reps * workout.weight;
    await expect(Number(volume)).toBe(expectedVolume);

    // ---------- Logout ----------
    await MainScreen.openSettings();
    await SettingsScreen.waitForIsShown();
    await SettingsScreen.tapLogoutButton();

    // Verify we are back on the sign‑in screen
    await SignInScreen.waitForIsShown();
  });
});
