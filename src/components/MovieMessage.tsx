import type { MovieToolPart } from '../services/movie-tool-part';
import { MovieToolCard } from './MovieToolCard';

export type MovieMessageData = {
  id: string;
  role: 'user' | 'assistant';
  parts: [{ type: 'text'; text: string }, ...MovieToolPart[]];
  outcome?: 'stopped' | 'interrupted';
};

export function MovieMessage({ message, pending = false }: {
  message: MovieMessageData;
  pending?: boolean;
}) {
  const speaker = message.role === 'user' ? 'You' : 'Movie picker';
  const [textPart, ...tools] = message.parts;
  return (
    <li className={`movie-chat-message movie-chat-${message.role}`} aria-label={`${speaker} message`}>
      <strong>{speaker}</strong>
      {textPart.text && <p>{textPart.text}</p>}
      {!textPart.text && tools.length === 0 && pending && (
        <div className="movie-chat-skeleton" role="status">
          <span>Thinking…</span><i aria-hidden="true" /><i aria-hidden="true" />
        </div>
      )}
      {tools.map(part => <MovieToolCard key={part.toolCallId} part={part} interrupted={!!message.outcome} />)}
      {message.outcome && <small>{message.outcome === 'stopped' ? 'Stopped · partial response' : 'Interrupted · partial response'}</small>}
    </li>
  );
}
