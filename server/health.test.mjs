// @vitest-environment node
import { expect, test, vi } from 'vitest';
import { createHealthHandler } from '../api/health.mjs';
const response = () => ({ statusCode: 0, setHeader: vi.fn(), end: vi.fn() });
test('health reports a validated fixed-endpoint data fetch', async () => {
  const res = response();
  const fetcher = vi.fn(async () => Response.json({ id: 1, title: 'Fixture record' }));
  await createHealthHandler({ fetcher })({ method: 'GET' }, res);
  expect(res.statusCode).toBe(200);
  expect(JSON.parse(res.end.mock.calls[0][0])).toMatchObject({ ok: true, id: 1, title: 'Fixture record' });
  expect(fetcher.mock.calls[0][0]).toBe('https://jsonplaceholder.typicode.com/todos/1');
});
test('health rejects invalid provider data and handles failed requests without leaking errors', async () => {
  for (const fetcher of [async () => Response.json({ id: 2, title: 'wrong record' }), async () => { throw new Error('private transport details'); }]) {
    const res = response();
    await createHealthHandler({ fetcher })({ method: 'GET' }, res);
    expect(res.statusCode).toBe(502);
    expect(JSON.parse(res.end.mock.calls[0][0]).ok).toBe(false);
    expect(res.end.mock.calls[0][0]).not.toContain('private transport details');
  }
});
