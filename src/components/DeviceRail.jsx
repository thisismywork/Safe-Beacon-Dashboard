import React from 'react';
import Icon from './Icon.jsx';
import { clockTime, colorFor, initials, isActive, mapsUrl, placeText, statusLabel, timeAgo, useNow, hasCoords } from '../utils';

export default function DeviceRail({ alert, name, contacts, logItems, nameOf, onStatus, onAddContact }) {
  const now = useNow(1000);

  return (
    <aside className="rail">
      <section className="card">
        <div className="card-title">Device details</div>
        {alert ? (
          <>
            <div className="kv"><span>Wearer</span><strong>{name}</strong></div>
            <div className="kv">
              <span>Battery</span>
              <strong className="amber">{alert.batteryLevel != null ? `${alert.batteryLevel}%` : '—'}</strong>
            </div>
            <div className="kv"><span>Location</span><strong>{placeText(alert)}</strong></div>
            <div className="kv"><span>Device ID</span><strong className="mono">{alert.deviceId}</strong></div>
            <div className="kv"><span>Last alert</span><strong>{timeAgo(alert.timestamp, now)}</strong></div>
            <div className="kv"><span>Status</span><strong>{statusLabel(alert.status)}</strong></div>

            <div className="rail-actions">
              {isActive(alert) && (
                <button className="btn btn-red" onClick={() => onStatus(alert.id, 'ACKNOWLEDGED')}>Acknowledge</button>
              )}
              {hasCoords(alert) && (
                <a className="btn btn-ghost" href={mapsUrl(alert)} target="_blank" rel="noreferrer">
                  <Icon name="nav" size={15} /> Track
                </a>
              )}
            </div>
            {alert.status !== 'RESOLVED' && (
              <button className="btn btn-ghost wide" onClick={() => onStatus(alert.id, 'RESOLVED')}>
                ✓ Mark as resolved
              </button>
            )}
          </>
        ) : (
          <p className="muted">No alerts yet.</p>
        )}
      </section>

      <section className="card">
        <div className="card-title">Emergency contacts</div>
        {contacts.length === 0 && <p className="muted small">No phones are paired with this device yet.</p>}
        {contacts.map((c) => (
          <div className="contact-row" key={c.id}>
            <div className="avatar" style={{ background: colorFor(c.name) }}>{initials(c.name)}</div>
            <div className="contact-main">
              <div className="contact-name">{c.name}</div>
              <div className="contact-sub">Alerts on this phone</div>
            </div>
            <span className="dot ok" />
          </div>
        ))}
        <button className="dashed-btn" onClick={onAddContact}>＋ Add emergency contact</button>
      </section>

      <section className="card">
        <div className="card-title">System log</div>
        {logItems.length === 0 && <p className="muted small">Nothing logged yet.</p>}
        {logItems.map((a) => (
          <div className="log-row" key={a.id}>
            <span className="mono muted">{clockTime(a.timestamp)}</span>
            <span className={`log-tag ${a.status}`}>
              {a.status === 'SOS_TRIGGERED' ? 'SOS' : a.status === 'ACKNOWLEDGED' ? 'ACK' : 'RESOLVED'}
            </span>
            <span className="log-text">{nameOf(a.deviceId)}</span>
          </div>
        ))}
      </section>
    </aside>
  );
}
