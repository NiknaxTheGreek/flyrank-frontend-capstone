import { getDatabase } from 'firebase/database';
import { requireFirebaseApp } from './firebase-app';

// This module is reached through the signed-in favorites service only.
export function getFirebaseDatabase() {
  return getDatabase(requireFirebaseApp());
}
