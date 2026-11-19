import { useEffect, useLayoutEffect, useRef, useState, type FormEvent } from 'react';
import { readMovieChatEvents } from '../services/movie-chat-stream';
import type { MovieToolPart } from '../services/movie-tool-part';
import { MovieToolCard } from './MovieToolCard';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  parts: [{ type: 'text'; text: string }, ...MovieToolPart[]];
  outcome?: 'stopped' | 'interrupted';
};

const makeMessage = (role: Message['role'], text: string): Message => ({
  id: crypto.randomUUID(), role, parts: [{ type: 'text', text }],
});
const starter = 'I want a clever sci-fi movie for tonight. Give me three spoiler-free picks and explain how they differ.';
const latestContext = (messages: Message[]) => {
  const recent = messages.map(m => {
    const tool = m.parts[1];
    const note = tool?.state === 'output-available'
      ? `Movie lookup found ${tool.output.title} (${tool.output.year}), IMDb ID ${tool.output.imdbId}.`
      : tool?.state === 'output-error' ? tool.errorText : '';
    return { role: m.role, content: [m.parts[0].text, note].filter(Boolean).join('\n').slice(0, 8000) };
  }).filter(m => m.content.trim()).slice(-20);
  while (recent[0]?.role === 'assistant') recent.shift();
  return recent;
};

