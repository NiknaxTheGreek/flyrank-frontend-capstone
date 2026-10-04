import { useEffect } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import AccountPage from './pages/AccountPage';
import FavoritesPage from './pages/FavoritesPage';
import HomePage from './pages/HomePage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import NotFoundPage from './pages/NotFoundPage';

function AppLayout() {
  const { pathname } = useLocation();
  const { user } = useAuth();
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
        <nav className="site-navigation" aria-label="Main navigation">
          <Link to="/movies">Movies</Link>
          <Link to="/favorites">Favorites</Link>
          <Link to="/account">{user ? 'Account' : 'Sign in'}</Link>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movies" element={<HomePage />} />
          <Route path="/movies/:movieId" element={<MovieDetailsPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return <AuthProvider>
    <FavoritesProvider>
      <AppLayout />
    </FavoritesProvider>
  </AuthProvider>;
}
