import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useMovieDetails } from '../hooks/useMovieDetails';
import MoviePoster from '../components/MoviePoster';
import NotFoundPage from './NotFoundPage';

export default function MovieDetailsPage() {
  const { movieId } = useParams();
  const [params] = useSearchParams();
  const { movie, loading, error, live, retry } = useMovieDetails(movieId);
  useEffect(() => {
    if (!loading) {
      const heading = document.querySelector<HTMLElement>('h1');
      heading?.focus();
      document.title = `${heading?.textContent ?? 'Movies'} | Reel Good`;
    }
  }, [loading, movie, error]);
  if (loading) return <section className="intro"><h1 tabIndex={-1}>Loading movie…</h1><p role="status">Fetching movie details…</p></section>;
  if (error) return <section className="intro"><h1 tabIndex={-1}>Unable to load movie</h1><p role="alert">{error}</p><button className="button button-primary" onClick={retry}>Retry details</button> <Link className="back-link" to="/">Browse movies</Link></section>;
  if (!movie) return <NotFoundPage movie />;
  const query = params.get('q');
  const backTo = query ? `/?${new URLSearchParams({ q: query, ...(params.get('page') ? { page: params.get('page')! } : {}) })}` : '/';
  return <section className="detail-page">
    <Link className="back-link" to={backTo}>{query ? 'Back to search results' : 'Back to movies'}</Link>
    <div className="detail-layout">
      <MoviePoster key={movie.id} movie={movie} />
      <div>
        <p className="eyebrow">The collection</p>
        <h1 tabIndex={-1}>{movie.title}</h1>
        <dl className="movie-facts">
          <div><dt>Release year</dt><dd>{movie.year}</dd></div>
          <div><dt>Genre</dt><dd>{movie.genre}</dd></div>
          <div><dt>Rating</dt><dd>{movie.rating === null ? 'Not rated' : `${movie.rating.toFixed(1)} / 10`}</dd></div>
        </dl>
        {movie.director && <p>Directed by {movie.director}</p>}
        {movie.runtime && <p>Runtime: {movie.runtime}</p>}
        {movie.plot && <p className="plot">{movie.plot}</p>}
        <p className="intro-copy">{live ? 'Movie information supplied by OMDb.' : 'Sample collection data. Search above from Home for live OMDb results.'}</p>
      </div>
    </div>
  </section>;
}
