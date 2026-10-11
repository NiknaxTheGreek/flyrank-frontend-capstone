import { act, cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { User } from 'firebase/auth';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { featuredMovieFixtures, inceptionMovie } from './test/movieFixtures';
import { getMovie } from './services/movies';
import type { Movie } from './types/movie';

const mocks = vi.hoisted(() => ({
  observeAuth: vi.fn(),
  registerWithEmail: vi.fn(),
  loginWithEmail: vi.fn(),
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
  logout: mocks.logout,
}));

vi.mock('./services/favorites', () => ({
  observeFavorites: mocks.observeFavorites,
  saveFavorite: mocks.saveFavorite,
  deleteFavorite: mocks.deleteFavorite,
}));

vi.mock('./services/movies', () => ({
  searchMovies: vi.fn(async () => ({ movies: [], total: 0 })),
  getMovie: vi.fn(),
}));

const signedInUser = { uid: 'viewer-a', email: 'viewer@example.test' } as User;
let authListener: ((user: User | null) => void) | undefined;
let favoriteListeners: Map<string, (favoriteMovies: Movie[]) => void>;
let savedByUser: Map<string, Movie[]>;

function renderApp(path: string) {
  return render(
    <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }} initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
}

function resolveAuth(user: User | null) {
  act(() => authListener?.(user));
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(getMovie).mockImplementation(async (id) => ({
    movie: featuredMovieFixtures.find((movie) => movie.id === id) ?? null,
  }));
  authListener = undefined;
  favoriteListeners = new Map();
  savedByUser = new Map();
  mocks.observeAuth.mockImplementation((onUser: (user: User | null) => void) => {
    authListener = onUser;
    return vi.fn();
  });
  mocks.observeFavorites.mockImplementation((
    userId: string,
    onMovies: (favoriteMovies: Movie[]) => void,
  ) => {
    favoriteListeners.set(userId, onMovies);
    onMovies(savedByUser.get(userId) ?? []);
    return () => favoriteListeners.delete(userId);
  });
  mocks.saveFavorite.mockImplementation(async (userId: string, movie: Movie) => {
    const id = movie.imdbId ?? movie.id;
    const saved = { ...movie, id, imdbId: id };
    savedByUser.set(userId, [...(savedByUser.get(userId) ?? []).filter((item) => item.id !== id), saved]);
    favoriteListeners.get(userId)?.(savedByUser.get(userId)!);
  });
  mocks.deleteFavorite.mockImplementation(async (userId: string, movieId: string) => {
    const remaining = (savedByUser.get(userId) ?? []).filter((movie) => movie.id !== movieId);
    savedByUser.set(userId, remaining);
    favoriteListeners.get(userId)?.(remaining);
  });
});

afterEach(cleanup);

it('waits for auth initialization and returns to the requested favorites page after sign-in', async () => {
  const user = userEvent.setup();
  renderApp('/favorites?sort=recent');

  expect(screen.getByRole('status').textContent).toContain('Checking your sign-in status');
  expect(screen.queryByLabelText('Email')).toBeNull();

  resolveAuth(null);
  await screen.findByLabelText('Email');
  mocks.loginWithEmail.mockImplementation(async () => resolveAuth(signedInUser));
  await user.type(screen.getByLabelText('Email'), 'viewer@example.test');
  await user.type(screen.getByLabelText('Password'), 'correct-horse');
  await user.click(screen.getByRole('button', { name: 'Sign in' }));

  expect(await screen.findByRole('heading', { name: 'No favorites yet' })).toBeTruthy();
  expect(mocks.loginWithEmail).toHaveBeenCalledWith('viewer@example.test', 'correct-horse');
  expect(mocks.observeFavorites).toHaveBeenCalledWith('viewer-a', expect.any(Function), expect.any(Function));
});

it('supports account creation and displays useful authentication failures', async () => {
  const user = userEvent.setup();
  renderApp('/account');
  resolveAuth(null);
  await user.click(await screen.findByRole('button', { name: 'Create an account' }));
  mocks.registerWithEmail.mockRejectedValueOnce(new Error('An account already exists for this email address.'));
  await user.type(screen.getByLabelText('Email'), 'viewer@example.test');
  await user.type(screen.getByLabelText('Password'), 'secure-password');
  await user.click(screen.getByRole('button', { name: 'Create account' }));

  expect(await screen.findByRole('alert')).toHaveProperty('textContent', 'An account already exists for this email address.');
  expect(mocks.registerWithEmail).toHaveBeenCalledWith('viewer@example.test', 'secure-password');
});

