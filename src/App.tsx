import { useState, type FormEvent } from 'react';

type NotificationType = 'movieReleases' | 'favoriteUpdates' | 'movieRecommendations' | 'weeklySummary';
type DeliveryChannel = 'email' | 'inApp';

type Preferences = {
  notifications: Record<NotificationType, Record<DeliveryChannel, boolean>>;
  frequency: 'immediately' | 'daily' | 'weekly';
  quietHoursEnabled: boolean;
  quietStart: string;
  quietEnd: string;
};

const notificationOptions: {
  id: NotificationType;
  title: string;
  description: string;
}[] = [
  {
    id: 'movieReleases',
    title: 'Movie releases',
    description: 'New releases matching your favorite movie genres.',
  },
  {
    id: 'favoriteUpdates',
    title: 'Favorite updates',
    description: 'Updates about movies saved in your favorites.',
  },
  {
    id: 'movieRecommendations',
    title: 'Movie recommendations',
    description: 'Movie suggestions based on your chosen interests.',
  },
  {
    id: 'weeklySummary',
    title: 'Weekly movie digest',
    description: 'A roundup of movie discoveries and saved favorites.',
  },
];

const defaultPreferences: Preferences = {
  notifications: {
    movieReleases: { email: true, inApp: true },
    favoriteUpdates: { email: true, inApp: true },
    movieRecommendations: { email: false, inApp: true },
    weeklySummary: { email: true, inApp: false },
  },
  frequency: 'immediately',
  quietHoursEnabled: false,
  quietStart: '22:00',
  quietEnd: '08:00',
};

const storageKey = 'flyrank-notification-preferences';

function isPreferences(value: unknown): value is Preferences {
  if (typeof value !== 'object' || value === null) return false;

  const candidate = value as Partial<Preferences>;
  const notifications = candidate.notifications;
  const notificationIds: NotificationType[] = [
    'movieReleases',
    'favoriteUpdates',
    'movieRecommendations',
    'weeklySummary',
  ];

  return (
    typeof notifications === 'object' &&
    notifications !== null &&
    notificationIds.every((id) => {
      const channels = notifications[id];
      return (
        typeof channels === 'object' &&
        channels !== null &&
        typeof channels.email === 'boolean' &&
        typeof channels.inApp === 'boolean'
      );
    }) &&
    ['immediately', 'daily', 'weekly'].includes(candidate.frequency ?? '') &&
    typeof candidate.quietHoursEnabled === 'boolean' &&
    typeof candidate.quietStart === 'string' &&
    typeof candidate.quietEnd === 'string'
  );
}

function loadPreferences(): Preferences {
  try {
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) return defaultPreferences;

    const parsed: unknown = JSON.parse(stored);
    if (isPreferences(parsed)) return parsed;

    console.error('Saved notification preferences were invalid; using defaults.');
  } catch (error) {
    console.error('Could not load saved notification preferences.', error);
  }

  return defaultPreferences;
}

