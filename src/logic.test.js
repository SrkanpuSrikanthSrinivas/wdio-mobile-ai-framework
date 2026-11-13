import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateWorkout, summarize, totalReps, parseCount } from './logic.js';

test('valid workout passes', () => {
  const r = validateWorkout({ exercise: 'Squats', sets: '3', reps: '10' });
  assert.equal(r.valid, true);
  assert.equal(r.error, '');
});

test('empty exercise is rejected', () => {
  assert.equal(validateWorkout({ exercise: '', sets: '3', reps: '10' }).valid, false);
});

test('non-positive sets/reps are rejected', () => {
  assert.equal(validateWorkout({ exercise: 'X', sets: '0', reps: '10' }).valid, false);
  assert.equal(validateWorkout({ exercise: 'X', sets: '3', reps: '-1' }).valid, false);
  assert.equal(validateWorkout({ exercise: 'X', sets: 'abc', reps: '10' }).valid, false);
});

test('summarize formats nicely', () => {
  assert.equal(summarize({ exercise: 'Bench ', sets: '4', reps: '8' }), 'Bench — 4x8');
});

test('totalReps multiplies and sums', () => {
  assert.equal(totalReps([{ sets: '3', reps: '10' }, { sets: '2', reps: '5' }]), 40);
});

test('parseCount guards input', () => {
  assert.equal(parseCount('5'), 5);
  assert.equal(parseCount('0'), null);
  assert.equal(parseCount('x'), null);
});
