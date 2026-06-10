"use client"

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';

// Fix for default marker icon in react-leaflet
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

export default function MapViewer({ pins }: { pins: any[] }) {
  useEffect(() => {
    // This effect ensures Leaflet runs only on client
  }, []);

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden relative z-0 border border-gray-800">
      <MapContainer 
        center={[11.5444, -72.9072]} // Riohacha approx
        zoom={8} 
        style={{ height: '100%', width: '100%', background: '#111827' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {pins.map((pin) => (
          <Marker 
            key={pin.id} 
            position={[pin.latitude, pin.longitude]}
          >
            <Popup>
              <div className="text-gray-900 p-1">
                <h3 className="font-bold text-lg mb-1">{pin.title}</h3>
                <p className="text-sm mb-2 text-gray-700">{pin.description}</p>
                <div className="bg-gray-100 rounded p-2 text-xs">
                  <span className="font-bold block mb-1">Impacto:</span>
                  {pin.impactData}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
