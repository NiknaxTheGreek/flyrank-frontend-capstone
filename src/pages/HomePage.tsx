import MovieCard from '../components/MovieCard';
import { movies } from '../data/movies';
import { useMovieSearch } from '../hooks/useMovieSearch';

function HomePage() {
  const {
    searchTerm,
    setSearchTerm,
    submitSearch,
    clearSearch,
    filteredMovies,
    hasSearched,
    submittedTerm, loading, error, total, page, setPage, retry,
  } = useMovieSearch(movies);

  return (
    <>
      <section className="intro" aria-labelledby="page-title">
        <p className="eyebrow">A little movie inspiration</p>
        <h1 tabIndex={-1} id="page-title">Discover movies</h1>
        <p className="intro-copy">Browse a hand-picked collection, or search by title.</p>

        <form className="search-form" role="search" onSubmit={submitSearch}>
          <label htmlFor="movie-search">Search movies by title</label>
          <div className="search-controls">
            <input
              id="movie-search"
              type="search"
              maxLength={100}
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Try a movie title"
            />
            <button className="button button-primary" type="submit">Search</button>
            {hasSearched && (
              <button className="button button-secondary" type="button" onClick={clearSearch}>
                Clear search
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="movie-section" aria-labelledby="movies-heading">
        <div className="section-heading">
          <h2 id="movies-heading">{hasSearched ? 'Search results' : 'Popular picks'}</h2>
          <span className="result-count">{loading ? 'Searching…' : `${total} movies`}</span>
        </div>

        <p className="visually-hidden" role="status" aria-live="polite">
          {loading ? 'Searching movies…' : error ? 'Search failed.' : hasSearched
            ? `${filteredMovies.length} ${filteredMovies.length === 1 ? 'movie' : 'movies'} found.`
            : `${loading ? 'Searching…' : `${total} movies`} available.`}
        </p>

        {loading ? <p role="status">Loading movies…</p> : error ? <div className="empty-state"><p role="alert">{error}</p><button className="button button-primary" onClick={retry}>Retry search</button></div> : filteredMovies.length > 0 ? (
          <div className="movie-grid">
            {filteredMovies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
          </div>
        ) : (
          <div className="empty-state">
            <span className="empty-icon" aria-hidden="true">⌕</span>
            <h3>No movies found</h3>
            <p>We couldn’t find a title matching “{submittedTerm}”. Try another title, or use Clear search above to browse all movies.</p>
          </div>
        )}
        {hasSearched && !loading && !error && total > 10 && <nav className="pagination" aria-label="Search result pages">
          <button className="button button-secondary" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous page</button>
          <span>Page {page} of {Math.min(100, Math.ceil(total / 10))}</span>
          <button className="button button-secondary" disabled={page >= Math.min(100, Math.ceil(total / 10))} onClick={() => setPage(page + 1)}>Next page</button>
        </nav>}
      </section>
    </>
  );
}

export default HomePage;