function App() {
  const [preferences, setPreferences] = useState<Preferences>(loadPreferences);
  const [savedPreferences, setSavedPreferences] = useState<Preferences>(preferences);
  const [saveMessage, setSaveMessage] = useState('');
  const hasChanges = JSON.stringify(preferences) !== JSON.stringify(savedPreferences);

  function updateChannel(
    notification: NotificationType,
    channel: DeliveryChannel,
    enabled: boolean,
  ) {
    setPreferences((current) => ({
      ...current,
      notifications: {
        ...current.notifications,
        [notification]: {
          ...current.notifications[notification],
          [channel]: enabled,
        },
      },
    }));
    setSaveMessage('');
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      window.localStorage.setItem(storageKey, JSON.stringify(preferences));
      setSavedPreferences(preferences);
      setSaveMessage('Your notification preferences have been saved.');
    } catch (error) {
      console.error('Could not save notification preferences.', error);
      setSaveMessage('We couldn’t save your changes. Please try again.');
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-wrap" aria-label="Reel Good">
          <span className="brand-mark" aria-hidden="true">R</span>
          <span>
            <span className="eyebrow">Movie discovery</span>
            <span className="brand-name">Reel Good</span>
          </span>
        </div>

        <p className="nav-label">Workspace</p>
        <nav className="nav" aria-label="Main navigation">
          <button className="nav-item" type="button"><span aria-hidden="true">◫</span> Overview</button>
          <button className="nav-item" type="button"><span aria-hidden="true">⌕</span> Movies</button>
          <button className="nav-item" type="button"><span aria-hidden="true">▤</span> Genres</button>
          <button className="nav-item" type="button"><span aria-hidden="true">♧</span> Favorites</button>
          <button className="nav-item" type="button"><span aria-hidden="true">▥</span> Activity</button>
        </nav>

        <div className="sidebar-bottom">
          <button className="nav-item active" type="button" aria-current="page">
            <span aria-hidden="true">⚙</span> Settings
          </button>
          <div className="profile">
            <span className="profile-avatar" aria-hidden="true">AM</span>
            <span className="profile-copy">
              <strong>Alex Morgan</strong>
              <span>Workspace admin</span>
            </span>
            <span className="profile-menu" aria-hidden="true">···</span>
          </div>
        </div>
      </aside>

      <main className="main-panel" id="settings">
        <div className="content-wrap">
          <div className="breadcrumb"><span>Settings</span><span aria-hidden="true">/</span><strong>Notifications</strong></div>

          <header className="page-header">
            <div>
              <p className="eyebrow">Your workspace</p>
              <h1>Notification settings</h1>
              <p className="page-description">
                Choose what you hear about and how often we reach out.
              </p>
            </div>
            <span className="account-badge"><span aria-hidden="true">●</span> All changes are private</span>
          </header>

          <form onSubmit={handleSubmit}>
            <section className="settings-card" aria-labelledby="alerts-heading">
              <div className="card-heading">
                <div className="heading-icon" aria-hidden="true">♧</div>
                <div>
                  <h2 id="alerts-heading">Alert preferences</h2>
                  <p>Choose which updates you’d like to receive.</p>
                </div>
              </div>

              <div className="preference-table" role="table" aria-label="Notification channels">
                <div className="table-header" role="row">
                  <span role="columnheader">Notification</span>
                  <span role="columnheader">Email</span>
                  <span role="columnheader">In-app</span>
                </div>
                {notificationOptions.map((option) => (
                  <div className="preference-row" role="row" key={option.id}>
                    <div className="notification-copy" role="rowheader">
                      <strong>{option.title}</strong>
                      <span>{option.description}</span>
                    </div>
                    <label className="switch-cell" role="cell">
                      <span className="sr-only">Email notifications for {option.title}</span>
                      <input
                        type="checkbox"
                        checked={preferences.notifications[option.id].email}
                        onChange={(event) => updateChannel(option.id, 'email', event.target.checked)}
                      />
                      <span className="switch-track" aria-hidden="true" />
                    </label>
                    <label className="switch-cell" role="cell">
                      <span className="sr-only">In-app notifications for {option.title}</span>
                      <input
                        type="checkbox"
                        checked={preferences.notifications[option.id].inApp}
                        onChange={(event) => updateChannel(option.id, 'inApp', event.target.checked)}
                      />
                      <span className="switch-track" aria-hidden="true" />
                    </label>
                  </div>
                ))}
              </div>
            </section>

            <section className="settings-card delivery-card" aria-labelledby="delivery-heading">
              <div className="card-heading">
                <div className="heading-icon" aria-hidden="true">◷</div>
                <div>
                  <h2 id="delivery-heading">Delivery schedule</h2>
                  <p>Set the pace that works best for you.</p>
                </div>
              </div>

              <div className="schedule-row">
                <div className="field-copy">
                  <label htmlFor="frequency">Email frequency</label>
                  <span>Choose how often to bundle your email notifications.</span>
                </div>
                <select
                  id="frequency"
                  value={preferences.frequency}
                  onChange={(event) => {
                    const frequency = event.target.value;
                    if (frequency !== 'immediately' && frequency !== 'daily' && frequency !== 'weekly') {
                      return;
                    }
                    setPreferences((current) => ({
                      ...current,
                      frequency,
                    }));
                    setSaveMessage('');
                  }}
                >
                  <option value="immediately">As they happen</option>
                  <option value="daily">Daily digest</option>
                  <option value="weekly">Weekly digest</option>
                </select>
              </div>

              <div className="quiet-hours">
                <div className="quiet-header">
                  <div className="field-copy">
                    <strong>Quiet hours</strong>
                    <span>Pause email notifications during these hours.</span>
                  </div>
                  <label className="switch-cell quiet-switch">
                    <span className="sr-only">Enable quiet hours</span>
                    <input
                      type="checkbox"
                      checked={preferences.quietHoursEnabled}
                      onChange={(event) => {
                        setPreferences((current) => ({
                          ...current,
                          quietHoursEnabled: event.target.checked,
                        }));
                        setSaveMessage('');
                      }}
                    />
                    <span className="switch-track" aria-hidden="true" />
                  </label>
                </div>
                <div className="time-range">
                  <label>
                    <span className="sr-only">Quiet hours start time</span>
                    <input
                      type="time"
                      value={preferences.quietStart}
                      disabled={!preferences.quietHoursEnabled}
                      onChange={(event) => {
                        setPreferences((current) => ({ ...current, quietStart: event.target.value }));
                        setSaveMessage('');
                      }}
                    />
                  </label>
                  <span className="time-separator">to</span>
                  <label>
                    <span className="sr-only">Quiet hours end time</span>
                    <input
                      type="time"
                      value={preferences.quietEnd}
                      disabled={!preferences.quietHoursEnabled}
                      onChange={(event) => {
                        setPreferences((current) => ({ ...current, quietEnd: event.target.value }));
                        setSaveMessage('');
                      }}
                    />
                  </label>
                  <span className="timezone">Your local time</span>
                </div>
              </div>
            </section>

            <footer className="form-footer">
              <p className={saveMessage.startsWith('We couldn’t') ? 'save-message error' : 'save-message'} role="status" aria-live="polite">
                {saveMessage || (hasChanges ? 'You have unsaved changes.' : 'Your preferences are up to date.')}
              </p>
              <button className="primary-btn" type="submit" disabled={!hasChanges}>
                {hasChanges ? 'Save changes' : 'Saved'}
              </button>
            </footer>
          </form>
        </div>
      </main>
    </div>
  );
}

export default App;
