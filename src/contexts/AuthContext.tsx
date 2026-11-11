import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { User } from 'firebase/auth';
import {
  firebaseConfigured,
  loginWithEmail,
  logout,
  observeAuth,
  registerWithEmail,
} from '../services/auth';

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
    try {
      return observeAuth(
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
    } catch (cause) {
      setLoading(false);
      setError(cause instanceof Error ? cause.message : 'Could not check your sign-in status.');
      return undefined;
    }
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    error,
    configured: firebaseConfigured,
    register: registerWithEmail,
    login: loginWithEmail,
    logout,
  }), [user, loading, error]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider.');
  return context;
}
