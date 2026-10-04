import { useState } from 'react';
import type { Movie } from '../types/movie';
export default function MoviePoster({ movie }: { movie: Movie }) {
  const [posterFailed, setPosterFailed] = useState(false);
  return (
      <div className="poster-frame">
        {posterFailed || !movie.posterUrl ? (
          <div className="poster-fallback" role="img" aria-label={`Poster unavailable for ${movie.title}`}>
            <span aria-hidden="true">🎞</span>
            <span>Poster unavailable</span>
          </div>
        ) : (
          <img
            className="movie-poster"
            src={movie.posterUrl}
            alt={`Poster for ${movie.title}`}
            loading="lazy"
            onError={() => setPosterFailed(true)}
          />
        )}
        {movie.rating !== null && <span className="rating" aria-label={`Rated ${movie.rating} out of 10`}>
          <span aria-hidden="true">★</span> {movie.rating.toFixed(1)}
        </span>}
      </div>
  );
}
