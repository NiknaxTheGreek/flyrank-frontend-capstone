import { featuredMovieIds } from '../data/movies';
import type { Movie } from '../types/movie';

const knownMovies: Record<string, Movie> = {
  tt0111161: {
    id: 'tt0111161',
    imdbId: 'tt0111161',
    title: 'The Shawshank Redemption',
    year: '1994',
    genre: 'Drama',
    rating: 9.3,
    posterUrl: 'https://example.test/shawshank.jpg',
    plot: 'Two imprisoned men form a lasting friendship through years of hardship.',
  },
  tt1375666: {
    id: 'tt1375666',
    imdbId: 'tt1375666',
    title: 'Inception',
    year: '2010',
    genre: 'Sci-Fi',
    rating: 8.8,
    posterUrl: 'https://example.test/inception.jpg',
    plot: 'A skilled thief enters dreams to plant an idea in a target’s mind.',
  },
  tt0816692: {
    id: 'tt0816692',
    imdbId: 'tt0816692',
    title: 'Interstellar',
    year: '2014',
    genre: 'Sci-Fi',
    rating: 8.7,
    posterUrl: 'https://example.test/interstellar.jpg',
    plot: 'Explorers travel through a wormhole searching for a future for humanity.',
  },
};

export const featuredMovieFixtures: Movie[] = featuredMovieIds.map((id, index) =>
  knownMovies[id] ?? {
    id,
    imdbId: id,
    title: `Featured Movie ${index + 1}`,
    year: String(2000 + (index % 20)),
    genre: index % 3 === 0 ? 'Drama' : index % 3 === 1 ? 'Action' : 'Sci-Fi',
    rating: 8,
    posterUrl: `https://example.test/${id}.jpg`,
    plot: `A verified test plot for featured movie ${index + 1}.`,
  },
);

export const inceptionMovie = knownMovies.tt1375666;
export const shawshankMovie = knownMovies.tt0111161;
export const interstellarMovie = knownMovies.tt0816692;

