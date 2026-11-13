import { test } from 'node:test';
import assert from 'node:assert/strict';
import { entryVolume, muscleSummary, totals, topWeightSeries, strengthRating } from './stats.js';

const strength = (exercise, muscle, sets, date = 1) => ({ exercise, muscle, type: 'strength', sets, date });

test('entryVolume sums reps*weight', () => {
  assert.equal(entryVolume(strength('Squat', 'Legs', [{ reps: '10', weight: '50' }, { reps: '8', weight: '60' }])), 980);
  assert.equal(entryVolume({ type: 'cardio' }), 0);
});

test('muscleSummary aggregates by muscle', () => {
  const s = muscleSummary([
    strength('Squat', 'Legs', [{ reps: '10', weight: '50' }]),
    strength('Lunge', 'Legs', [{ reps: '10', weight: '20' }]),
  ]);
  assert.equal(s.Legs.sets, 2);
  assert.equal(s.Legs.volume, 700);
});

test('totals count workouts/sets/volume', () => {
  const t = totals([strength('Squat', 'Legs', [{ reps: '5', weight: '100' }, { reps: '5', weight: '100' }])]);
  assert.deepEqual(t, { workouts: 1, sets: 2, volume: 1000 });
});

test('topWeightSeries sorts and takes max weight', () => {
  const series = topWeightSeries([
    strength('Squat', 'Legs', [{ reps: '5', weight: '80' }, { reps: '5', weight: '90' }], 2),
    strength('Squat', 'Legs', [{ reps: '5', weight: '70' }], 1),
  ], 'Squat');
  assert.deepEqual(series.map((p) => p.top), [70, 90]);
});

test('strengthRating maps ratio to a label', () => {
  assert.equal(strengthRating('Squat', 100, 60).rating, 'Untrained');
  assert.equal(strengthRating('Squat', 100, 130).rating, 'Intermediate');
  assert.equal(strengthRating('Deadlift', 80, 200).rating, 'Elite');
  assert.equal(strengthRating('Deadlift', 100, 210).rating, 'Advanced');
});
