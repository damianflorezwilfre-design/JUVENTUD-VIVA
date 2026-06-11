"use client"

import { useState, useEffect } from "react";
import { Plus, Edit, Trash, History } from "lucide-react";

export default function AdminHistoria() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form
  const [year, setYear] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [order, setOrder] = useState("0");

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/historia");
      const data = await res.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const openModal = (evt?: any) => {
    if (evt) {
      setEditingId(evt.id);
      setYear(evt.year);
      setTitle(evt.title);
      setDescription(evt.description);
      setOrder(evt.order.toString());
    } else {
      setEditingId(null);
      setYear("");
      setTitle("");
      setDescription("");
      setOrder(events.length.toString());
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { year, title, description, order };

    try {
      const url = editingId ? `/api/historia/${editingId}` : "/api/historia";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchEvents();
      } else {
        alert("Error al guardar");
      }
    } catch (e) {
      alert("Error de conexión");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este evento histórico?")) return;
    try {
      const res = await fetch(`/api/historia/${id}`, { method: "DELETE" });
      if (res.ok) fetchEvents();
    } catch (e) {
      alert("Error al eliminar");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Línea de Tiempo (Historia)</h2>
          <p className="text-gray-400">Agrega los hitos y momentos clave de la fundación.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-jv-turquoise hover:bg-white text-jv-dark px-4 py-2 rounded-xl flex items-center font-bold transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Nuevo Hito
        </button>
      </div>

      {loading ? (
        <div className="text-gray-400">Cargando...</div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-800 bg-gray-800/50">
                  <th className="p-4 text-sm font-semibold text-gray-300 w-16">Orden</th>
                  <th className="p-4 text-sm font-semibold text-gray-300 w-24">Año</th>
                  <th className="p-4 text-sm font-semibold text-gray-300">Título del Hito</th>
                  <th className="p-4 text-sm font-semibold text-gray-300">Descripción</th>
                  <th className="p-4 text-sm font-semibold text-gray-300 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {events.map((evt) => (
                  <tr key={evt.id} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
                    <td className="p-4 text-gray-400 font-mono">{evt.order}</td>
                    <td className="p-4 text-jv-turquoise font-bold text-lg">{evt.year}</td>
                    <td className="p-4 text-white font-medium">{evt.title}</td>
                    <td className="p-4 text-gray-400 text-sm">{evt.description}</td>
                    <td className="p-4 text-right">
                      <button onClick={() => openModal(evt)} className="p-2 text-jv-purple hover:bg-jv-purple/20 rounded-lg transition-colors mr-2">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDelete(evt.id)} className="p-2 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors">
                        <Trash size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {events.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">
                      No hay eventos históricos registrados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-2xl">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <History className="mr-2 text-jv-turquoise" size={24} />
              {editingId ? "Editar Hito Histórico" : "Nuevo Hito Histórico"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Año (Ej. 2023)</label>
                  <input required type="text" value={year} onChange={e => setYear(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-turquoise focus:outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Orden Cronológico</label>
                  <input type="number" value={order} onChange={e => setOrder(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-turquoise focus:outline-none transition-colors" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Título del Evento</label>
                <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-turquoise focus:outline-none transition-colors" placeholder="Ej. Constitución Legal" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Descripción corta</label>
                <textarea required rows={4} value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white resize-none focus:border-jv-turquoise focus:outline-none transition-colors" placeholder="Ej. Nos registramos como fundación..." />
              </div>

              <div className="flex justify-end space-x-3 mt-8">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors">
                  Cancelar
                </button>
                <button type="submit" className="px-4 py-2 bg-jv-purple hover:bg-jv-turquoise text-white rounded-lg transition-colors font-semibold">
                  Guardar Hito
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
