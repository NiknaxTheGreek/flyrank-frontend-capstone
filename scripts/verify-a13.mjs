// Real-browser checks of GPU lifecycle and user-facing behaviour; no API calls.
// Install playwright@1.62.1 and its Chromium, build, then: node scripts/verify-a13.mjs
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { setTimeout as delay } from 'node:timers/promises';
import { chromium } from 'playwright';

const output = 'docs/assignment-13/evidence';
await mkdir(output, { recursive: true });
const checks = [];
const errors = [];
const base = process.env.A13_URL || 'http://127.0.0.1:4183';
const server = process.env.A13_URL ? null : spawn('npm', ['run', 'preview', '--', '--host', '127.0.0.1', '--port', '4183'], { stdio: 'pipe' });
let serverLog = '';
server?.stdout.on('data', chunk => { serverLog += chunk; });
server?.stderr.on('data', chunk => { serverLog += chunk; });
let browser;

// Instrument native calls in the test page only; the production app has no debug API.
function instrument() {
  window.__a13 = { draws: 0, contexts: 0, deletes: 0, uniforms: {} };
  const locations = new WeakMap();
  const context = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function(type, ...args) {
    if (type === 'webgl' || type === 'webgl2') window.__a13.contexts++;
    return context.call(this, type, ...args);
  };
  const prototype = WebGLRenderingContext.prototype;
  const getLocation = prototype.getUniformLocation;
  prototype.getUniformLocation = function(program, name) {
    const location = getLocation.call(this, program, name);
    if (location) locations.set(location, name);
    return location;
  };
  for (const method of ['uniform1f', 'uniform2f']) {
    const original = prototype[method];
    prototype[method] = function(location, ...values) {
      const name = locations.get(location);
      if (name) window.__a13.uniforms[name] = values;
      return original.call(this, location, ...values);
    };
  }
  const draw = prototype.drawArrays;
  prototype.drawArrays = function(...args) { window.__a13.draws++; return draw.apply(this, args); };
  const remove = prototype.deleteProgram;
  prototype.deleteProgram = function(...args) { window.__a13.deletes++; return remove.apply(this, args); };
}

const state = page => page.evaluate(() => structuredClone(window.__a13));
async function eventually(predicate, message) {
  for (let attempt = 0; attempt < 80; attempt++) {
    if (await predicate()) return;
    await delay(75);
  }
  throw new Error(message);
}
async function noDraws(page, message) {
  await delay(160);
  const before = (await state(page)).draws;
  await delay(350);
  assert.equal((await state(page)).draws, before, message);
  return before;
}
function watch(page) {
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', entry => { if (entry.type() === 'error') errors.push(entry.text()); });
}

