"use client"

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin, Info, ArrowRight } from 'lucide-react';

// Create a custom pulse icon using standard HTML/CSS
const PulseIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `
    <div class="relative flex items-center justify-center w-8 h-8">
      <div class="absolute w-full h-full bg-jv-turquoise rounded-full opacity-40 animate-ping"></div>
      <div class="relative w-4 h-4 bg-jv-purple rounded-full border-2 border-white shadow-[0_0_10px_rgba(155,28,201,0.8)]"></div>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16]
});

// Component to handle map flyTo animations
function MapController({ center }: { center: [number, number] | null }) {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.flyTo(center, 14, { duration: 1.5 });
    }
  }, [center, map]);
  
  return null;
}

export default function MapViewer({ pins }: { pins: any[] }) {
  const [activePin, setActivePin] = useState<any | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);
  const mapRef = useRef(null);

  // Default center if no pins
  const defaultCenter: [number, number] = [11.5444, -72.9072]; // Riohacha approx
  const initialCenter = pins.length > 0 ? [pins[0].latitude || pins[0].lat, pins[0].longitude || pins[0].lng] as [number, number] : defaultCenter;

  const handlePinClick = (pin: any) => {
    setActivePin(pin);
    setMapCenter([pin.latitude || pin.lat, pin.longitude || pin.lng]);
  };

  return (
    <div className="flex flex-col lg:flex-row w-full h-full gap-6">
      {/* Sidebar List */}
      <div className="w-full lg:w-1/3 flex flex-col h-[300px] lg:h-full bg-gray-900/50 rounded-2xl border border-gray-800 overflow-hidden">
        <div className="p-4 bg-gray-800/80 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white flex items-center">
            <MapPin className="text-jv-turquoise mr-2" />
            Comunidades
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            {pins.length} ubicaciones de impacto
          </p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
          {pins.map((pin) => (
            <motion.div
              key={pin.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handlePinClick(pin)}
              className={`p-4 rounded-xl cursor-pointer transition-all duration-300 border ${
                activePin?.id === pin.id 
                  ? 'bg-jv-purple/20 border-jv-purple shadow-[0_0_15px_rgba(155,28,201,0.3)]' 
                  : 'bg-gray-800/50 border-gray-700 hover:border-jv-turquoise/50'
              }`}
            >
              <h3 className="font-bold text-white text-lg mb-1">{pin.title}</h3>
              <div className="text-xs text-jv-turquoise mb-2 flex items-center">
                <MapPin size={12} className="mr-1" />
                {pin.location}
              </div>
              <p className="text-sm text-gray-400 line-clamp-2 mb-3">{pin.description}</p>
              
              <div className="flex items-center justify-between text-xs font-semibold text-jv-purple group">
                <span>Ver en mapa</span>
                <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
          
          {pins.length === 0 && (
            <div className="text-center p-6 text-gray-500">
              No hay comunidades registradas aún.
            </div>
          )}
        </div>
      </div>

      {/* Map Container */}
      <div className="w-full lg:w-2/3 h-[400px] lg:h-full rounded-2xl overflow-hidden relative z-0 border border-gray-800 shadow-[0_0_30px_rgba(79,221,230,0.1)]">
        <MapContainer 
          center={initialCenter} 
          zoom={9} 
          style={{ height: '100%', width: '100%', background: '#0f172a' }} // Very dark background
        >
          <TileLayer
            attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            subdomains={['a', 'b', 'c', 'd']}
            maxZoom={19}
          />
          
          <MapController center={mapCenter} />
          
          {pins.map((pin) => (
            <Marker 
              key={pin.id} 
              position={[pin.latitude || pin.lat, pin.longitude || pin.lng]}
              icon={PulseIcon}
              eventHandlers={{
                click: () => setActivePin(pin),
              }}
            >
              <Popup className="custom-popup">
                <div className="flex flex-col bg-gray-900 w-[260px] rounded-xl overflow-hidden shadow-2xl border border-gray-700">
                  {pin.imageUrl && (
                    <div className="w-full h-36 relative">
                      <Image 
                        src={pin.imageUrl} 
                        alt={pin.title} 
                        fill 
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
                    </div>
                  )}
                  <div className="p-4 relative">
                    <h3 className="font-bold text-lg mb-1 text-white leading-tight">{pin.title}</h3>
                    <div className="text-xs text-jv-turquoise mb-3 flex items-center font-semibold">
                      <MapPin size={12} className="mr-1" />
                      {pin.location}
                    </div>
                    <p className="text-sm text-gray-300 mb-3 line-clamp-3">{pin.description}</p>
                    
                    {pin.impactData && (
                      <div className="bg-gradient-to-r from-jv-purple/20 to-jv-turquoise/20 rounded-lg p-3 text-xs border border-jv-purple/30 flex items-start">
                        <Info size={14} className="text-jv-turquoise mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-bold block text-white mb-0.5">Impacto Logrado</span>
                          <span className="text-gray-300">{pin.impactData}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .leaflet-popup-content-wrapper {
          background: transparent;
          box-shadow: none;
          padding: 0;
        }
        .leaflet-popup-content {
          margin: 0;
          width: 260px !important;
        }
        .leaflet-popup-tip-container {
          display: none;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(31, 41, 55, 0.5);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(155, 28, 201, 0.5);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(79, 221, 230, 0.7);
        }
      `}} />
    </div>
  );
}
