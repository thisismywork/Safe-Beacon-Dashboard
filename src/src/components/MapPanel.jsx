import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, CircleMarker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { coords, hasCoords, mapsUrl } from '../utils';

const pinIcon = (active) =>
  L.divIcon({
    className: 'pin-wrap',
    html: `<div class="pin ${active ? 'pin-active' : ''}"></div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 26],
  });

function Recenter({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], Math.max(map.getZoom(), 14), { animate: true });
  }, [lat, lng, map]);
  return null;
}

export default function MapPanel({ alerts, selected, title = 'Last known location', tall = false }) {
  const has = hasCoords(selected);
  const center = has ? [Number(selected.latitude), Number(selected.longitude)] : [0.0236, 37.9062]; // Kenya
  const others = alerts.filter((a) => hasCoords(a) && a.id !== selected?.id).slice(0, 30);

  return (
    <section className="map-card">
      <div className="map-head">
        <h3>{title}</h3>
        {has && (
          <a href={mapsUrl(selected)} target="_blank" rel="noreferrer">Open in Maps →</a>
        )}
      </div>

      <div className={`map-box ${tall ? 'tall' : ''}`}>
        <MapContainer center={center} zoom={has ? 15 : 6} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            subdomains="abcd"
            attribution="&copy; OpenStreetMap contributors &copy; CARTO"
          />
          {others.map((a) => (
            <CircleMarker
              key={a.id}
              center={[Number(a.latitude), Number(a.longitude)]}
              radius={5}
              pathOptions={{ color: '#ef3322', weight: 1, fillColor: '#ef3322', fillOpacity: 0.55 }}
            />
          ))}
          {has && (
            <>
              <Recenter lat={center[0]} lng={center[1]} />
              <Marker position={center} icon={pinIcon(selected.status === 'SOS_TRIGGERED')} />
            </>
          )}
        </MapContainer>

        {has && <div className="map-chip coords-chip mono">{coords(selected)}</div>}
        {!has && <div className="map-chip center-chip">Waiting for the first alert…</div>}
      </div>
    </section>
  );
}
