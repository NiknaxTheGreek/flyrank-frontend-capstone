import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { firebaseConfig as config, firebaseConfigured } from './firebase-config';
export { firebaseConfigured } from './firebase-config';

const app = firebaseConfigured
  ? getApps().length > 0 ? getApp() : initializeApp(config)
  : null;

export function requireFirebaseApp() {
  if (!app) {
    throw new Error('Firebase is not configured. Add the VITE_FIREBASE_* values to .env.local.');
  }

  return app;
}

export function getFirebaseAuth() {
  return getAuth(requireFirebaseApp());
}

export function getFirebaseDatabase() {
  return getDatabase(requireFirebaseApp());
}
