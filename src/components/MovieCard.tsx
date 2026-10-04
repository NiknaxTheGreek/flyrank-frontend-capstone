import { Link, useSearchParams } from 'react-router-dom';
import MoviePoster from './MoviePoster';
import type { Movie } from '../types/movie';

type MovieCardProps = {
  movie: Movie;
};

function MovieCard({ movie }: MovieCardProps) {
  const [params] = useSearchParams();
  const query = params.get('q');
  const suffix = query ? `?${new URLSearchParams({ q: query, page: params.get('page') ?? '1' })}` : '';

  return (
    <article className="movie-card">
      <Link className="movie-link" to={`/movies/${movie.id}${suffix}`} aria-label={`View ${movie.title}`}>
      <MoviePoster key={movie.posterUrl} movie={movie} />
      <div className="movie-details">
        <h3>{movie.title}</h3>
        <p><span>{movie.year}</span><span className="detail-dot" aria-hidden="true">·</span><span>{movie.genre}</span></p>
      </div>
      </Link>
    </article>
  );
}

export default MovieCard;

