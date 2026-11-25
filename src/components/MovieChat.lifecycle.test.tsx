import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, test, vi } from 'vitest';
import MovieChat from './MovieChat';
import { failedPart, lookingUpPart, preparingPart, resultPart, sseResponse } from '../test/movieChatFixtures';

afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

test('an empty or whitespace-only prompt never starts an API request', async () => {
  const user = userEvent.setup();
  const fetcher = vi.fn();
  vi.stubGlobal('fetch', fetcher);
  render(<MovieChat />);
  const send = screen.getByRole('button', { name: 'Send' });
  expect(send).toBeDisabled();
  await user.type(screen.getByRole('textbox', { name: 'Your movie preferences' }), '   ');
  expect(send).toBeDisabled();
  await user.click(send);
  expect(fetcher).not.toHaveBeenCalled();
  expect(screen.getByRole('button', { name: 'Try an example' })).toBeEnabled();
});

test('a mocked stream transitions through every successful tool state and then completes', async () => {
  let controller!: ReadableStreamDefaultController<Uint8Array>;
  const push = (event: object) => controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(event)}\n\n`));
  const fetcher = vi.fn(async () => new Response(new ReadableStream({ start(stream) { controller = stream; } }), {
    headers: { 'Content-Type': 'text/event-stream' },
  }));
  vi.stubGlobal('fetch', fetcher);
  render(<MovieChat />);
  fireEvent.change(screen.getByRole('textbox', { name: 'Your movie preferences' }), { target: { value: 'Look up Inception' } });
  fireEvent.click(screen.getByRole('button', { name: 'Send' }));
  expect(screen.getByRole('button', { name: 'Send' })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Stop generation' })).toBeEnabled();
  await act(async () => { await Promise.resolve(); push(preparingPart); });
  const card = await screen.findByRole('region', { name: 'Movie lookup' });
  expect(within(card).getByRole('status')).toHaveTextContent('Preparing movie lookup…');
  push(lookingUpPart);
  await within(card).findByText('Checking OMDb');
  expect(within(card).getByRole('status')).toHaveTextContent('Looking up Inception');
  push(resultPart);
  push({ type: 'text', delta: 'A dream-heist film.' });
  push({ type: 'done' });
  controller.close();
  await screen.findByRole('heading', { name: 'Inception (2010)' });
  await screen.findByText('Movie lookup complete.');
  expect(screen.getByRole('listitem', { name: 'Movie picker message' })).toHaveTextContent('A dream-heist film.');
  expect(screen.getByRole('button', { name: 'Stop generation' })).toBeDisabled();
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  expect(fetcher).toHaveBeenCalledWith('/api/movie-chat', expect.objectContaining({ method: 'POST' }));
});

test('a failed tool shows an alert and retries the same turn without duplicating the user message', async () => {
  const user = userEvent.setup();
  const fetcher = vi.fn()
    .mockResolvedValueOnce(sseResponse([failedPart, { type: 'done' }]))
    .mockResolvedValueOnce(sseResponse([resultPart, { type: 'done' }]));
  vi.stubGlobal('fetch', fetcher);
  render(<MovieChat />);
  await user.type(screen.getByRole('textbox', { name: 'Your movie preferences' }), 'Find Inception');
  await user.click(screen.getByRole('button', { name: 'Send' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('OMDb is temporarily unavailable.');
  await user.click(screen.getByRole('button', { name: 'Retry failed message' }));
  await screen.findByRole('heading', { name: 'Inception (2010)' });
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  expect(screen.getAllByRole('listitem', { name: 'You message' })).toHaveLength(1);
  expect(fetcher).toHaveBeenCalledTimes(2);
  expect(fetcher.mock.calls[0][1].body).toBe(fetcher.mock.calls[1][1].body);
});
