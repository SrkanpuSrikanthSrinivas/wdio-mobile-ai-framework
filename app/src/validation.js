// validation.js — pure rules for GymProgress. No UI, so unit-testable anywhere.

export function isValidEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function parseCount(value) {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : null;
}

/** Sign-up form validation. Returns { valid, error }. */
export function validateSignup({ name, email, password, confirm }) {
  if (!name || !String(name).trim()) return { valid: false, error: 'Name is required' };
  if (!isValidEmail(email)) return { valid: false, error: 'Enter a valid email' };
  if (!password || String(password).length < 6) return { valid: false, error: 'Password must be at least 6 characters' };
  if (password !== confirm) return { valid: false, error: 'Passwords do not match' };
  return { valid: true, error: '' };
}

/** Sign-in form validation (format only; credential match is in the app). */
export function validateSignin({ email, password }) {
  if (!isValidEmail(email)) return { valid: false, error: 'Enter a valid email' };
  if (!password) return { valid: false, error: 'Password is required' };
  return { valid: true, error: '' };
}

/** Find a matching user (case-insensitive email). */
export function findUser(users, email, password) {
  const e = String(email || '').trim().toLowerCase();
  return users.find((u) => u.email.toLowerCase() === e && u.password === password) || null;
}

/** Workout form validation. */
export function validateWorkout({ exercise, sets, reps }) {
  if (!exercise || !String(exercise).trim()) return { valid: false, error: 'Exercise name is required' };
  if (parseCount(sets) === null) return { valid: false, error: 'Sets must be a positive number' };
  if (parseCount(reps) === null) return { valid: false, error: 'Reps must be a positive number' };
  return { valid: true, error: '' };
}

export function summarize({ exercise, sets, reps }) {
  return `${String(exercise).trim()} — ${parseCount(sets)}x${parseCount(reps)}`;
}

/** Seed account so login always works in a demo. */
export const DEMO_USER = { name: 'Demo User', email: 'demo@gym.com', password: 'Password123' };

/** Validate one strength/machine set (reps + weight positive). */
export function validateSet({ reps, weight }) {
  if (parseCount(reps) === null) return { valid: false, error: 'Reps must be a positive number' };
  const w = Number(weight);
  if (!Number.isFinite(w) || w < 0) return { valid: false, error: 'Weight must be 0 or more' };
  return { valid: true, error: '' };
}

/** Validate a full entry by type (strength/machine need >=1 valid set; cardio needs duration). */
export function validateEntry(entry) {
  if (!entry || !entry.exercise || !String(entry.exercise).trim()) {
    return { valid: false, error: 'Exercise name is required' };
  }
  if (entry.type === 'cardio') {
    if (parseCount(entry.duration) === null) return { valid: false, error: 'Duration must be a positive number' };
    return { valid: true, error: '' };
  }
  const sets = entry.sets || [];
  if (sets.length === 0) return { valid: false, error: 'Add at least one set' };
  for (const set of sets) {
    const c = validateSet(set);
    if (!c.valid) return c;
  }
  return { valid: true, error: '' };
}
