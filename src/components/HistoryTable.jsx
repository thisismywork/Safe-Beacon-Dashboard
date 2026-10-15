import React from 'react';
import { coords, dateTime, isActive, statusLabel } from '../utils';

export default function HistoryTable({ alerts, nameOf, onSelect, onStatus }) {
  return (
    <section className="card table-card">
      <div className="card-title">Alert history</div>
      {alerts.length === 0 ? (
        <p className="muted">No alerts yet.</p>
      ) : (
        <div className="table-scroll">
          <table>
            <thead>
              <tr><th>Time</th><th>Wearer</th><th>Status</th><th>Location</th><th>Source</th><th /></tr>
            </thead>
            <tbody>
              {alerts.map((a) => (
                <tr key={a.id} onClick={() => onSelect(a.id)}>
                  <td>{dateTime(a.timestamp)}</td>
                  <td>{nameOf(a.deviceId)}</td>
                  <td><span className={`tag ${a.status}`}>{statusLabel(a.status)}</span></td>
                  <td className="mono">{coords(a)}</td>
                  <td>{a.source === 'mock' ? 'Test' : 'Device'}</td>
                  <td>
                    {isActive(a) && (
                      <button className="btn btn-red small" onClick={(e) => { e.stopPropagation(); onStatus(a.id, 'ACKNOWLEDGED'); }}>
                        Acknowledge
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
