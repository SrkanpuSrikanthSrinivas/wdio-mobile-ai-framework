import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildCredentials,
  uniqueEmail,
  isValidEmail,
  byAccessibilityId,
} from './data.js';

/**
 * data.test.js — runs with `node --test` (no emulator, no Appium). This is what
 * the AI-CLI's auto-test loop uses for fast feedback while editing.
 */

test('buildCredentials returns defaults', () => {
  const c = buildCredentials();
  assert.equal(c.email, 'test@webdriver.io');
  assert.ok(c.password.length >= 8);
});

test('buildCredentials applies overrides', () => {
  const c = buildCredentials({ email: 'x@y.z' });
  assert.equal(c.email, 'x@y.z');
});

test('uniqueEmail is unique-ish and well-formed', () => {
  const a = uniqueEmail();
  assert.ok(isValidEmail(a), `${a} should be a valid email`);
});

test('isValidEmail rejects bad formats', () => {
  assert.equal(isValidEmail('not-an-email'), false);
  assert.equal(isValidEmail('a@b.co'), true);
});

test('byAccessibilityId builds a ~selector', () => {
  assert.equal(byAccessibilityId('button-LOGIN'), '~button-LOGIN');
  assert.throws(() => byAccessibilityId(''));
});
