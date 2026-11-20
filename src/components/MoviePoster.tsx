import { useState } from 'react';
import type { Movie } from '../types/movie';
export default function MoviePoster({ movie, priority = false }: { movie: Movie; priority?: boolean }) {
  const [posterFailed, setPosterFailed] = useState(false);
  return (
      <div className="poster-frame">
        {posterFailed || !movie.posterUrl ? (
          <div className="poster-fallback" role="img" aria-label={`Poster unavailable for ${movie.title}`}>
            <span className="poster-fallback-icon" aria-hidden="true">🎞</span>
            <span className="poster-fallback-title">{movie.title}</span>
            <span>Poster unavailable</span>
          </div>
        ) : (
          <img
            className="movie-poster"
            src={movie.posterUrl}
            alt={`Poster for ${movie.title}`}
            loading={priority ? 'eager' : 'lazy'}
            {...{ fetchpriority: priority ? 'high' : 'auto' }}
            width={300}
            height={450}
            decoding="async"
            onError={() => setPosterFailed(true)}
          />
        )}
        {movie.rating !== null && <span className="rating" aria-label={`Rated ${movie.rating} out of 10`}>
          <span aria-hidden="true">★</span> {movie.rating.toFixed(1)}
        </span>}
      </div>
  );
}
