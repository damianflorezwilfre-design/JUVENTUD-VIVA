"use client"

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Trash2, X, Search, Image as ImageIcon, Video, ExternalLink } from "lucide-react";

type GalleryItem = {
  id: string;
  title: string | null;
  url: string;
  type: string;
  createdAt: string;
};

export default function AdminGaleria() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [type, setType] = useState("image");

  const fetchGaleria = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/galeria");
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGaleria();
  }, []);

  const openModal = () => {
    setTitle("");
    setUrl("");
    setType("image");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { title, url, type };

    try {
      const res = await fetch("/api/galeria", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchGaleria();
      } else {
        alert("Error al guardar en galería");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar este archivo multimedia?")) {
      try {
        const res = await fetch(`/api/galeria/${id}`, { method: "DELETE" });
        if (res.ok) fetchGaleria();
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Galería Multimedia</h2>
          <p className="text-gray-400">Añade imágenes y videos de los eventos de la fundación.</p>
        </div>
        <button 
          onClick={openModal}
          className="bg-jv-purple hover:bg-jv-turquoise text-white px-4 py-2 rounded-xl flex items-center transition-all duration-300 font-semibold shadow-[0_0_15px_rgba(155,28,201,0.3)]"
        >
          <PlusCircle size={20} className="mr-2" />
          Añadir Multimedia
        </button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por título..." 
              className="w-full bg-gray-800 border border-gray-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-jv-purple transition-colors"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Cargando galería...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <ImageIcon size={48} className="mx-auto mb-4 opacity-20" />
            <p>La galería está vacía. Añade tu primera imagen o video.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 group relative"
              >
                <div className="aspect-video bg-gray-900 relative">
                  {item.type === 'image' ? (
                    <img src={item.url} alt={item.title || "Imagen"} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                      <Video size={40} className="mb-2 opacity-50" />
                      <span className="text-xs">Video (Vista previa no disponible)</span>
                    </div>
                  )}
                  
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3">
                    <a href={item.url} target="_blank" rel="noreferrer" className="p-2 bg-jv-purple hover:bg-jv-turquoise text-white rounded-full transition-colors">
                      <ExternalLink size={18} />
                    </a>
                    <button onClick={() => handleDelete(item.id)} className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                  
                  {/* Badge */}
                  <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium text-gray-300 flex items-center">
                    {item.type === 'image' ? <ImageIcon size={12} className="mr-1" /> : <Video size={12} className="mr-1" />}
                    {item.type === 'image' ? 'Imagen' : 'Video'}
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="text-white font-medium truncate">{item.title || "Sin título"}</h3>
                  <p className="text-gray-500 text-xs mt-1">{new Date(item.createdAt).toLocaleDateString()}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md overflow-hidden"
          >
            <div className="p-6 border-b border-gray-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Añadir Multimedia</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Título / Descripción (Opcional)</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={e => setTitle(e.target.value)} 
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none" 
                  placeholder="Ej. Jóvenes en Acción 2026"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Tipo</label>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2 text-gray-300 cursor-pointer">
                    <input 
                      type="radio" 
                      name="type" 
                      value="image" 
                      checked={type === "image"} 
                      onChange={() => setType("image")}
                      className="text-jv-purple focus:ring-jv-purple"
                    />
                    <span>Imagen</span>
                  </label>
                  <label className="flex items-center space-x-2 text-gray-300 cursor-pointer">
                    <input 
                      type="radio" 
                      name="type" 
                      value="video" 
                      checked={type === "video"} 
                      onChange={() => setType("video")}
                      className="text-jv-purple focus:ring-jv-purple"
                    />
                    <span>Video</span>
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Enlace (URL) de la {type === 'image' ? 'Imagen' : 'Video'}</label>
                <input 
                  required
                  type="url" 
                  value={url} 
                  onChange={e => setUrl(e.target.value)} 
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none" 
                  placeholder={type === 'image' ? "https://imgur.com/..." : "https://youtube.com/watch?v=..."}
                />
                <p className="text-xs text-gray-500 mt-1">Pega el enlace directo a la imagen o video (ej. YouTube).</p>
              </div>

              {type === 'image' && url && (
                <div className="mt-4 border border-gray-700 rounded-lg overflow-hidden bg-gray-800 p-1">
                  <p className="text-xs text-gray-500 mb-1 px-1">Vista previa:</p>
                  <img src={url} alt="Vista previa" className="w-full h-32 object-cover rounded" onError={(e) => (e.currentTarget.src = "")} />
                </div>
              )}

              <div className="pt-4 flex justify-end space-x-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors">Cancelar</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-jv-purple hover:bg-jv-turquoise text-white font-semibold transition-colors">Añadir a Galería</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
