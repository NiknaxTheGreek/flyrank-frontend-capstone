import { useEffect, useState } from 'react';
import { getMovie } from '../services/movies';
import type { Movie } from '../types/movie';

export function useMovieDetails(id = '') {
  const [attempt, setAttempt] = useState(0);
  const key = `${id}|${attempt}`;
  const [result, setResult] = useState<{
    key: string;
    movie: Movie | null;
    error: string;
  } | null>(null);

  const live = /^tt\d{7,10}$/.test(id);

  useEffect(() => {
    if (!live) return;

    const controller = new AbortController();

    getMovie(id, controller.signal)
      .then(({ movie }) => {
        if (!controller.signal.aborted) {
          setResult({ key, movie, error: '' });
        }
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setResult({
            key,
            movie: null,
            error:
              error instanceof Error
                ? error.message
                : 'Movie request failed.',
          });
        }
      });

    return () => controller.abort();
  }, [id, live, key]);

  const current = result?.key === key ? result : null;

  return {
    movie: live ? current?.movie ?? null : null,
    loading: live && !current,
    error: live ? current?.error ?? '' : '',
    live,
    retry: () => setAttempt((value) => value + 1),
  };
}

