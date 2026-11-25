import { expect, test } from '@playwright/test';
import { lookingUpPart, preparingPart, resultPart } from '../src/test/movieChatFixtures';

const frames = (events: object[]) => events.map(event => `data: ${JSON.stringify(event)}\n\n`).join('');
const done = { type: 'done' };

test.beforeEach(async ({ context, page }) => {
  // No third-party request may leave the test browser, including AI and Firebase calls.
  await context.route('**/*', route => {
    const url = new URL(route.request().url());
    return url.origin === 'http://127.0.0.1:4173'
      ? route.continue()
      : route.abort('blockedbyclient');
  });
  page.on('pageerror', error => { throw error; });
});

test('primary flow: prompt, pending state, movie lookup card, and contextual follow-up', async ({ page }) => {
  const requests: { messages: { role: string; content: string }[] }[] = [];
  let release!: () => void;
  const pending = new Promise<void>(resolve => { release = resolve; });
  await page.route('**/api/movie-chat', async route => {
    requests.push(route.request().postDataJSON());
    const first = requests.length === 1;
    if (first) await pending;
    await route.fulfill({
      status: 200, contentType: 'text/event-stream',
      body: frames(first
        ? [preparingPart, lookingUpPart, resultPart, { type: 'text', delta: 'Inception is a clever dream-heist thriller.' }, done]
        : [{ type: 'text', delta: 'For something lighter, try Galaxy Quest.' }, done]),
    });
  });
  await page.goto('/pick-a-movie');
  await expect(page.getByRole('heading', { name: 'Help me pick a movie' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Try an example' })).toBeVisible();
  const input = page.getByRole('textbox', { name: 'Your movie preferences' });
  await input.fill('Show me Inception’s IMDb rating and runtime.');
  await page.getByRole('button', { name: 'Send', exact: true }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Thinking…' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Stop generation' })).toBeEnabled();
  release();
  const card = page.getByRole('region', { name: 'Movie lookup' });
  // This fixture delivers its frames together. Transient tool states are
  // checked with a frame-controlled stream in MovieChat.lifecycle.test.tsx;
  // browser polling can miss their short display windows under CI load.
  await expect(card.getByRole('heading', { name: 'Inception (2010)' })).toBeVisible();
  await expect(card.getByRole('definition').filter({ hasText: '148 min' })).toBeVisible();
  await expect(card.getByRole('link', { name: 'View Inception on IMDb' })).toHaveAttribute('href', 'https://www.imdb.com/title/tt1375666/');
  await expect(page.getByRole('button', { name: 'Stop generation' })).toBeDisabled();
  await input.fill('Anything lighter?');
  await page.getByRole('button', { name: 'Send', exact: true }).click();
  await expect(page.getByRole('region', { name: 'Movie conversation' }).getByText('For something lighter, try Galaxy Quest.', { exact: true })).toBeVisible();
  await expect(page.getByRole('listitem', { name: 'You message' })).toHaveCount(2);
  await expect(page.getByRole('listitem', { name: 'Movie picker message' })).toHaveCount(2);
  if (test.info().project.name === 'desktop-chromium') await page.screenshot({ path: 'test-results/release/movie-picker.png', fullPage: true });
  expect(requests).toHaveLength(2);
  expect(requests[1].messages[1]).toMatchObject({ role: 'assistant' });
  expect(requests[1].messages[1].content).toContain('IMDb ID tt1375666');
  expect(requests[1].messages[2]).toEqual({ role: 'user', content: 'Anything lighter?' });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test('an interrupted reply exposes a working retry and preserves one user turn', async ({ page }) => {
  let attempts = 0;
  await page.route('**/api/movie-chat', route => route.fulfill({
    status: 200, contentType: 'text/event-stream',
    body: frames(++attempts === 1
      ? [{ type: 'text', delta: 'An unfinished movie recommendation' }, { type: 'error', message: 'The test connection was interrupted.' }]
      : [resultPart, { type: 'text', delta: 'Recovered movie recommendation.' }, done]),
  }));
  await page.goto('/pick-a-movie');
  await page.getByRole('textbox', { name: 'Your movie preferences' }).fill('Find Inception');
  await page.getByRole('button', { name: 'Send', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('The test connection was interrupted.');
  await expect(page.getByText('An unfinished movie recommendation', { exact: true })).toBeVisible();
  await expect(page.getByText('Interrupted · partial response', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Retry failed message' }).click();
  await expect(page.getByRole('heading', { name: 'Inception (2010)' })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Movie conversation' }).getByText('Recovered movie recommendation.', { exact: true })).toBeVisible();
  await expect(page.getByRole('alert')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Retry failed message' })).toHaveCount(0);
  await expect(page.getByRole('listitem', { name: 'You message' })).toHaveCount(1);
  expect(attempts).toBe(2);
});

