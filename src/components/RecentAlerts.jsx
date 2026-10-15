import React from 'react';
import { coords, isActive, statusLabel, timeAgo, useNow } from '../utils';

export default function RecentAlerts({
  items, selectedId, onSelect, nameOf, title = 'Recent alerts',
  onViewAll, onStatus, onAcknowledgeAll, empty = 'No alerts yet.',
}) {
  const now = useNow(1000);
  const activeCount = items.filter(isActive).length;

  return (
    <section className="recent">
      <div className="recent-head">
        <h3>{title}</h3>
        <span className="head-actions">
          {onAcknowledgeAll && activeCount > 1 && (
            <button className="link-btn" onClick={onAcknowledgeAll}>Acknowledge all ({activeCount})</button>
          )}
          {onViewAll && <button className="link-btn" onClick={onViewAll}>View all</button>}
        </span>
      </div>

      {items.length === 0 && <p className="muted pad">{empty}</p>}

      {items.map((a) => (
        <div
          key={a.id}
          className={`alert-row ${a.id === selectedId ? 'selected' : ''} s-${a.status}`}
          onClick={() => onSelect(a.id)}
        >
          <span className="row-dot" />
          <div className="row-main">
            <div className="row-name">{nameOf(a.deviceId)}</div>
            <div className="row-sub mono">{coords(a)}</div>
          </div>
          <div className="row-side">
            <span className={`tag ${a.status}`}>{statusLabel(a.status)}</span>
            <small>{timeAgo(a.timestamp, now)}</small>
          </div>
          {onStatus && isActive(a) && (
            <button className="btn btn-red small" onClick={(e) => { e.stopPropagation(); onStatus(a.id, 'ACKNOWLEDGED'); }}>
              Acknowledge
            </button>
          )}
        </div>
      ))}
    </section>
  );
}
