import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
} from 'firebase/firestore';
import type { Movie } from '../types/movie';
import { getFirebaseFirestore } from './firebase';

function isMovie(value: unknown): value is Movie {
  if (typeof value !== 'object' || value === null) return false;
  const movie = value as Record<string, unknown>;

  return typeof movie.id === 'string'
    && typeof movie.title === 'string'
    && (typeof movie.year === 'string' || typeof movie.year === 'number')
    && typeof movie.genre === 'string'
    && (movie.rating === null || typeof movie.rating === 'number')
    && typeof movie.posterUrl === 'string'
    && ['imdbId', 'plot', 'director', 'runtime'].every(
      (field) => movie[field] === undefined || typeof movie[field] === 'string',
    );
}

export function observeFavorites(
  userId: string,
  onMovies: (movies: Movie[]) => void,
  onError: (error: Error) => void,
) {
  const favorites = collection(getFirebaseFirestore(), 'users', userId, 'favorites');
  return onSnapshot(favorites, (snapshot) => {
    try {
      const movies = snapshot.docs.map((favorite) => {
        const movie: unknown = favorite.data();
        if (!isMovie(movie) || movie.id !== favorite.id) {
          throw new Error('A saved favorite has invalid movie data.');
        }
        return movie;
      });
      onMovies(movies);
    } catch (cause) {
      onError(cause instanceof Error ? cause : new Error('Could not read saved favorites.'));
    }
  }, onError);
}

function favoriteReference(userId: string, movieId: string) {
  if (!/^[A-Za-z0-9_-]{1,100}$/.test(movieId)) {
    throw new Error('This movie cannot be saved as a favorite.');
  }

  return doc(getFirebaseFirestore(), 'users', userId, 'favorites', movieId);
}

export async function saveFavorite(userId: string, movie: Movie) {
  await setDoc(favoriteReference(userId, movie.id), movie);
}

export async function deleteFavorite(userId: string, movieId: string) {
  await deleteDoc(favoriteReference(userId, movieId));
}
