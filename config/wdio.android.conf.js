import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { shared } from './wdio.shared.conf.js';

/**
 * wdio.android.conf.js — local Android emulator (or any device Appium can see).
 *
 * Used by `npm run android` and `npm run run:local`. Appium must already be
 * running (run-local.sh starts it). `appium:app` is an ABSOLUTE path, because
 * Appium resolves relative paths from its own working folder, not this repo.
 *
 * Override with env vars: APP_URL, DEVICE_NAME, PLATFORM_VERSION.
 */

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
// The APK is git-ignored; accept either spelling of the file name (Linux is case-sensitive).
const localApk = ['apps/GymProgress.apk', 'apps/gymprogress.apk']
  .map((p) => resolve(root, p))
  .find((p) => existsSync(p)) || resolve(root, 'apps/GymProgress.apk');
const APP_URL = process.env.APP_URL || localApk;

export const config = {
  ...shared,

  specs: ['../test/specs/**/*.spec.js'],

  capabilities: [
    {
      platformName: 'Android',
      'wdio:maxInstances': 1,
      // W3C Appium caps use the `appium:` vendor prefix.
      'appium:deviceName': process.env.DEVICE_NAME || 'Android Emulator',
      'appium:platformVersion': process.env.PLATFORM_VERSION || '', // '' = any
      'appium:automationName': 'UiAutomator2',
      'appium:orientation': 'PORTRAIT',
      'appium:app': APP_URL,
      'appium:appWaitActivity': '*',
      'appium:autoGrantPermissions': true,
      'appium:newCommandTimeout': 240,
      // Appium does not speak WebDriver BiDi; WDIO v9 would try it by default.
      'wdio:enforceWebDriverClassic': true,
    },
  ],
};
