import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import App from './App';
import { getMovie, searchMovies } from './services/movies';
import {
  featuredMovieFixtures,
  inceptionMovie,
  interstellarMovie,
} from './test/movieFixtures';

vi.mock('./services/movies', () => ({
  getMovie: vi.fn(),
  searchMovies: vi.fn(),
}));

beforeEach(() => {
  vi.mocked(getMovie).mockImplementation(async (id) => ({
    movie: featuredMovieFixtures.find((movie) => movie.id === id) ?? null,
  }));

  vi.mocked(searchMovies).mockImplementation(async (q) => {
    const term = q.trim().toLowerCase();
    const found = featuredMovieFixtures.filter((movie) =>
      movie.title.toLowerCase().includes(term),
    );
    return { movies: found, total: found.length };
  });
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

function HistoryControls() {
  const navigate = useNavigate();

  return (
    <>
      <button onClick={() => navigate(-1)}>History back</button>
      <button onClick={() => navigate(1)}>History forward</button>
    </>
  );
}

function open(path = '/') {
  return render(
    <MemoryRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      initialEntries={[path]}
    >
      <App />
      <HistoryControls />
    </MemoryRouter>,
  );
}

it('moves focus to the destination heading after navigating into a lazy route', async () => {
  const user = userEvent.setup();
  open('/');
  await user.click(screen.getByRole('link', { name: 'Movie picker' }));
  const heading = await screen.findByRole('heading', { level: 1, name: 'Help me pick a movie' });
  await waitFor(() => expect(document.activeElement).toBe(heading));
});

it('opens details and returns to the submitted search, including browser history', async () => {
  const user = userEvent.setup();

  open('/?q=Inception');

  expect(await screen.findAllByRole('article')).toHaveLength(1);

  await user.click(screen.getByRole('link', { name: 'View Inception' }));

  expect(
    await screen.findByRole('heading', { level: 1, name: 'Inception' }),
  ).toBeTruthy();

  expect(screen.getByText('2010')).toBeTruthy();

  await user.click(screen.getByRole('button', { name: 'History back' }));

  expect(
    (screen.getByRole('searchbox') as HTMLInputElement).value,
  ).toBe('Inception');

  await user.click(screen.getByRole('button', { name: 'History forward' }));

  expect(
    await screen.findByRole('heading', { level: 1, name: 'Inception' }),
  ).toBeTruthy();

  await user.click(
    screen.getByRole('link', { name: 'Back to search results' }),
  );

  expect(await screen.findAllByRole('article')).toHaveLength(1);
});

it('opens an IMDb detail URL directly and supplies a home link', async () => {
  vi.mocked(getMovie).mockResolvedValueOnce({ movie: interstellarMovie });

  open('/movies/tt0816692');

  expect(
    await screen.findByRole('heading', { level: 1, name: 'Interstellar' }),
  ).toBeTruthy();

  expect(
    screen.getByRole('link', { name: 'Back to movies' }).getAttribute('href'),
  ).toBe('/');

  expect(
    screen.getByRole('link', { name: 'Movies' }).getAttribute('href'),
  ).toBe('/movies');

  expect(document.title).toBe('Interstellar | Reel Good');
});

it('opens the browse collection at the Movies navigation route', async () => {
  open('/movies');

  expect(
    screen.getByRole('heading', { name: 'Discover movies' }),
  ).toBeTruthy();

  expect(await screen.findAllByRole('article')).toHaveLength(24);
});

it.each([
  ['/movies/missing', 'Movie not found'],
  ['/missing', 'Page not found'],
])('handles %s', async (path, heading) => {
  const user = userEvent.setup();

  open(path);

  expect(
    await screen.findByRole('heading', { name: heading }),
  ).toBeTruthy();

  await user.click(screen.getByRole('link', { name: 'Browse movies' }));

  expect(await screen.findAllByRole('article')).toHaveLength(24);
});

it('keeps the empty-state message tied to the submitted query', async () => {
  const user = userEvent.setup();

  vi.mocked(searchMovies).mockResolvedValueOnce({
    movies: [],
    total: 0,
  });

  open('/?q=zzzz');

  expect(
    await screen.findByRole('heading', { name: 'No movies found' }),
  ).toBeTruthy();

  await user.clear(screen.getByRole('searchbox'));
  await user.type(screen.getByRole('searchbox'), 'Inception');

  expect(screen.getByText(/matching “zzzz”/)).toBeTruthy();
  expect(screen.queryAllByRole('article')).toHaveLength(0);
});
