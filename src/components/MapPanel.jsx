import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Default Leaflet marker icons reference image files that don't resolve
// correctly under Vite's bundler - this rebuilds them from the CDN instead.
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function RecenterOnSelect({ alert }) {
  const map = useMap();
  useEffect(() => {
    if (alert?.latitude && alert?.longitude) {
      map.flyTo([alert.latitude, alert.longitude], 15, { duration: 0.8 });
    }
  }, [alert, map]);
  return null;
}

export default function MapPanel({ alerts, selectedAlert }) {
  const hasAlerts = alerts.length > 0;
  const center = selectedAlert
    ? [selectedAlert.latitude, selectedAlert.longitude]
    : [0.5143, 35.2698]; // fallback: Eldoret, Kenya

  return (
    <div className="map-panel">
      <div className="map-panel__header">
        <span>Location Feed</span>
        {hasAlerts && <span className="map-panel__hint">Tap a marker for details</span>}
      </div>
      <div className="map-panel__frame">
        <MapContainer
          center={center}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {alerts.map((alert) =>
            alert.latitude && alert.longitude ? (
              <Marker key={alert.id} position={[alert.latitude, alert.longitude]}>
                <Popup>
                  <strong>{alert.deviceId}</strong>
                  <br />
                  {alert.status}
                  <br />
                  {alert.latitude.toFixed(6)}, {alert.longitude.toFixed(6)}
                </Popup>
              </Marker>
            ) : null
          )}
          <RecenterOnSelect alert={selectedAlert} />
        </MapContainer>
      </div>
    </div>
  );
}
