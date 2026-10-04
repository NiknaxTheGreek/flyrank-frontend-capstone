import { MemoryRouter } from 'react-router-dom';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import App from './App';

afterEach(cleanup);

describe('movie browsing home', () => {
  it('shows all six sample movies initially', () => {
    render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><App /></MemoryRouter>);

    expect(screen.getByRole('heading', { name: 'Discover movies' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Popular picks' })).toBeTruthy();
    expect(screen.getAllByRole('article')).toHaveLength(6);
    expect(screen.getByRole('heading', { name: 'The Shawshank Redemption' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Spirited Away' })).toBeTruthy();
  });

  it('filters by title without case or surrounding whitespace sensitivity and clears the search', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><App /></MemoryRouter>);
    const search = screen.getByRole('searchbox', { name: 'Search movies by title' });

    await user.type(search, '  iNcEpTiOn  ');
    await user.click(screen.getByRole('button', { name: 'Search' }));

    expect(screen.getAllByRole('article')).toHaveLength(1);
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
    expect(screen.getByRole('heading', { name: 'No movies found' })).toBeTruthy();
    expect(screen.getByText(/We couldn’t find a title matching “not a movie”/)).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Clear search' })).toBeTruthy();
  });
});

