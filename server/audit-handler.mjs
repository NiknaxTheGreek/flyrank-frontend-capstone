import Anthropic from '@anthropic-ai/sdk';
import { auditConfig } from './audit-config.mjs';

const jsonError = (error, status) => Response.json({ error }, { status });
const encoder = new TextEncoder();

async function readConversation(request) {
  const reader = request.body?.getReader();
  if (!reader) throw new Error();
  const decoder = new TextDecoder('utf-8', { fatal: true });
  let body = '', bytes = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.length;
      if (bytes > 256_000) { await reader.cancel(); throw new Error(); }
      body += decoder.decode(value, { stream: true });
    }
    return JSON.parse(body + decoder.decode()).messages;
  } finally {
    reader.releaseLock();
  }
}

function validMessages(messages) {
  return Array.isArray(messages) && messages.length >= 1 && messages.length <= 20 &&
    messages[0]?.role === 'user' && messages.at(-1)?.role === 'user' &&
    messages.every(m => m && ['user', 'assistant'].includes(m.role) &&
      typeof m.content === 'string' && m.content.trim() && m.content.length <= 12_000);
}

export function createAuditHandler({ apiKey, client } = {}) {
  return async function audit(request) {
    if (request.method !== 'POST') return new Response(null, { status: 405, headers: { Allow: 'POST' } });
    let messages;
    try { messages = await readConversation(request); }
    catch { return jsonError('Send a valid conversation within the size limit.', 400); }
    if (!validMessages(messages)) return jsonError('Send a valid conversation within the size limit.', 400);

    const key = apiKey ?? process.env.ANTHROPIC_API_KEY;
    if (!client && !key) return jsonError('Claude is not configured for this preview.', 503);
    const provider = client ?? new Anthropic({ apiKey: key, maxRetries: 0, timeout: 30_000 });
    const disconnect = new AbortController();
    const signal = AbortSignal.any([request.signal, disconnect.signal, AbortSignal.timeout(40_000)]);
    let upstream;
    try {
      upstream = await provider.messages.create({
        model: auditConfig.model,
        system: auditConfig.system,
        max_tokens: auditConfig.maxTokens,
        messages: messages.map(({ role, content }) => ({ role, content })),
        stream: true,
      }, { signal });
    } catch (error) {
      return error?.status === 429
        ? jsonError('Claude is busy. Wait a moment and send your message again.', 429)
        : jsonError('Could not start an audit response. Try again shortly.', 502);
    }

    const body = new ReadableStream({
      async start(controller) {
        const send = (event) => {
          if (!disconnect.signal.aborted) controller.enqueue(encoder.encode('data: ' + JSON.stringify(event) + '\n\n'));
        };
        try {
          let complete = false;
          for await (const event of upstream) {
            if (signal.aborted) break;
            if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
              send({ type: 'text', delta: event.delta.text });
            }
            if (event.type === 'message_stop') { complete = true; break; }
          }
          if (!request.signal.aborted) send(complete ? { type: 'done' } : { type: 'error', message: 'The audit response was interrupted.' });
        } catch {
          if (!request.signal.aborted) send({ type: 'error', message: 'The audit response was interrupted.' });
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
