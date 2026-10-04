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

type FavoritesState = {
  userId: string | null;
  movies: Movie[];
  loading: boolean;
  error: string;
};

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
  const [state, setState] = useState<FavoritesState>({
    userId: null,
    movies: [],
    loading: true,
    error: '',
  });
  const [retryCount, setRetryCount] = useState(0);
  const userId = user?.uid ?? null;

  useEffect(() => {
    if (authLoading) return;
    if (!userId) {
      setState({ userId: null, movies: [], loading: false, error: '' });
      return;
    }

    let active = true;
    setState({ userId, movies: [], loading: true, error: '' });
    try {
      const unsubscribe = observeFavorites(
        userId,
        (movies) => {
          if (active) setState({ userId, movies, loading: false, error: '' });
        },
        (cause) => {
          if (active) setState({ userId, movies: [], loading: false, error: cause.message });
        },
      );
      return () => {
        active = false;
        unsubscribe();
      };
    } catch (cause) {
      setState({
        userId,
        movies: [],
        loading: false,
        error: cause instanceof Error ? cause.message : 'Could not load your favorites.',
      });
      return undefined;
    }
  }, [authLoading, userId, retryCount]);

  const movies = userId && state.userId === userId ? state.movies : [];
  const loading = authLoading || (!!userId && (state.userId !== userId || state.loading));
  const error = userId && state.userId === userId ? state.error : '';

  const toggleFavorite = useCallback(async (movie: Movie) => {
    if (!userId) throw new Error('Sign in to save favorites.');
    const movieId = movie.imdbId ?? movie.id;
    if (movies.some((favorite) => favorite.id === movieId)) {
      await deleteFavorite(userId, movieId);
    } else {
      await saveFavorite(userId, movie);
    }
  }, [movies, userId]);

  const retry = useCallback(() => setRetryCount((count) => count + 1), []);
  const isFavorite = useCallback((movieId: string) => movies.some((movie) => movie.id === movieId), [movies]);

  const value = useMemo(() => ({
    movies,
    loading,
    error,
    retry,
    isFavorite,
    toggleFavorite,
  }), [movies, loading, error, retry, isFavorite, toggleFavorite]);

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error('useFavorites must be used within a FavoritesProvider.');
  return context;
}
