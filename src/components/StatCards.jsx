import React from 'react';

export default function StatCards({ active, today, contacts, devices }) {
  const cards = [
    ['Active alerts', active, active === 1 ? 'Needs a response' : 'Need a response', 'red'],
    ['Today total', today, 'Since midnight', 'amber'],
    ['Paired contacts', contacts, 'Phones receiving alerts', 'green'],
    ['Devices', devices, 'Registered wearables', 'gray'],
  ];
  return (
    <div className="stat-grid">
      {cards.map(([label, value, sub, tone]) => (
        <div className="stat-card" key={label}>
          <div className="stat-label">{label}</div>
          <div className={`stat-value ${tone}`}>{value}</div>
          <div className="stat-sub">{sub}</div>
        </div>
      ))}
    </div>
  );
}
