/**
 * data.js — pure helpers with NO device dependency, so the AI-CLI's auto-test
 * loop can validate logic instantly. Mirrors the GymProgress app.
 */

// The seeded demo account (matches app/src/validation.js DEMO_USER).
export const DEMO = { email: 'demo@gym.com', password: 'Password123' };

/** A unique email so repeated sign-up runs don't collide within a session. */
export function uniqueEmail(prefix = 'user') {
  return `${prefix}.${Date.now().toString(36)}@gym.com`;
}

/** Build a valid sign-up form with overrides. */
export function buildSignup(overrides = {}) {
  return { name: 'Alex Carter', email: uniqueEmail(), password: 'Password123', confirm: 'Password123', ...overrides };
}

/** Build a workout entry (strings, as typed). */
export function buildWorkout(overrides = {}) {
  return { exercise: 'Squats', sets: '3', reps: '10', ...overrides };
}

export function byAccessibilityId(id) {
  if (!id) throw new Error('accessibility id required');
  return `~${id}`;
}
