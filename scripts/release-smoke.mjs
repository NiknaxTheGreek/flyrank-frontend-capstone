import { chromium, firefox, webkit, devices } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';

const base = 'https://flyrank-frontend-capstone-snowy.vercel.app';
const results = [];
await mkdir('test-results/release-live', { recursive: true });
for (const [name, engine, options] of [
  ['chromium', chromium, { viewport: { width: 1280, height: 900 } }],
  ['firefox', firefox, { viewport: { width: 1280, height: 900 } }],
  ['webkit', webkit, { viewport: { width: 1280, height: 900 } }],
  ['mobile-webkit', webkit, devices['iPhone 13']],
]) {
  const browser = await engine.launch();
  try {
    const page = await browser.newPage(options);
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const response = await page.goto(base + '/pick-a-movie');
    if (response?.status() !== 200) throw new Error(`Public route returned ${response?.status()}`);
    await page.getByRole('heading', { name: 'Help me pick a movie' }).waitFor();
    await page.getByRole('textbox', { name: 'Your movie preferences' }).fill('Use lookupMovie to show the IMDb rating and runtime for Inception.');
    const chatResponse = page.waitForResponse(r => r.url().includes('/api/movie-chat') && r.request().method() === 'POST');
    await page.getByRole('button', { name: 'Send', exact: true }).click();
    const chat = await chatResponse;
    if (chat.status() !== 200) throw new Error(`Chat returned ${chat.status()}: ${await chat.text()}`);
    await page.getByRole('heading', { name: 'Inception (2010)' }).waitFor({ timeout: 60_000 });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    if (overflow || errors.length) throw new Error(JSON.stringify({ overflow, errors }));
    await page.screenshot({ path: `test-results/release-live/${name}.png`, fullPage: true });
    results.push({ engine: name, publicRoute: 200, chat: 200, movieCard: 'Inception (2010)', overflow, errors });
    console.log('A14_LIVE_BROWSER ' + JSON.stringify(results.at(-1)));
  } finally { await browser.close(); }
}
await writeFile('test-results/release-live/results.json', JSON.stringify(results, null, 2));
