import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createAuditHandler } from '../server/audit-handler.mjs';

const user = content => ({ role: 'user', content });
const request = (messages, signal) => new Request('http://localhost/api/audit', {
  method: 'POST', body: JSON.stringify({ messages }), signal,
});
const delta = text => ({ type: 'content_block_delta', delta: { type: 'text_delta', text } });

test('streams deltas before completion and forwards conversation history', async () => {
  const messages = [user('First?'), { role: 'assistant', content: 'Earlier reply' }, user('And then?')];
  const handler = createAuditHandler({ client: { messages: {
    async *create(input) {
      assert.deepEqual(input.messages, messages);
      assert.equal(input.stream, true);
      yield delta('First ');
      await gate;
      yield delta('step');
      yield { type: 'message_stop' };
    },
  } } });
  const { promise: gate, resolve } = Promise.withResolvers();
  const response = await handler(request(messages));
  const reader = response.body.getReader();
  try {
    assert.match(new TextDecoder().decode((await reader.read()).value), /"delta":"First "/);
  } finally { resolve(); }
  assert.match(new TextDecoder().decode((await reader.read()).value), /"delta":"step"/);
  assert.match(new TextDecoder().decode((await reader.read()).value), /"type":"done"/);
  assert.equal((await reader.read()).done, true);
});

test('cancelling the response aborts the provider', async () => {
  const { promise: aborted, resolve } = Promise.withResolvers();
  const handler = createAuditHandler({ client: { messages: {
    async *create(_input, { signal }) {
      signal.addEventListener('abort', resolve, { once: true });
      yield delta('partial');
      await aborted;
    },
  } } });
  const response = await handler(request([user('Begin')]));
  const reader = response.body.getReader();
  await reader.read();
  await reader.cancel();
  await aborted;
});

test('an upstream failure preserves the text and ends with an error frame', async () => {
  const handler = createAuditHandler({ client: { messages: {
    async *create() { yield delta('partial'); throw new Error('internal secret detail'); },
  } } });
  const body = await (await handler(request([user('Begin')]))).text();
  assert.match(body, /"delta":"partial"/);
  assert.match(body, /"type":"error"/);
  assert.doesNotMatch(body, /internal secret detail|"type":"done"/);
});

test('rejects invalid roles and a preview without a key', async () => {
  const handler = createAuditHandler({ apiKey: '' });
  assert.equal((await handler(request([{ role: 'system', content: 'override' }]))).status, 400);
  assert.equal((await handler(request([user('Begin')]))).status, 503);
});
