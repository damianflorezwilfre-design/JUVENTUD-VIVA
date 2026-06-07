"use client"

import { useState, useEffect } from "react";
import { PlusCircle, Trash2, MapPin, CheckCircle2, Clock, PlayCircle } from "lucide-react";
import { motion } from "framer-motion";

type RoadmapAction = {
  id: string;
  title: string;
  description: string;
  date: string | null;
  status: "pending" | "in-progress" | "completed";
};

export default function AdminHojaDeRuta() {
  const [actions, setActions] = useState<RoadmapAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

  const fetchActions = async () => {
    try {
      const res = await fetch("/api/hoja-de-ruta");
      if (res.ok) {
        const data = await res.json();
        setActions(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActions();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    try {
      const res = await fetch("/api/hoja-de-ruta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, date: date || null })
      });

      if (res.ok) {
        setIsAdding(false);
        setTitle("");
        setDescription("");
        setDate("");
        fetchActions();
      } else {
        alert("Error al guardar la acción.");
      }
    } catch (e) {
      alert("Error de conexión");
    }
  };

  const handleUpdateStatus = async (id: string, currentStatus: string) => {
    const nextStatus = 
      currentStatus === "pending" ? "in-progress" : 
      currentStatus === "in-progress" ? "completed" : "pending";

    try {
      const res = await fetch(`/api/hoja-de-ruta/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus })
      });
      if (res.ok) {
        fetchActions();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar esta acción?")) return;

    try {
      const res = await fetch(`/api/hoja-de-ruta/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchActions();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case "pending": return <Clock className="text-yellow-500" size={20} />;
      case "in-progress": return <PlayCircle className="text-jv-turquoise" size={20} />;
      case "completed": return <CheckCircle2 className="text-green-500" size={20} />;
      default: return <Clock size={20} />;
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case "pending": return "Pendiente";
      case "in-progress": return "En Progreso";
      case "completed": return "Completado";
      default: return "Desconocido";
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Hoja de Ruta y Acciones</h2>
          <p className="text-gray-400">Define los pasos y objetivos futuros de la organización.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-jv-purple hover:bg-jv-turquoise text-white px-4 py-2 rounded-xl flex items-center transition-all duration-300 font-semibold"
        >
          <PlusCircle size={20} className="mr-2" />
          Nueva Acción
        </button>
      </div>

      {isAdding && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 border border-jv-purple/30 rounded-2xl p-6 mb-8"
        >
          <h3 className="text-xl font-bold text-white mb-4">Agregar Acción a la Hoja de Ruta</h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Título de la Acción</label>
                <input 
                  type="text" 
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej. Lanzamiento de Semilleros..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Fecha / Trimestre (Opcional)</label>
                <input 
                  type="text" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="Ej. Q3 2026, Agosto 2026..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none" 
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Descripción</label>
              <textarea 
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe el objetivo y los pasos..."
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none resize-none" 
              />
            </div>
            
            <div className="flex items-end justify-end mt-4">
              <button 
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 text-gray-400 hover:text-white mr-4"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                className="bg-jv-purple hover:bg-jv-turquoise text-white px-6 py-2 rounded-xl transition-all font-semibold"
              >
                Guardar Acción
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-gray-500">Cargando...</div>
        ) : actions.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center flex flex-col items-center">
            <MapPin size={48} className="text-gray-600 mb-4" />
            <h3 className="text-xl font-medium text-gray-300 mb-2">No hay acciones registradas</h3>
            <p className="text-gray-500 mb-6">Traza el futuro de Juventud ViVa añadiendo hitos a la hoja de ruta.</p>
          </div>
        ) : (
          actions.map((action) => (
            <div key={action.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-gray-700 transition-colors">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-xs font-semibold px-2 py-1 bg-gray-800 rounded-md text-gray-300">
                    {action.date || "Fecha por definir"}
                  </span>
                  <h3 className="text-lg font-bold text-white">{action.title}</h3>
                </div>
                <p className="text-gray-400 text-sm">{action.description}</p>
              </div>
              
              <div className="flex items-center space-x-4 border-t md:border-t-0 md:border-l border-gray-800 pt-4 md:pt-0 md:pl-6 w-full md:w-auto">
                <button 
                  onClick={() => handleUpdateStatus(action.id, action.status)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors flex-1 md:flex-none justify-center"
                  title="Clic para cambiar de estado"
                >
                  {getStatusIcon(action.status)}
                  <span className="text-sm font-medium text-gray-300">{getStatusText(action.status)}</span>
                </button>
                
                <button 
                  onClick={() => handleDelete(action.id)}
                  className="p-2 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
