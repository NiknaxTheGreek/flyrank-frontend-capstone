import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { User } from 'firebase/auth';
import type {
  loginWithEmail,
  logout,
  registerWithEmail,
} from '../services/auth';
import { firebaseConfigured } from '../services/firebase-config';

// Account actions load the SDK on demand; browsing can paint independently.
const register: typeof registerWithEmail = async (...args) =>
  (await import('../services/auth')).registerWithEmail(...args);
const login: typeof loginWithEmail = async (...args) =>
  (await import('../services/auth')).loginWithEmail(...args);
const signOut: typeof logout = async () => (await import('../services/auth')).logout();

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  error: string;
  configured: boolean;
  register: typeof registerWithEmail;
  login: typeof loginWithEmail;
  logout: typeof logout;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(firebaseConfigured);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!firebaseConfigured) {
      setLoading(false);
      return;
    }
    let active = true;
    let unsubscribe: (() => void) | undefined;
    void import('../services/auth').then(({ observeAuth }) => {
      if (!active) return;
      unsubscribe = observeAuth(
        (nextUser) => {
          setUser(nextUser);
          setLoading(false);
          setError('');
        },
        (authError) => {
          setLoading(false);
          setError(authError.message || 'Could not check your sign-in status.');
        },
      );
    }).catch((cause: unknown) => {
      if (!active) return;
      setLoading(false);
      setError(cause instanceof Error ? cause.message : 'Could not check your sign-in status.');
    });
    return () => { active = false; unsubscribe?.(); };
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    error,
    configured: firebaseConfigured,
    register,
    login,
    logout: signOut,
  }), [user, loading, error]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider.');
  return context;
}
