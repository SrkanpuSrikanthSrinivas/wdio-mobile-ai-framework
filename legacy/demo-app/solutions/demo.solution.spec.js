import LoginScreen from '../test/screenobjects/login.screen.js';
import { buildCredentials, uniqueEmail } from '../test/helpers/data.js';

/**
 * demo.solution.spec.js — what a good AI-CLI answer to each PROMPTS.md prompt
 * looks like. Run it on a device BEFORE the talk to prove the screen methods work:
 *   npm run run:local -- solutions/demo.solution.spec.js
 * (Paths differ from a real spec only because this file lives in solutions/.)
 */

describe('Prompt A — sign up', () => {
  beforeEach(async () => {
    await LoginScreen.open();
    await LoginScreen.switchToSignup();
  });

  it('signs up with a fresh email and matching passwords', async () => {
    await LoginScreen.signup({ email: uniqueEmail('signup'), password: 'Password123!' });
    await expect(await LoginScreen.readAlert()).toBe(LoginScreen.messages.signupSuccess);
  });

  it('rejects mismatched passwords', async () => {
    await LoginScreen.signup({ ...buildCredentials(), repeatPassword: 'Different123!' });
    await expect(LoginScreen.validationMessage(LoginScreen.messages.passwordMismatch)).toBeDisplayed();
    await expect(await LoginScreen.readAlert({ timeout: 2000 })).toBe('');
  });
});

describe('Prompt B — login validation', () => {
  beforeEach(async () => {
    await LoginScreen.open();
    await LoginScreen.switchToLogin();
  });

  it('rejects an invalid email', async () => {
    await LoginScreen.login(buildCredentials({ email: 'not-an-email' }));
    await expect(LoginScreen.validationMessage(LoginScreen.messages.invalidEmail)).toBeDisplayed();
    await expect(await LoginScreen.readAlert({ timeout: 2000 })).toBe('');
  });

  it('rejects a password shorter than 8 characters', async () => {
    await LoginScreen.login(buildCredentials({ password: 'short' }));
    await expect(LoginScreen.validationMessage(LoginScreen.messages.shortPassword)).toBeDisplayed();
    await expect(await LoginScreen.readAlert({ timeout: 2000 })).toBe('');
  });
});

describe('Prompt C — successful login', () => {
  it('logs in with valid credentials', async () => {
    await LoginScreen.open();
    await LoginScreen.switchToLogin();
    await LoginScreen.login(buildCredentials());
    await expect(await LoginScreen.readAlert()).toBe(LoginScreen.messages.loginSuccess);
  });
});
