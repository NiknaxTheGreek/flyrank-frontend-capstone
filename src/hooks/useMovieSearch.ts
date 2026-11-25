import { useSearchParams } from 'react-router-dom';
import { useEffect, useState, type FormEvent } from 'react';
import type { Movie } from '../types/movie';
import { searchMovies } from '../services/movies';
export function useMovieSearch(movies: Movie[]) {
  const [params, setParams] = useSearchParams();
  const submittedTerm = (params.get('q') ?? '').trim();
  const rawPage = Number(params.get('page') ?? 1);
  const page = Number.isInteger(rawPage) && rawPage >= 1 && rawPage <= 100 ? rawPage : 1;
  const [searchTerm, setSearchTerm] = useState(submittedTerm);
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<{ key: string; movies: Movie[]; total: number; error: string } | null>(null);
  const key = `${submittedTerm}|${page}|${attempt}`;
  useEffect(() => setSearchTerm(submittedTerm), [submittedTerm]);
  useEffect(() => {
    if (!submittedTerm) return;
    const controller = new AbortController();
    if (submittedTerm.length < 2 || submittedTerm.length > 100) {
      setResult({ key, movies: [], total: 0, error: 'Enter a title of 2–100 characters.' });
      return;
    }
    searchMovies(submittedTerm, page, controller.signal).then((data) => {
      if (!controller.signal.aborted) setResult({ key, ...data, error: '' });
    }).catch((error) => {
      if (!controller.signal.aborted) setResult({ key, movies: [], total: 0, error: error instanceof Error ? error.message : 'Movie request failed.' });
    });
    return () => controller.abort();
  }, [submittedTerm, page, key]);
  const current = result?.key === key ? result : null;
  const hasSearched = !!submittedTerm;
  const loading = hasSearched && !current;
  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setParams(searchTerm.trim() ? { q: searchTerm.trim() } : {}); setAttempt((v) => v + 1);
  }
  return {
    submittedTerm, searchTerm, setSearchTerm, submitSearch, hasSearched, loading,
    error: hasSearched ? current?.error ?? '' : '',
    filteredMovies: hasSearched ? current?.movies ?? [] : movies,
    total: hasSearched ? current?.total ?? 0 : movies.length,
    page, setPage: (value: number) => setParams({ q: submittedTerm, page: String(value) }),
    retry: () => setAttempt((v) => v + 1),
    clearSearch: () => { setSearchTerm(''); setParams({}); },
  };
}

