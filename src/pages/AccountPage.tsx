import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function safeReturnPath(candidate: string | null) {
  return candidate?.startsWith('/') && !candidate.startsWith('//') ? candidate : '/';
}

export default function AccountPage() {
  const {
    user, loading, error: authError, configured, register, login, loginGoogle, logout,
  } = useAuth();
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
      if (mode === 'register') await register(email.trim(), password);
      else await login(email.trim(), password);
      navigate(safeReturnPath(params.get('returnTo')));
    } catch (cause) {
      setActionError(cause instanceof Error ? cause.message : 'Could not complete sign in.');
    } finally {
      setPending(false);
    }
  }

  async function signInGoogle() {
    setActionError('');
    setPending(true);
    try {
      await loginGoogle();
      navigate(safeReturnPath(params.get('returnTo')));
    } catch (cause) {
      setActionError(cause instanceof Error ? cause.message : 'Could not sign in with Google.');
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
        Firebase is not configured. Add the VITE_FIREBASE_* values to your local .env.local file to enable accounts.
      </p>
      <Link className="back-link" to="/">Browse movies</Link>
    </> : <>
      <p className="intro-copy">Sign in to keep your favorite movies saved to your account.</p>
      <form className="account-form" onSubmit={submit}>
        <label htmlFor="account-email">Email</label>
        <input
          id="account-email"
          type="email"
          autoComplete="email"
          required
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
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <button className="button button-primary account-submit" type="submit" disabled={pending}>
          {pending ? 'Please wait…' : mode === 'register' ? 'Create account' : 'Sign in'}
        </button>
      </form>
      <button
        className="button button-secondary account-google"
        type="button"
        disabled={pending}
        onClick={signInGoogle}
      >
        Continue with Google
      </button>
      <p className="account-switch">
        {mode === 'sign-in' ? 'New here?' : 'Already have an account?'}{' '}
        <button type="button" onClick={() => {
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
