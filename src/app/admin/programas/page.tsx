"use client"

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2, X, Search } from "lucide-react";

type Programa = {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl?: string | null;
};

export default function AdminProgramas() {
  const [programas, setProgramas] = useState<Programa[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const fetchProgramas = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/programas");
      if (res.ok) {
        const data = await res.json();
        setProgramas(data);
      } else {
        // Fallback for Demo without DB
        setProgramas([
          { id: "1", title: "Líderes del Mañana", category: "Liderazgo", description: "Programa de formación intensiva..." },
          { id: "2", title: "Tech para Todos", category: "Educación", description: "Cursos de programación básica..." }
        ]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgramas();
  }, []);

  const openModal = (prog?: Programa) => {
    if (prog) {
      setEditingId(prog.id);
      setTitle(prog.title);
      setCategory(prog.category);
      setDescription(prog.description);
      setImageUrl(prog.imageUrl || "");
    } else {
      setEditingId(null);
      setTitle("");
      setCategory("");
      setDescription("");
      setImageUrl("");
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { title, category, description, imageUrl };

    try {
      const url = editingId ? `/api/programas/${editingId}` : "/api/programas";
      const method = editingId ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchProgramas();
      } else {
        alert("Error al guardar. Si no hay base de datos, esto fallará.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar este programa?")) {
      try {
        const res = await fetch(`/api/programas/${id}`, { method: "DELETE" });
        if (res.ok) {
          fetchProgramas();
        } else {
          alert("Error al eliminar.");
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Gestión de Programas</h2>
          <p className="text-gray-400">Administra los programas de la fundación</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-jv-purple hover:bg-jv-turquoise text-white px-4 py-2 rounded-xl flex items-center transition-all duration-300 font-semibold shadow-[0_0_15px_rgba(155,28,201,0.3)]"
        >
          <Plus size={20} className="mr-2" />
          Nuevo Programa
        </button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Buscar programas..." 
              className="bg-gray-800 border border-gray-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-jv-purple text-sm w-64 transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-800/50 border-b border-gray-800">
                <th className="p-4 text-sm font-semibold text-gray-300">Título</th>
                <th className="p-4 text-sm font-semibold text-gray-300">Categoría</th>
                <th className="p-4 text-sm font-semibold text-gray-300">Descripción</th>
                <th className="p-4 text-sm font-semibold text-gray-300 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">Cargando programas...</td>
                </tr>
              ) : programas.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">No hay programas registrados.</td>
                </tr>
              ) : (
                programas.map((prog) => (
                  <tr key={prog.id} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
                    <td className="p-4 text-white font-medium">{prog.title}</td>
                    <td className="p-4">
                      <span className="bg-jv-purple/20 text-jv-purple px-3 py-1 rounded-full text-xs font-semibold">
                        {prog.category}
                      </span>
                    </td>
                    <td className="p-4 text-gray-400 text-sm truncate max-w-xs">{prog.description}</td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <button onClick={() => openModal(prog)} className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white rounded-lg transition-colors">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(prog.id)} className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-colors">
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

      {/* Modal CRUD */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-lg overflow-hidden"
          >
            <div className="p-6 border-b border-gray-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">{editingId ? "Editar Programa" : "Crear Nuevo Programa"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Título</label>
                <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Categoría</label>
                <select required value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none">
                  <option value="">Selecciona una categoría</option>
                  <option value="Liderazgo">Liderazgo</option>
                  <option value="Educación">Educación</option>
                  <option value="Cultura">Cultura</option>
                  <option value="Deporte">Deporte</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">URL de Imagen (Opcional)</label>
                <input type="url" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none" placeholder="https://..." />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Descripción</label>
                <textarea required rows={4} value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none resize-none"></textarea>
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors">Cancelar</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-jv-purple hover:bg-jv-turquoise text-white font-semibold transition-colors">Guardar</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
