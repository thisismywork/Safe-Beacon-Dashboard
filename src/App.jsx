import React, { useEffect, useMemo, useState } from 'react';
import { collection, doc, limit, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { registerServiceWorker } from './push';
import { isActive, isToday } from './utils';
import Header from './components/Header.jsx';
import Sidebar from './components/Sidebar.jsx';
import LiveAlertBanner from './components/LiveAlertBanner.jsx';
import StatCards from './components/StatCards.jsx';
import MapPanel from './components/MapPanel.jsx';
import RecentAlerts from './components/RecentAlerts.jsx';
import DeviceRail from './components/DeviceRail.jsx';
import HistoryTable from './components/HistoryTable.jsx';
import DevicesView from './components/DevicesView.jsx';
import ContactsView from './components/ContactsView.jsx';
import PairPhone from './components/PairPhone.jsx';

export default function App() {
  const params = new URLSearchParams(window.location.search);

  const [alerts, setAlerts] = useState([]);
  const [devices, setDevices] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [connection, setConnection] = useState('connecting'); // connecting | live | error
  const [view, setView] = useState('dashboard');
  const [selectedId, setSelectedId] = useState(() => params.get('alert'));
  const [pair, setPair] = useState(() => (params.has('device') ? { open: true, deviceId: params.get('device') } : { open: false }));
  const [installEvent, setInstallEvent] = useState(null);

  useEffect(() => {
    registerServiceWorker().catch((err) => console.error('Service worker error:', err));

    const onPrompt = (e) => { e.preventDefault(); setInstallEvent(e); };
    const onInstalled = () => setInstallEvent(null);
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  useEffect(() => {
    const toRows = (snap) => snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    const logErr = (label) => (err) => console.error(`${label} listener error:`, err);

    const unsubs = [
      onSnapshot(
        query(collection(db, 'alerts'), orderBy('timestamp', 'desc'), limit(100)),
        (snap) => { setAlerts(toRows(snap)); setConnection('live'); },
        (err) => { console.error('Alerts listener error:', err); setConnection('error'); }
      ),
      onSnapshot(collection(db, 'devices'), (snap) => setDevices(toRows(snap)), logErr('Devices')),
      onSnapshot(collection(db, 'contacts'), (snap) => setContacts(toRows(snap)), logErr('Contacts')),
    ];
    return () => unsubs.forEach((u) => u());
  }, []);

  const devicesById = useMemo(() => Object.fromEntries(devices.map((d) => [d.id, d])), [devices]);
  const nameOf = (id) => devicesById[id]?.name || id || 'Unknown device';

  const active = useMemo(() => alerts.filter(isActive), [alerts]);
  const latestActive = active[0] || null;
  const selected = alerts.find((a) => a.id === selectedId) || latestActive || alerts[0] || null;
  const todayCount = alerts.filter((a) => isToday(a.timestamp)).length;

  const railContacts = selected ? contacts.filter((c) => c.deviceId === selected.deviceId) : [];
  const sidebarDeviceId = selected?.deviceId || devices[0]?.id || null;
  const lastAlertForSidebar = sidebarDeviceId ? alerts.find((a) => a.deviceId === sidebarDeviceId) : null;

  async function setStatus(id, status) {
    const field = status === 'ACKNOWLEDGED' ? 'acknowledgedAt' : 'resolvedAt';
    try {
      await updateDoc(doc(db, 'alerts', id), { status, [field]: new Date().toISOString() });
    } catch (err) {
      console.error(err);
      window.alert(`Could not update the alert: ${err.message}`);
    }
  }

  const acknowledgeAll = () => Promise.all(active.map((a) => setStatus(a.id, 'ACKNOWLEDGED')));
  const showAlert = (id) => { setSelectedId(id); setView('dashboard'); };
  const openPair = (deviceId) => setPair({ open: true, deviceId: typeof deviceId === 'string' ? deviceId : undefined });

  async function installApp() {
    if (!installEvent) return;
    installEvent.prompt();
    await installEvent.userChoice;
    setInstallEvent(null);
  }

  return (
    <div className="shell">
      <Header
        connection={connection}
        activeCount={active.length}
        onBell={() => setView('live')}
        onPair={() => openPair()}
      />

      <div className="body">
        <Sidebar
          view={view}
          onView={setView}
          liveCount={active.length}
          contactCount={contacts.length}
          deviceId={sidebarDeviceId}
          deviceName={sidebarDeviceId ? nameOf(sidebarDeviceId) : ''}
          lastAlert={lastAlertForSidebar}
        />

        <main className="content">
          {view === 'dashboard' && (
            <div className="dash-grid">
              <div className="dash-main">
                {latestActive ? (
                  <LiveAlertBanner
                    alert={latestActive}
                    name={nameOf(latestActive.deviceId)}
                    onSelect={() => setSelectedId(latestActive.id)}
                    onAcknowledge={() => setStatus(latestActive.id, 'ACKNOWLEDGED')}
                  />
                ) : (
                  <div className="all-clear">✅ No active alerts. All devices are quiet.</div>
                )}

                <StatCards active={active.length} today={todayCount} contacts={contacts.length} devices={devices.length} />
                <MapPanel alerts={alerts} selected={selected} />
                <RecentAlerts
                  items={alerts.slice(0, 6)}
                  selectedId={selected?.id}
                  onSelect={setSelectedId}
                  nameOf={nameOf}
                  onViewAll={() => setView('history')}
                />
              </div>

              <DeviceRail
                alert={selected}
                name={selected ? nameOf(selected.deviceId) : ''}
                contacts={railContacts}
                logItems={alerts.slice(0, 8)}
                nameOf={nameOf}
                onStatus={setStatus}
                onAddContact={() => openPair(selected?.deviceId)}
              />
            </div>
          )}

          {view === 'live' && (
            <RecentAlerts
              title="Live alerts"
              items={active}
              selectedId={selected?.id}
              onSelect={showAlert}
              nameOf={nameOf}
              onStatus={setStatus}
              onAcknowledgeAll={acknowledgeAll}
              empty="No active alerts right now."
            />
          )}

          {view === 'history' && (
            <HistoryTable alerts={alerts} nameOf={nameOf} onSelect={showAlert} onStatus={setStatus} />
          )}

          {view === 'map' && <MapPanel alerts={alerts} selected={selected} title="Location map" tall />}

          {view === 'contacts' && <ContactsView devices={devices} contacts={contacts} onPair={openPair} />}

          {view === 'devices' && (
            <DevicesView devices={devices} contacts={contacts} alerts={alerts} onPair={openPair} />
          )}
        </main>
      </div>

      {pair.open && (
        <PairPhone
          devices={devices}
          defaultDeviceId={pair.deviceId}
          installEvent={installEvent}
          onInstall={installApp}
          onClose={() => setPair({ open: false })}
        />
      )}
    </div>
  );
}
