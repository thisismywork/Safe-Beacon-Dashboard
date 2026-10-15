import React from 'react';
import { colorFor, initials } from '../utils';

export default function ContactsView({ devices, contacts, onPair }) {
  const nameOfDevice = (id) => devices.find((d) => d.id === id)?.name || id;
  const groups = [...new Set(contacts.map((c) => c.deviceId))];

  return (
    <section className="view-stack">
      <div className="card">
        <div className="card-title">Emergency contacts</div>
        <p className="muted small">
          Phone numbers and tokens stay private. Only names are shown here.
        </p>
        <button className="dashed-btn" onClick={() => onPair()}>＋ Pair a phone</button>
      </div>

      {contacts.length === 0 && <div className="card"><p className="muted">No phones paired yet.</p></div>}

      {groups.map((deviceId) => (
        <div className="card" key={deviceId}>
          <div className="card-title">{nameOfDevice(deviceId)} · {deviceId}</div>
          {contacts.filter((c) => c.deviceId === deviceId).map((c) => (
            <div className="contact-row" key={c.id}>
              <div className="avatar" style={{ background: colorFor(c.name) }}>{initials(c.name)}</div>
              <div className="contact-main">
                <div className="contact-name">{c.name}</div>
                <div className="contact-sub">Alerts on this phone</div>
              </div>
              <span className="dot ok" />
            </div>
          ))}
        </div>
      ))}
    </section>
  );
}
