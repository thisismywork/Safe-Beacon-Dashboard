import React from 'react';
import Icon from './Icon.jsx';

const STATE = {
  live: ['ok', 'System online — monitoring active'],
  connecting: ['wait', 'Connecting…'],
  error: ['bad', 'Connection problem — check your network'],
};

export default function Header({ connection, activeCount, onBell, onPair }) {
  const [tone, text] = STATE[connection] || STATE.connecting;
  return (
    <header className="topbar">
      <div className="brand">
        <div className="brand-mark"><Icon name="pin" size={20} /></div>
        <div>
          <div className="brand-name">SAFE BEACON</div>
          <div className="brand-sub">EMERGENCY RESPONSE SYSTEM</div>
        </div>
      </div>

      <div className={`sys-status ${tone}`}><span className="dot" />{text}</div>

      <div className="top-actions">
        <button className="icon-btn" onClick={onBell} aria-label="Live alerts">
          <Icon name="bell" />
          {activeCount > 0 && <span className="bell-dot" />}
        </button>
        <button className="pill-btn" onClick={onPair}>Get alerts on this phone</button>
      </div>
    </header>
  );
}
