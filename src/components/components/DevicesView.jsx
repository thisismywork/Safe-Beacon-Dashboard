import React, { useState } from 'react';
import Icon from './Icon.jsx';
import { timeAgo, useNow } from '../utils';

export default function DevicesView({ devices, contacts, alerts, onPair }) {
  const now = useNow(10000);
  const [copied, setCopied] = useState('');

  async function copyLink(id) {
    const link = `${window.location.origin}/?device=${encodeURIComponent(id)}`;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(id);
      setTimeout(() => setCopied(''), 2000);
    } catch {
      window.prompt('Copy this pairing link:', link);
    }
  }

  return (
    <section className="view-stack">
      <div className="card">
        <div className="card-title">Devices</div>
        <p className="muted small">
          Each wearable only alerts the phones paired with it. Share its pairing link with a contact,
          and they tap “Enable alerts” on their phone.
        </p>
      </div>

      {devices.length === 0 && <div className="card"><p className="muted">No devices registered yet.</p></div>}

      {devices.map((d) => {
        const last = alerts.find((a) => a.deviceId === d.id);
        const count = contacts.filter((c) => c.deviceId === d.id).length;
        return (
          <div className="card device-card" key={d.id}>
            <div className="device-top">
              <div>
                <div className="device-name">{d.name || d.id}</div>
                <div className="mono muted">{d.id}</div>
              </div>
              <span className="tag Active-soft">{count} paired</span>
            </div>
            <div className="muted small">{last ? `Last alert ${timeAgo(last.timestamp, now)}` : 'No alerts yet'}</div>
            <div className="device-actions">
              <button className="btn btn-ghost" onClick={() => copyLink(d.id)}>
                <Icon name="copy" size={15} /> {copied === d.id ? 'Copied!' : 'Copy pairing link'}
              </button>
              <button className="btn btn-red" onClick={() => onPair(d.id)}>Pair this phone</button>
            </div>
          </div>
        );
      })}
    </section>
  );
}
