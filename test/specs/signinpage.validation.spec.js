/**
 * Sign‑In Page Validation Tests
 *
 * This test suite validates the basic UI and functional behavior of the
 * sign‑in page. It assumes a page object `SignInPage` exists at
 * `../pageobjects/signin.page.js` exposing the following selectors / methods:
 *
 * - open()                – navigates to the sign‑in screen
 * - title                 – element representing the page title
 * - emailInput            – input field for the email address
 * - passwordInput         – input field for the password
 * - signInButton          – button used to submit the credentials
 * - login(email, pass)    – helper that fills the fields and taps the button
 * - getAlertText()        – returns any error alert text displayed after a login attempt
 *
 * Adjust the selectors or method names to match your actual page‑object implementation.
 */

const SignInPage = require('../pageobjects/signin.page');

describe('Sign In Page Validation', () => {
    beforeEach(async () => {
        // Open the sign‑in page before each test
        await SignInPage.open();
    });

    it('should display the correct title', async () => {
        await expect(SignInPage.title).toBeDisplayed();
        await expect(SignInPage.title).toHaveText('Sign In');
    });

    it('should have email & password fields and a disabled sign‑in button initially', async () => {
        await expect(SignInPage.emailInput).toBeDisplayed();
        await expect(SignInPage.passwordInput).toBeDisplayed();
        await expect(SignInPage.signInButton).toBeDisplayed();

        // Button should be disabled until both fields are filled
        await expect(SignInPage.signInButton).toBeDisabled();

        // Fill valid values
        await SignInPage.emailInput.setValue('testuser@example.com');
        await SignInPage.passwordInput.setValue('ValidPass123');

        // Now the button should become enabled
        await expect(SignInPage.signInButton).toBeEnabled();
    });

    it('should show an error message for invalid credentials', async () => {
        // Attempt login with deliberately wrong credentials
        await SignInPage.login('invalid@example.com', 'wrongPassword');

        // Retrieve the alert/error text (implementation may vary)
        const alertText = await SignInPage.getAlertText();

        // Verify that an appropriate error is shown
        await expect(alertText).toContain('Invalid credentials');
    });
});
