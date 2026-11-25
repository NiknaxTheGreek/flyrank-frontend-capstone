import { getApp, getApps, initializeApp } from 'firebase/app';
import { firebaseConfig, firebaseConfigured } from './firebase-config';

const app = firebaseConfigured
  ? getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
  : null;

export function requireFirebaseApp() {
  if (!app) {
    throw new Error('Firebase is not configured. Add the VITE_FIREBASE_* values to .env.local.');
  }
  return app;
}
