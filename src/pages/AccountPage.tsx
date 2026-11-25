import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function safeReturnPath(candidate: string | null) {
  if (!candidate?.startsWith('/') || candidate.startsWith('//') || candidate.startsWith('/\\')) return '/';
  const destination = new URL(candidate, window.location.origin);
  return destination.origin === window.location.origin
    ? `${destination.pathname}${destination.search}${destination.hash}`
    : '/';
}

export default function AccountPage() {
  const { user, loading, error: authError, configured, register, login, logout } = useAuth();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'sign-in' | 'register'>('sign-in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [actionError, setActionError] = useState('');
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setActionError('');
    setPending(true);
    try {
      if (!email.trim()) throw new Error('Enter your email address.');
      if (password.length < 6) throw new Error('Your password must contain at least 6 characters.');
      if (mode === 'register') await register(email.trim(), password);
      else await login(email.trim(), password);
      navigate(safeReturnPath(params.get('returnTo')), { replace: true });
    } catch (cause) {
      setActionError(cause instanceof Error ? cause.message : 'Could not complete authentication.');
    } finally {
      setPending(false);
    }
  }

  async function signOut() {
    setActionError('');
    setPending(true);
    try {
      await logout();
    } catch (cause) {
      setActionError(cause instanceof Error ? cause.message : 'Could not sign out.');
    } finally {
      setPending(false);
    }
  }

  return <section className="intro account-page" aria-labelledby="account-title">
    <p className="eyebrow">Your Reel Good account</p>
    <h1 id="account-title" tabIndex={-1}>Account</h1>
    {loading ? <p role="status">Checking your sign-in status…</p> : user ? <>
      <p className="intro-copy">Signed in as {user.email || user.displayName || 'your account'}.</p>
      <Link className="button button-secondary" to="/favorites">View favorites</Link>
      <button className="button button-primary account-signout" type="button" disabled={pending} onClick={signOut}>
        {pending ? 'Signing out…' : 'Sign out'}
      </button>
    </> : !configured ? <>
      <p role="alert" className="account-error">
        Firebase is not configured. Set VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, VITE_FIREBASE_PROJECT_ID, VITE_FIREBASE_APP_ID and VITE_FIREBASE_DATABASE_URL to enable accounts and favorites.
      </p>
      <Link className="back-link" to="/">Browse movies</Link>
    </> : <>
      <p className="intro-copy">Sign in or create an account to keep your favorites.</p>
      <form className="account-form" onSubmit={submit}>
        <label htmlFor="account-email">Email</label>
        <input
          id="account-email"
          type="email"
          autoComplete="email"
          required
          disabled={pending}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <label htmlFor="account-password">Password</label>
        <input
          id="account-password"
          type="password"
          autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
          minLength={6}
          required
          disabled={pending}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <button className="button button-primary account-submit" type="submit" disabled={pending}>
          {pending ? 'Please wait…' : mode === 'register' ? 'Create account' : 'Sign in'}
        </button>
      </form>
      <p className="account-switch">
        {mode === 'sign-in' ? 'New here?' : 'Already have an account?'}{' '}
        <button type="button" disabled={pending} onClick={() => {
          setMode(mode === 'sign-in' ? 'register' : 'sign-in');
          setActionError('');
        }}>
          {mode === 'sign-in' ? 'Create an account' : 'Sign in'}
        </button>
      </p>
    </>}
    {(authError || actionError) && <p role="alert" className="account-error">{actionError || authError}</p>}
  </section>;
}

