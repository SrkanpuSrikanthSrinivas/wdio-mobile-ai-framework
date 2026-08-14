import { shared } from './wdio.shared.conf.js';

/**
 * wdio.browserstack.conf.js — run on a REAL device in BrowserStack's cloud.
 * No emulator, no Android SDK, no local Appium — light on your machine.
 *
 * Setup (once):
 *   1. Free trial + credentials: https://www.browserstack.com/users/sign_up
 *   2. export BROWSERSTACK_USERNAME=... BROWSERSTACK_ACCESS_KEY=...
 *   3. Get the demo app once:  npm run get-app     (downloads the APK to ./apps)
 *   4. Run:  npm run android:cloud
 *
 * The browserstack service uploads the APK for you (custom_id avoids re-uploading
 * the same build every run). Watch the live session on the App Automate dashboard.
 */

const APP =
  process.env.BSTACK_APP || // e.g. "bs://<id>" or "username/WdioDemoApp" after first upload
  './apps/android.wdio.native.app.v2.2.0.apk';

export const config = {
  ...shared,
  // The service manages the connection to BrowserStack's hub.
  hostname: undefined,
  port: undefined,
  path: undefined,
  protocol: undefined,

  user: process.env.BROWSERSTACK_USERNAME,
  key: process.env.BROWSERSTACK_ACCESS_KEY,

  services: [
    ['browserstack', {
      app: { path: APP, custom_id: 'WdioDemoApp' },
      buildIdentifier: '#${BUILD_NUMBER}',
    }],
  ],

  specs: ['../test/specs/**/*.spec.js'],

  capabilities: [
    {
      platformName: 'Android',
      'appium:automationName': 'UiAutomator2',
      'appium:autoGrantPermissions': true,
      'bstack:options': {
        deviceName: process.env.BSTACK_DEVICE || 'Samsung Galaxy S23',
        osVersion: process.env.BSTACK_OS || '13.0',
        projectName: 'AIQEAcademy Workshop',
        buildName: 'wdio-mobile-ai-lab',
        sessionName: 'mobile-ai-lab',
      },
    },
  ],
};
