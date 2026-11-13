/**
 * Sign‑up integration test for the wdio‑mobile‑ai‑framework project.
 *
 * This test:
 *   1. Generates a fresh e‑mail address for each run.
 *   2. Navigates to the sign‑up page.
 *   3. Fills out the sign‑up form.
 *   4. Submits the form.
 *   5. Verifies that an alert (or toast/message) containing the exact text
 *      'signed up' is displayed.
 *
 * Adjust selectors, URLs, and the verification logic to match the actual
 * implementation of your application.
 */

const assert = require('assert');

/**
 * Helper to generate a unique e‑mail address.
 */
function generateFreshEmail() {
    const timestamp = Date.now();
    return `testuser_${timestamp}@example.com`;
}

/**
 * Main test suite.
 */
describe('Sign‑up flow', () => {
    it("should sign up with a fresh email and display an alert saying 'signed up'", async () => {
        const freshEmail = generateFreshEmail();

        // 1. Open the sign‑up page.
        // Adjust the URL if your sign‑up route differs.
        await browser.url('/signup');

        // 2. Fill in the form fields.
        // Update selectors to match your actual markup.
        const emailInput = await $('#email');
        const passwordInput = await $('#password');
        const nameInput = await $('#name');
        const submitButton = await $('#signupBtn');

        await emailInput.setValue(freshEmail);
        await passwordInput.setValue('TestPassword123!');
        await nameInput.setValue('Test User');

        // 3. Submit the form.
        await submitButton.click();

        // 4. Wait for an alert / toast / message that contains 'signed up'.
        // This example checks a browser alert first; if your app uses a
        // custom toast element, replace the logic accordingly.
        let alertText = null;

        // Try native browser alert
        try {
            await browser.waitUntil(async () => {
                return await browser.isAlertOpen();
            }, {
                timeout: 5000,
                timeoutMsg: 'expected alert to be opened after sign‑up'
            });
            alertText = await browser.getAlertText();
            // Dismiss the alert so it doesn't block subsequent steps
            await browser.acceptAlert();
        } catch (e) {
            // No native alert – fall back to checking a DOM element.
            // Adjust the selector to match your toast/notification element.
            const toast = await $('.toast, .alert, .notification');
            await toast.waitForDisplayed({ timeout: 5000 });
            alertText = await toast.getText();
        }

        // 5. Assert the message.
        assert.strictEqual(alertText, 'signed up', `Expected alert text to be 'signed up' but got '${alertText}'`);
    });
});
