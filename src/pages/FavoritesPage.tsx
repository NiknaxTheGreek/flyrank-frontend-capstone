import { Link } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../contexts/FavoritesContext';

export default function FavoritesPage() {
  const { user, loading: authLoading } = useAuth();
  const { movies, loading, error, retry } = useFavorites();

  return <section className="movie-section favorites-page" aria-labelledby="favorites-title">
    <p className="eyebrow">Your collection</p>
    <h1 id="favorites-title" tabIndex={-1}>Favorites</h1>
    {authLoading || loading ? <p role="status">Loading your favorites…</p> : !user ? <>
      <div className="empty-state">
        <h2>Sign in to see your favorites</h2>
        <p>Your saved movies are kept with your account.</p>
        <Link className="button button-primary" to="/account?returnTo=%2Ffavorites">Go to account</Link>
      </div>
    </> : error ? <div className="empty-state">
      <p role="alert">{error}</p>
      <p>Your favorites could not be loaded. Please try again.</p>
      <button className="button button-primary" type="button" onClick={retry}>Retry favorites</button>
    </div> : movies.length === 0 ? <div className="empty-state">
      <h2>No favorites yet</h2>
      <p>Save a movie from its details page to start your collection.</p>
      <Link className="button button-primary" to="/">Browse movies</Link>
    </div> : <>
      <div className="section-heading">
        <h2>Saved movies</h2>
        <span className="result-count">{movies.length} {movies.length === 1 ? 'movie' : 'movies'}</span>
      </div>
      <div className="movie-grid">
        {movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
      </div>
    </>}
  </section>;
}