export default function MovieChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState('');
  const [activeId, setActiveId] = useState<string>();
  const [error, setError] = useState('');
  const [announcement, setAnnouncement] = useState('');
  const [showJump, setShowJump] = useState(false);
  const running = useRef<AbortController | null>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  const pinned = useRef(true);
  const lastTop = useRef(0);

  useEffect(() => () => running.current?.abort(), []);
  function jumpToLatest() {
    pinned.current = true;
    if (viewport.current) {
      viewport.current.scrollTop = viewport.current.scrollHeight;
      lastTop.current = viewport.current.scrollTop;
    }
    setShowJump(false);
  }
  useLayoutEffect(() => {
    if (pinned.current) jumpToLatest();
  }, [messages, activeId]);

  function handleScroll() {
    const el = viewport.current;
    if (!el) return;
    const upward = el.scrollTop < lastTop.current;
    lastTop.current = el.scrollTop;
    pinned.current = !upward && el.scrollHeight - el.clientHeight - el.scrollTop <= 2;
    setShowJump(!pinned.current);
  }

  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const prompt = draft.trim();
    if (!prompt || running.current) return;
    const controller = new AbortController();
    running.current = controller;
    const conversation = [...messages, makeMessage('user', prompt)];
    const assistant = makeMessage('assistant', '');
    setMessages([...conversation, assistant]);
    setActiveId(assistant.id);
    setDraft('');
    setError('');
    setAnnouncement('Preparing movie recommendations.');
    let output = '';
    let tool: MovieToolPart | undefined;
    let finishedTool = false;
    let outcome: Message['outcome'];
    try {
      const response = await fetch('/api/movie-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: latestContext(conversation) }),
        signal: controller.signal,
      });
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(typeof body?.error === 'string' ? body.error : 'The movie assistant could not respond.');
      }
      for await (const part of readMovieChatEvents(response)) {
        if (part.type === 'error') throw new Error(part.message);
        if (part.type === 'tool') {
          tool = part;
          finishedTool = part.state === 'output-available' || part.state === 'output-error';
          setMessages(current => current.map(m => m.id === assistant.id
            ? { ...m, parts: [m.parts[0], part] } : m));
          if (part.state === 'input-streaming' || part.state === 'input-available') {
            await new Promise(resolve => setTimeout(resolve, 350));
            controller.signal.throwIfAborted();
          }
        }
        if (part.type === 'text') {
          if (!output && part.delta) setAnnouncement('Movie recommendations are streaming.');
          output += part.delta;
          const snapshot = output;
          setMessages(current => current.map(m => m.id === assistant.id
            ? { ...m, parts: [{ type: 'text', text: snapshot }, ...m.parts.slice(1) as MovieToolPart[]] } : m));
        }
      }
      if (!output.trim() && !finishedTool) throw new Error('The movie assistant returned an empty reply.');
      setAnnouncement(tool?.state === 'output-error' ? '' : finishedTool ? 'Movie lookup complete.' : 'Movie recommendations ready.');
    } catch (cause) {
      outcome = controller.signal.aborted ? 'stopped' : 'interrupted';
      if (outcome === 'stopped') setAnnouncement('Generation stopped.');
      else {
        setAnnouncement('');
        setError(cause instanceof Error ? cause.message : 'The movie reply was interrupted.');
        if (!output.trim() && !tool) setDraft(current => current || prompt);
      }
    } finally {
      if (outcome) setMessages(current => output.trim() || tool
        ? current.map(m => m.id === assistant.id ? { ...m, outcome } : m)
        : current.filter(m => m.id !== assistant.id &&
          (outcome !== 'interrupted' || m.id !== conversation[conversation.length - 1].id)));
      running.current = null;
      setActiveId(undefined);
    }
  }

  return (
    <section className="movie-chat" id="movie-chat-chat" aria-labelledby="movie-chat-heading">
      <header>
        <p className="eyebrow">Reel Good · Movie picker</p>
        <h1 id="movie-chat-heading" tabIndex={-1}>Help me pick a movie</h1>
        <p>Tell us what you’re in the mood for, then narrow your picks with follow-up questions.</p>
      </header>
      <div className="movie-chat-viewport" ref={viewport} onScroll={handleScroll}
        onWheel={event => {
          if (event.deltaY < 0 && event.currentTarget.scrollTop > 0) {
            pinned.current = false;
            setShowJump(true);
          }
        }} tabIndex={0}
        role="region" aria-label="Movie conversation">
        {messages.length === 0 && <p>Share a genre, a mood, or a movie you liked. Try the example below to get started.</p>}
        <ol className="movie-chat-messages">
          {messages.map(m => (
            <li key={m.id} className={`movie-chat-message movie-chat-${m.role}`}>
              <strong>{m.role === 'user' ? 'You' : 'Movie picker'}</strong>
              {m.parts[0].text && <p>{m.parts[0].text}</p>}
              {!m.parts[0].text && m.parts.length === 1 && m.id === activeId && <p>Thinking…</p>}
              {m.parts[1] && <MovieToolCard key={m.parts[1].toolCallId} part={m.parts[1]} interrupted={!!m.outcome} />}
              {m.outcome && <small>{m.outcome === 'stopped' ? 'Stopped · partial response' : 'Interrupted · partial response'}</small>}
            </li>
          ))}
        </ol>
      </div>
      <span className="movie-chat-sr-only" role="status" aria-live="polite">{announcement}</span>
      {showJump && <button className="movie-chat-secondary" type="button" onClick={() => { jumpToLatest(); viewport.current?.focus(); }}>Jump to latest</button>}
      {error && <p role="alert" className="movie-chat-error">{error}</p>}
      {messages.length === 0 && <button className="movie-chat-secondary" type="button" onClick={() => { setDraft(starter); input.current?.focus(); }}>Try an example</button>}
      <form onSubmit={send} className="movie-chat-form">
        <label htmlFor="movie-chat-question">Your movie preferences</label>
        <textarea id="movie-chat-question" ref={input} value={draft} maxLength={4000}
          onChange={e => setDraft(e.target.value)} rows={2} placeholder="Something tense, but not too scary…" />
        <div className="movie-chat-actions">
          <button className="movie-chat-send" type="submit" disabled={!!activeId || !draft.trim()}>Send</button>
          <button className="movie-chat-secondary" type="button" disabled={!activeId} onClick={() => { running.current?.abort(); input.current?.focus(); }}>Stop generation</button>
        </div>
      </form>
    </section>
  );
}
