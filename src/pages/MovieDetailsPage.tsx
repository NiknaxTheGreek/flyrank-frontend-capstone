import { Link, useParams, useSearchParams } from 'react-router-dom';
import { movies } from '../data/movies';
import MoviePoster from '../components/MoviePoster';
import NotFoundPage from './NotFoundPage';

export default function MovieDetailsPage() {
  const { movieId } = useParams();
  const [params] = useSearchParams();
  const movie = movies.find((item) => item.id === movieId);
  if (!movie) return <NotFoundPage movie />;
  const query = params.get('q');
  const backTo = query ? `/?${new URLSearchParams({ q: query })}` : '/';
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
          <div><dt>Rating</dt><dd>{movie.rating.toFixed(1)} / 10</dd></div>
        </dl>
        <p className="intro-copy">Sample collection data. Live movie information will be connected in a later milestone.</p>
      </div>
    </div>
  </section>;
}
