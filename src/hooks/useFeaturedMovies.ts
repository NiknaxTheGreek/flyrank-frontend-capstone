import { useEffect, useState } from 'react';
import { featuredMovieIds } from '../data/movies';
import { getMovie } from '../services/movies';
import type { Movie } from '../types/movie';

export function useFeaturedMovies(enabled = true) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!enabled) {
      setMovies([]);
      setLoading(false);
      setError('');
      return;
    }

    const controller = new AbortController();

    async function loadMovies() {
      try {
        setLoading(true);
        setError('');

        const loaded: Movie[] = [];

        // Six bounded requests halve the metadata round trips before posters can render.
        for (let index = 0; index < featuredMovieIds.length; index += 6) {
          const batch = featuredMovieIds.slice(index, index + 6);

          const results = await Promise.all(
            batch.map(async (id) => {
              const { movie } = await getMovie(id, controller.signal);
              return movie;
            }),
          );

          loaded.push(...results.filter((movie): movie is Movie => movie !== null));
        }

        if (!controller.signal.aborted) {
          setMovies(loaded);
        }
      } catch (cause) {
        if (!controller.signal.aborted) {
          setError(
            cause instanceof Error
              ? cause.message
              : 'Could not load featured movies.',
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadMovies();

    return () => controller.abort();
  }, [enabled]);

  return { movies, loading, error };
}
