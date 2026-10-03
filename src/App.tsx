type Stat = {
  label: string;
  value: string;
  delta: string;
  tone: 'positive' | 'neutral' | 'warning';
};

type Keyword = {
  keyword: string;
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
  { label: 'Organic clicks', value: '184.2K', delta: '+12.4%', tone: 'positive' },
  { label: 'Avg. SERP position', value: '4.8', delta: '+0.6', tone: 'positive' },
  { label: 'Conversion rate', value: '7.1%', delta: '+1.2%', tone: 'positive' },
  { label: 'New ranking opportunities', value: '42', delta: '-3 this week', tone: 'warning' },
];

const keywords: Keyword[] = [
  { keyword: 'AI marketing platform', position: 2, trend: 18, volume: '32K' },
  { keyword: 'SEO automation tools', position: 5, trend: 9, volume: '18K' },
  { keyword: 'content strategy dashboard', position: 8, trend: 14, volume: '12K' },
  { keyword: 'keyword monitoring software', position: 12, trend: 6, volume: '9K' },
];

const regions: Region[] = [
  { region: 'United States', visibility: '68%', change: '+4.3%' },
  { region: 'United Kingdom', visibility: '61%', change: '+2.1%' },
  { region: 'Germany', visibility: '54%', change: '+1.8%' },
  { region: 'Canada', visibility: '47%', change: '+3.5%' },
];

const navItems = ['Overview', 'Keywords', 'Content', 'Competitors', 'Reports'];

function App() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-wrap">
          <div className="brand-mark" aria-hidden="true">F</div>
          <div>
            <p className="eyebrow">Growth suite</p>
            <h1>FlyRank</h1>
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
          <p className="label">Performance goal</p>
          <strong>Top 3 rankings</strong>
          <div className="progress" aria-label="72 percent of monthly target reached">
            <span style={{ width: '72%' }} />
          </div>
          <small>72% of monthly target</small>
        </div>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div>
            <p className="eyebrow">Campaign dashboard</p>
            <h2>FlyRank SEO Performance</h2>
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
                <p className="eyebrow">Ranking momentum</p>
                <h3>Keyword growth</h3>
              </div>
              <span className="pill positive">+14.8% MoM</span>
            </div>

            <div className="chart" aria-label="Keyword growth chart">
              {[40, 58, 52, 72, 66, 88, 96].map((height, index) => (
                <div key={index} className="bar" style={{ height: `${height}%` }} />
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Priority targets</p>
                <h3>Top keywords</h3>
              </div>
            </div>

            <div className="keyword-list">
              {keywords.map(({ keyword, position, trend, volume }) => (
                <div key={keyword} className="keyword-item">
                  <div>
                    <strong>{keyword}</strong>
                    <p>{volume} monthly searches</p>
                  </div>
                  <div className="keyword-meta">
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
                <p className="eyebrow">Regional impact</p>
                <h3>Visibility by market</h3>
              </div>
            </div>

            <div className="region-list">
              {regions.map(({ region, visibility, change }) => (
                <div key={region} className="region-row">
                  <div>
                    <strong>{region}</strong>
                    <p>{visibility} average visibility</p>
                  </div>
                  <span className="trend positive">{change}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="panel insights-panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Optimization notes</p>
                <h3>Actionable insights</h3>
              </div>
            </div>

            <ul className="insights-list">
              <li>Update product landing pages to target high-intent comparison keywords.</li>
              <li>Expand FAQ blocks on service pages for better featured snippet capture.</li>
              <li>Prioritize on-page internal linking for pages ranking in positions 7-12.</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
