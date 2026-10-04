import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, expect, it, vi } from 'vitest';
import App from './App';
import { searchMovies, getMovie } from './services/movies';
vi.mock('./services/movies', () => ({ searchMovies: vi.fn(), getMovie: vi.fn() }));
afterEach(() => { cleanup(); vi.resetAllMocks(); });
const movie = { id: 'tt1375666', title: 'Inception', year: '2010', genre: 'Sci-Fi', rating: 8.8, posterUrl: '', plot: 'A dream mission.', director: 'Christopher Nolan', runtime: '148 min' };
function open(path = '/?q=Inception') {
  render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }} initialEntries={[path]}><App /></MemoryRouter>);
}
it('shows loading then paginated results and fetches live details', async () => {
  const user = userEvent.setup();
  vi.mocked(searchMovies).mockResolvedValue({ movies: [movie], total: 20 });
  vi.mocked(getMovie).mockResolvedValue({ movie });
  open();
  expect(screen.getByText('Loading movies…')).toBeTruthy();
  await screen.findByRole('link', { name: 'View Inception' });
  await user.click(screen.getByRole('button', { name: 'Next page' }));
  await screen.findByText('Page 2 of 2');
  expect(vi.mocked(searchMovies).mock.calls.at(-1)?.[1]).toBe(2);
  expect(getMovie).not.toHaveBeenCalled();
  await user.click(screen.getByRole('link', { name: 'View Inception' }));
  expect((await screen.findByRole('region', { name: 'Plot' })).textContent).toContain('A dream mission.');
  const imdbLink = screen.getByRole('link', { name: 'View Inception on IMDb' });
  expect(imdbLink.getAttribute('href')).toBe('https://www.imdb.com/title/tt1375666/');
  expect(imdbLink.getAttribute('target')).toBe('_blank');
  expect(imdbLink.getAttribute('rel')).toBe('noopener noreferrer');
  expect(screen.getByRole('link', { name: 'Back to search results' }).getAttribute('href')).toBe('/?q=Inception&page=2');
});
it('displays a search error and retries successfully', async () => {
  const user = userEvent.setup();
  vi.mocked(searchMovies).mockRejectedValueOnce(new Error('Service unavailable')).mockResolvedValueOnce({ movies: [], total: 0 });
  open();
  expect(await screen.findByRole('alert')).toBeTruthy();
  await user.click(screen.getByRole('button', { name: 'Retry search' }));
  expect(await screen.findByRole('heading', { name: 'No movies found' })).toBeTruthy();
});
it('displays detail errors and supports retry', async () => {
  const user = userEvent.setup();
  vi.mocked(getMovie).mockRejectedValueOnce(new Error('Try later')).mockResolvedValueOnce({ movie });
  open('/movies/tt1375666');
  await screen.findByRole('alert');
  await user.click(screen.getByRole('button', { name: 'Retry details' }));
  expect(await screen.findByText('A dream mission.')).toBeTruthy();
});
it('shows sample movie details and its IMDb profile without making a live request', async () => {
  open('/movies/inception');
  expect(await screen.findByRole('heading', { name: 'Inception' })).toBeTruthy();
  expect(screen.getByText(/A skilled thief enters layered dreams/)).toBeTruthy();
  expect(screen.getByRole('link', { name: 'View Inception on IMDb' }).getAttribute('href'))
    .toBe('https://www.imdb.com/title/tt1375666/');
  expect(getMovie).not.toHaveBeenCalled();
});
it('does not let a delayed search overwrite cleared results', async () => {
  const user = userEvent.setup();
  let resolve!: (value: { movies: typeof movie[]; total: number }) => void;
  vi.mocked(searchMovies).mockImplementation(() => new Promise(r => { resolve = r; }));
  open();
  await user.click(screen.getByRole('button', { name: 'Clear search' }));
  resolve({ movies: [movie], total: 1 });
  expect(screen.getAllByRole('article')).toHaveLength(6);
  expect(vi.mocked(searchMovies).mock.calls[0][2].aborted).toBe(true);
});
