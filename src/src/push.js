/*
  SAFE BEACON - push notification helpers
  A phone is "paired" with ONE wearable (a device code like SB-NANO-001).
  Its push token is saved with that device code, so the backend only sends a
  device's alerts to the phones paired with it.
*/

import { getToken } from 'firebase/messaging';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, firebaseConfig, getMessagingIfSupported } from './firebase';

export async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return null;
  // A service worker can't read Vite's env vars, so the (public) Firebase
  // config is passed through the URL's query string.
  const params = new URLSearchParams(firebaseConfig).toString();
  return navigator.serviceWorker.register(`/firebase-messaging-sw.js?${params}`);
}

export function pushSupported() {
  return 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;
}

async function sha256Hex(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function enablePush({ deviceId, name }) {
  const id = String(deviceId || '').trim();
  const cleanName = String(name || '').trim().slice(0, 40);
  if (!/^[A-Za-z0-9_-]{3,40}$/.test(id)) {
    throw new Error('Enter the device code (letters, numbers, - or _).');
  }
  if (!cleanName) throw new Error('Please enter your name.');

  const messaging = await getMessagingIfSupported();
  if (!messaging) throw new Error('This browser does not support push notifications.');

  // Ask for permission first, while the tap is still fresh
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') throw new Error('Notification permission was not granted.');

  const deviceSnap = await getDoc(doc(db, 'devices', id));
  if (!deviceSnap.exists()) {
    throw new Error(`No device with code "${id}" was found. Check the code and try again.`);
  }

  const registration = await registerServiceWorker();
  await navigator.serviceWorker.ready;

  const token = await getToken(messaging, {
    vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    serviceWorkerRegistration: registration,
  });
  if (!token) throw new Error('Could not get a push token. Please try again.');

  // Private: only the backend can read this
  await setDoc(doc(db, 'pushTokens', `${id}__${token}`), {
    token,
    deviceId: id,
    name: cleanName,
    createdAt: serverTimestamp(),
    userAgent: navigator.userAgent.slice(0, 200),
  });

  // Public: just the name, so the dashboard can list who is paired (no token, no number)
  const hash = await sha256Hex(token);
  await setDoc(doc(db, 'contacts', `${id}__${hash.slice(0, 24)}`), {
    deviceId: id,
    name: cleanName,
    createdAt: serverTimestamp(),
  });

  return { deviceName: deviceSnap.data().name || id };
}
