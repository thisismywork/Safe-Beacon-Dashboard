/*
  SAFE BEACON - push notification helpers
  1. registerServiceWorker(): registers the service worker (also what lets the
     browser offer "Install app").
  2. enablePush(): asks permission, gets this phone's FCM token and saves it
     to Firestore (collection "pushTokens") so the backend knows where to send alerts.
*/

import { getToken } from 'firebase/messaging';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, firebaseConfig, getMessagingIfSupported } from './firebase';

export async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return null;

  // A service worker can't read Vite's env vars, so we pass the (public)
  // Firebase config to it through the URL's query string.
  const params = new URLSearchParams(firebaseConfig).toString();
  return navigator.serviceWorker.register(`/firebase-messaging-sw.js?${params}`);
}

export function pushSupported() {
  return 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;
}

export async function enablePush() {
  const messaging = await getMessagingIfSupported();
  if (!messaging) throw new Error('This browser does not support push notifications.');

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') throw new Error('Notification permission was not granted.');

  const registration = await registerServiceWorker();
  await navigator.serviceWorker.ready;

  const token = await getToken(messaging, {
    vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    serviceWorkerRegistration: registration,
  });
  if (!token) throw new Error('Could not get a push token. Please try again.');

  await setDoc(
    doc(db, 'pushTokens', token),
    { token, createdAt: serverTimestamp(), userAgent: navigator.userAgent.slice(0, 200) },
    { merge: true }
  );

  return token;
}
