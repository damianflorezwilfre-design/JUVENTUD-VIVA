"use client"

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';
import Image from 'next/image';

// Create a custom pulse icon using standard HTML/CSS
const PulseIcon = L.divIcon({
  className: 'custom-div-icon',
  html: "<div class='map-marker-pulse'></div>",
  iconSize: [15, 15],
  iconAnchor: [7.5, 7.5],
  popupAnchor: [0, -10]
});

export default function MapViewer({ pins }: { pins: any[] }) {
  useEffect(() => {
    // This effect ensures Leaflet runs only on client
  }, []);

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden relative z-0 border border-gray-800 shadow-[0_0_30px_rgba(79,221,230,0.1)]">
      <MapContainer 
        center={[11.5444, -72.9072]} // Riohacha approx
        zoom={8} 
        style={{ height: '100%', width: '100%', background: '#0f172a' }} // Very dark background
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          subdomains={['a', 'b', 'c', 'd']}
          maxZoom={19}
        />
        
        {pins.map((pin) => (
          <Marker 
            key={pin.id} 
            position={[pin.latitude || pin.lat, pin.longitude || pin.lng]}
            icon={PulseIcon}
          >
            <Popup>
              <div className="flex flex-col bg-gray-900 w-full min-w-[240px]">
                {pin.imageUrl && (
                  <div className="w-full h-32 relative">
                    <Image 
                      src={pin.imageUrl} 
                      alt={pin.title} 
                      fill 
                      className="object-cover"
                    />
                    {/* Gradient overlay for text readability if we want, but image is separated here */}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                  </div>
                )}
                <div className="p-4 relative">
                  <h3 className="font-bold text-lg mb-1 text-white leading-tight">{pin.title}</h3>
                  <div className="text-xs text-jv-turquoise mb-3 flex items-center font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-jv-purple mr-1.5 inline-block"></span>
                    {pin.location}
                  </div>
                  <p className="text-sm text-gray-300 mb-3">{pin.description}</p>
                  
                  {pin.impactData && (
                    <div className="bg-gray-800/80 rounded-lg p-3 text-xs border border-gray-700/50">
                      <span className="font-bold block text-jv-turquoise mb-1 uppercase tracking-wider text-[10px]">Impacto:</span>
                      <span className="text-gray-200">{pin.impactData}</span>
                    </div>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
