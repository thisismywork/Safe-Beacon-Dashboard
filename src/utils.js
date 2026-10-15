import { useEffect, useState } from 'react';

// Re-renders the calling component every `ms` so "x seconds ago" stays live
export function useNow(ms = 1000) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), ms);
    return () => clearInterval(t);
  }, [ms]);
  return now;
}

export function timeAgo(iso, now = Date.now()) {
  if (!iso) return '—';
  const s = Math.max(0, Math.floor((now - new Date(iso).getTime()) / 1000));
  if (s < 60) return `${s} second${s === 1 ? '' : 's'} ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} minute${m === 1 ? '' : 's'} ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hour${h === 1 ? '' : 's'} ago`;
  const d = Math.floor(h / 24);
  return `${d} day${d === 1 ? '' : 's'} ago`;
}

// "10:11" style stopwatch since the alert was raised
export function sinceClock(iso, now = Date.now()) {
  const total = Math.max(0, Math.floor((now - new Date(iso).getTime()) / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n) => String(n).padStart(2, '0');
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

export const isActive = (a) => a.status === 'SOS_TRIGGERED';

export function isToday(iso) {
  if (!iso) return false;
  return new Date(iso).toDateString() === new Date().toDateString();
}

export const hasCoords = (a) =>
  a && Number.isFinite(Number(a.latitude)) && Number.isFinite(Number(a.longitude));

export const coords = (a) =>
  hasCoords(a) ? `${Number(a.latitude).toFixed(4)}, ${Number(a.longitude).toFixed(4)}` : 'No location';

export const mapsUrl = (a) =>
  `https://www.google.com/maps/search/?api=1&query=${a.latitude},${a.longitude}`;

export const directionsUrl = (a) =>
  `https://www.google.com/maps/dir/?api=1&destination=${a.latitude},${a.longitude}`;

// The most human-friendly description of where the wearer is
export const placeText = (a) => a.address || coords(a);

export const clockTime = (iso) =>
  iso ? new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '—';

export const dateTime = (iso) =>
  iso ? new Date(iso).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : '—';

export const initials = (name = '?') =>
  name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('') || '?';

const PALETTE = ['#c026d3', '#7c4dff', '#16a34a', '#d97706', '#0891b2', '#e11d48'];
export function colorFor(str = '') {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length];
}

export const STATUS_LABEL = {
  SOS_TRIGGERED: 'Active',
  ACKNOWLEDGED: 'Acknowledged',
  RESOLVED: 'Resolved',
};
export const statusLabel = (s) => STATUS_LABEL[s] || 'Unknown';
