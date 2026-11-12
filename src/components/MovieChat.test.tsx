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
