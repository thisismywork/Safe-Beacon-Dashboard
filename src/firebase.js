/*
  SAFE BEACON - Firebase Web SDK Config
  ---------------------------------------
  IMPORTANT: This is different from the backend's serviceAccountKey.json.
  This "web config" is PUBLIC by design - it's meant to be visible in
  browser code. It only identifies which Firebase project to talk to;
  it does NOT grant admin access. Firestore Security Rules (not this file)
  are what actually control who can read/write your data.

  WHERE TO GET THESE VALUES:
  1. Firebase Console -> gear icon -> Project Settings
  2. Scroll down to "Your apps" -> click the "</>" (Web) icon to register a web app
     (if you haven't already registered one)
  3. Firebase will show you a config object exactly like the shape below -
     copy those real values into the .env file (see .env.example)
*/

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
