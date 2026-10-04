import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import MovieCard from './MovieCard';
import type { Movie } from '../types/movie';

const movie: Movie = {
  id: 'pulp-fiction',
  title: 'Pulp Fiction',
  year: 1994,
  genre: 'Crime',
  rating: 8.9,
  posterUrl: 'https://image.tmdb.org/t/p/w500/pulp-fiction.jpg',
};

describe('MovieCard', () => {
  it('shows a poster fallback on image error while retaining the movie title and rating', () => {
    render(<MovieCard movie={movie} />);

    fireEvent.error(screen.getByRole('img', { name: 'Poster for Pulp Fiction' }));

    expect(screen.getByRole('img', { name: 'Poster unavailable for Pulp Fiction' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Pulp Fiction' })).toBeTruthy();
    expect(screen.getByLabelText('Rated 8.9 out of 10')).toBeTruthy();
  });
});
