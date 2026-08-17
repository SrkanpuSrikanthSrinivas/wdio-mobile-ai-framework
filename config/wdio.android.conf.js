import { shared } from './wdio.shared.conf.js';

/**
 * wdio.android.conf.js — Android capabilities for the WDIO native demo app.
 *
 * `appium:app` is a URL: Appium downloads and installs the APK inside the
 * container, so nothing needs to be copied or volume-mounted. Override the
 * version/URL with APP_URL if you like.
 */

const APP_URL = process.env.APP_URL || './apps/GymProgress.apk'; // your built GymProgress APK

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
      // The demo app + UiAutomator2 are most stable over classic protocol.
      'wdio:enforceWebDriverClassic': true,
    },
  ],
};
