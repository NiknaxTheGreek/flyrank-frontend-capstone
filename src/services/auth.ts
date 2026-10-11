import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth';
import { firebaseConfigured, getFirebaseAuth } from './firebase';

export { firebaseConfigured };
export type { User };

export function observeAuth(
  onUser: (user: User | null) => void,
  onError: (error: Error) => void,
) {
  return onAuthStateChanged(getFirebaseAuth(), onUser, onError);
}

export async function registerWithEmail(email: string, password: string) {
  await createUserWithEmailAndPassword(getFirebaseAuth(), email, password);
}

export async function loginWithEmail(email: string, password: string) {
  await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
}

export async function loginWithGoogle() {
  await signInWithPopup(getFirebaseAuth(), new GoogleAuthProvider());
}

export async function logout() {
  await signOut(getFirebaseAuth());
}
