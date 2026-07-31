import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query, limit } from 'firebase/firestore';
import { db } from './firebase';
import AlertFeed from './components/AlertFeed.jsx';
import MapPanel from './components/MapPanel.jsx';
import AlertDetail from './components/AlertDetail.jsx';
import StatusBar from './components/StatusBar.jsx';

export default function App() {
  const [alerts, setAlerts] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [connectionState, setConnectionState] = useState('connecting'); // connecting | live | error

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
    </div>
  );
}
