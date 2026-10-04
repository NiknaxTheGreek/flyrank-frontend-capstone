import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, afterEach, expect, it } from 'vitest';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import App from './App';
afterEach(cleanup);
function HistoryControls() {
  const navigate = useNavigate();
  return <><button onClick={() => navigate(-1)}>History back</button><button onClick={() => navigate(1)}>History forward</button></>;
}
function open(path = '/') {
  return render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }} initialEntries={[path]}><App /><HistoryControls /></MemoryRouter>);
}
it('opens details and returns to the submitted search, including browser history', async () => {
  const user = userEvent.setup();
  open('/?q=Inception');
  expect(await screen.findAllByRole('article')).toHaveLength(1);
  await user.click(screen.getByRole('link', { name: 'View Inception' }));
  expect(screen.getByRole('heading', { level: 1, name: 'Inception' })).toBe(document.activeElement);
  expect(screen.getByText('2010')).toBeTruthy();
  await user.click(screen.getByRole('button', { name: 'History back' }));
  expect((screen.getByRole('searchbox') as HTMLInputElement).value).toBe('Inception');
  await user.click(screen.getByRole('button', { name: 'History forward' }));
  await user.click(screen.getByRole('link', { name: 'Back to search results' }));
  expect(await screen.findAllByRole('article')).toHaveLength(1);
});
it('opens a detail URL directly and supplies a home link', () => {
  open('/movies/interstellar');
  expect(screen.getByRole('heading', { level: 1, name: 'Interstellar' })).toBeTruthy();
  expect(screen.getByRole('link', { name: 'Back to movies' }).getAttribute('href')).toBe('/');
  expect(screen.getByRole('link', { name: 'Movies' }).getAttribute('href')).toBe('/movies');
  expect(document.title).toBe('Interstellar | Reel Good');
});
it('opens the movie collection directly at /movies', () => {
  open('/movies');
  expect(screen.getByRole('heading', { name: 'Discover movies' })).toBeTruthy();
  expect(screen.getAllByRole('article')).toHaveLength(6);
});
it('returns to movie browsing from the main navigation', async () => {
  const user = userEvent.setup();
  open('/movies/interstellar');
  await user.click(screen.getByRole('link', { name: 'Movies' }));
  expect(await screen.findByRole('heading', { name: 'Discover movies' })).toBeTruthy();
});
it.each([['/movies/missing', 'Movie not found'], ['/missing', 'Page not found']])('handles %s', async (path, heading) => {
  const user = userEvent.setup(); open(path);
  expect(screen.getByRole('heading', { name: heading })).toBeTruthy();
  await user.click(screen.getByRole('link', { name: 'Browse movies' }));
  expect(screen.getAllByRole('article')).toHaveLength(6);
});
it('keeps the empty-state message tied to the submitted query', async () => {
  const user = userEvent.setup(); open('/?q=zzzz');
  await user.clear(screen.getByRole('searchbox'));
  await user.type(screen.getByRole('searchbox'), 'Inception');
  expect(screen.getByText(/matching “zzzz”/)).toBeTruthy();
  expect(screen.queryAllByRole('article')).toHaveLength(0);
});

vi.mock('./services/movies', async () => {
  const { movies } = await import('./data/movies');
  return { searchMovies: vi.fn(async (q: string) => {
    const found = movies.filter(m => m.title.toLowerCase().includes(q.trim().toLowerCase()));
    return { movies: found, total: found.length };
  }) };
});
