import LoginScreen from '../screenobjects/login.screen.js';

/**
 * smoke.spec.js — the first green test: the app launches and the login form is usable.
 * Every step here is one the device has already executed successfully.
 */
describe('Smoke', () => {
  it('shows the login form on the Login tab', async () => {
    await LoginScreen.open();
    await LoginScreen.switchToLogin();
    await expect($(LoginScreen.selectors.email)).toBeDisplayed();
    await expect($(LoginScreen.selectors.password)).toBeDisplayed();
    await expect($(LoginScreen.selectors.loginButton)).toBeDisplayed();
  });
});
