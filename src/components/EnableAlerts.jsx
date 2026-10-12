import React, { useEffect, useState } from 'react';
import { enablePush, pushSupported } from '../push';

// Self-contained banner (inline styles) so it doesn't depend on your CSS.
const bar = {
  position: 'fixed', left: 12, right: 12,
  bottom: 'calc(12px + env(safe-area-inset-bottom, 0px))',
  zIndex: 1000, display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center',
  justifyContent: 'space-between', padding: '10px 14px', borderRadius: 12,
  background: '#0f172a', color: '#f8fafc', fontSize: 14,
  boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
};
const btn = {
  border: 'none', borderRadius: 8, padding: '8px 14px', fontWeight: 600,
  background: '#dc2626', color: '#fff', cursor: 'pointer',
};

export default function EnableAlerts() {
  const [permission, setPermission] = useState(
    'Notification' in window ? Notification.permission : 'unsupported'
  );
  const [installEvent, setInstallEvent] = useState(null);
  const [installed, setInstalled] = useState(
    window.matchMedia('(display-mode: standalone)').matches
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const onPrompt = (e) => { e.preventDefault(); setInstallEvent(e); };
    const onInstalled = () => { setInstalled(true); setInstallEvent(null); };
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  async function handleEnable() {
    setBusy(true); setError('');
    try {
      await enablePush();
      setPermission('granted');
    } catch (err) {
      setError(err.message);
      if ('Notification' in window) setPermission(Notification.permission);
    } finally {
      setBusy(false);
    }
  }

  async function handleInstall() {
    installEvent.prompt();
    await installEvent.userChoice;
    setInstallEvent(null);
  }

  const isIPhone = /iphone|ipad|ipod/i.test(navigator.userAgent);

  // iPhones only allow push once the app is on the Home Screen
  if (!pushSupported() && isIPhone && !installed) {
    return (
      <div style={bar}>
        <span>On iPhone: tap Share, then “Add to Home Screen”, and open SAFE BEACON from there to enable alerts.</span>
      </div>
    );
  }
  if (!pushSupported()) return null;

  if (permission === 'granted' && !installEvent) {
    return <div style={{ ...bar, justifyContent: 'center' }}>🔔 Emergency alerts are on for this phone</div>;
  }

  if (permission === 'denied') {
    return (
      <div style={bar}>
        <span>Notifications are blocked. Allow them in your browser's site settings to receive alerts.</span>
      </div>
    );
  }

  return (
    <div style={bar}>
      <span>{error || 'Get an alert on this phone the moment an SOS is sent.'}</span>
      <span style={{ display: 'flex', gap: 8 }}>
        {installEvent && !installed && (
          <button style={{ ...btn, background: '#334155' }} onClick={handleInstall}>Install app</button>
        )}
        {permission !== 'granted' && (
          <button style={btn} onClick={handleEnable} disabled={busy}>
            {busy ? 'Enabling…' : 'Enable alerts'}
          </button>
        )}
      </span>
    </div>
  );
}
