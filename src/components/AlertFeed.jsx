import React from 'react';

function relativeTime(isoString) {
  if (!isoString) return '—';
  const diffMs = Date.now() - new Date(isoString).getTime();
  const diffSec = Math.max(0, Math.floor(diffMs / 1000));
  if (diffSec < 5) return 'just now';
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  return `${diffHr}h ago`;
}

export default function AlertFeed({ alerts, selectedId, onSelect, connectionState }) {
  return (
    <aside className="alert-feed">
      <div className="alert-feed__header">
        <span>Incoming Alerts</span>
      </div>

      {connectionState === 'connecting' && (
        <div className="alert-feed__empty">
          <p>Connecting to Firestore…</p>
        </div>
      )}

      {connectionState === 'error' && (
        <div className="alert-feed__empty alert-feed__empty--error">
          <p>Connection lost.</p>
          <p className="alert-feed__empty-sub">Check your Firebase config in .env and refresh.</p>
        </div>
      )}

      {connectionState === 'live' && alerts.length === 0 && (
        <div className="alert-feed__empty">
          <p>No alerts yet.</p>
          <p className="alert-feed__empty-sub">
            Run <code>node mockGpsSender.js</code> in the backend to send a test alert.
          </p>
        </div>
      )}

      <ul className="alert-feed__list">
        {alerts.map((alert, index) => (
          <li key={alert.id}>
            <button
              className={`alert-card ${alert.id === selectedId ? 'alert-card--active' : ''}`}
              onClick={() => onSelect(alert.id)}
            >
              <div className="alert-card__top">
                <span className={`alert-card__badge alert-card__badge--${(alert.status || 'unknown').toLowerCase()}`}>
                  {alert.status === 'SOS_TRIGGERED' ? 'SOS' : alert.status || 'UNKNOWN'}
                </span>
                {index === 0 && <span className="alert-card__latest">LATEST</span>}
              </div>
              <div className="alert-card__device">{alert.deviceId || 'Unknown device'}</div>
              <div className="alert-card__coords">
                {alert.latitude?.toFixed(5)}, {alert.longitude?.toFixed(5)}
              </div>
              <div className="alert-card__time">{relativeTime(alert.timestamp)}</div>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
