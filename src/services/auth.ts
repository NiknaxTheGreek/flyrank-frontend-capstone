import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth';
import { firebaseConfigured, getFirebaseAuth } from './firebase';

export { firebaseConfigured };
export type { User };

function authMessage(error: unknown) {
  const code = typeof error === 'object' && error !== null && 'code' in error
    ? String(error.code)
    : '';
  switch (code) {
    case 'auth/email-already-in-use': return 'An account already exists for this email address.';
    case 'auth/invalid-email': return 'Enter a valid email address.';
    case 'auth/weak-password': return 'Choose a password with at least 6 characters.';
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found': return 'The email or password is incorrect.';
    case 'auth/too-many-requests': return 'Too many attempts. Wait a moment and try again.';
    case 'auth/network-request-failed': return 'Could not reach Firebase. Check your connection and try again.';
    case 'auth/operation-not-allowed': return 'Email and password sign-in is not enabled in Firebase Authentication.';
    default: return error instanceof Error ? error.message : 'Authentication failed. Please try again.';
  }
}

function withAuthErrors<T>(action: () => Promise<T>) {
  return action().catch((error: unknown) => {
    throw new Error(authMessage(error));
  });
}

export function observeAuth(
  onUser: (user: User | null) => void,
  onError: (error: Error) => void,
) {
  return onAuthStateChanged(getFirebaseAuth(), onUser, onError);
}

export function registerWithEmail(email: string, password: string) {
  return withAuthErrors(async () => {
    await createUserWithEmailAndPassword(getFirebaseAuth(), email.trim(), password);
  });
}

export function loginWithEmail(email: string, password: string) {
  return withAuthErrors(async () => {
    await signInWithEmailAndPassword(getFirebaseAuth(), email.trim(), password);
  });
}

export function logout() {
  return withAuthErrors(async () => {
    await signOut(getFirebaseAuth());
  });
}

