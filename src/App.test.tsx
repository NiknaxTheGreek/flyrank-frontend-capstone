import { MemoryRouter } from 'react-router-dom';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import { featuredMovieFixtures } from './test/movieFixtures';
import { getMovie, searchMovies } from './services/movies';

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

describe('movie browsing home', () => {
  it('loads the 24 featured movies from the movie service', async () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByText('Loading movies from OMDb…')).toBeTruthy();

    expect(await screen.findByRole('heading', { name: 'The Shawshank Redemption' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Inception' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Interstellar' })).toBeTruthy();

    expect(screen.getAllByRole('article')).toHaveLength(24);
    expect(screen.getAllByRole('link', { name: /^IMDb profile for / })).toHaveLength(24);
    expect(document.querySelectorAll('.movie-summary')).toHaveLength(24);
    expect(getMovie).toHaveBeenCalledTimes(24);
  });

  it('filters the featured collection by genre with a labelled control', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <App />
      </MemoryRouter>,
    );

    await screen.findByRole('heading', { name: 'The Shawshank Redemption' });

    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Filter popular picks by genre' }),
      'Sci-Fi',
    );

    expect(screen.getAllByRole('article')).toHaveLength(9);
    expect(screen.getByRole('heading', { name: 'Sci-Fi' })).toBeTruthy();
    expect(screen.queryByRole('heading', { name: 'Drama' })).toBeNull();
  });

  it('searches by title without case or surrounding whitespace sensitivity and clears the search', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <App />
      </MemoryRouter>,
    );

    await screen.findByRole('heading', { name: 'The Shawshank Redemption' });

    const search = screen.getByRole('searchbox', { name: 'Search movies by title' });

    await user.type(search, '  iNcEpTiOn  ');
    await user.click(screen.getByRole('button', { name: 'Search' }));

    expect(await screen.findAllByRole('article')).toHaveLength(1);
    expect(screen.getByRole('heading', { name: 'Inception' })).toBeTruthy();

    await user.click(screen.getByRole('button', { name: 'Clear search' }));

    expect((search as HTMLInputElement).value).toBe('');
    expect(await screen.findAllByRole('article')).toHaveLength(24);
    expect(screen.getByRole('heading', { name: 'Popular picks' })).toBeTruthy();
  });

  it('shows an informative empty state for a search with no matches', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <App />
      </MemoryRouter>,
    );

    await screen.findByRole('heading', { name: 'The Shawshank Redemption' });

    await user.type(
      screen.getByRole('searchbox', { name: 'Search movies by title' }),
      'not a movie',
    );
    await user.click(screen.getByRole('button', { name: 'Search' }));

    expect(screen.queryAllByRole('article')).toHaveLength(0);
    expect(await screen.findByRole('heading', { name: 'No movies found' })).toBeTruthy();
    expect(screen.getByText(/matching “not a movie”/)).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Clear search' })).toBeTruthy();
  });
});
