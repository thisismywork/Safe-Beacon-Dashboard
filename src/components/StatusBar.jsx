import React, { useEffect, useState } from 'react';

const STATE_LABEL = {
  connecting: 'CONNECTING',
  live: 'LIVE',
  error: 'CONNECTION LOST',
};

export default function StatusBar({ connectionState, alertCount }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const timeStr = now.toUTCString().slice(17, 25); // HH:MM:SS

  return (
    <header className="status-bar">
      <div className="brand">
        <span className="brand-mark" aria-hidden="true">
          <span className={`pulse-ring pulse-ring--${connectionState}`} />
          <span className={`pulse-dot pulse-dot--${connectionState}`} />
        </span>
        <div className="brand-text">
          <span className="brand-name">SAFE BEACON</span>
          <span className="brand-tagline">Emergency Alert Dashboard</span>
        </div>
      </div>

      <div className="status-meta">
        <div className="status-chip">
          <span className={`status-chip__dot status-chip__dot--${connectionState}`} />
          {STATE_LABEL[connectionState]}
        </div>
        <div className="status-meta__count">
          <span className="status-meta__count-num">{alertCount}</span> ALERTS TRACKED
        </div>
        <div className="status-meta__clock">{timeStr} UTC</div>
      </div>
    </header>
  );
}
