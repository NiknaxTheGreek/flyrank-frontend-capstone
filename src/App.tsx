import { useEffect } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  const { pathname } = useLocation();
  useEffect(() => {
    const heading = document.querySelector<HTMLElement>('h1');
    heading?.focus();
    document.title = `${heading?.textContent ?? 'Movies'} | Reel Good`;
  }, [pathname]);
  return (
    <div className="home">
      <header className="site-header">
        <Link className="brand" to="/" aria-label="Reel Good home">
          <span className="brand-mark" aria-hidden="true">R</span>
          <span>Reel Good</span>
        </Link>
        <p className="header-note">Find your next favorite</p>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movies/:movieId" element={<MovieDetailsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  );
}
