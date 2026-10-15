import React, { useState } from 'react';
import Icon from './Icon.jsx';
import { coords, directionsUrl, hasCoords, mapsUrl, sinceClock, timeAgo, useNow } from '../utils';

export default function LiveAlertBanner({ alert, name, onAcknowledge }) {
  const now = useNow(1000);
  const [note, setNote] = useState('');
  const located = hasCoords(alert);

  async function share() {
    const text = `🚨 ${name} needs help${alert.address ? ` near ${alert.address}` : ''}. Location: ${mapsUrl(alert)}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'SAFE BEACON alert', text });
      } else {
        await navigator.clipboard.writeText(text);
        setNote('Copied!');
        setTimeout(() => setNote(''), 2000);
      }
    } catch {
      /* the person closed the share sheet */
    }
  }

  return (
    <section className="live-banner">
      <div className="live-top">
        <div className="live-icon"><Icon name="pin" size={22} /></div>
        <div className="live-text">
          <div className="live-title">🚨 {name} needs help</div>
          <div className="live-sub">
            SOS sent {timeAgo(alert.timestamp, now)} · {alert.source === 'mock' ? 'Test data' : 'Live device'}
          </div>
        </div>
        <div className="live-clock">
          <span className="mono">{sinceClock(alert.timestamp, now)}</span>
          <small>since alert</small>
        </div>
      </div>

      <div className="live-place">
        <div className="place-label">LAST KNOWN LOCATION</div>
        <div className="place-name">{alert.address || (located ? 'Exact place name not available' : 'No location yet')}</div>
        {located && <div className="place-meta mono">{coords(alert)}</div>}
      </div>

      <div className="live-actions">
        {located && (
          <a className="btn btn-red big" href={mapsUrl(alert)} target="_blank" rel="noreferrer">Open in Google Maps</a>
        )}
        {located && (
          <a className="btn btn-ghost big" href={directionsUrl(alert)} target="_blank" rel="noreferrer">Get directions</a>
        )}
        <button className="btn btn-ghost big" onClick={share}>{note || 'Share'}</button>
        <button className="btn btn-ghost big" onClick={onAcknowledge}>I’m responding</button>
      </div>
    </section>
  );
}
