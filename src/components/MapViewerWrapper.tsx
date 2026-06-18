"use client"

import dynamic from 'next/dynamic';

const MapViewer = dynamic(() => import('./MapViewer'), { 
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center bg-gray-900 text-jv-turquoise">Cargando mapa...</div>
});

export default function MapViewerWrapper({ pins }: { pins: any[] }) {
  return <MapViewer pins={pins} />;
}
