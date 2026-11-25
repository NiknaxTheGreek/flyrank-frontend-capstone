import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import { useFeaturedMovies } from '../hooks/useFeaturedMovies';
import { useMovieSearch } from '../hooks/useMovieSearch';

function HomePage() {
  const [selectedGenre, setSelectedGenre] = useState('All genres');
  const [params] = useSearchParams();
  const hasSearchQuery = Boolean((params.get('q') ?? '').trim());

  const {
    movies: featuredMovies,
    loading: featuredLoading,
    error: featuredError,
  } = useFeaturedMovies(!hasSearchQuery);

  const {
    searchTerm,
    setSearchTerm,
    submitSearch,
    clearSearch,
    filteredMovies,
    hasSearched,
    submittedTerm,
    loading: searchLoading,
    error: searchError,
    total,
    page,
    setPage,
    retry,
  } = useMovieSearch(featuredMovies);

  const loading = hasSearched ? searchLoading : featuredLoading;
  const error = hasSearched ? searchError : featuredError;

  const genreGroups = [...new Set(featuredMovies.map((movie) => movie.genre).filter(Boolean))]
    .map((genre) => ({
      genre,
      movies: featuredMovies.filter((movie) => movie.genre === genre),
    }));

  const genres = ['All genres', ...genreGroups.map(({ genre }) => genre)];

  return (
    <>
      <section className="intro" aria-labelledby="page-title">
        <p className="eyebrow">A little movie inspiration</p>
        <h1 tabIndex={-1} id="page-title">Discover movies</h1>
        <p className="intro-copy">
          Browse a live movie collection, or search by title.
        </p>

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
            <button className="button button-primary" type="submit">
              Search
            </button>
            {hasSearched && (
              <button
                className="button button-secondary"
                type="button"
                onClick={clearSearch}
              >
                Clear search
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="movie-section" aria-labelledby="movies-heading">
        <div className="section-heading">
          <h2 id="movies-heading">
            {hasSearched ? 'Search results' : 'Popular picks'}
          </h2>
          <span className="result-count">
            {loading ? 'Loading…' : `${total} movies`}
          </span>
        </div>

        {!hasSearched && !featuredLoading && (
          <div className="genre-filter">
            <label htmlFor="genre-filter">
              Filter popular picks by genre
            </label>
            <select
              id="genre-filter"
              value={selectedGenre}
              onChange={(event) => setSelectedGenre(event.target.value)}
            >
              {genres.map((genre) => (
                <option key={genre}>{genre}</option>
              ))}
            </select>
          </div>
        )}

        <p className="visually-hidden" role="status" aria-live="polite">
          {loading
            ? 'Loading movies…'
            : error
              ? 'Movie loading failed.'
              : `${filteredMovies.length} movies available.`}
        </p>

        {loading ? (
          <p role="status">Loading movies from OMDb…</p>
        ) : error ? (
          <div className="empty-state">
            <p role="alert">{error}</p>
            {hasSearched && (
              <button className="button button-primary" onClick={retry}>
                Retry search
              </button>
            )}
          </div>
        ) : filteredMovies.length > 0 ? hasSearched ? (
          <div className="movie-grid">
            {filteredMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="genre-sections">
            {genreGroups.map(({ genre, movies }) => {
              if (
                selectedGenre !== 'All genres' &&
                selectedGenre !== genre
              ) return null;

              const headingId =
                `genre-${genre.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

              return (
                <section
                  className="genre-section"
                  key={genre}
                  aria-labelledby={headingId}
                >
                  <div className="section-heading">
                    <h3 id={headingId}>{genre}</h3>
                    <span className="result-count">
                      {movies.length} {movies.length === 1 ? 'pick' : 'picks'}
                    </span>
                  </div>

                  <div className="movie-grid">
                    {movies.map((movie) => (
                      <MovieCard key={movie.id} movie={movie} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <span className="empty-icon" aria-hidden="true">⌕</span>
            <h3>No movies found</h3>
            <p>
              We couldn’t find a title matching “{submittedTerm}”.
              Try another title.
            </p>
          </div>
        )}

        {hasSearched && !loading && !error && total > 10 && (
          <nav className="pagination" aria-label="Search result pages">
            <button
              className="button button-secondary"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous page
            </button>
            <span>
              Page {page} of {Math.min(100, Math.ceil(total / 10))}
            </span>
            <button
              className="button button-secondary"
              disabled={page >= Math.min(100, Math.ceil(total / 10))}
              onClick={() => setPage(page + 1)}
            >
              Next page
            </button>
          </nav>
        )}
      </section>
    </>
  );
}

export default HomePage;
