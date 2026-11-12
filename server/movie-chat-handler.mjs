import { movieChatConfig } from './movie-chat-config.mjs';

const error = (message, status) => Response.json({ error: message }, { status });
const encoder = new TextEncoder();

async function readMessages(request) {
  const reader = request.body?.getReader();
  if (!reader) throw new Error();
  const decoder = new TextDecoder();
  let body = '', bytes = 0;
  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      bytes += value.length;
      if (bytes > 192_000) { await reader.cancel(); throw new Error(); }
      body += decoder.decode(value, { stream: true });
    }
    const { messages } = JSON.parse(body + decoder.decode());
    if (!Array.isArray(messages) || messages.length < 1 || messages.length > 20 ||
        messages[0]?.role !== 'user' || messages.at(-1)?.role !== 'user' ||
        !messages.every(m => m && ['user', 'assistant'].includes(m.role) &&
          typeof m.content === 'string' && m.content.trim() && m.content.length <= 8000)) throw new Error();
    return messages.map(({ role, content }) => ({ role, content }));
  } finally { reader.releaseLock(); }
}

async function* openAIEvents(body) {
  const reader = body.pipeThrough(new TextDecoderStream()).getReader();
  let buffer = '';
  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) return;
      buffer += value;
      for (;;) {
        const boundary = /\r?\n\r?\n/.exec(buffer);
        if (!boundary) break;
        const data = buffer.slice(0, boundary.index).split(/\r?\n/)
          .filter(line => line.startsWith('data:')).map(line => line.slice(5).replace(/^ /, '')).join('\n');
        buffer = buffer.slice(boundary.index + boundary[0].length);
        if (data && data !== '[DONE]') yield JSON.parse(data);
      }
    }
  } finally {
    await reader.cancel().catch(() => {});
    reader.releaseLock();
  }
}

export function createMovieChatHandler({ getKey = () => process.env.OPENAI_API_KEY, fetcher = fetch } = {}) {
  return async function movieChat(request) {
    if (request.method !== 'POST') return new Response(null, { status: 405, headers: { Allow: 'POST' } });
    let input;
    try { input = await readMessages(request); }
    catch { return error('Send a valid conversation within the size limit.', 400); }
    const key = getKey();
    if (!key) return error('Movie recommendations are not configured on this deployment.', 503);
    const disconnect = new AbortController();
    const signal = AbortSignal.any([request.signal, disconnect.signal, AbortSignal.timeout(40_000)]);
    let upstream;
    try {
      upstream = await fetcher('https://api.openai.com/v1/responses', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
        signal,
        body: JSON.stringify({
          model: movieChatConfig.model, instructions: movieChatConfig.instructions,
          max_output_tokens: movieChatConfig.maxOutputTokens, input, stream: true, store: false,
        }),
      });
    } catch { return error('Could not start the movie reply. Try again shortly.', 502); }
    if (!upstream.ok || !upstream.body) {
      await upstream.body?.cancel().catch(() => {});
      return upstream.status === 429
        ? error('The movie picker is busy. Wait a moment and try again.', 429)
        : error('Could not start the movie reply. Try again shortly.', 502);
    }
    const body = new ReadableStream({
      async start(controller) {
        const send = event => {
          if (!disconnect.signal.aborted && !request.signal.aborted) {
            controller.enqueue(encoder.encode('data: ' + JSON.stringify(event) + '\n\n'));
          }
        };
        try {
          for await (const event of openAIEvents(upstream.body)) {
            if (event.type === 'response.output_text.delta' || event.type === 'response.refusal.delta') {
              if (typeof event.delta === 'string') send({ type: 'text', delta: event.delta });
            }
            if (event.type === 'response.completed') { send({ type: 'done' }); return; }
            if (['response.incomplete', 'response.failed', 'error'].includes(event.type)) break;
          }
          send({ type: 'error', message: 'The movie reply ended early. You can send another message.' });
        } catch {
          send({ type: 'error', message: 'The movie reply was interrupted. You can send another message.' });
        } finally {
          if (!disconnect.signal.aborted) controller.close();
        }
      },
      cancel() { disconnect.abort(); },
    });
    return new Response(body, { headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      'X-Accel-Buffering': 'no',
    } });
  };
}
