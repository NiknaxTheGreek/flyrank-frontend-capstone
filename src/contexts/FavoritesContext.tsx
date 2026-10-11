import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Movie } from '../types/movie';
import { deleteFavorite, observeFavorites, saveFavorite } from '../services/favorites';
import { useAuth } from './AuthContext';

type FavoritesContextValue = {
  movies: Movie[];
  loading: boolean;
  error: string;
  retry: () => void;
  isFavorite: (movieId: string) => boolean;
  toggleFavorite: (movie: Movie) => Promise<void>;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (authLoading) {
      setLoading(true);
      return;
    }
    if (!user) {
      setMovies([]);
      setError('');
      setLoading(false);
      return;
    }

    setMovies([]);
    setLoading(true);
    setError('');
    return observeFavorites(
      user.uid,
      (nextMovies) => {
        setMovies(nextMovies);
        setError('');
        setLoading(false);
      },
      (favoritesError) => {
        setError(favoritesError.message || 'Could not load your favorites.');
        setLoading(false);
      },
    );
  }, [user, authLoading, retryCount]);

  const toggleFavorite = useCallback(async (movie: Movie) => {
    if (!user) throw new Error('Sign in to save favorites.');
    setError('');
    try {
      if (movies.some((favorite) => favorite.id === movie.id)) {
        await deleteFavorite(user.uid, movie.id);
      } else {
        await saveFavorite(user.uid, movie);
      }
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : 'Could not update this favorite.';
      setError(message);
      throw cause;
    }
  }, [movies, user]);

  const value = useMemo(() => ({
    movies,
    loading,
    error,
    retry: () => setRetryCount((count) => count + 1),
    isFavorite: (movieId: string) => movies.some((movie) => movie.id === movieId),
    toggleFavorite,
  }), [movies, loading, error, toggleFavorite]);

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error('useFavorites must be used within a FavoritesProvider.');
  return context;
}
