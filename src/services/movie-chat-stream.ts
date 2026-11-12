export type MovieChatEvent =
  | { type: 'text'; delta: string }
  | { type: 'done' }
  | { type: 'error'; message: string };

function decode(frame: string): MovieChatEvent {
  if (!frame.startsWith('data: ')) throw new Error('Unexpected movie reply.');
  const event: unknown = JSON.parse(frame.slice(6));
  if (!event || typeof event !== 'object' || !('type' in event)) throw new Error('Unexpected movie reply.');
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
      if (done) throw new Error('The movie reply ended early. You can send another message.');
      buffer += value;
      for (let boundary = buffer.indexOf('\n\n'); boundary !== -1; boundary = buffer.indexOf('\n\n')) {
        const event = decode(buffer.slice(0, boundary));
        buffer = buffer.slice(boundary + 2);
        yield event;
        if (event.type !== 'text') return;
      }
    }
  } finally {
    try { await reader.cancel(); } catch { /* Network abort already closed the reader. */ }
    reader.releaseLock();
  }
}
