import { MemoryRouter } from 'react-router-dom';
import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, afterEach, describe, expect, it } from 'vitest';
import App from './App';
import { movies } from './data/movies';

afterEach(cleanup);

describe('movie browsing home', () => {
  it('shows all six sample movies initially', () => {
    render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><App /></MemoryRouter>);

    expect(screen.getByRole('heading', { name: 'Discover movies' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Popular picks' })).toBeTruthy();
    expect(screen.getAllByRole('article')).toHaveLength(6);
    expect(screen.getByRole('heading', { name: 'The Shawshank Redemption' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Spirited Away' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Drama' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Sci-Fi' })).toBeTruthy();
    expect(screen.getAllByRole('link', { name: /^IMDb profile for / })).toHaveLength(6);
    expect(document.querySelectorAll('.movie-summary')).toHaveLength(6);
    for (const movie of movies) {
      expect(movie.plot?.length).toBeGreaterThan(20);
      expect(movie.imdbId).toMatch(/^tt\d{7,10}$/);
      const card = screen.getByRole('heading', { name: movie.title }).closest('article');
      expect(within(card!).getByRole('link', { name: `IMDb profile for ${movie.title}` }).getAttribute('href'))
        .toBe(`https://www.imdb.com/title/${movie.imdbId}/`);
    }
  });

  it('filters the popular collection by genre with a labelled control', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><App /></MemoryRouter>);
    await user.selectOptions(screen.getByRole('combobox', { name: 'Filter popular picks by genre' }), 'Sci-Fi');

    expect(screen.getAllByRole('article')).toHaveLength(2);
    expect(screen.getByRole('heading', { name: 'Sci-Fi' })).toBeTruthy();
    expect(screen.queryByRole('heading', { name: 'Drama' })).toBeNull();
  });

  it('filters by title without case or surrounding whitespace sensitivity and clears the search', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><App /></MemoryRouter>);
    const search = screen.getByRole('searchbox', { name: 'Search movies by title' });

    await user.type(search, '  iNcEpTiOn  ');
    await user.click(screen.getByRole('button', { name: 'Search' }));

    expect(await screen.findAllByRole('article')).toHaveLength(1);
    expect(screen.getByRole('heading', { name: 'Inception' })).toBeTruthy();
    expect(screen.queryByRole('heading', { name: 'Interstellar' })).toBeNull();

    await user.click(screen.getByRole('button', { name: 'Clear search' }));

    expect((search as HTMLInputElement).value).toBe('');
    expect(screen.getAllByRole('article')).toHaveLength(6);
    expect(screen.getByRole('heading', { name: 'Popular picks' })).toBeTruthy();
  });

  it('shows an informative empty state for a search with no matches', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><App /></MemoryRouter>);

    await user.type(screen.getByRole('searchbox', { name: 'Search movies by title' }), 'not a movie');
    await user.click(screen.getByRole('button', { name: 'Search' }));

    expect(screen.queryAllByRole('article')).toHaveLength(0);
    expect(await screen.findByRole('heading', { name: 'No movies found' })).toBeTruthy();
    expect(screen.getByText(/We couldn’t find a title matching “not a movie”/)).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Clear search' })).toBeTruthy();
  });
});


vi.mock('./services/movies', async () => {
  const { movies } = await import('./data/movies');
  return { searchMovies: vi.fn(async (q: string) => {
    const found = movies.filter(m => m.title.toLowerCase().includes(q.trim().toLowerCase()));
    return { movies: found, total: found.length };
  }) };
});
