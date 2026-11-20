import type { MovieToolPart } from '../services/movie-tool-part';
import './movie-tool-card.css';

export function MovieToolCard({ part, interrupted }: {
  part: MovieToolPart;
  interrupted: boolean;
}) {
  const waiting = part.state === 'input-streaming' || part.state === 'input-available';
  return (
    <section className={`movie-tool-card movie-tool-${part.state}`} aria-label="Movie lookup">
      <div key={interrupted && waiting ? 'interrupted' : part.state} className="movie-tool-content">
        {interrupted && waiting ? (
          <small>Lookup ended before a result arrived.</small>
        ) : part.state === 'input-streaming' ? (
          <div className="movie-tool-pending" role="status">
            <span aria-hidden="true" /> Preparing movie lookup…
          </div>
        ) : part.state === 'input-available' ? (
          <div role="status">
            <small>Checking OMDb</small>
            <p>Looking up <strong>{part.input.title}</strong>…</p>
          </div>
        ) : part.state === 'output-error' ? (
          <div role="alert">
            <strong>Movie lookup couldn’t finish</strong>
            {part.input && <p>Title: {part.input.title}</p>}
            <p>{part.errorText}</p>
          </div>
        ) : (
          <>
            <h2>{part.output.title}{part.output.year && ` (${part.output.year})`}</h2>
            <dl>
              <div><dt>IMDb rating</dt><dd>{part.output.rating === null ? 'Unrated' : `${part.output.rating}/10`}</dd></div>
              <div><dt>Genre</dt><dd>{part.output.genre || 'Unavailable'}</dd></div>
              <div><dt>Runtime</dt><dd>{part.output.runtime || 'Unavailable'}</dd></div>
            </dl>
            {part.output.plot && <p>{part.output.plot}</p>}
            <a href={`https://www.imdb.com/title/${part.output.imdbId}/`}>View {part.output.title} on IMDb</a>
          </>
        )}
      </div>
    </section>
  );
}

