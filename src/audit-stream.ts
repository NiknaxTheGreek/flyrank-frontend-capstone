export type AuditEvent =
  | { type: 'text'; delta: string }
  | { type: 'done' }
  | { type: 'error'; message: string };

function decode(frame: string): AuditEvent {
  if (!frame.startsWith('data: ')) throw new Error('Unexpected audit response.');
  const event: unknown = JSON.parse(frame.slice(6));
  if (!event || typeof event !== 'object' || !('type' in event)) throw new Error('Unexpected audit response.');
  if (event.type === 'done') return { type: 'done' };
  if (event.type === 'text' && 'delta' in event && typeof event.delta === 'string') return { type: 'text', delta: event.delta };
  if (event.type === 'error' && 'message' in event && typeof event.message === 'string') return { type: 'error', message: event.message };
  throw new Error('Unexpected audit response.');
}

export async function* readAuditEvents(response: Response): AsyncGenerator<AuditEvent> {
  if (!response.body || !response.headers.get('content-type')?.startsWith('text/event-stream')) {
    throw new Error('The audit service did not return a stream.');
  }
  const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
  let buffer = '';
  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) throw new Error('The audit response ended early. You can send another message.');
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
