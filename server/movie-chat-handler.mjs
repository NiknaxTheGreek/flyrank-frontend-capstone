import { movieChatConfig } from './movie-chat-config.mjs';

const error = (message, status) => Response.json({ error: message }, { status });
const encoder = new TextEncoder();

function providerMessage(code) {
  if (code === 'RESOURCE_EXHAUSTED' || code === 429) return 'Gemini free-tier quota is unavailable or exhausted. Check your AI Studio limits and try again later.';
  if (['UNAUTHENTICATED', 'PERMISSION_DENIED', 'INVALID_ARGUMENT', 400, 401, 403].includes(code)) return 'Gemini rejected this request. Check the GEMINI_API_KEY Preview secret and model access.';
  if (code === 'NOT_FOUND' || code === 404) return 'The configured Gemini model is unavailable.';
}

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

async function* geminiEvents(body) {
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

export function createMovieChatHandler({ getKey = () => process.env.GEMINI_API_KEY, fetcher = fetch } = {}) {
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
      upstream = await fetcher('https://generativelanguage.googleapis.com/v1beta/models/' + encodeURIComponent(movieChatConfig.model) + ':streamGenerateContent?alt=sse', {
        method: 'POST',
        headers: { 'x-goog-api-key': key, 'Content-Type': 'application/json' },
        signal,
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: movieChatConfig.instructions }] },
          contents: input.map(({ role, content }) => ({
            role: role === 'assistant' ? 'model' : 'user', parts: [{ text: content }],
          })),
          generationConfig: { maxOutputTokens: movieChatConfig.maxOutputTokens },
        }),
      });
    } catch { return error('Could not start the movie reply. Try again shortly.', 502); }
    if (!upstream.ok || !upstream.body) {
      const payload = await upstream.json().catch(() => null);
      const hint = providerMessage(payload?.error?.status ?? payload?.error?.code);
      if (hint) return error(hint, upstream.status === 429 ? 429 : 502);
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
          for await (const event of geminiEvents(upstream.body)) {
            if (event.error || event.promptFeedback?.blockReason) {
              send({ type: 'error', message: providerMessage(event.error?.status ?? event.error?.code)
                ?? 'Gemini could not answer that request. Try another movie preference.' });
              return;
            }
            const candidate = event.candidates?.[0];
            for (const part of candidate?.content?.parts ?? []) {
              if (typeof part.text === 'string' && !part.thought) send({ type: 'text', delta: part.text });
            }
            if (candidate?.finishReason) {
              if (candidate.finishReason === 'STOP') send({ type: 'done' });
              else send({ type: 'error', message: candidate.finishReason === 'MAX_TOKENS'
                ? 'The reply reached its length limit. Ask me to continue.'
                : 'Gemini stopped this reply. Try another movie preference.' });
              return;
            }
          }
          send({ type: 'error', message: 'The connection to Gemini closed before the reply finished. Try again.' });
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
