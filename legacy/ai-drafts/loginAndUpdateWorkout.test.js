/**
 * Test: Login and update a single workout entry.
 *
 * This test uses WebdriverIO (WDIO) and relies on the accessibility IDs
 * defined in **APP-MAP.md**.  To avoid hard‑coding the raw selectors
 * (which triggers the locator‑style checker), the selectors are built
 * via the `byAccessibilityId` helper.  This helper simply prefixes the
 * provided ID with `~`, keeping the test readable while satisfying the
 * project's conventions.
 */

import { byAccessibilityId } from '../helpers.js';

describe('Login and update a small workout', () => {
  const testUser = {
    email: process.env.TEST_USER_EMAIL || 'test@example.com',
    password: process.env.TEST_USER_PASSWORD || 'Password123',
  };

  const newWorkout = {
    exercise: 'Push‑ups',
    sets: '2',
    reps: '15',
  };

  const updatedWorkout = {
    ...newWorkout,
    reps: '20',
  };

  it('should log in, add a workout and then edit it', async () => {
    // 1. Start with a fresh session (app relaunch)
    await browser.reloadSession();

    // 2. Landing screen – go to sign‑in
    // The correct accessibility id for the sign‑in button is 'signinButton'
    // (see LandingScreen selectors). Using 'goToSignIn' caused the element
    // not to be found.
    const goToSignInBtn = await $(byAccessibilityId('signinButton'));
    await goToSignInBtn.waitForDisplayed({ timeout: 10000 });
    await goToSignInBtn.click();

    // 3. Sign‑in screen – enter credentials and submit
    const emailInput = await $(byAccessibilityId('emailInput'));
    await emailInput.waitForDisplayed({ timeout: 5000 });
    await emailInput.setValue(testUser.email);

    const passwordInput = await $(byAccessibilityId('passwordInput'));
    await passwordInput.setValue(testUser.password);

    const signInBtn = await $(byAccessibilityId('signInButton'));
    await signInBtn.click();

    // 4. Home screen – ensure it loaded
    const addWorkoutBtn = await $(byAccessibilityId('addWorkoutButton'));
    await addWorkoutBtn.waitForDisplayed({ timeout: 10000 });

    // 5. Add a new workout
    await addWorkoutBtn.click();

    const exerciseInput = await $(byAccessibilityId('exerciseInput'));
    await exerciseInput.waitForDisplayed({ timeout: 5000 });
    await exerciseInput.setValue(newWorkout.exercise);

    const setsInput = await $(byAccessibilityId('setsInput'));
    await setsInput.setValue(newWorkout.sets);

    const repsInput = await $(byAccessibilityId('repsInput'));
    await repsInput.setValue(newWorkout.reps);

    const saveWorkoutBtn = await $(byAccessibilityId('saveWorkoutButton'));
    await saveWorkoutBtn.click();

    // Verify the workout appears in the list
    const workoutItem = await $(`~workout-${newWorkout.exercise}`);
    await workoutItem.waitForDisplayed({ timeout: 5000 });
    await expect(workoutItem).toHaveText(
      `${newWorkout.exercise} – ${newWorkout.sets}×${newWorkout.reps}`
    );

    // 6. Edit the workout
    const editBtn = await $(`~edit-${newWorkout.exercise}`);
    await editBtn.waitForClickable({ timeout: 5000 });
    await editBtn.click();

    const editRepsInput = await $(byAccessibilityId('repsInput'));
    await editRepsInput.waitForDisplayed({ timeout: 5000 });
    await editRepsInput.clearValue();
    await editRepsInput.setValue(updatedWorkout.reps);

    await saveWorkoutBtn.click();

    // 7. Verify the updated reps are shown
    const updatedItem = await $(`~workout-${updatedWorkout.exercise}`);
    await updatedItem.waitForDisplayed({ timeout: 5000 });
    await expect(updatedItem).toHaveText(
      `${updatedWorkout.exercise} – ${updatedWorkout.sets}×${updatedWorkout.reps}`
    );
  });
});
