import { test } from 'node:test';
import assert from 'node:assert/strict';
import { recoveryScore } from './recovery.js';

test('well-rested scores high', () => {
  const r = recoveryScore({ sleepHours: 8, soreness: 1, restingHr: 55 });
  assert.ok(r.score >= 90, `expected high, got ${r.score}`);
  assert.equal(r.label, 'Fresh');
});

test('poor inputs score low', () => {
  const r = recoveryScore({ sleepHours: 3, soreness: 9, restingHr: 95 });
  assert.ok(r.score <= 35, `expected low, got ${r.score}`);
  assert.equal(r.label, 'Rest');
});

test('score is always 0-100 and rounded', () => {
  const r = recoveryScore({ sleepHours: 6, soreness: 5, restingHr: 70 });
  assert.ok(r.score >= 0 && r.score <= 100);
  assert.equal(r.score, Math.round(r.score));
});
