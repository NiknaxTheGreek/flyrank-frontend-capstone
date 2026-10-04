import { onValue, ref, remove, set } from 'firebase/database';
import type { Movie } from '../types/movie';
import { getFirebaseDatabase } from './firebase';

const imdbIdPattern = /^tt\d{7,10}$/;

function databaseError(cause: unknown) {
  const code = typeof cause === 'object' && cause !== null && 'code' in cause
    ? String(cause.code)
    : '';
  if (code === 'PERMISSION_DENIED') return new Error('Firebase denied access to these favorites. Check the Realtime Database rules.');
  if (code === 'NETWORK_ERROR') return new Error('Could not reach Firebase. Check your connection and try again.');
  return cause instanceof Error ? cause : new Error('Could not update your favorites.');
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isMovie(value: unknown): value is Movie {
  if (!isRecord(value)) return false;
  const yearValid = (typeof value.year === 'string' && value.year.length <= 20)
    || (typeof value.year === 'number' && Number.isFinite(value.year));
  const ratingValid = value.rating === undefined || value.rating === null
    || (typeof value.rating === 'number' && Number.isFinite(value.rating) && value.rating >= 0 && value.rating <= 10);
  const allowedKeys = new Set(['id', 'title', 'year', 'genre', 'rating', 'posterUrl', 'imdbId', 'plot', 'director', 'runtime']);
  const optionalTextIsValid = (field: string, maximumLength: number) => {
    const text = value[field];
    return text === undefined || (typeof text === 'string' && text.length <= maximumLength);
  };

  return Object.keys(value).every((key) => allowedKeys.has(key))
    && typeof value.id === 'string'
    && imdbIdPattern.test(value.id)
    && value.imdbId === value.id
    && typeof value.title === 'string'
    && value.title.length > 0
    && value.title.length <= 200
    && yearValid
    && typeof value.genre === 'string'
    && value.genre.length <= 300
    && ratingValid
    && typeof value.posterUrl === 'string'
    && (value.posterUrl === '' || /^https:\/\/\S+$/.test(value.posterUrl))
    && optionalTextIsValid('imdbId', 12)
    && optionalTextIsValid('plot', 2000)
    && optionalTextIsValid('director', 200)
    && optionalTextIsValid('runtime', 50);
}

export function observeFavorites(
  userId: string,
  onMovies: (movies: Movie[]) => void,
  onError: (error: Error) => void,
) {
  return onValue(ref(getFirebaseDatabase(), `users/${userId}/favorites`), (snapshot) => {
    try {
      const saved = snapshot.val();
      if (saved === null) {
        onMovies([]);
        return;
      }
      if (!isRecord(saved)) throw new Error('Saved favorites have an invalid format.');
      const records = Object.entries(saved).map(([key, value]) => {
        if (!imdbIdPattern.test(key) || !isMovie(value) || value.id !== key) {
          throw new Error('A saved favorite has invalid movie data.');
        }
        return { ...value, rating: value.rating ?? null };
      });
      onMovies(records);
    } catch (cause) {
      onError(cause instanceof Error ? cause : new Error('Could not read saved favorites.'));
    }
  }, (cause) => onError(databaseError(cause)));
}

function favoritePath(userId: string, movieId: string) {
  if (!userId || !imdbIdPattern.test(movieId)) {
    throw new Error('This movie does not have a verified IMDb ID and cannot be saved.');
  }
  return `users/${userId}/favorites/${movieId}`;
}

export async function saveFavorite(userId: string, movie: Movie) {
  const id = movie.imdbId && imdbIdPattern.test(movie.imdbId)
    ? movie.imdbId
    : imdbIdPattern.test(movie.id) ? movie.id : '';
  const favorite = { ...movie, id, imdbId: id };
  if (!id || !isMovie(favorite)) {
    throw new Error('This movie has incomplete details and cannot be saved as a favorite.');
  }
  try {
    await set(ref(getFirebaseDatabase(), favoritePath(userId, id)), favorite);
  } catch (cause) {
    throw databaseError(cause);
  }
}

export async function deleteFavorite(userId: string, movieId: string) {
  try {
    await remove(ref(getFirebaseDatabase(), favoritePath(userId, movieId)));
  } catch (cause) {
    throw databaseError(cause);
  }
}
