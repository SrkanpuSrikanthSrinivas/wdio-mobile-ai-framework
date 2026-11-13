import { existsSync } from 'node:fs';
import { shared } from './wdio.shared.conf.js';

/**
 * wdio.browserstack.conf.js — run on a real device in BrowserStack, so every
 * run shows up on ONE dashboard (yours). No emulator, no Android SDK locally.
 *
 * Everyone uses the HOST's credentials (shared), and tags their run with their
 * name, so you see "Alice - login", "Bob - login" ... all under one build.
 *   export BROWSERSTACK_USERNAME=<host's user>  BROWSERSTACK_ACCESS_KEY=<host's key>
 *   export PARTICIPANT="Alice"
 *   export BSTACK_APP="bs://<id>"     # the app the host uploaded once (see CLOUD-DASHBOARD.md)
 *   npm run android:cloud
 */

const PARTICIPANT = process.env.PARTICIPANT || 'anon';

// Prefer a pre-uploaded app id (bs://... or "user/custom_id") so nobody
// re-uploads the 118 MB APK. Falls back to a local path for the host's FIRST
// upload only.
const APK = existsSync('./apps/GymProgress.apk') ? './apps/GymProgress.apk' : './apps/gymprogress.apk';
const APP = process.env.BSTACK_APP || {
  path: APK,
  custom_id: 'GymProgress',
};

export const config = {
  ...shared,
  hostname: undefined, port: undefined, path: undefined, protocol: undefined,

  user: process.env.BROWSERSTACK_USERNAME,
  key: process.env.BROWSERSTACK_ACCESS_KEY,

  services: [['browserstack', { app: APP }]],

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
        buildName: process.env.BUILD_NAME || 'Mobile AI Workshop',   // shared -> groups everyone
        sessionName: `${PARTICIPANT} - mobile-ai-lab`,                // per person
      },
    },
  ],
};
