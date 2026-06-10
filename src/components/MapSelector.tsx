"use client"

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Fix leaflet icon issue in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function LocationMarker({ position, setPosition }: { position: L.LatLngExpression, setPosition: (p: L.LatLng) => void }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position === null ? null : (
    <Marker position={position} />
  )
}

export default function MapSelector({ lat, lng, onChange }: { lat: number, lng: number, onChange: (lat: number, lng: number) => void }) {
  const [position, setPosition] = useState<L.LatLng>(new L.LatLng(lat, lng));

  useEffect(() => {
    setPosition(new L.LatLng(lat, lng));
  }, [lat, lng]);

  const handlePositionChange = (p: L.LatLng) => {
    setPosition(p);
    onChange(p.lat, p.lng);
  }

  return (
    <MapContainer center={[lat, lng]} zoom={8} scrollWheelZoom={true} className="w-full h-full">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker position={position} setPosition={handlePositionChange} />
    </MapContainer>
  );
}
