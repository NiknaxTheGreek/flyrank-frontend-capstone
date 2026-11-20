import {
  browserLocalPersistence,
  browserSessionPersistence,
  indexedDBLocalPersistence,
  initializeAuth,
} from 'firebase/auth';
import { requireFirebaseApp } from './firebase-app';
export { firebaseConfigured } from './firebase-config';

export function getFirebaseAuth() {
  // Email/password is the only sign-in flow. Keep the default persistence
  // fallbacks without downloading an unused popup/redirect iframe and SDK.
  return initializeAuth(requireFirebaseApp(), {
    persistence: [indexedDBLocalPersistence, browserLocalPersistence, browserSessionPersistence],
  });
}
