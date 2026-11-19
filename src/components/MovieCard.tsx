import { Link, useSearchParams } from 'react-router-dom';
import MoviePoster from './MoviePoster';
import FavoriteButton from './FavoriteButton';
import type { Movie } from '../types/movie';

type MovieCardProps = {
  movie: Movie;
  priority?: boolean;
};

function MovieCard({ movie, priority = false }: MovieCardProps) {
  const [params] = useSearchParams();
  const query = params.get('q');
  const suffix = query ? `?${new URLSearchParams({ q: query, page: params.get('page') ?? '1' })}` : '';
  const imdbId = movie.imdbId && /^tt\d{7,10}$/.test(movie.imdbId)
    ? movie.imdbId
    : /^tt\d{7,10}$/.test(movie.id) ? movie.id : undefined;

  return (
    <article className="movie-card">
      <Link className="movie-link" to={`/movies/${movie.id}${suffix}`} aria-label={`View ${movie.title}`}>
      <MoviePoster key={movie.posterUrl} movie={movie} priority={priority} />
      <div className="movie-details">
        <h3>{movie.title}</h3>
        <p><span>{movie.year}</span><span className="detail-dot" aria-hidden="true">·</span><span>{movie.genre || 'Genre unavailable'}</span></p>
      </div>
      </Link>
      <p className="movie-summary">{movie.plot || 'Plot description unavailable from OMDb.'}</p>
      {imdbId && <a
        className="movie-imdb-link"
        href={`https://www.imdb.com/title/${imdbId}/`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`IMDb profile for ${movie.title}`}
      >
        IMDb profile <span aria-hidden="true">↗</span>
      </a>}
      <FavoriteButton movie={movie} />
    </article>
  );
}

export default MovieCard;
