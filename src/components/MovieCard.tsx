import { useState } from 'react';
import type { Movie } from '../types/movie';

type MovieCardProps = {
  movie: Movie;
};

function MovieCard({ movie }: MovieCardProps) {
  const [posterFailed, setPosterFailed] = useState(false);

  return (
    <article className="movie-card">
      <div className="poster-frame">
        {posterFailed ? (
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
        <span className="rating" aria-label={`Rated ${movie.rating} out of 10`}>
          <span aria-hidden="true">★</span> {movie.rating.toFixed(1)}
        </span>
      </div>
      <div className="movie-details">
        <h3>{movie.title}</h3>
        <p><span>{movie.year}</span><span className="detail-dot" aria-hidden="true">·</span><span>{movie.genre}</span></p>
      </div>
    </article>
  );
}

export default MovieCard;
