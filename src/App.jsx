import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query, limit } from 'firebase/firestore';
import { db } from './firebase';
import { registerServiceWorker } from './push';
import AlertFeed from './components/AlertFeed.jsx';
import MapPanel from './components/MapPanel.jsx';
import AlertDetail from './components/AlertDetail.jsx';
import StatusBar from './components/StatusBar.jsx';
import EnableAlerts from './components/EnableAlerts.jsx';

export default function App() {
  const [alerts, setAlerts] = useState([]);
  // CHANGE 1: if the app was opened from a notification (/?alert=ID), start on that alert
  const [selectedId, setSelectedId] = useState(
    () => new URLSearchParams(window.location.search).get('alert')
  );
  const [connectionState, setConnectionState] = useState('connecting'); // connecting | live | error

  // CHANGE 2: register the service worker as soon as the app loads
  useEffect(() => {
    registerServiceWorker().catch((err) => console.error('Service worker error:', err));
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'alerts'), orderBy('timestamp', 'desc'), limit(25));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const rows = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setAlerts(rows);
        setConnectionState('live');
        // auto-select the most recent alert if nothing is selected yet
        setSelectedId((prev) => prev ?? (rows[0]?.id ?? null));
      },
      (error) => {
        console.error('Firestore listener error:', error);
        setConnectionState('error');
      }
    );

    return () => unsubscribe();
  }, []);

  const selectedAlert = alerts.find((a) => a.id === selectedId) ?? alerts[0] ?? null;

  return (
    <div className="app-shell">
      <StatusBar connectionState={connectionState} alertCount={alerts.length} />

      <main className="app-main">
        <AlertFeed
          alerts={alerts}
          selectedId={selectedAlert?.id}
          onSelect={setSelectedId}
          connectionState={connectionState}
        />

        <section className="main-panel">
          <MapPanel alerts={alerts} selectedAlert={selectedAlert} />
          <AlertDetail alert={selectedAlert} />
        </section>
      </main>

      {/* CHANGE 3: install + enable-notifications banner */}
      <EnableAlerts />
    </div>
  );
}
