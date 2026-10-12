/*
  SAFE BEACON - service worker
  Runs in the background (even when the app is closed) so Firebase Cloud
  Messaging can show an SOS notification on the phone.
*/
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

// Config arrives through the query string (see registerServiceWorker in src/push.js)
const params = new URL(self.location.href).searchParams;

firebase.initializeApp({
  apiKey: params.get('apiKey'),
  authDomain: params.get('authDomain'),
  projectId: params.get('projectId'),
  storageBucket: params.get('storageBucket'),
  messagingSenderId: params.get('messagingSenderId'),
  appId: params.get('appId'),
});

// Starting messaging here is what lets Firebase display background notifications
// and open the alert link when the notification is tapped.
firebase.messaging();

// Minimal fetch handler: helps older browsers treat the site as an installable app.
self.addEventListener('fetch', () => {});
