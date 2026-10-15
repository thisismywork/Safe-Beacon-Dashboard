import React, { useState } from 'react';
import { enablePush, pushSupported } from '../push';

function load(key) {
  try { return localStorage.getItem(key) || ''; } catch { return ''; }
}
function save(key, value) {
  try { localStorage.setItem(key, value); } catch { /* storage may be unavailable */ }
}

export default function PairPhone({ devices, defaultDeviceId, installEvent, onInstall, onClose }) {
  const fromLink = new URLSearchParams(window.location.search).get('device') || '';
  const [deviceId, setDeviceId] = useState(defaultDeviceId || fromLink || load('sb_device'));
  const [name, setName] = useState(load('sb_name'));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [doneFor, setDoneFor] = useState('');

  const isIPhone = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const standalone = window.matchMedia('(display-mode: standalone)').matches;

  async function handleSubmit() {
    setBusy(true); setError('');
    try {
      const { deviceName } = await enablePush({ deviceId, name });
      save('sb_device', deviceId.trim());
      save('sb_name', name.trim());
      setDoneFor(deviceName);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <h3>Get alerts on this phone</h3>

        {doneFor ? (
          <>
            <p className="ok-text">✅ Done. This phone will now receive SOS alerts for {doneFor}.</p>
            <button className="btn btn-red wide" onClick={onClose}>Close</button>
          </>
        ) : !pushSupported() ? (
          <>
            <p className="muted">
              {isIPhone && !standalone
                ? 'On iPhone: tap Share, then “Add to Home Screen”, and open SAFE BEACON from there to enable alerts.'
                : 'This browser does not support push notifications. Try Chrome on Android.'}
            </p>
            <button className="btn btn-ghost wide" onClick={onClose}>Close</button>
          </>
        ) : (
          <>
            <p className="muted small">Pair this phone with a wearable. Only that wearable’s alerts will come here.</p>

            <label>
              Device code
              <input
                list="device-codes"
                value={deviceId}
                onChange={(e) => setDeviceId(e.target.value)}
                placeholder="e.g. SB-NANO-001"
                autoCapitalize="characters"
              />
              <datalist id="device-codes">
                {devices.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </datalist>
            </label>

            <label>
              Your name
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Jane Kamau" maxLength={40} />
            </label>

            {error && <p className="error-text">{error}</p>}

            <div className="modal-actions">
              {installEvent && !standalone && (
                <button className="btn btn-ghost" onClick={onInstall}>Install app</button>
              )}
              <button className="btn btn-red" onClick={handleSubmit} disabled={busy}>
                {busy ? 'Enabling…' : 'Enable alerts'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
