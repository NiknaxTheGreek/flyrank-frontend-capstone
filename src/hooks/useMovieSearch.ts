import { useMemo, useState, type FormEvent } from 'react';
import type { Movie } from '../types/movie';

export function useMovieSearch(movies: Movie[]) {
  const [searchTerm, setSearchTerm] = useState('');
  const [submittedTerm, setSubmittedTerm] = useState('');

  const filteredMovies = useMemo(() => {
    const normalizedTerm = submittedTerm.trim().toLowerCase();

    if (!normalizedTerm) {
      return movies;
    }

    return movies.filter((movie) =>
      movie.title.toLowerCase().includes(normalizedTerm),
    );
  }, [movies, submittedTerm]);

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmittedTerm(searchTerm.trim());
  }

  function clearSearch() {
    setSearchTerm('');
    setSubmittedTerm('');
  }

  return {
    searchTerm,
    setSearchTerm,
    submitSearch,
    clearSearch,
    filteredMovies,
    hasSearched: submittedTerm.length > 0,
  };
}
