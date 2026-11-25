import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { Movie } from '../types/movie';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../contexts/FavoritesContext';

export default function FavoriteButton({ movie }: { movie: Movie }) {
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const location = useLocation();
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const movieId = movie.imdbId && /^tt\d{7,10}$/.test(movie.imdbId)
    ? movie.imdbId
    : /^tt\d{7,10}$/.test(movie.id) ? movie.id : '';

  if (!movieId) return <p className="favorite-error">This movie has no verified IMDb ID and cannot be saved.</p>;
  if (!user) {
    const returnTo = `${location.pathname}${location.search}`;
    return <Link
      className="button button-secondary favorite-button"
      to={`/account?returnTo=${encodeURIComponent(returnTo)}`}
      aria-label={`Sign in to save ${movie.title}`}
    >
      Sign in to save
    </Link>;
  }

  const saved = isFavorite(movieId);
  async function handleClick() {
    setError('');
    setMessage('');
    setPending(true);
    try {
      await toggleFavorite(movie);
      setMessage(saved ? `${movie.title} removed from favorites.` : `${movie.title} saved to favorites.`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not update this favorite.');
    } finally {
      setPending(false);
    }
  }

  return <div className="favorite-action">
    <button
      className={`button ${saved ? 'button-secondary' : 'button-primary'} favorite-button`}
      type="button"
      aria-pressed={saved}
      disabled={pending}
      onClick={handleClick}
    >
      {pending ? (saved ? 'Removing favorite…' : 'Saving favorite…') : saved ? 'Remove from favorites' : 'Add to favorites'}
    </button>
    {message && <p role="status" className="favorite-success">{message}</p>}
    {error && <p role="alert" className="favorite-error">{error}</p>}
  </div>;
}

