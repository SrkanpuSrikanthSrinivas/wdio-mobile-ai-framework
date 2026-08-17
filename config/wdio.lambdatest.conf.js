import { shared } from './wdio.shared.conf.js';

/**
 * wdio.lambdatest.conf.js — run on a real device in LambdaTest, so every run
 * shows up on ONE dashboard (yours). Alternative to BrowserStack.
 *
 * Everyone uses the HOST's credentials (shared) and tags their run with their
 * name, all under one shared build.
 *   export LT_USERNAME=<host's user>  LT_ACCESS_KEY=<host's key>
 *   export LT_APP="lt://APP..."       # the app the host uploaded once (see CLOUD-DASHBOARD.md)
 *   export PARTICIPANT="Alice"
 *   npm run android:lt
 *
 * Tip: if a device/version is unavailable, regenerate caps with LambdaTest's
 * Capabilities Generator and adjust the LT:Options below.
 */

const PARTICIPANT = process.env.PARTICIPANT || 'anon';

export const config = {
  ...shared,
  // LambdaTest mobile hub (the service/these values manage the connection).
  hostname: 'mobile-hub.lambdatest.com',
  port: 443,
  path: '/wd/hub',
  protocol: 'https',

  user: process.env.LT_USERNAME,
  key: process.env.LT_ACCESS_KEY,

  services: ['lambdatest'],

  specs: ['../test/specs/**/*.spec.js'],

  capabilities: [
    {
      platformName: 'android',
      'appium:automationName': 'UiAutomator2',
      'appium:deviceName': process.env.LT_DEVICE || 'Galaxy S23',
      'appium:platformVersion': process.env.LT_OS || '13',
      'appium:app': process.env.LT_APP, // lt://APP... from the one-time upload
      'LT:Options': {
        w3c: true,
        isRealMobile: true,
        build: process.env.BUILD_NAME || 'Mobile AI Workshop', // shared -> groups everyone
        name: `${PARTICIPANT} - mobile-ai-lab`,                 // per person
        project: 'AIQEAcademy Workshop',
        visual: true,
        devicelog: true,
        network: false,
      },
    },
  ],
};
