import { act, cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { User } from 'firebase/auth';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import type { Movie } from './types/movie';

const mocks = vi.hoisted(() => ({
  observeAuth: vi.fn(),
  registerWithEmail: vi.fn(),
  loginWithEmail: vi.fn(),
  loginWithGoogle: vi.fn(),
  logout: vi.fn(),
  observeFavorites: vi.fn(),
  saveFavorite: vi.fn(),
  deleteFavorite: vi.fn(),
}));

vi.mock('./services/auth', () => ({
  firebaseConfigured: true,
  observeAuth: mocks.observeAuth,
  registerWithEmail: mocks.registerWithEmail,
  loginWithEmail: mocks.loginWithEmail,
  loginWithGoogle: mocks.loginWithGoogle,
  logout: mocks.logout,
}));

vi.mock('./services/favorites', () => ({
  observeFavorites: mocks.observeFavorites,
  saveFavorite: mocks.saveFavorite,
  deleteFavorite: mocks.deleteFavorite,
}));

vi.mock('./services/movies', () => ({
  searchMovies: vi.fn(async () => ({ movies: [], total: 0 })),
  getMovie: vi.fn(async () => ({ movie })),
}));

const movie: Movie = {
  id: 'inception',
  title: 'Inception',
  year: 2010,
  genre: 'Sci-Fi',
  rating: 8.8,
  posterUrl: 'https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg',
  imdbId: 'tt1375666',
  plot: 'A skilled thief enters layered dreams for one final job that could give him a chance to return home.',
};
const signedInUser = { uid: 'test-user', email: 'viewer@example.test' } as User;
let authListener: ((user: User | null) => void) | undefined;
let favoritesListener: ((movies: Movie[]) => void) | undefined;

function renderApp(path: string) {
  return render(
    <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }} initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  authListener = undefined;
  favoritesListener = undefined;
  mocks.observeAuth.mockImplementation((onUser: (user: User | null) => void) => {
    authListener = onUser;
    onUser(null);
    return vi.fn();
  });
  mocks.observeFavorites.mockImplementation((
    _userId: string,
    onMovies: (movies: Movie[]) => void,
  ) => {
    favoritesListener = onMovies;
    onMovies([]);
    return vi.fn();
  });
  mocks.saveFavorite.mockImplementation(async (_userId: string, savedMovie: Movie) => {
    favoritesListener?.([savedMovie]);
  });
  mocks.deleteFavorite.mockImplementation(async () => {
    favoritesListener?.([]);
  });
});

afterEach(cleanup);

it('registers an email account using the auth service', async () => {
  const user = userEvent.setup();
  renderApp('/account');

  await user.click(screen.getByRole('button', { name: 'Create an account' }));
  await user.type(screen.getByLabelText('Email'), 'viewer@example.test');
  await user.type(screen.getByLabelText('Password'), 'secure-password');
  await user.click(screen.getByRole('button', { name: 'Create account' }));

  expect(mocks.registerWithEmail).toHaveBeenCalledWith('viewer@example.test', 'secure-password');
});

it('saves and removes the current movie through the favorites service', async () => {
  const user = userEvent.setup();
  renderApp('/movies/inception');
  act(() => authListener?.(signedInUser));
  await screen.findByRole('heading', { name: 'Inception' });

  await user.click(screen.getByRole('button', { name: 'Add to favorites' }));
  expect(mocks.saveFavorite).toHaveBeenCalledWith(signedInUser.uid, movie);
  expect(await screen.findByRole('button', { name: 'Remove from favorites' })).toBeTruthy();

  await user.click(screen.getByRole('button', { name: 'Remove from favorites' }));
  expect(mocks.deleteFavorite).toHaveBeenCalledWith(signedInUser.uid, movie.id);
  expect(await screen.findByRole('button', { name: 'Add to favorites' })).toBeTruthy();
});

it('shows a signed-out prompt and a clear empty state on the favorites route', async () => {
  renderApp('/favorites');
  expect(await screen.findByRole('heading', { name: 'Sign in to see your favorites' })).toBeTruthy();

  act(() => authListener?.(signedInUser));
  expect(await screen.findByRole('heading', { name: 'No favorites yet' })).toBeTruthy();
});

it('surfaces favorite persistence failures', async () => {
  const user = userEvent.setup();
  mocks.saveFavorite.mockRejectedValueOnce(new Error('Permission denied.'));
  renderApp('/movies/inception');
  act(() => authListener?.(signedInUser));
  await screen.findByRole('heading', { name: 'Inception' });

  await user.click(screen.getByRole('button', { name: 'Add to favorites' }));
  expect((await screen.findByRole('alert')).textContent).toContain('Permission denied.');
});
