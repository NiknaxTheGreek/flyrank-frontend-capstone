import { chromium } from '@playwright/test';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';

// Run after npm run build, with npm run preview serving on port 4173.
const base = process.env.BASE_URL || 'http://127.0.0.1:4173';
const evidence = new URL('../docs/assignment-11/evidence/', import.meta.url);
await mkdir(evidence, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH, args: ['--enable-unsafe-swiftshader'] });
const report = { date: new Date().toISOString(), source: base, browser: browser.version(), environment: 'Headless Linux Chromium, software WebGL. Mobile is viewport/touch emulation, not a physical phone.', assets: [], publicAssets: [], runs: [] };
const assetsDir = new URL('../dist/assets/', import.meta.url);
for (const name of await readdir(assetsDir)) {
  if (/Planet|index/.test(name)) { const content = await readFile(new URL(name, assetsDir)); report.assets.push({ name, bytes: content.length, gzipBytes: gzipSync(content).length }); }
}
const publicAssetsDir = new URL('../dist-planet/assets/', import.meta.url);
for (const name of await readdir(publicAssetsDir)) {
  const content = await readFile(new URL(name, publicAssetsDir));
  report.publicAssets.push({ name, bytes: content.length, gzipBytes: gzipSync(content).length });
}
try {
  for (const [name, viewport, mobile] of [['desktop', { width: 1440, height: 1100 }, false], ['mobile', { width: 375, height: 812 }, true]]) {
    const context = await browser.newContext({ viewport, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: mobile ? 2 : 1 });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', entry => { if (entry.type() === 'error') errors.push(entry.text()); });
    await page.goto(`${base}/planet-studio`);
    await page.getByRole('button', { name: 'Launch 3D' }).waitFor();
    const initialResources = await page.evaluate(() => performance.getEntriesByType('resource').map(item => ({ name: item.name, bytes: item.encodedBodySize })));
    await page.screenshot({ path: new URL(`${name}-static.jpg`, evidence).pathname, type: 'jpeg', quality: 78, fullPage: true });
    const loadStart = performance.now();
    await page.getByRole('button', { name: 'Launch 3D' }).click();
    await page.getByText('LIVE 3D', { exact: true }).waitFor();
    const firstSceneMs = performance.now() - loadStart;
    const canvas = page.locator('.ps-canvas canvas');
    const dimensions = await canvas.evaluate(element => ({ width: element.width, height: element.height, cssWidth: element.clientWidth, cssHeight: element.clientHeight, triangles: Number(element.dataset.triangles), drawCalls: Number(element.dataset.drawCalls) }));
    await page.screenshot({ path: new URL(`${name}-dune-3d.jpg`, evidence).pathname, type: 'jpeg', quality: 82, fullPage: true });
    const frameCount = async () => Number(await canvas.getAttribute('data-frames'));
    const idleStart = await frameCount();
    await page.waitForTimeout(1000);
    const idleFrames = await frameCount() - idleStart;
    await page.getByRole('checkbox', { name: 'Auto-rotate' }).check();
    await canvas.scrollIntoViewIfNeeded();
    const activeStart = performance.now(), frameStart = await frameCount();
    await page.waitForTimeout(2500);
    const animationFps = (await frameCount() - frameStart) / ((performance.now() - activeStart) / 1000);
    await page.getByRole('checkbox', { name: 'Auto-rotate' }).uncheck();
    await page.getByRole('radio', { name: 'Ocean' }).check();
    await canvas.scrollIntoViewIfNeeded();
    await page.waitForFunction(() => document.querySelector('.ps-canvas canvas')?.getAttribute('data-world') === 'ocean');
    await page.screenshot({ path: new URL(`${name}-ocean-3d.jpg`, evidence).pathname, type: 'jpeg', quality: 82, fullPage: true });

    // Exercise actual touch drag + two-finger pinch via Chromium's input protocol.
    let touch = null;
    if (mobile) {
      await canvas.scrollIntoViewIfNeeded();
      const box = await canvas.boundingBox();
      const cdp = await context.newCDPSession(page);
      const p = (x, y, id = 0) => ({ x, y, id, radiusX: 2, radiusY: 2 });
      const x = box.x + box.width / 2, y = box.y + box.height / 2;
      const beforeDrag = await frameCount();
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [p(x, y)] });
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [p(x + 45, y + 18)] });
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      await page.waitForTimeout(100);
      const dragRedrew = await frameCount() > beforeDrag;
      const beforePinch = await canvas.getAttribute('data-camera-distance');
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [p(x - 20, y), p(x + 20, y, 1)] });
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [p(x - 40, y), p(x + 40, y, 1)] });
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      await page.waitForTimeout(100);
      touch = { dragRedrew, pinchChangedDistance: beforePinch !== await canvas.getAttribute('data-camera-distance') };
    }
    // Synthetic visibility event checks the same stop/resume handler used by tabs.
    await page.getByRole('checkbox', { name: 'Auto-rotate' }).check();
    await page.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, get: () => true }); document.dispatchEvent(new Event('visibilitychange')); });
    const hiddenStart = await frameCount();
    await page.waitForTimeout(700);
    const hiddenFrames = await frameCount() - hiddenStart;
    await page.evaluate(() => { delete document.hidden; document.dispatchEvent(new Event('visibilitychange')); });
    await page.getByRole('checkbox', { name: 'Auto-rotate' }).uncheck();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    report.runs.push({ name, viewport, initialEngineRequests: initialResources.filter(item => /PlanetCanvas/.test(item.name)).length, firstSceneMs: Math.round(firstSceneMs), dimensions, idleFramesInOneSecond: idleFrames, animationFps: Number(animationFps.toFixed(1)), hiddenFramesIn700ms: hiddenFrames, horizontalOverflow: overflow, touch, errors });
    if (!mobile) {
      await canvas.evaluate(element => element.getContext('webgl2').getExtension('WEBGL_lose_context').loseContext());
      await page.getByRole('alert').waitFor();
      await page.screenshot({ path: new URL('context-loss-fallback.jpg', evidence).pathname, type: 'jpeg', quality: 78, fullPage: true });
    }
    await context.close();
  }
  const page = await browser.newPage({ viewport: { width: 1280, height: 1000 }, reducedMotion: 'reduce' });
  await page.goto(`${base}/planet-studio`); await page.getByRole('button', { name: 'Launch 3D' }).waitFor();
  await page.screenshot({ path: new URL('reduced-motion-static.jpg', evidence).pathname, type: 'jpeg', quality: 78, fullPage: true });
  report.reducedMotion = { canvasCount: await page.locator('canvas').count(), engineRequests: await page.evaluate(() => performance.getEntriesByType('resource').filter(item => /PlanetCanvas/.test(item.name)).length) };
} finally { await browser.close(); }
await writeFile(new URL('../performance.json', evidence), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
