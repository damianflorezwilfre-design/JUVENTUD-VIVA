"use client"

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Trash2, X, Search, Image as ImageIcon, Video, ExternalLink, Save } from "lucide-react";

type GalleryItem = {
  id: string;
  title: string | null;
  url: string;
  type: string;
  album: string;
  createdAt: string;
};

export default function AdminGaleria() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("image");
  const [album, setAlbum] = useState("General");
  
  // New States for files and urls
  const [coverPhoto, setCoverPhoto] = useState<{name: string, data: string} | null>(null);
  const [additionalPhotos, setAdditionalPhotos] = useState<{name: string, data: string}[]>([]);
  const [videoUrls, setVideoUrls] = useState("");

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
    setType("image");
    setAlbum("General");
    setCoverPhoto(null);
    setAdditionalPhotos([]);
    setVideoUrls("");
    setIsModalOpen(true);
  };

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new window.Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", 0.7)); // 70% quality JPEG
        };
        img.onerror = (error) => reject(error);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedData = await compressImage(file);
        setCoverPhoto({ name: file.name, data: compressedData });
      } catch (error) {
        console.error("Error compressing cover image", error);
        alert("Hubo un error al procesar la imagen. Intenta con otra.");
      }
    }
  };

  const handleAdditionalUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    try {
      const compressedPhotos = await Promise.all(
        Array.from(files).map(async (file) => ({
          name: file.name,
          data: await compressImage(file)
        }))
      );
      setAdditionalPhotos(prev => [...prev, ...compressedPhotos]);
    } catch (error) {
      console.error("Error compressing additional images", error);
      alert("Hubo un error al procesar algunas imágenes.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const payloadItems: any[] = [];
    
    if (type === "image") {
      // Agregamos primero las adicionales, y de último la portada,
      // para que la portada sea la más reciente y aparezca primero en la web pública.
      additionalPhotos.forEach(p => {
        payloadItems.push({ title: title || p.name, url: p.data, type: "image", album });
      });
      if (coverPhoto) {
        payloadItems.push({ title: title || "Portada", url: coverPhoto.data, type: "image", album });
      }
    } else {
      const urls = videoUrls.split('\n').map(u => u.trim()).filter(u => u);
      urls.forEach(u => {
        payloadItems.push({ title, url: u, type: "video", album });
      });
    }

    if (payloadItems.length === 0) {
      alert("Por favor agrega al menos una foto o enlace de video.");
      setSaving(false);
      return;
    }

    try {
      const res = await fetch("/api/galeria", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: payloadItems })
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchGaleria();
      } else {
        alert("Error al guardar en galería");
      }
    } catch (e) {
      console.error(e);
      alert("Error de conexión");
    } finally {
      setSaving(false);
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
                      <span className="text-xs">Video</span>
                    </div>
                  )}
                  
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3">
                    {item.type === 'video' && (
                      <a href={item.url} target="_blank" rel="noreferrer" className="p-2 bg-jv-purple hover:bg-jv-turquoise text-white rounded-full transition-colors">
                        <ExternalLink size={18} />
                      </a>
                    )}
                    <button onClick={() => handleDelete(item.id)} className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                  
                  {/* Badge */}
                  <div className="absolute top-2 right-2 flex flex-col space-y-1 items-end">
                    <div className="bg-black/70 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium text-gray-300 flex items-center">
                      {item.type === 'image' ? <ImageIcon size={12} className="mr-1" /> : <Video size={12} className="mr-1" />}
                      {item.type === 'image' ? 'Imagen' : 'Video'}
                    </div>
                    <div className="bg-jv-purple/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium text-white flex items-center shadow-lg">
                      {item.album}
                    </div>
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
            className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
          >
            <div className="p-6 border-b border-gray-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Añadir Multimedia (Bloque)</h3>
              <button onClick={() => !saving && setIsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Título General (Opcional)</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={e => setTitle(e.target.value)} 
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none" 
                  placeholder="Ej. Jóvenes en Acción 2026"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Álbum (Carpeta)</label>
                <input 
                  type="text" 
                  value={album} 
                  onChange={e => setAlbum(e.target.value)} 
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none" 
                  placeholder="Ej. Entrega de kits a los colegios"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">¿Qué deseas subir?</label>
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
                    <span>Fotos</span>
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
                    <span>Videos (Enlaces)</span>
                  </label>
                </div>
              </div>
              
              {type === 'image' ? (
                <div className="space-y-4 pt-2">
                  <div className="bg-gray-800/50 p-4 rounded-xl border border-jv-purple/30">
                    <label className="block text-sm font-medium text-white mb-2">1. Foto de Portada</label>
                    <div className="relative">
                      <input type="file" accept="image/*" onChange={handleCoverUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                      <div className="w-full bg-gray-800 border border-jv-purple/50 rounded-lg px-4 py-3 text-jv-purple flex items-center justify-between">
                        <span className="truncate text-sm font-medium">{coverPhoto ? "Portada seleccionada ✓" : "Seleccionar Portada..."}</span>
                        <ImageIcon size={18} />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                    <label className="block text-sm font-medium text-white mb-2">2. Fotos Adicionales ({additionalPhotos.length} seleccionadas)</label>
                    <div className="relative">
                      <input type="file" multiple accept="image/*" onChange={handleAdditionalUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                      <div className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-400 flex items-center justify-between hover:border-gray-500 transition-colors">
                        <span className="truncate text-sm font-medium">Seleccionar Varias Fotos...</span>
                        <PlusCircle size={18} />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="pt-2">
                  <label className="block text-sm font-medium text-gray-400 mb-1">Enlaces de Videos</label>
                  <p className="text-xs text-gray-500 mb-2">Pega un enlace por cada línea (YouTube, Instagram, TikTok, etc.)</p>
                  <textarea 
                    rows={4}
                    value={videoUrls} 
                    onChange={e => setVideoUrls(e.target.value)} 
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none resize-none" 
                    placeholder="https://youtube.com/watch?v=123&#10;https://www.tiktok.com/@usuario/video/123456789"
                  />
                </div>
              )}

              <div className="pt-6 flex justify-end space-x-3">
                <button type="button" disabled={saving} onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors">Cancelar</button>
                <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg bg-jv-purple hover:bg-jv-turquoise text-white font-semibold transition-colors flex items-center">
                  {saving ? (
                    <>Cargando...</>
                  ) : (
                    <>
                      <Save size={18} className="mr-2" />
                      Subir al Álbum
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
