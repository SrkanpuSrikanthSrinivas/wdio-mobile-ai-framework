/**
 * Helper utilities for e2e tests.
 *
 * Provides a simple wrapper to build accessibility‑id selectors.
 * The project’s conventions require selectors to be expressed as
 * `~<id>` (the tilde prefix). Using this helper keeps the test
 * code readable and satisfies the locator‑style checker.
 */

export function byAccessibilityId(id) {
  if (!id) {
    throw new Error('accessibility id required');
  }
  return `~${id}`;
}