try {
  if (server) {
    let available = false;
    for (let attempt = 0; attempt < 100; attempt++) {
      try { available = (await fetch(base)).ok; } catch {}
      if (available) break;
      if (server.exitCode !== null) throw new Error(serverLog);
      await delay(100);
    }
    assert(available, `Preview did not start: ${serverLog}`);
  }
  browser = await chromium.launch({ headless: process.env.A13_HEADFUL !== '1', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 2, reducedMotion: 'no-preference' });
  await context.addInitScript(instrument);
  const page = await context.newPage();
  watch(page);
  await page.goto(`${base}/shader-lab`, { waitUntil: 'networkidle' });
  const pause = page.getByRole('button', { name: 'Pause animation' });
  await pause.waitFor();
  await eventually(async () => (await state(page)).draws >= 4, 'Shader did not draw');
  const size = await page.locator('canvas').evaluate(el => ({ w: el.width, h: el.height, css: el.getBoundingClientRect().toJSON() }));
  assert(size.w <= size.css.width * 1.5 && size.h <= size.css.height * 1.5);
  assert(size.w * size.h <= 1_600_000);
  assert.deepEqual((await state(page)).uniforms.u_resolution, [size.w, size.h]);
  checks.push({ name: 'Real WebGL rendering and resolution caps at desktop DPR 2', buffer: [size.w, size.h], passed: true });

  await pause.click();
  assert.equal(await pause.getAttribute('aria-pressed'), 'true');
  await noDraws(page, 'Pause did not stop GPU draws');
  await page.screenshot({ path: `${output}/desktop-afterlight.png`, fullPage: true });
  const first = await page.locator('canvas').screenshot();
  await page.getByRole('button', { name: 'Glacier', exact: true }).click();
  assert.deepEqual((await state(page)).uniforms.u_palette, [1]);
  assert.notDeepEqual(await page.locator('canvas').screenshot(), first, 'Palette did not change the rendered image');
  await noDraws(page, 'Palette change unexpectedly resumed animation');
  await page.screenshot({ path: `${output}/desktop-glacier-paused.png`, fullPage: true });
  await pause.press('Space');
  assert.equal(await pause.getAttribute('aria-pressed'), 'false');
  const resumedAt = (await state(page)).draws;
  await eventually(async () => (await state(page)).draws > resumedAt, 'Keyboard resume did not restart drawing');
  checks.push({ name: 'Pause stops draws; colour redraws a still frame; Space resumes', passed: true });

  const hero = await page.locator('.afterlight').boundingBox();
  await page.mouse.move(hero.x + hero.width * 0.9, hero.y + hero.height * 0.2);
  await eventually(async () => (await state(page)).uniforms.u_mouse[0] > 0.6, 'Mouse did not influence shader');
  checks.push({ name: 'Pointer reaches the shader as a smoothed uniform', passed: true });

  // Headful Chromium under Xvfb provides actual visible/hidden tabs in CI.
  const other = await context.newPage();
  await other.goto('about:blank');
  await other.bringToFront();
  await eventually(() => page.evaluate(() => document.hidden), 'Background tab did not become hidden');
  const timeBeforeHide = (await state(page)).uniforms.u_time[0];
  await noDraws(page, 'Hidden tab kept drawing');
  await page.bringToFront();
  await eventually(() => page.evaluate(() => !document.hidden), 'Foreground tab did not become visible');
  await eventually(async () => (await state(page)).uniforms.u_time[0] > timeBeforeHide, 'Visible tab did not resume');
  assert((await state(page)).uniforms.u_time[0] - timeBeforeHide < 0.4, 'Hidden time leaked into active animation');
  await other.close();
  checks.push({ name: 'Actual hidden tab stops drawing and resumes without a time jump', passed: true });

  await page.evaluate(() => {
    const spacer = document.createElement('div');
    spacer.id = 'a13-verification-spacer';
    spacer.style.height = '1600px';
    document.body.append(spacer);
    window.scrollTo(0, document.body.scrollHeight);
  });
  await noDraws(page, 'Offscreen hero kept drawing');
  const offscreenDraws = (await state(page)).draws;
  await page.evaluate(() => { document.getElementById('a13-verification-spacer').remove(); window.scrollTo(0, 0); });
  await eventually(async () => (await state(page)).draws > offscreenDraws, 'Returning hero did not resume');
  checks.push({ name: 'Offscreen observer stops drawing and resumes when in view', passed: true });

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.getByText('Still edition', { exact: true }).waitFor();
  await noDraws(page, 'Reduced-motion preference kept drawing');
  assert.equal(await page.locator('canvas').isVisible(), false);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await pause.waitFor();
  const restarted = (await state(page)).draws;
  await eventually(async () => (await state(page)).draws > restarted, 'Motion preference could not be reversed');
  checks.push({ name: 'Live OS motion preference changes stop and restart the renderer cleanly', passed: true });

  const atRouteChange = (await state(page)).draws;
  await page.getByRole('link', { name: 'Motion lab', exact: true }).click();
  await noDraws(page, 'Renderer survived route unmount');
  assert((await state(page)).deletes > 0);
  await page.getByRole('link', { name: 'Afterlight', exact: true }).click();
  await pause.waitFor();
  await eventually(async () => (await state(page)).draws > atRouteChange, 'Returning to shader route failed');
  checks.push({ name: 'Route cleanup deletes GPU program and stops callbacks; return works', passed: true });

  await page.evaluate(() => document.querySelector('canvas').getContext('webgl').getExtension('WEBGL_lose_context').loseContext());
  await page.getByText('Still edition', { exact: true }).waitFor();
  await noDraws(page, 'Lost WebGL context kept scheduling draws');
  await page.getByRole('button', { name: 'Ember', exact: true }).click();
  assert.equal(await page.locator('.afterlight').getAttribute('data-mood'), 'ember');
  await page.screenshot({ path: `${output}/context-loss-fallback.png`, fullPage: true });
  checks.push({ name: 'GPU context loss exposes a working static fallback', passed: true });

  const reduced = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
  await reduced.addInitScript(instrument);
  const still = await reduced.newPage();
  watch(still);
  const shaderRequests = [];
  still.on('request', request => { if (request.url().includes('aurora-renderer')) shaderRequests.push(request.url()); });
  await still.goto(`${base}/shader-lab`, { waitUntil: 'networkidle' });
  assert.equal((await state(still)).contexts, 0);
  assert.equal((await state(still)).draws, 0);
  assert.deepEqual(shaderRequests, []);
  assert.equal(await still.locator('canvas').isVisible(), false);
  // Keyboard only from the focused heading: both links, then three moods.
  for (const label of ['Find my next film', 'Explore the collection', 'Afterlight', 'Glacier', 'Ember']) {
    await still.keyboard.press('Tab');
    const active = await still.evaluate(() => document.activeElement.textContent);
    assert(active.includes(label), `Unexpected keyboard focus: ${active}`);
  }
  await still.keyboard.press('Space');
  assert.equal(await still.getByRole('button', { name: 'Ember', exact: true }).getAttribute('aria-pressed'), 'true');
  await still.screenshot({ path: `${output}/desktop-reduced-motion.png`, fullPage: true });
  checks.push({ name: 'Reduced motion makes zero WebGL calls and no shader request; all actions reachable by keyboard', passed: true });

  const mobile = await browser.newContext({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true, reducedMotion: 'no-preference' });
  await mobile.addInitScript(instrument);
  const phone = await mobile.newPage();
  watch(phone);
  await phone.goto(`${base}/shader-lab`, { waitUntil: 'networkidle' });
  await phone.getByRole('button', { name: 'Pause animation' }).waitFor();
  assert.equal(await phone.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  const mobileSize = await phone.locator('canvas').evaluate(el => ({ w: el.width, h: el.height, css: el.getBoundingClientRect().toJSON() }));
  assert(mobileSize.w <= mobileSize.css.width * 1.5 && mobileSize.h <= mobileSize.css.height * 1.5);
  assert(mobileSize.w * mobileSize.h <= 1_600_000);
  await phone.getByRole('button', { name: 'Glacier', exact: true }).tap();
  assert.equal(await phone.getByRole('button', { name: 'Glacier', exact: true }).getAttribute('aria-pressed'), 'true');
  await phone.getByRole('button', { name: 'Pause animation' }).tap();
  await phone.screenshot({ path: `${output}/phone-glacier.png`, fullPage: true });
  for (const width of [320, 360, 768]) {
    await phone.setViewportSize({ width, height: 900 });
    assert.equal(await phone.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `Horizontal overflow at ${width}px`);
  }
  checks.push({ name: 'Touch controls, DPR 3 cap and no horizontal overflow at 320/360/375/768px', buffer: [mobileSize.w, mobileSize.h], passed: true });

  assert.deepEqual(errors, [], 'Application console errors');
  checks.push({ name: 'Zero application console errors during all checks', passed: true });
  const report = { status: 'passed', browser: browser.version(), desktopBuffer: [size.w, size.h], checks, errors };
  await writeFile(`${output}/verification.json`, JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report, null, 2));
} catch (error) {
  const report = { status: 'failed', checks, errors, failure: String(error.stack || error) };
  await writeFile(`${output}/verification.json`, JSON.stringify(report, null, 2) + '\n');
  console.error(JSON.stringify(report, null, 2));
  process.exitCode = 1;
} finally {
  await browser?.close();
  server?.kill('SIGTERM');
}
