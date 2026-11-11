import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
};

export const firebaseConfigured = Boolean(
  config.apiKey && config.authDomain && config.projectId && config.appId && config.databaseURL,
);

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
