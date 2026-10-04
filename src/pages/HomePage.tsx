import MovieCard from '../components/MovieCard';
import { movies } from '../data/movies';
import { useMovieSearch } from '../hooks/useMovieSearch';
import { useState } from 'react';

const genreGroups = [...new Set(movies.map((movie) => movie.genre))].map((genre) => ({
  genre,
  movies: movies.filter((movie) => movie.genre === genre),
}));
const genres = ['All genres', ...genreGroups.map(({ genre }) => genre)];

function HomePage() {
  const [selectedGenre, setSelectedGenre] = useState('All genres');
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
        {!hasSearched && <div className="genre-filter">
          <label htmlFor="genre-filter">Filter popular picks by genre</label>
          <select id="genre-filter" value={selectedGenre} onChange={(event) => setSelectedGenre(event.target.value)}>
            {genres.map((genre) => <option key={genre}>{genre}</option>)}
          </select>
        </div>}

        <p className="visually-hidden" role="status" aria-live="polite">
          {loading ? 'Searching movies…' : error ? 'Search failed.' : hasSearched
            ? `${filteredMovies.length} ${filteredMovies.length === 1 ? 'movie' : 'movies'} found.`
            : `${loading ? 'Searching…' : `${total} movies`} available.`}
        </p>

        {loading ? <p role="status">Loading movies…</p> : error ? <div className="empty-state"><p role="alert">{error}</p><button className="button button-primary" onClick={retry}>Retry search</button></div> : filteredMovies.length > 0 ? hasSearched ? (
          <div className="movie-grid">
            {filteredMovies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
          </div>
        ) : (
          <div className="genre-sections">
            {genreGroups.map(({ genre, movies: genreMovies }) => {
              if (selectedGenre !== 'All genres' && selectedGenre !== genre) return null;
              const picks = genreMovies.filter((movie) => filteredMovies.some((match) => match.id === movie.id));
              if (picks.length === 0) return null;
              const headingId = `genre-${genre.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
              return <section className="genre-section" key={genre} aria-labelledby={headingId}>
                <div className="section-heading">
                  <h3 id={headingId}>{genre}</h3>
                  <span className="result-count">{picks.length} {picks.length === 1 ? 'pick' : 'picks'}</span>
                </div>
                <div className="movie-grid">
                  {picks.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
                </div>
              </section>;
            })}
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
