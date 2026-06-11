"use client"
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Folder, Image as ImageIcon, Video, ArrowLeft, ExternalLink } from "lucide-react";

type GalleryItem = {
  id: string;
  title: string | null;
  url: string;
  type: string;
  album: string;
  createdAt: string;
};

export default function Galeria() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/galeria")
      .then(res => res.json())
      .then(data => {
        setItems(data);
        setLoading(false);
      })
      .catch(e => {
        console.error(e);
        setLoading(false);
      });
  }, []);

  // Agrupar items por album
  const albumsMap = new Map<string, GalleryItem[]>();
  items.forEach(item => {
    const albumName = item.album || "General";
    if (!albumsMap.has(albumName)) {
      albumsMap.set(albumName, []);
    }
    albumsMap.get(albumName)!.push(item);
  });

  const albums = Array.from(albumsMap.entries()).map(([name, files]) => ({
    name,
    files,
    coverUrl: files.find(f => f.type === 'image')?.url || null
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

      {loading ? (
        <div className="text-center py-20 text-gray-500">Cargando álbumes...</div>
      ) : albums.length === 0 ? (
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
                  <img src={album.coverUrl} alt={album.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600">
                    <Folder size={64} />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold text-white mb-1 flex items-center">
                    <Folder size={20} className="mr-2 text-jv-turquoise" />
                    {album.name}
                  </h3>
                  <p className="text-gray-300 text-sm">{album.files.length} archivo{album.files.length !== 1 ? 's' : ''}</p>
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
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 group relative shadow-lg"
              >
                <div className="aspect-square bg-gray-800 relative">
                  {item.type === 'image' ? (
                    <img src={item.url} alt={item.title || "Imagen"} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                      <Video size={48} className="mb-2 opacity-50" />
                      <span className="text-sm font-medium">Video</span>
                    </div>
                  )}
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center">
                    {item.title && <h3 className="text-white font-medium mb-3 line-clamp-2">{item.title}</h3>}
                    <a href={item.url} target="_blank" rel="noreferrer" className="p-3 bg-jv-purple hover:bg-jv-turquoise text-white rounded-full transition-colors shadow-lg">
                      <ExternalLink size={20} />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
