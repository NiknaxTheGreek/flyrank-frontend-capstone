import { z } from 'zod';

export const lookupMovie = {
  name: 'lookupMovie',
  description: 'Look up factual details for one movie by its title.',
  inputSchema: z.object({
    title: z.string().trim().min(2).max(100).describe('The movie title'),
  }),

  async execute(input, {
    getKey = () => process.env.OMDB_API_KEY,
    fetcher = fetch,
    signal,
  } = {}) {
    const { title } = lookupMovie.inputSchema.parse(input);
    const key = getKey();
    const unavailable = 'Movie lookup is unavailable. Try again shortly.';
    if (!key) throw new Error(unavailable);

    const url = new URL('https://www.omdbapi.com/');
    url.search = new URLSearchParams({ apikey: key, t: title, type: 'movie' });
    const timeout = AbortSignal.timeout(8000);

    let movie;
    try {
      const response = await fetcher(url, {
        signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
        redirect: 'error',
      });
      if (!response.ok) throw new Error();
      movie = await response.json();
    } catch {
      throw new Error(unavailable);
    }

    if (movie?.Response === 'False' && movie.Error === 'Movie not found!') {
      throw new Error('No matching movie. Check the title and try again.');
    }

    const clean = value =>
      typeof value === 'string' && value.trim() !== 'N/A' ? value.trim() : '';
    if (movie?.Response !== 'True' ||
        !/^tt\d{7,10}$/.test(clean(movie.imdbID)) || !clean(movie.Title)) {
      throw new Error(unavailable);
    }

    const rawRating = clean(movie.imdbRating);
    const rating = rawRating ? Number(rawRating) : NaN;
    return {
      title: clean(movie.Title),
      year: clean(movie.Year),
      genre: clean(movie.Genre),
      runtime: clean(movie.Runtime),
      rating: Number.isFinite(rating) && rating >= 0 && rating <= 10 ? rating : null,
      plot: clean(movie.Plot),
      imdbId: clean(movie.imdbID),
    };
  },
};
