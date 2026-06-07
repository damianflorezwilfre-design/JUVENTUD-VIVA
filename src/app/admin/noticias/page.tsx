"use client"

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Edit2, Trash2, X, Search, Image as ImageIcon } from "lucide-react";

type News = {
  id: string;
  title: string;
  content: string;
  imageUrl: string | null;
  createdAt: string;
};

export default function AdminNoticias() {
  const [noticias, setNoticias] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const fetchNoticias = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/noticias");
      if (res.ok) {
        const data = await res.json();
        setNoticias(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNoticias();
  }, []);

  const openModal = (noticia?: News) => {
    if (noticia) {
      setEditingId(noticia.id);
      setTitle(noticia.title);
      setContent(noticia.content);
      setImageUrl(noticia.imageUrl || "");
    } else {
      setEditingId(null);
      setTitle("");
      setContent("");
      setImageUrl("");
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { title, content, imageUrl: imageUrl || null };

    try {
      const url = editingId ? `/api/noticias/${editingId}` : "/api/noticias";
      const method = editingId ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchNoticias();
      } else {
        alert("Error al guardar la noticia");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar esta noticia?")) {
      try {
        const res = await fetch(`/api/noticias/${id}`, { method: "DELETE" });
        if (res.ok) fetchNoticias();
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Gestión de Noticias</h2>
          <p className="text-gray-400">Publica artículos, comunicados y novedades.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-jv-purple hover:bg-jv-turquoise text-white px-4 py-2 rounded-xl flex items-center transition-all duration-300 font-semibold shadow-[0_0_15px_rgba(155,28,201,0.3)]"
        >
          <PlusCircle size={20} className="mr-2" />
          Nueva Noticia
        </button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Buscar noticia..." 
              className="bg-gray-800 border border-gray-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-jv-purple text-sm w-64 transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-800/50 border-b border-gray-800">
                <th className="p-4 text-sm font-semibold text-gray-300 w-16">Imagen</th>
                <th className="p-4 text-sm font-semibold text-gray-300">Título</th>
                <th className="p-4 text-sm font-semibold text-gray-300">Fecha</th>
                <th className="p-4 text-sm font-semibold text-gray-300 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">Cargando noticias...</td>
                </tr>
              ) : noticias.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">No hay noticias publicadas.</td>
                </tr>
              ) : (
                noticias.map((noticia) => (
                  <tr key={noticia.id} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
                    <td className="p-4">
                      {noticia.imageUrl ? (
                        <img src={noticia.imageUrl} alt={noticia.title} className="w-12 h-12 object-cover rounded-lg border border-gray-700" />
                      ) : (
                        <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center border border-gray-700">
                          <ImageIcon size={20} className="text-gray-500" />
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-white font-medium">{noticia.title}</td>
                    <td className="p-4 text-gray-400 text-sm">
                      {new Date(noticia.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <button onClick={() => openModal(noticia)} className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white rounded-lg transition-colors">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(noticia.id)} className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            <div className="p-6 border-b border-gray-800 flex justify-between items-center shrink-0">
              <h3 className="text-xl font-bold text-white">{editingId ? "Editar Noticia" : "Publicar Noticia"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-grow">
              <form id="noticias-form" onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Título de la Noticia</label>
                  <input 
                    required 
                    type="text" 
                    value={title} 
                    onChange={e => setTitle(e.target.value)} 
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none" 
                    placeholder="Ej. Nuevo programa de liderazgo juvenil"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">URL de la Imagen (Opcional)</label>
                  <input 
                    type="url" 
                    value={imageUrl} 
                    onChange={e => setImageUrl(e.target.value)} 
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none" 
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                  <p className="text-xs text-gray-500 mt-1">Pega un enlace directo a la imagen. Recomendado: Imgur o Google Drive.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Contenido</label>
                  <textarea 
                    required 
                    value={content} 
                    onChange={e => setContent(e.target.value)} 
                    rows={8}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none resize-none" 
                    placeholder="Escribe el cuerpo de la noticia aquí..."
                  />
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-gray-800 flex justify-end space-x-3 shrink-0">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors">Cancelar</button>
              <button type="submit" form="noticias-form" className="px-4 py-2 rounded-lg bg-jv-purple hover:bg-jv-turquoise text-white font-semibold transition-colors">
                {editingId ? "Actualizar" : "Publicar"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
