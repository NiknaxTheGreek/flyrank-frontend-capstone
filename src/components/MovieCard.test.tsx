import { MemoryRouter } from 'react-router-dom';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import MovieCard from './MovieCard';
import type { Movie } from '../types/movie';

vi.mock('./FavoriteButton', () => ({ default: () => null }));
afterEach(cleanup);

const movie: Movie = {
  id: 'pulp-fiction',
  title: 'Pulp Fiction',
  year: 1994,
  genre: 'Crime',
  rating: 8.9,
  posterUrl: 'https://image.tmdb.org/t/p/w500/pulp-fiction.jpg',
  imdbId: 'tt0110912',
  plot: 'Interwoven stories follow a group of Los Angeles criminals and companions.',
};

describe('MovieCard', () => {
  it('shows a poster fallback on image error while retaining the movie title and rating', () => {
    const { container } = render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><MovieCard movie={movie} /></MemoryRouter>);

    fireEvent.error(screen.getByRole('img', { name: 'Poster for Pulp Fiction' }));

    expect(screen.getByRole('img', { name: 'Poster unavailable for Pulp Fiction' })).toBeTruthy();
    expect(container.querySelector('.poster-fallback-title')?.textContent).toBe('Pulp Fiction');
    expect(screen.getByRole('heading', { name: 'Pulp Fiction' })).toBeTruthy();
    expect(screen.getByLabelText('Rated 8.9 out of 10')).toBeTruthy();
    expect(screen.getByText(movie.plot!)).toBeTruthy();
  });

  it('provides independent accessible movie and IMDb links', () => {
    render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><MovieCard movie={movie} /></MemoryRouter>);

    const movieLink = screen.getByRole('link', { name: 'View Pulp Fiction' });
    const imdbLink = screen.getByRole('link', { name: 'IMDb profile for Pulp Fiction' });
    expect(imdbLink.getAttribute('href')).toBe('https://www.imdb.com/title/tt0110912/');
    expect(imdbLink.getAttribute('target')).toBe('_blank');
    expect(imdbLink.getAttribute('rel')).toBe('noopener noreferrer');
    expect(movieLink.contains(imdbLink)).toBe(false);
  });
});

