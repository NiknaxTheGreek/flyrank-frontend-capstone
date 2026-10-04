import { afterEach, expect, it, vi } from 'vitest';
import { movies } from '../data/movies';
import { deleteFavorite, observeFavorites, saveFavorite } from './favorites';

const mocks = vi.hoisted(() => ({
  ref: vi.fn((_database: unknown, path: string) => ({ path })),
  set: vi.fn(),
  remove: vi.fn(),
  onValue: vi.fn(),
}));

vi.mock('firebase/database', () => mocks);
vi.mock('./firebase', () => ({ getFirebaseDatabase: () => ({}) }));

afterEach(() => vi.clearAllMocks());

it('stores initial and live movies under their canonical verified IMDb IDs', async () => {
  await saveFavorite('viewer-a', movies[2]);

  expect(mocks.ref).toHaveBeenCalledWith({}, 'users/viewer-a/favorites/tt1375666');
  expect(mocks.set).toHaveBeenCalledWith(
    { path: 'users/viewer-a/favorites/tt1375666' },
    expect.objectContaining({ id: 'tt1375666', imdbId: 'tt1375666', title: 'Inception' }),
  );
});

it('deletes favorites using the uid-scoped IMDb key and rejects invalid movie identifiers', async () => {
  await deleteFavorite('viewer-a', 'tt1375666');
  expect(mocks.remove).toHaveBeenCalledWith({ path: 'users/viewer-a/favorites/tt1375666' });
  await expect(deleteFavorite('viewer-a', 'not-an-imdb-id')).rejects.toThrow('verified IMDb ID');
});

it('validates database records before exposing favorites to the UI', () => {
  let receive!: (snapshot: { val: () => unknown }) => void;
  mocks.onValue.mockImplementation((_reference, callback) => {
    receive = callback;
    return vi.fn();
  });
  const onMovies = vi.fn();
  const onError = vi.fn();
  observeFavorites('viewer-a', onMovies, onError);

  receive({ val: () => ({ tt1375666: { ...movies[2], id: 'wrong-id', imdbId: 'tt1375666' } }) });

  expect(onMovies).not.toHaveBeenCalled();
  expect(onError).toHaveBeenCalledWith(expect.objectContaining({ message: 'A saved favorite has invalid movie data.' }));
});
