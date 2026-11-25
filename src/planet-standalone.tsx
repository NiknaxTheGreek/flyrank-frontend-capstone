import React from 'react';
import ReactDOM from 'react-dom/client';
import PlanetStudioPage from './pages/PlanetStudioPage';
import './planet-base.css';

// The public A11 release has no authentication, Firebase initialization or API routes.
ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><div className="home">
  <header className="site-header"><a className="brand" href="/planet-studio"><span className="brand-mark" aria-hidden="true">R</span>Reel Good</a><span className="planet-header-note">A LITTLE ESCAPE / BY NICHOLAS PERIKLI</span></header>
  <main><PlanetStudioPage /></main>
</div></React.StrictMode>);
