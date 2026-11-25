import { defineConfig, devices } from '@playwright/test';
import base from './playwright.config';
export default defineConfig(base, {
  projects: [
    { name: 'desktop-chromium', use: { launchOptions: { args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }, browserName: 'chromium', viewport: { width: 1280, height: 900 } } },
    { name: 'phone-chromium', use: { browserName: 'chromium', viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true, launchOptions: { args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] } } },
    { name: 'desktop-firefox', use: { browserName: 'firefox', viewport: { width: 1280, height: 900 } } },
    { name: 'desktop-webkit', use: { browserName: 'webkit', viewport: { width: 1280, height: 900 } } },
    { name: 'mobile-webkit', use: { ...devices['iPhone 13'] } },
  ],
});
