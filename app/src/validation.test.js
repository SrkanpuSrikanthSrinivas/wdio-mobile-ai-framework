import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  isValidEmail, validateSignup, validateSignin, findUser,
  validateWorkout, summarize, DEMO_USER,
} from './validation.js';

test('email validation', () => {
  assert.equal(isValidEmail('a@b.co'), true);
  assert.equal(isValidEmail('nope'), false);
});

test('signup: happy path', () => {
  assert.equal(validateSignup({ name: 'A', email: 'a@b.co', password: 'secret1', confirm: 'secret1' }).valid, true);
});

test('signup: catches each error', () => {
  assert.match(validateSignup({ name: '', email: 'a@b.co', password: 'secret1', confirm: 'secret1' }).error, /Name/);
  assert.match(validateSignup({ name: 'A', email: 'bad', password: 'secret1', confirm: 'secret1' }).error, /email/);
  assert.match(validateSignup({ name: 'A', email: 'a@b.co', password: '123', confirm: '123' }).error, /6 characters/);
  assert.match(validateSignup({ name: 'A', email: 'a@b.co', password: 'secret1', confirm: 'nope' }).error, /match/);
});

test('signin validation', () => {
  assert.equal(validateSignin({ email: 'a@b.co', password: 'x' }).valid, true);
  assert.equal(validateSignin({ email: 'bad', password: 'x' }).valid, false);
});

test('findUser matches demo (case-insensitive email)', () => {
  const u = findUser([DEMO_USER], 'DEMO@gym.com', 'Password123');
  assert.ok(u);
  assert.equal(findUser([DEMO_USER], 'demo@gym.com', 'wrong'), null);
});

test('workout validation + summary', () => {
  assert.equal(validateWorkout({ exercise: 'Squats', sets: '3', reps: '10' }).valid, true);
  assert.equal(validateWorkout({ exercise: '', sets: '3', reps: '10' }).valid, false);
  assert.equal(summarize({ exercise: 'Bench ', sets: '4', reps: '8' }), 'Bench — 4x8');
});

test('validateSet + validateEntry', async () => {
  const { validateSet, validateEntry } = await import('./validation.js');
  assert.equal(validateSet({ reps: '10', weight: '50' }).valid, true);
  assert.equal(validateSet({ reps: '0', weight: '50' }).valid, false);
  assert.equal(validateEntry({ exercise: 'Squat', type: 'strength', sets: [{ reps: '5', weight: '100' }] }).valid, true);
  assert.equal(validateEntry({ exercise: '', type: 'strength', sets: [] }).valid, false);
  assert.equal(validateEntry({ exercise: 'Run', type: 'cardio', duration: '30' }).valid, true);
  assert.equal(validateEntry({ exercise: 'Run', type: 'cardio', duration: '0' }).valid, false);
});
