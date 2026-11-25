import { expect, test } from '@playwright/test';

test('configures a real 3D world, recovers context loss and retains a static alternative', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'GPU context recovery is exercised in Chromium; all engines exercise the static fallback.');
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/planet-studio');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Small world.');
  expect(await page.locator('canvas').count()).toBe(0);
  await page.getByRole('button', { name: 'Launch 3D' }).click();
  await expect(page.getByText('LIVE 3D', { exact: true })).toBeVisible();
  const canvas = page.locator('.ps-canvas canvas');
  await page.getByRole('radio', { name: 'Ocean' }).check();
  await canvas.scrollIntoViewIfNeeded();
  await expect(canvas).toHaveAttribute('data-world', 'ocean');
  const triangles = Number(await canvas.getAttribute('data-triangles'));
  await page.getByRole('checkbox', { name: 'Add planetary rings' }).uncheck();
  await canvas.scrollIntoViewIfNeeded();
  await expect.poll(async () => Number(await canvas.getAttribute('data-triangles'))).toBeLessThan(triangles);
  await page.getByRole('button', { name: 'Zoom in' }).click();
  await canvas.scrollIntoViewIfNeeded();
  await expect(canvas).toHaveAttribute('data-camera-distance', '7.00');
  await canvas.focus(); await page.keyboard.press('ArrowRight');
  await page.getByRole('checkbox', { name: 'Auto-rotate' }).check();
  await canvas.scrollIntoViewIfNeeded();
  const startFrames = Number(await canvas.getAttribute('data-frames'));
  await expect.poll(async () => Number(await canvas.getAttribute('data-frames'))).toBeGreaterThan(startFrames + 3);
  await page.getByRole('checkbox', { name: 'Auto-rotate' }).uncheck();
  await canvas.evaluate(element => {
    const gl = (element as HTMLCanvasElement).getContext('webgl2');
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
  });
  await expect(page.getByRole('alert')).toContainText('3D was interrupted');
  await expect(page.getByRole('img', { name: 'Ocean world, static illustration' })).toBeVisible();
  await page.getByRole('button', { name: 'Try 3D again' }).click();
  await expect(page.getByText('LIVE 3D', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: /Use static view/ }).click();
  await expect(page.locator('canvas')).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);
  expect(errors).toEqual([]);
});

test('reduced motion keeps the engine unloaded and radio choices work by keyboard', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const engineRequests: string[] = [];
  page.on('request', request => { if (/PlanetCanvas.*\.js/.test(request.url())) engineRequests.push(request.url()); });
  await page.goto('/planet-studio');
  await page.getByRole('radio', { name: 'Dune' }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('radio', { name: 'Ocean' })).toBeChecked();
  await expect(page.getByRole('img', { name: 'Ocean world, static illustration with rings' })).toBeVisible();
  await expect(page.locator('canvas')).toHaveCount(0);
  expect(engineRequests).toEqual([]);
});
