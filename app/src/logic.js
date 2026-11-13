// logic.js — pure GymProgress rules. No UI, so it can be unit-tested anywhere
// (and it mirrors the accessibility ids the tests will use).

export function parseCount(value) {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : null;
}

/** Validate a workout entry. Returns { valid, error }. */
export function validateWorkout({ exercise, sets, reps }) {
  if (!exercise || !String(exercise).trim()) {
    return { valid: false, error: 'Exercise name is required' };
  }
  if (parseCount(sets) === null) {
    return { valid: false, error: 'Sets must be a positive number' };
  }
  if (parseCount(reps) === null) {
    return { valid: false, error: 'Reps must be a positive number' };
  }
  return { valid: true, error: '' };
}

/** One-line summary, e.g. "Squats — 3x10". */
export function summarize({ exercise, sets, reps }) {
  return `${String(exercise).trim()} — ${parseCount(sets)}x${parseCount(reps)}`;
}

/** Total reps across all logged workouts.
 *  Invalid entries (non‑positive sets or reps) are ignored rather than
 *  propagating NaN, ensuring the function always returns a numeric total.
 */
export function totalReps(list) {
  return list.reduce((sum, w) => {
    const sets = parseCount(w.sets);
    const reps = parseCount(w.reps);
    if (sets === null || reps === null) {
      // Skip malformed entries
      return sum;
    }
    return sum + sets * reps;
  }, 0);
}
