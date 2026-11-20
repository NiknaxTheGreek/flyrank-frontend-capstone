import NotificationSettings from '../components/NotificationSettings';
import './preferences.css';
export default function PreferencesPage() {
  return <section className="preferences-page"><h1 tabIndex={-1}>Your preferences</h1><p>Keep your choices on this device.</p><NotificationSettings /></section>;
}
