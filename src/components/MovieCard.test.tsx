import { MemoryRouter } from 'react-router-dom';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import MovieCard from './MovieCard';
import { AuthProvider } from '../contexts/AuthContext';
import { FavoritesProvider } from '../contexts/FavoritesContext';
import type { Movie } from '../types/movie';

afterEach(cleanup);

const movie: Movie = {
  id: 'pulp-fiction',
  title: 'Pulp Fiction',
  year: 1994,
  genre: 'Crime',
  rating: 8.9,
  posterUrl: 'https://image.tmdb.org/t/p/w500/pulp-fiction.jpg',
  imdbId: 'tt0110912',
  plot: 'Interwoven stories follow a group of Los Angeles criminals, boxers, and companions through a violent day.',
};

describe('MovieCard', () => {
  it('shows the poster fallback when a movie has no poster URL', () => {
    render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider><FavoritesProvider><MovieCard movie={{ ...movie, posterUrl: '' }} /></FavoritesProvider></AuthProvider>
    </MemoryRouter>);

    expect(screen.getByRole('img', { name: 'Poster unavailable for Pulp Fiction' })).toBeTruthy();
    expect(document.querySelector('.poster-fallback')?.textContent).toContain('Pulp Fiction');
    expect(document.querySelector('.poster-fallback-icon')?.textContent).toBeTruthy();
    expect(screen.queryByRole('img', { name: 'Poster for Pulp Fiction' })).toBeNull();
  });

  it('shows a poster fallback on image error while retaining the movie title and rating', () => {
    render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider><FavoritesProvider><MovieCard movie={movie} /></FavoritesProvider></AuthProvider>
    </MemoryRouter>);

    fireEvent.error(screen.getByRole('img', { name: 'Poster for Pulp Fiction' }));

    expect(screen.getByRole('img', { name: 'Poster unavailable for Pulp Fiction' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Pulp Fiction' })).toBeTruthy();
    expect(screen.getByLabelText('Rated 8.9 out of 10')).toBeTruthy();
    expect(screen.getByText(movie.plot)).toBeTruthy();
    expect(screen.getByRole('link', { name: 'IMDb profile for Pulp Fiction' }).getAttribute('href'))
      .toBe('https://www.imdb.com/title/tt0110912/');
  });
});
