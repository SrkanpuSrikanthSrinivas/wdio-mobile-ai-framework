/**
 * wdio.shared.conf.js — settings common to every run.
 *
 * The whole point of this lab: participants never install Android tooling. The
 * Appium server + emulator live in Docker (or CI). This config connects to that
 * remote Appium via env vars, so the SAME file works against:
 *   - a local `docker compose up`      (APPIUM_HOST=127.0.0.1)
 *   - the facilitator's shared host    (APPIUM_HOST=<their-ip>)
 *   - GitLab CI's docker-android       (APPIUM_HOST=android, the service alias)
 */

import { mkdirSync } from 'node:fs';

export const shared = {
  // --- Remote Appium (in Docker), not a local install -------------------
  hostname: process.env.APPIUM_HOST || '127.0.0.1',
  port: Number(process.env.APPIUM_PORT || 4723),
  path: process.env.APPIUM_PATH || '/', // Appium 2 base path is '/'
  protocol: process.env.APPIUM_PROTOCOL || 'http',

  // We connect to an already-running Appium, so no appium service here.
  services: [],

  framework: 'mocha',
  reporters: ['spec'],
  mochaOpts: { ui: 'bdd', timeout: 120000 },

  logLevel: process.env.WDIO_LOG_LEVEL || 'info',
  waitforTimeout: 20000,
  connectionRetryTimeout: 180000,
  connectionRetryCount: 2,
  maxInstances: 1,

  // Fail fast in a workshop so a broken emulator doesn't hang the room.
  specFileRetries: 0,

  // On a failed test, save a screenshot so CI artifacts show what happened.
  afterTest: async function (test, _ctx, { passed }) {
    if (passed) return;
    try {
      mkdirSync('screenshots', { recursive: true });
      const name = `${Date.now()}-${String(test.title).replace(/\W+/g, '_')}.png`;
      await browser.saveScreenshot(`screenshots/${name}`);
    } catch { /* best effort */ }
  },
};
