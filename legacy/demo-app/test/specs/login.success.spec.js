import LoginScreen from '../screenobjects/login.screen.js';

describe('Login – Success', () => {
  it('should log in successfully with valid credentials', async () => {
    // Open the app and navigate to the Login tab
    await LoginScreen.open();
    await LoginScreen.switchToLogin();

    // Perform login with valid credentials
    await LoginScreen.login({
      email: 'test@example.com',
      password: 'Password123',
    });

    // Verify the success message is displayed
    const successMessage = await LoginScreen.validationMessage(
      LoginScreen.messages.loginSuccess
    );
    await expect(successMessage).toBeDisplayed();
  });
});
