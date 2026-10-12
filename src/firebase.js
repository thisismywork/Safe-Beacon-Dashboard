/*
  SAFE BEACON - Firebase Web SDK Config
  This "web config" is PUBLIC by design - it only identifies which Firebase
  project to talk to. Firestore Security Rules are what control access.
  Values come from the .env file (see .env.example).
*/

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getMessaging, isSupported } from 'firebase/messaging';

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Messaging only works in browsers that support push (not every browser does),
// so we check first instead of crashing the whole app.
export async function getMessagingIfSupported() {
  return (await isSupported()) ? getMessaging(app) : null;
}
