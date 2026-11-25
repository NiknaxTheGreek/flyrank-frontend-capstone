// @vitest-environment node
import { test, expect, vi } from 'vitest';
import { createChatRateLimit } from './chat-rate-limit.mjs';
import { createMovieChatHandler } from './movie-chat-handler.mjs';
const req = (ip = '1.2.3.4', content = 'Recommend a movie', origin) => new Request('https://example.test/api/movie-chat', {
  method: 'POST', headers: { 'x-vercel-forwarded-for': ip, ...(origin ? { origin } : {}) },
  body: JSON.stringify({ messages: [{ role: 'user', content }] }),
});
test('limits a client, isolates another client and resets the window', () => {
  let time = 0;
  const limit = createChatRateLimit({ now: () => time, limit: 2 });
  expect(limit(req()).allowed).toBe(true);
  expect(limit(req()).allowed).toBe(true);
  expect(limit(req())).toEqual({ allowed: false, retryAfter: 60 });
  expect(limit(req('2.3.4.5')).allowed).toBe(true);
  time = 60_000;
  expect(limit(req()).allowed).toBe(true);
});
test('blocked requests return Retry-After without calling a provider', async () => {
  const fetcher = vi.fn();
  const handler = createMovieChatHandler({ getKey: () => 'mock', fetcher,
    rateLimit: () => ({ allowed: false, retryAfter: 30 }) });
  const response = await handler(req());
  expect(response.status).toBe(429);
  expect(response.headers.get('retry-after')).toBe('30');
  expect(fetcher).not.toHaveBeenCalled();
});
test('rejects foreign origins and oversized input before provider calls', async () => {
  const fetcher = vi.fn();
  const handler = createMovieChatHandler({ getKey: () => 'mock', fetcher });
  expect((await handler(req('x', 'hello', 'https://foreign.test'))).status).toBe(403);
  expect((await handler(req('x', 'x'.repeat(8001)))).status).toBe(400);
  expect(fetcher).not.toHaveBeenCalled();
});
