import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DEMO, uniqueEmail, buildSignup, buildWorkout, byAccessibilityId } from './data.js';

test('demo creds present', () => {
  assert.equal(DEMO.email, 'demo@gym.com');
});
test('uniqueEmail is well-formed and unique-ish', () => {
  const a = uniqueEmail(); assert.match(a, /@gym\.com$/);
});
test('buildSignup defaults are valid-looking', () => {
  const s = buildSignup();
  assert.equal(s.password, s.confirm);
  assert.ok(s.name && s.email);
});
test('buildWorkout + byAccessibilityId', () => {
  assert.equal(buildWorkout().exercise, 'Squats');
  assert.equal(byAccessibilityId('button-add'), '~button-add');
  assert.throws(() => byAccessibilityId(''));
});
