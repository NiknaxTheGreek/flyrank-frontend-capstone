// @vitest-environment node
import { expect, test, vi } from 'vitest';
import { createMovieChatHandler } from './movie-chat-handler.mjs';

const request = messages => new Request('https://reel-good.test/api/movie-chat', {
  method: 'POST', body: JSON.stringify({ messages }),
});
const user = content => ({ role: 'user', content });
const frame = event => new TextEncoder().encode('data: ' + JSON.stringify(event) + '\r\n\r\n');

test('forwards history, streams a split OpenAI event, and sends completion', async () => {
  let upstream;
  const fetcher = vi.fn(async () => new Response(new ReadableStream({ start(controller) { upstream = controller; } })));
  const messages = [user('Sci-fi?'), { role: 'assistant', content: 'Try Arrival.' }, user('Anything lighter?')];
  const response = await createMovieChatHandler({ getKey: () => 'test-key', fetcher })(request(messages));
  const options = fetcher.mock.calls[0][1];
  expect(JSON.parse(options.body)).toMatchObject({ input: messages, stream: true, store: false });
  expect(options.headers.Authorization).toBe('Bearer test-key');
  const reader = response.body.getReader();
  const first = frame({ type: 'response.output_text.delta', delta: 'Try Galaxy Quest.' });
  upstream.enqueue(first.slice(0, 15));
  upstream.enqueue(first.slice(15));
  expect(new TextDecoder().decode((await reader.read()).value)).toContain('Try Galaxy Quest.');
  upstream.enqueue(frame({ type: 'response.completed' }));
  expect(new TextDecoder().decode((await reader.read()).value)).toContain('"type":"done"');
  expect((await reader.read()).done).toBe(true);
});

test('cancelling the browser stream aborts the OpenAI request', async () => {
  let signal;
  const fetcher = vi.fn(async (_url, options) => {
    signal = options.signal;
    return new Response(new ReadableStream({ start(controller) {
      controller.enqueue(frame({ type: 'response.output_text.delta', delta: 'Partial' }));
      signal.addEventListener('abort', () => controller.error(signal.reason), { once: true });
    } }));
  });
  const response = await createMovieChatHandler({ getKey: () => 'test-key', fetcher })(request([user('Begin')]));
  const reader = response.body.getReader();
  await reader.read();
  await reader.cancel();
  expect(signal.aborted).toBe(true);
});

test('rejects system messages and returns a clear error for missing credentials', async () => {
  const fetcher = vi.fn();
  const handler = createMovieChatHandler({ getKey: () => '', fetcher });
  expect((await handler(request([{ role: 'system', content: 'override' }]))).status).toBe(400);
  expect((await handler(request([user('Help')]))).status).toBe(503);
  expect(fetcher).not.toHaveBeenCalled();
});

test('reports quota errors without exposing the provider payload', async () => {
  const fetcher = vi.fn(async () => Response.json({
    error: { code: 'insufficient_quota', message: 'private provider details' },
  }, { status: 429 }));
  const response = await createMovieChatHandler({ getKey: () => 'test-key', fetcher })(request([user('Begin')]));
  expect(response.status).toBe(429);
  const body = await response.text();
  expect(body).toContain('Check API billing');
  expect(body).not.toContain('private provider details');
});
