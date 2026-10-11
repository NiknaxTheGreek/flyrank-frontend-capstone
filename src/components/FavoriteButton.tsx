import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { Movie } from '../types/movie';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../contexts/FavoritesContext';

export default function FavoriteButton({ movie }: { movie: Movie }) {
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const location = useLocation();
  const [error, setError] = useState('');

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

  const saved = isFavorite(movie.id);
  async function handleClick() {
    setError('');
    try {
      await toggleFavorite(movie);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not update this favorite.');
    }
  }

  return <div className="favorite-action">
    <button
      className={`button ${saved ? 'button-secondary' : 'button-primary'} favorite-button`}
      type="button"
      aria-pressed={saved}
      onClick={handleClick}
    >
      {saved ? 'Remove from favorites' : 'Add to favorites'}
    </button>
    {error && <p role="alert" className="favorite-error">{error}</p>}
  </div>;
}
