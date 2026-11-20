import type { ReactNode } from 'react';
import { lazy, Suspense, useEffect, useRef } from 'react';
import { Link, NavLink, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { RouteErrorBoundary } from './components/RouteErrorBoundary';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';

const MovieChat = lazy(() => import('./components/MovieChat'));
const AccountPage = lazy(() => import('./pages/AccountPage'));
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'));
const MovieDetailsPage = lazy(() => import('./pages/MovieDetailsPage'));
const MotionLabPage = lazy(() => import('./pages/MotionLabPage'));
const PlanetStudioPage = lazy(() => import('./pages/PlanetStudioPage'));
const ShaderHeroPage = lazy(() => import('./pages/ShaderHeroPage'));
const PlaygroundPage = lazy(() => import('./pages/PlaygroundPage'));
const HealthPage = lazy(() => import('./pages/HealthPage'));

function RouteFocus() {
  const { pathname } = useLocation();
  const firstPaint = useRef(true);
  useEffect(() => {
    const heading = document.querySelector<HTMLElement>('main h1');
    document.title = `${heading?.textContent ?? 'Movies'} | Reel Good`;
    // Do not steal focus on arrival; move it after client-side navigation.
    if (!firstPaint.current) heading?.focus();
    firstPaint.current = false;
  }, [pathname]);
  return null;
}

function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <section className="intro"><h1 tabIndex={-1}>Checking sign-in</h1><p role="status">Checking your sign-in status…</p></section>;
  if (!user) {
    const returnTo = `${location.pathname}${location.search}`;
    return <Navigate replace to={`/account?returnTo=${encodeURIComponent(returnTo)}`} />;
  }
  return children;
}

function AppLayout() {
  const { pathname } = useLocation();
  const { user } = useAuth();
  return (
    <div className="home">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <header className="site-header">
        <Link className="brand" to="/" aria-label="Reel Good home">
          <span className="brand-mark" aria-hidden="true">R</span>
          <span>Reel Good</span>
        </Link>
        <nav className="site-navigation" aria-label="Main navigation">
          <NavLink to="/movies">Movies</NavLink>
          <NavLink to="/pick-a-movie">Movie picker</NavLink>
          <NavLink to="/motion-lab">Motion lab</NavLink>
          <NavLink to="/planet-studio">Planet studio</NavLink>
          <NavLink to="/shader-lab">Shader lab</NavLink>
          <NavLink to="/playground">Accessibility</NavLink>
          <NavLink to="/health">Health</NavLink>
          <NavLink to="/favorites">Favorites</NavLink>
          <NavLink to="/account">{user ? 'Account' : 'Sign in'}</NavLink>
        </nav>
      </header>
      <main id="main-content" tabIndex={-1}>
        <Suspense fallback={<section className="intro" aria-busy="true"><h1>Loading page</h1><p role="status">Opening your page…</p></section>}>
        <RouteFocus />
        <RouteErrorBoundary key={pathname}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movies" element={<HomePage />} />
          <Route path="/movies/:movieId" element={<MovieDetailsPage />} />
          <Route path="/pick-a-movie" element={<MovieChat />} />
          <Route path="/motion-lab" element={<MotionLabPage />} />
          <Route path="/planet-studio" element={<PlanetStudioPage />} />
          <Route path="/shader-lab" element={<ShaderHeroPage />} />
          <Route path="/playground" element={<PlaygroundPage />} />
          <Route path="/health" element={<HealthPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/favorites" element={<RequireAuth><FavoritesPage /></RequireAuth>} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        </RouteErrorBoundary>
        </Suspense>
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

