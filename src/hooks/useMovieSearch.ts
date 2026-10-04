import { useSearchParams } from 'react-router-dom';
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import type { Movie } from '../types/movie';

export function useMovieSearch(movies: Movie[]) {
  const [params, setParams] = useSearchParams();
  const submittedTerm = (params.get('q') ?? '').trim();
  const [searchTerm, setSearchTerm] = useState(submittedTerm);
  useEffect(() => setSearchTerm(submittedTerm), [submittedTerm]);

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
    setParams(searchTerm.trim() ? { q: searchTerm.trim() } : {});
  }

  function clearSearch() {
    setSearchTerm('');
    setParams({});
  }

  return {
    submittedTerm,
    searchTerm,
    setSearchTerm,
    submitSearch,
    clearSearch,
    filteredMovies,
    hasSearched: submittedTerm.length > 0,
  };
}

