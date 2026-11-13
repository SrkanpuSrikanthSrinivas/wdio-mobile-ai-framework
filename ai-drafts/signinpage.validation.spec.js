/**
 * Sign‑In Page Validation Tests
 *
 * This spec validates the basic UI elements and error handling of the
 * sign‑in screen. It relies on the page object defined in
 * `test/pageobjects/signin.page.js`.
 */

const SignInPage = require('../pageobjects/signin.page');

describe('Sign‑In Page', () => {
    /**
     * Open the sign‑in screen before each test.
     */
    beforeEach(async () => {
        await SignInPage.open();
    });

    it('should display the correct title', async () => {
        await expect(SignInPage.title).toBeDisplayed();
        // Adjust the expected text if your app uses a different wording.
        await expect(SignInPage.title).toHaveTextContaining('Sign In');
    });

    it('should have email & password inputs and a disabled sign‑in button initially', async () => {
        await expect(SignInPage.emailInput).toBeDisplayed();
        await expect(SignInPage.passwordInput).toBeDisplayed();
        await expect(SignInPage.signInButton).toBeDisplayed();

        // Assuming the button is disabled until both fields have values.
        // If your app enables the button differently, adjust this expectation.
        await expect(SignInPage.signInButton).toBeDisabled();
    });

    it('should show an error message for invalid credentials', async () => {
        // Attempt login with deliberately wrong credentials.
        await SignInPage.login('invalid@example.com', 'wrongPassword');

        // Retrieve the alert/error text (implementation may vary).
        const alertText = await SignInPage.getAlertText();

        // Verify that an appropriate error is shown.
        await expect(alertText).toContain('Invalid credentials');
    });
});
