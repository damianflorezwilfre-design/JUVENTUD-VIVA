"use client"

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Edit2, Trash2, X, Search, FileText } from "lucide-react";

type Document = {
  id: string;
  title: string;
  fileUrl: string;
  type: string;
  createdAt: string;
};

export default function AdminDocumentos() {
  const [documentos, setDocumentos] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [type, setType] = useState("pdf");

  const fetchDocumentos = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/documentos");
      if (res.ok) {
        const data = await res.json();
        setDocumentos(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocumentos();
  }, []);

  const openModal = (doc?: Document & { description?: string }) => {
    if (doc) {
      setEditingId(doc.id);
      setTitle(doc.title);
      setDescription(doc.description || "");
      setFileUrl(doc.fileUrl);
      setType(doc.type);
    } else {
      setEditingId(null);
      setTitle("");
      setDescription("");
      setFileUrl("");
      setType("pdf");
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { title, description, fileUrl, type };

    try {
      const url = editingId ? `/api/documentos/${editingId}` : "/api/documentos";
      const method = editingId ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchDocumentos();
      } else {
        alert("Error al guardar el documento");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar este documento?")) {
      try {
        const res = await fetch(`/api/documentos/${id}`, { method: "DELETE" });
        if (res.ok) fetchDocumentos();
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Documentos Públicos</h2>
          <p className="text-gray-400">Gestiona los archivos descargables de la fundación.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-jv-purple hover:bg-jv-turquoise text-white px-4 py-2 rounded-xl flex items-center transition-all duration-300 font-semibold shadow-[0_0_15px_rgba(155,28,201,0.3)]"
        >
          <PlusCircle size={20} className="mr-2" />
          Subir Documento
        </button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Buscar documento..." 
              className="bg-gray-800 border border-gray-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-jv-purple text-sm w-64 transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-800/50 border-b border-gray-800">
                <th className="p-4 text-sm font-semibold text-gray-300 w-16">Tipo</th>
                <th className="p-4 text-sm font-semibold text-gray-300">Título</th>
                <th className="p-4 text-sm font-semibold text-gray-300">Enlace</th>
                <th className="p-4 text-sm font-semibold text-gray-300">Fecha</th>
                <th className="p-4 text-sm font-semibold text-gray-300 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">Cargando documentos...</td>
                </tr>
              ) : documentos.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">No hay documentos registrados.</td>
                </tr>
              ) : (
                documentos.map((doc) => (
                  <tr key={doc.id} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
                    <td className="p-4">
                      <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center border border-gray-700">
                        <FileText size={18} className={doc.type === 'pdf' ? "text-red-400" : "text-blue-400"} />
                      </div>
                    </td>
                    <td className="p-4 text-white font-medium">{doc.title}</td>
                    <td className="p-4 text-gray-400 text-sm max-w-[200px] truncate">
                      <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="hover:text-jv-turquoise hover:underline">
                        {doc.fileUrl}
                      </a>
                    </td>
                    <td className="p-4 text-gray-400 text-sm">
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <button onClick={() => openModal(doc)} className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white rounded-lg transition-colors">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(doc.id)} className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-colors">
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
            className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md overflow-hidden"
          >
            <div className="p-6 border-b border-gray-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">{editingId ? "Editar Documento" : "Añadir Documento"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Título del Documento</label>
                <input 
                  required 
                  type="text" 
                  value={title} 
                  onChange={e => setTitle(e.target.value)} 
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none" 
                  placeholder="Ej. Acta de Asamblea 2026"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Breve Descripción (Opcional)</label>
                <textarea 
                  value={description} 
                  onChange={e => setDescription(e.target.value)} 
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none" 
                  placeholder="Explica brevemente el contenido de este documento"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Tipo de Archivo</label>
                <select 
                  value={type} 
                  onChange={e => setType(e.target.value)} 
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none"
                >
                  <option value="pdf">PDF</option>
                  <option value="doc">Word / Texto</option>
                  <option value="xls">Excel / Tabla</option>
                  <option value="other">Otro</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Enlace de Descarga (URL)</label>
                <input 
                  required
                  type="url" 
                  value={fileUrl} 
                  onChange={e => setFileUrl(e.target.value)} 
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none" 
                  placeholder="https://drive.google.com/..."
                />
                <p className="text-xs text-gray-500 mt-1">Sube el archivo a Google Drive (ponlo público) o similar, y pega el enlace aquí.</p>
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors">Cancelar</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-jv-purple hover:bg-jv-turquoise text-white font-semibold transition-colors">Guardar Documento</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
