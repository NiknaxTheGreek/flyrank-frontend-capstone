import { movieToolPart, type MovieToolPart } from './movie-tool-part';

export type MovieChatEvent =
  | MovieToolPart
  | { type: 'text'; delta: string }
  | { type: 'done' }
  | { type: 'error'; message: string };

function decode(frame: string): MovieChatEvent {
  if (!frame.startsWith('data: ')) throw new Error('Unexpected movie reply.');
  let event: unknown;
  try { event = JSON.parse(frame.slice(6)); }
  catch { throw new Error('The movie service returned an unreadable reply. Retry the failed message.'); }
  if (!event || typeof event !== 'object' || !('type' in event)) throw new Error('Unexpected movie reply.');
  if (event.type === 'tool') {
    const parsed = movieToolPart.safeParse(event);
    if (!parsed.success) throw new Error('The movie service returned incomplete movie details. Retry the failed message.');
    return parsed.data;
  }
  if (event.type === 'done') return { type: 'done' };
  if (event.type === 'text' && 'delta' in event && typeof event.delta === 'string') return { type: 'text', delta: event.delta };
  if (event.type === 'error' && 'message' in event && typeof event.message === 'string') return { type: 'error', message: event.message };
  throw new Error('Unexpected movie reply.');
}

export async function* readMovieChatEvents(response: Response): AsyncGenerator<MovieChatEvent> {
  if (!response.body || !response.headers.get('content-type')?.startsWith('text/event-stream')) {
    throw new Error('The movie assistant did not return a stream.');
  }
  const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
  let buffer = '';
  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) throw new Error('The connection ended before the reply finished. Retry the failed message.');
      buffer += value;
      for (let boundary = buffer.indexOf('\n\n'); boundary !== -1; boundary = buffer.indexOf('\n\n')) {
        const event = decode(buffer.slice(0, boundary));
        buffer = buffer.slice(boundary + 2);
        yield event;
        if (event.type === 'done' || event.type === 'error') return;
      }
    }
  } finally {
    try { await reader.cancel(); } catch { /* Network abort already closed the reader. */ }
    reader.releaseLock();
  }
}


