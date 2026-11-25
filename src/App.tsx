import NotificationSettings from './components/NotificationSettings';

type Stat = {
  label: string;
  value: string;
  delta: string;
  tone: 'positive' | 'neutral' | 'warning';
};

type Movie = {
  movie: string;
  position: number;
  trend: number;
  volume: string;
};

type Region = {
  region: string;
  visibility: string;
  change: string;
};

const stats: Stat[] = [
  { label: 'Movie views (demo)', value: '184.2K', delta: '+12.4%', tone: 'positive' },
  { label: 'Average rating (demo)', value: '4.8', delta: '+0.6', tone: 'positive' },
  { label: 'Favorite rate (demo)', value: '7.1%', delta: '+1.2%', tone: 'positive' },
  { label: 'New releases (demo)', value: '42', delta: '-3 this week', tone: 'warning' },
];

const movies: Movie[] = [
  { movie: 'Inception', position: 2, trend: 18, volume: '32K' },
  { movie: 'Interstellar', position: 5, trend: 9, volume: '18K' },
  { movie: 'The Matrix', position: 8, trend: 14, volume: '12K' },
  { movie: 'Arrival', position: 12, trend: 6, volume: '9K' },
];

const regions: Region[] = [
  { region: 'United States', visibility: '68%', change: '+4.3%' },
  { region: 'United Kingdom', visibility: '61%', change: '+2.1%' },
  { region: 'Germany', visibility: '54%', change: '+1.8%' },
  { region: 'Canada', visibility: '47%', change: '+3.5%' },
];

const navItems = ['Overview', 'Movies', 'Genres', 'Favorites', 'Activity'];

function App() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-wrap">
          <div className="brand-mark" aria-hidden="true">R</div>
          <div>
            <p className="eyebrow">Movie discovery</p>
            <h1>Reel Good</h1>
          </div>
        </div>

        <nav className="nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <button
              key={item}
              type="button"
              className={`nav-item${item === 'Overview' ? ' active' : ''}`}
              aria-current={item === 'Overview' ? 'page' : undefined}
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="side-card">
          <p className="label">Movie night goal</p>
          <strong>Watch three movies</strong>
          <div className="progress" aria-label="72 percent of monthly target reached">
            <span style={{ width: '72%' }} />
          </div>
          <small>72% of monthly target</small>
        </div>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div>
            <p className="eyebrow">Demo movie dashboard</p>
            <h2>Reel Good Movie Dashboard</h2>
          </div>
          <button type="button" className="primary-btn">Export report</button>
        </header>

        <section className="stats-grid">
          {stats.map((stat) => (
            <article key={stat.label} className="stat-card">
              <p>{stat.label}</p>
              <div className="stat-row">
                <strong>{stat.value}</strong>
                <span className={`delta ${stat.tone}`}>{stat.delta}</span>
              </div>
            </article>
          ))}
        </section>

        <section className="content-grid">
          <div className="panel large-panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Viewing activity</p>
                <h3>Watchlist activity</h3>
              </div>
              <span className="pill positive">+14.8% MoM</span>
            </div>

            <div className="chart" aria-label="Watchlist activity chart">
              {[40, 58, 52, 72, 66, 88, 96].map((height, index) => (
                <div key={index} className="bar" style={{ height: `${height}%` }} />
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Movie picks</p>
                <h3>Popular movies</h3>
              </div>
            </div>

            <div className="movie-list">
              {movies.map(({ movie, position, trend, volume }) => (
                <div key={movie} className="movie-item">
                  <div>
                    <strong>{movie}</strong>
                    <p>{volume} demo views</p>
                  </div>
                  <div className="movie-meta">
                    <span className="position">#{position}</span>
                    <span className="trend positive">+{trend}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bottom-grid">
          <div className="panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Audience overview</p>
                <h3>Audience by region (demo)</h3>
              </div>
            </div>

            <div className="region-list">
              {regions.map(({ region, visibility, change }) => (
                <div key={region} className="region-row">
                  <div>
                    <strong>{region}</strong>
                    <p>{visibility} demo audience share</p>
                  </div>
                  <span className="trend positive">{change}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="panel insights-panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Movie night ideas</p>
                <h3>Viewing suggestions</h3>
              </div>
            </div>

            <ul className="insights-list">
              <li>Explore a genre you have not watched recently.</li>
              <li>Save a movie to your favorites for your next movie night.</li>
              <li>Read the plot summary before choosing a movie.</li>
            </ul>
          </div>
        </section>

        <NotificationSettings />
      </main>
    </div>
  );
}

export default App;
