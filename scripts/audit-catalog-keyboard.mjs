// Keyboard-only catalogue journey against the production bundle, with movie
// HTTP fixtures. No account, movie-provider or AI-provider requests are made.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { chromium } from 'playwright';

const dist = path.resolve('dist');
const output = path.resolve(process.env.AUDIT_OUTPUT || 'docs/assignment-12/evidence/keyboard/catalog');
await fs.mkdir(output, { recursive: true });
const inception = { id: 'tt1375666', title: 'Inception', year: '2010', genre: 'Sci-Fi', rating: 8.8, posterUrl: '', plot: 'A team enters dreams to plant an idea.', director: 'Christopher Nolan', runtime: '148 min' };
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname === '/api/movies') {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(url.searchParams.has('q')
      ? { movies: [inception], total: 1 }
      : { movie: url.searchParams.get('id') === inception.id ? inception : null }));
    return;
  }
  const file = url.pathname.startsWith('/assets/') ? path.resolve(dist, '.' + url.pathname) : path.join(dist, 'index.html');
  if (!file.startsWith(dist + path.sep)) { res.writeHead(403); res.end(); return; }
  try {
    const data = await fs.readFile(file);
    res.setHeader('Content-Type', file.endsWith('.js') ? 'text/javascript' : file.endsWith('.css') ? 'text/css' : 'text/html');
    res.end(data);
  } catch { res.writeHead(404); res.end(); }
});
await new Promise(resolve => server.listen(4190, '127.0.0.1', resolve));
const browser = await chromium.launch({ headless: true, executablePath: process.env.AUDIT_CHROME_PATH || chromium.executablePath(), args: ['--no-sandbox'] });
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  const focused = locator => locator.evaluate(el => el === document.activeElement);
  const tabTo = async locator => {
    for (let i = 0; i < 40; i++) {
      if (await focused(locator)) return;
      await page.keyboard.press('Tab');
    }
    throw Error('Keyboard did not reach the requested control.');
  };
  const checks = [];
  await page.goto('http://127.0.0.1:4190/', { waitUntil: 'networkidle' });
  await page.getByRole('link', { name: 'View Inception', exact: true }).waitFor();
  await page.keyboard.press('Tab');
  assert(await focused(page.getByRole('link', { name: 'Skip to main content' })));
  await page.keyboard.press('Enter');
  assert(await focused(page.locator('main')));
  const search = page.getByRole('searchbox', { name: 'Search movies by title' });
  await tabTo(search);
  await page.keyboard.type('Inception');
  await tabTo(page.getByRole('button', { name: 'Search', exact: true }));
  await page.keyboard.press('Enter');
  await page.getByRole('heading', { name: 'Search results', exact: true }).waitFor();
  await page.getByRole('link', { name: 'View Inception', exact: true }).waitFor();
  checks.push('Skip navigation, labelled search input and search submission work with Tab/Enter.');
  await tabTo(page.getByRole('link', { name: 'View Inception', exact: true }));
  await page.screenshot({ path: path.join(output, 'search-result-focused.jpg'), type: 'jpeg', quality: 80 });
  await page.keyboard.press('Enter');
  const heading = page.getByRole('heading', { name: 'Inception', exact: true });
  await heading.waitFor();
  assert(await focused(heading));
  checks.push('Enter opens a movie result and client-side navigation focuses its loaded heading.');
  await tabTo(page.getByRole('link', { name: 'Back to search results' }));
  await page.keyboard.press('Enter');
  await page.getByRole('heading', { name: 'Search results', exact: true }).waitFor();
  assert(new URL(page.url()).searchParams.get('q') === 'Inception');
  checks.push('The keyboard-reachable back link preserves the search query.');
  for (const width of [375, 320]) {
    await page.setViewportSize({ width, height: 812 });
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  }
  checks.push('Search results reflow at 375 and 320 CSS px without horizontal overflow.');
  await tabTo(page.getByRole('link', { name: 'Movie picker', exact: true }));
  await page.keyboard.press('Enter');
  const chatHeading = page.getByRole('heading', { name: 'Help me pick a movie', exact: true });
  await chatHeading.waitFor();
  assert(await focused(chatHeading));
  await tabTo(page.getByRole('button', { name: 'Try an example' }));
  await page.keyboard.press('Enter');
  assert(await focused(page.getByRole('textbox', { name: 'Your movie preferences' })));
  checks.push('Keyboard navigation reaches the lazy chat route, focuses its heading and activates its example.');
  assert.deepEqual(errors, []);
  const result = { at: new Date().toISOString(), browser: await browser.version(), build: 'A12 with six-request featured batches', fixtures: 'Movie HTTP boundary; no external provider requests', checks, errors };
  await fs.writeFile(path.join(output, 'checks.json'), JSON.stringify(result, null, 2) + '\n');
  console.log(JSON.stringify(result));
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}
