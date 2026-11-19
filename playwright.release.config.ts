import { defineConfig, devices } from '@playwright/test';
import base from './playwright.config';
export default defineConfig(base, {
  projects: [
    { name: 'desktop-chromium', use: { browserName: 'chromium', viewport: { width: 1280, height: 900 } } },
    { name: 'desktop-firefox', use: { browserName: 'firefox', viewport: { width: 1280, height: 900 } } },
    { name: 'desktop-webkit', use: { browserName: 'webkit', viewport: { width: 1280, height: 900 } } },
    { name: 'mobile-webkit', use: { ...devices['iPhone 13'] } },
  ],
});
