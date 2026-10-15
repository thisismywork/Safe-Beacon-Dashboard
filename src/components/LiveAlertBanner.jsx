import React from 'react';
import Icon from './Icon.jsx';
import { coords, sinceClock, timeAgo, useNow } from '../utils';

export default function LiveAlertBanner({ alert, name, onSelect, onAcknowledge }) {
  const now = useNow(1000);
  return (
    <section className="live-banner" onClick={onSelect}>
      <div className="live-icon"><Icon name="pin" size={22} /></div>
      <div className="live-text">
        <div className="live-title">🚨 LIVE ALERT — {name} needs help</div>
        <div className="live-sub">
          GPS: {coords(alert)} · {alert.source === 'mock' ? 'Test data' : 'Live device'} · {timeAgo(alert.timestamp, now)}
        </div>
      </div>
      <div className="live-clock">
        <span className="mono">{sinceClock(alert.timestamp, now)}</span>
        <small>since alert</small>
      </div>
      <button className="btn btn-red" onClick={(e) => { e.stopPropagation(); onAcknowledge(); }}>
        Acknowledge
      </button>
    </section>
  );
}
