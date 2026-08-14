/**
 * data.js — pure helpers with NO device dependency, so the AI-CLI's auto-test
 * loop can validate logic instantly (see .aider.conf.yml). The mobile specs run
 * against the emulator; these run anywhere.
 */

/** Build login credentials with sensible defaults and overrides. */
export function buildCredentials(overrides = {}) {
  return {
    email: 'test@webdriver.io',
    password: 'Password123!',
    ...overrides,
  };
}

/** A unique email so sign-up tests don't collide across runs. */
export function uniqueEmail(prefix = 'user') {
  const stamp = Date.now().toString(36);
  return `${prefix}.${stamp}@webdriver.io`;
}

/** Very small email-format check used to assert negative cases. */
export function isValidEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Turn an accessibility id into a WDIO selector (`~id`). */
export function byAccessibilityId(id) {
  if (!id) throw new Error('accessibility id required');
  return `~${id}`;
}
