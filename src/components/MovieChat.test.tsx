import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';
import MovieChat from './MovieChat';

afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

test('shows thinking, preserves stopped text and includes it in the next request', async () => {
  let stream: ReadableStreamDefaultController<Uint8Array>;
  const push = (event: object) => stream.enqueue(new TextEncoder().encode('data: ' + JSON.stringify(event) + '\n\n'));
  const fetcher = vi.fn((_url: string, options: RequestInit) => Promise.resolve(new Response(new ReadableStream({
    start(controller) {
      stream = controller;
      if (fetcher.mock.calls.length === 1) {
        options.signal?.addEventListener('abort', () => controller.error(new Error('Stopped')), { once: true });
      } else {
        push({ type: 'text', delta: 'Try Galaxy Quest.' });
        push({ type: 'done' });
        controller.close();
      }
    },
  }), { headers: { 'Content-Type': 'text/event-stream' } })));
  vi.stubGlobal('fetch', fetcher);
  render(<MovieChat />);
  fireEvent.click(screen.getByRole('button', { name: 'Try an example' }));
  const question = screen.getByRole('textbox', { name: 'Your movie preferences' });
  fireEvent.click(screen.getByRole('button', { name: 'Send', exact: true }));
  expect(screen.getByText('Thinking…')).toBeTruthy();
  push({ type: 'text', delta: 'Try ' });
  await screen.findByText('Try');
  push({ type: 'text', delta: 'Arrival.' });
  await screen.findByText('Try Arrival.');
  fireEvent.click(screen.getByRole('button', { name: 'Stop generation' }));
  await screen.findByText('Stopped · partial response');
  fireEvent.change(question, { target: { value: 'Anything lighter?' } });
  fireEvent.click(screen.getByRole('button', { name: 'Send', exact: true }));
  await screen.findByText('Try Galaxy Quest.');
  expect(screen.getByText('Try Arrival.')).toBeTruthy();
  expect(JSON.parse(String(fetcher.mock.calls[1][1].body)).messages.slice(-2)).toEqual([
    { role: 'assistant', content: 'Try Arrival.' },
    { role: 'user', content: 'Anything lighter?' },
  ]);
});


test('mid-stream failure keeps partial text and retries only the failed turn once', async () => {
  let stream: ReadableStreamDefaultController<Uint8Array>;
  const encode = (event: object) => new TextEncoder().encode('data: ' + JSON.stringify(event) + '\n\n');
  const fetcher = vi.fn(async () => new Response(new ReadableStream({ start(controller) {
    stream = controller;
    controller.enqueue(encode({ type: 'text', delta: fetcher.mock.calls.length === 1 ? 'Partial recommendation' : 'Recovered recommendation' }));
    if (fetcher.mock.calls.length === 1) {
      controller.enqueue(encode({ type: 'error', message: 'Connection interrupted.' }));
      controller.close();
    }
  } }), { headers: { 'Content-Type': 'text/event-stream' } }));
  vi.stubGlobal('fetch', fetcher);
  render(<MovieChat />);
  fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Suggest a comedy' } });
  fireEvent.click(screen.getByRole('button', { name: 'Send', exact: true }));
  await screen.findByText('Connection interrupted.');
  expect(screen.getByText('Partial recommendation')).toBeTruthy();
  const retry = screen.getByRole('button', { name: 'Retry failed message' });
  fireEvent.click(retry);
  fireEvent.click(retry);
  await screen.findByText('Recovered recommendation');
  expect(fetcher).toHaveBeenCalledTimes(2);
  expect(fetcher.mock.calls.map(call => JSON.parse(String((call as unknown as [string, RequestInit])[1].body)))).toEqual([
    { messages: [{ role: 'user', content: 'Suggest a comedy' }] },
    { messages: [{ role: 'user', content: 'Suggest a comedy' }] },
  ]);
  expect(screen.queryByText('Partial recommendation')).toBeNull();
  stream!.enqueue(encode({ type: 'done' }));
  stream!.close();
  await screen.findByText('Movie recommendations ready.');
});

test.each(['network', 'rate limit', 'malformed tool'])('%s failure offers recovery', async kind => {
  vi.stubGlobal('fetch', vi.fn(async () => {
    if (kind === 'network') throw new TypeError('Network unavailable');
    if (kind === 'rate limit') return Response.json({ error: 'Please wait before retrying.' }, { status: 429 });
    return new Response('data: {"type":"tool","state":"output-available","output":{}}\n\n', { headers: { 'Content-Type': 'text/event-stream' } });
  }));
  render(<MovieChat />);
  fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Find Arrival' } });
  fireEvent.click(screen.getByRole('button', { name: 'Send', exact: true }));
  await screen.findByRole('alert');
  expect(screen.getByRole('button', { name: 'Retry failed message' })).toBeTruthy();
  expect(screen.getByText('Find Arrival', { selector: 'p' })).toBeTruthy();
});
