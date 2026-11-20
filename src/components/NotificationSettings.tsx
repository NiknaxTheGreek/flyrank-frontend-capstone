import { useRef, useState, type FormEvent } from 'react';

const STORAGE_KEY = 'flyrank-notification-preferences';

type Preferences = {
  email: string;
  emailNotifications: boolean;
};

type Feedback = {
  kind: 'success' | 'error';
  message: string;
};

const DEFAULT_PREFERENCES: Preferences = {
  email: '',
  emailNotifications: false,
};

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function readPreferences(): { preferences: Preferences; feedback: Feedback | null } {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === null) {
      return { preferences: DEFAULT_PREFERENCES, feedback: null };
    }

    const parsed: unknown = JSON.parse(stored);
    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      !('email' in parsed) ||
      !('emailNotifications' in parsed) ||
      typeof parsed.email !== 'string' ||
      typeof parsed.emailNotifications !== 'boolean'
    ) {
      return { preferences: DEFAULT_PREFERENCES, feedback: null };
    }

    const email = parsed.email.trim();
    if (parsed.emailNotifications && !isValidEmail(email)) {
      return { preferences: DEFAULT_PREFERENCES, feedback: null };
    }

    return {
      preferences: { email, emailNotifications: parsed.emailNotifications },
      feedback: null,
    };
  } catch {
    return {
      preferences: DEFAULT_PREFERENCES,
      feedback: { kind: 'error', message: 'Could not load saved notification preferences.' },
    };
  }
}

function NotificationSettings() {
  const [initialState] = useState(readPreferences);
  const [email, setEmail] = useState(initialState.preferences.email);
  const [emailNotifications, setEmailNotifications] = useState(
    initialState.preferences.emailNotifications,
  );
  const [emailError, setEmailError] = useState('');
  const [feedback, setFeedback] = useState<Feedback | null>(initialState.feedback);
  const emailInput = useRef<HTMLInputElement>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedEmail = email.trim();
    setEmail(normalizedEmail);

    if (emailNotifications && !isValidEmail(normalizedEmail)) {
      setEmailError('Enter a valid email address to enable email notifications.');
      setFeedback(null);
      emailInput.current?.focus();
      return;
    }

    setEmailError('');
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ email: normalizedEmail, emailNotifications }),
      );
      setFeedback({ kind: 'success', message: 'Notification preferences saved in this browser.' });
    } catch {
      setFeedback({
        kind: 'error',
        message: 'Could not save preferences in this browser. Please try again.',
      });
    }
  }

  function clearFeedback() {
    setFeedback(null);
    setEmailError('');
  }

  return (
    <section className="panel notification-settings" aria-labelledby="notification-settings-title">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Preferences</p>
          <h3 id="notification-settings-title">Notification settings</h3>
        </div>
      </div>

      <p className="notification-disclaimer">
        These preferences are saved in this browser only. No emails are sent.
      </p>

      <form className="notification-form" onSubmit={handleSubmit} noValidate>
        <div className="notification-field">
          <label htmlFor="notification-email">Email address</label>
          <input
            ref={emailInput}
            id="notification-email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            aria-invalid={emailError ? true : undefined}
            aria-describedby={emailError ? 'notification-email-error' : undefined}
            onChange={(event) => {
              setEmail(event.target.value);
              clearFeedback();
            }}
          />
          {emailError && (
            <p className="notification-error" id="notification-email-error">
              {emailError}
            </p>
          )}
        </div>

        <label className="notification-checkbox">
          <input
            name="emailNotifications"
            type="checkbox"
            checked={emailNotifications}
            onChange={(event) => {
              setEmailNotifications(event.target.checked);
              clearFeedback();
            }}
          />
          <span>Enable email notifications</span>
        </label>

        <button className="primary-btn notification-save" type="submit">
          Save preferences
        </button>
      </form>

      <p className="notification-feedback" aria-live="polite" data-kind={feedback?.kind}>
        {feedback?.message ?? ''}
      </p>
    </section>
  );
}

export default NotificationSettings;