it('saves and removes favorites with pending and success feedback and stable IMDb keys', async () => {
  const user = userEvent.setup();
  renderApp('/');
  resolveAuth(signedInUser);
  const inceptionCard = (await screen.findByRole('heading', { name: 'Inception' })).closest('article')!;
  const addButton = within(inceptionCard).getByRole('button', { name: 'Add to favorites' });
  let finishSave!: () => void;
  mocks.saveFavorite.mockImplementationOnce(() => new Promise<void>((resolve) => { finishSave = resolve; }));

  await user.click(addButton);
  const pendingButton = within(inceptionCard).getByRole('button', { name: 'Saving favorite…' });
  expect(pendingButton.hasAttribute('disabled')).toBe(true);
  await user.click(pendingButton);
  expect(mocks.saveFavorite).toHaveBeenCalledTimes(1);
  finishSave();
  expect(await within(inceptionCard).findByRole('status')).toBeTruthy();
  expect(mocks.saveFavorite).toHaveBeenCalledWith('viewer-a', expect.objectContaining({ id: 'tt1375666', imdbId: 'tt1375666' }));

  mocks.saveFavorite.mockImplementation(async (userId: string, movie: Movie) => {
    const saved = { ...movie, id: movie.imdbId! };
    savedByUser.set(userId, [saved]);
    favoriteListeners.get(userId)?.([saved]);
  });
  await user.click(within(inceptionCard).getByRole('button', { name: 'Add to favorites' }));
  const removeButton = await within(inceptionCard).findByRole('button', { name: 'Remove from favorites' });
  await user.click(removeButton);

  expect(mocks.deleteFavorite).toHaveBeenCalledWith('viewer-a', 'tt1375666');
  expect(await within(inceptionCard).findByRole('button', { name: 'Add to favorites' })).toBeTruthy();
});

it('reports a failed favorite write and clears another user’s saved state', async () => {
  const user = userEvent.setup();
  renderApp('/');
  resolveAuth(signedInUser);
  const shawshankCard = (await screen.findByRole('heading', { name: 'The Shawshank Redemption' })).closest('article')!;
  mocks.saveFavorite.mockRejectedValueOnce(new Error('Firebase denied this write.'));
  await user.click(within(shawshankCard).getByRole('button', { name: 'Add to favorites' }));
  expect((await within(shawshankCard).findByRole('alert')).textContent).toContain('Firebase denied this write.');

  savedByUser.set('viewer-b', []);
  resolveAuth({ uid: 'viewer-b', email: 'second@example.test' } as User);
  const secondInceptionCard = (await screen.findByRole('heading', { name: 'Inception' })).closest('article')!;
  expect(await within(secondInceptionCard).findByRole('button', { name: 'Add to favorites' })).toBeTruthy();
  expect(screen.queryByRole('button', { name: 'Remove from favorites' })).toBeNull();
});

it('renders only favorites belonging to the signed-in uid and restores them after reauthentication', async () => {
  const favorite = { ...inceptionMovie, id: 'tt1375666', imdbId: 'tt1375666' };
  savedByUser.set('viewer-a', [favorite]);
  const { unmount } = renderApp('/favorites');
  resolveAuth(signedInUser);

  expect(await screen.findByRole('heading', { name: 'Saved movies' })).toBeTruthy();
  expect(screen.getByRole('heading', { name: 'Inception' })).toBeTruthy();
  unmount();

  renderApp('/favorites');
  resolveAuth({ uid: 'viewer-b', email: 'second@example.test' } as User);
  expect(await screen.findByRole('heading', { name: 'No favorites yet' })).toBeTruthy();
  resolveAuth(signedInUser);
  expect(await screen.findByRole('heading', { name: 'Saved movies' })).toBeTruthy();
});

it('signs out and removes the previous account state from the UI', async () => {
  const user = userEvent.setup();
  renderApp('/account');
  resolveAuth(signedInUser);
  expect(await screen.findByText(/Signed in as viewer@example.test/)).toBeTruthy();
  mocks.logout.mockImplementation(async () => resolveAuth(null));
  await user.click(screen.getByRole('button', { name: 'Sign out' }));

  expect(await screen.findByLabelText('Email')).toBeTruthy();
  expect(mocks.logout).toHaveBeenCalledOnce();
});
