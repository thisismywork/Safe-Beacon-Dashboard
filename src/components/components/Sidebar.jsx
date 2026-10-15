import React from 'react';
import Icon from './Icon.jsx';
import { timeAgo, useNow } from '../utils';

const MAIN = [
  ['dashboard', 'Dashboard', 'home'],
  ['live', 'Live Alerts', 'bolt'],
  ['history', 'Alert History', 'pulse'],
  ['map', 'Location Map', 'pin'],
];
const MANAGE = [
  ['contacts', 'Contacts', 'users'],
  ['devices', 'Devices', 'device'],
];

export default function Sidebar({ view, onView, liveCount, contactCount, deviceName, deviceId, lastAlert }) {
  const now = useNow(10000);

  const item = ([id, label, icon]) => {
    const badge = id === 'live' ? liveCount : id === 'contacts' ? contactCount : 0;
    return (
      <button key={id} className={`nav-item ${view === id ? 'active' : ''}`} onClick={() => onView(id)}>
        <Icon name={icon} size={17} />
        <span>{label}</span>
        {badge > 0 && <em className={`badge ${id === 'live' ? 'red' : 'amber'}`}>{badge}</em>}
      </button>
    );
  };

  return (
    <aside className="sidebar">
      <div className="nav-label">MAIN</div>
      {MAIN.map(item)}
      <div className="nav-label">MANAGE</div>
      {MANAGE.map(item)}

      {deviceId && (
        <div className="paired-card">
          <div className="nav-label tight">PAIRED DEVICE</div>
          <div className="paired-name">{deviceName}</div>
          <div className="paired-hw">{deviceId} · Arduino Nano · SIM800L · Neo-6M</div>
          <div className="paired-meta">
            <span className="dot ok" />
            {lastAlert ? `Last alert ${timeAgo(lastAlert.timestamp, now)}` : 'No alerts yet'}
          </div>
        </div>
      )}
    </aside>
  );
}
