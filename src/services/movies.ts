import type { Movie } from '../types/movie';

async function request<T>(params: Record<string, string>, signal: AbortSignal): Promise<T> {
  const response = await fetch(`/api/movies?${new URLSearchParams(params)}`, { signal });
  const body = await response.json();
  if (!response.ok) throw new Error(body.error || 'Movie request failed. Please retry.');
  return body;
}

export const searchMovies = (
  q: string,
  page: number,
  signal: AbortSignal,
) => request<{ movies: Movie[]; total: number }>({ q, page: String(page) }, signal);

export const getMovie = (
  id: string,
  signal: AbortSignal,
) => request<{ movie: Movie | null }>({ id }, signal);

export async function getMovies(
  ids: readonly string[],
  signal: AbortSignal,
): Promise<Movie[]> {
  const results = await Promise.all(
    ids.map(async (id) => {
      const { movie } = await getMovie(id, signal);
      return movie;
    }),
  );

  return results.filter((movie): movie is Movie => movie !== null);
}

