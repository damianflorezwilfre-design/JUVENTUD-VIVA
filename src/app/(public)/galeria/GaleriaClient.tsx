"use client"

import { useState } from "react";
import { motion } from "framer-motion";
import { Folder, Image as ImageIcon, Video, ArrowLeft, ExternalLink, X, Download } from "lucide-react";
import Image from "next/image";

type GalleryItem = {
  id: string;
  title: string | null;
  url: string;
  type: string;
  album: string;
  createdAt: string;
};

export default function GaleriaClient({ initialItems }: { initialItems: GalleryItem[] }) {
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<GalleryItem | null>(null);

  // Agrupar items por album
  const albumsMap = new Map<string, GalleryItem[]>();
  initialItems.forEach(item => {
    const albumName = item.album || "General";
    if (!albumsMap.has(albumName)) {
      albumsMap.set(albumName, []);
    }
    albumsMap.get(albumName)!.push(item);
  });

  const albums = Array.from(albumsMap.entries()).map(([name, files]) => ({
    name,
    files,
    coverUrl: files.find(f => f.type === 'cover')?.url || files.find(f => f.type === 'image')?.url || null
  }));

  const selectedItems = selectedAlbum ? albumsMap.get(selectedAlbum) || [] : [];

  return (
    <div className="py-20 px-4 max-w-7xl mx-auto min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16 pt-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">Nuestra <span className="text-transparent bg-clip-text bg-gradient-to-r from-jv-purple to-jv-turquoise">Galería</span></h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Un recorrido visual por el impacto y las sonrisas que hemos construido juntos.
        </p>
      </motion.div>

      {albums.length === 0 ? (
        <div className="text-center py-20 bg-gray-900 border border-gray-800 rounded-3xl">
          <p className="text-gray-500">Aún no hay fotos publicadas en la galería.</p>
        </div>
      ) : !selectedAlbum ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {albums.map((album, idx) => (
            <motion.div
              key={album.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => setSelectedAlbum(album.name)}
              className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden cursor-pointer group hover:border-jv-purple transition-all duration-300 shadow-xl"
            >
              <div className="aspect-[4/3] bg-gray-800 relative overflow-hidden">
                {album.coverUrl ? (
                  <Image src={album.coverUrl} alt={album.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" unoptimized={true} className="object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600">
                    <Folder size={64} />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="flex items-start mb-2">
                    <div className="bg-jv-purple/80 backdrop-blur-md p-1.5 rounded-lg mr-3 shadow-lg flex-shrink-0 mt-0.5">
                      <Folder size={18} className="text-white" />
                    </div>
                    <h3 className="text-base md:text-lg font-bold text-white leading-snug drop-shadow-lg line-clamp-3">
                      {album.name}
                    </h3>
                  </div>
                  <div className="pl-11">
                    <span className="inline-block bg-black/50 backdrop-blur-sm border border-gray-600/50 text-gray-300 text-xs px-2.5 py-1 rounded-full font-medium">
                      {album.files.length} archivo{album.files.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div>
          <button 
            onClick={() => setSelectedAlbum(null)}
            className="mb-8 flex items-center text-gray-400 hover:text-jv-turquoise transition-colors font-medium bg-gray-900/50 px-4 py-2 rounded-lg border border-gray-800 hover:border-jv-turquoise"
          >
            <ArrowLeft size={20} className="mr-2" />
            Volver a los Álbumes
          </button>

          <h2 className="text-3xl font-bold text-white mb-8 flex items-center border-b border-gray-800 pb-4">
            <Folder size={32} className="mr-4 text-jv-purple" />
            {selectedAlbum}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {selectedItems.map((item, idx) => (
              <div 
                key={item.id}
                className={`bg-gray-900 rounded-xl overflow-hidden border border-gray-800 group relative shadow-lg ${item.type === 'image' || item.type === 'cover' ? 'cursor-pointer' : ''}`}
                onClick={() => {
                  if (item.type === 'image' || item.type === 'cover') setLightboxImage(item);
                }}
              >
                <div className="aspect-square bg-gray-800 relative">
                  {item.type === 'image' || item.type === 'cover' ? (
                    <Image src={item.url} alt={item.title || "Imagen"} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" unoptimized={true} className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                      <Video size={48} className="mb-2 opacity-50" />
                      <span className="text-sm font-medium">Video</span>
                    </div>
                  )}
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center">
                    {item.title && <h3 className="text-white font-medium mb-3 line-clamp-2">{item.title}</h3>}
                    
                    {item.type === 'video' ? (
                      <a href={item.url} target="_blank" rel="noreferrer" className="p-3 bg-jv-purple hover:bg-jv-turquoise text-white rounded-full transition-colors shadow-lg" onClick={(e) => e.stopPropagation()}>
                        <ExternalLink size={20} />
                      </a>
                    ) : (
                      <div className="p-3 bg-jv-purple hover:bg-jv-turquoise text-white rounded-full transition-colors shadow-lg">
                        <ImageIcon size={20} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox para Imágenes */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 bg-black/95 z-[100] flex flex-col items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setLightboxImage(null)}
        >
          <button 
            onClick={() => setLightboxImage(null)} 
            className="absolute top-4 right-4 md:top-6 md:right-6 text-white hover:text-jv-turquoise transition-colors p-3 bg-gray-900/80 rounded-full z-[110] shadow-xl"
          >
            <X size={32} />
          </button>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative max-w-5xl max-h-[70vh] w-full h-full flex items-center justify-center mt-8"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={lightboxImage.url} 
              alt={lightboxImage.title || "Imagen ampliada"} 
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" 
            />
          </motion.div>
          
          <div 
            className="mt-6 flex flex-col items-center space-y-4 z-[110]"
            onClick={(e) => e.stopPropagation()}
          >
            {lightboxImage.title && <h3 className="text-white text-xl font-medium text-center">{lightboxImage.title}</h3>}
            
            <a 
              href={lightboxImage.url} 
              download={lightboxImage.title ? `${lightboxImage.title}.jpg` : "imagen-juventud-viva.jpg"}
              className="flex items-center bg-jv-purple hover:bg-jv-turquoise px-6 py-3 rounded-xl text-white font-medium transition-all duration-300 shadow-[0_0_15px_rgba(155,28,201,0.4)] hover:scale-105 active:scale-95"
            >
              <Download size={20} className="mr-2" />
              Descargar Imagen
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
