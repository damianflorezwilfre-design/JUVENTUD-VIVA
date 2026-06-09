"use client"

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Save, X, Image as ImageIcon, CalendarDays, MapPin } from "lucide-react";
import Image from "next/image";

export default function AdminEventos() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/eventos");
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const openModal = (event?: any) => {
    if (event) {
      setEditingId(event.id);
      setTitle(event.title);
      setDescription(event.description);
      setDate(new Date(event.date).toISOString().slice(0, 16));
      setLocation(event.location || "");
      setImageUrl(event.imageUrl || "");
    } else {
      setEditingId(null);
      setTitle("");
      setDescription("");
      setDate(new Date().toISOString().slice(0, 16));
      setLocation("");
      setImageUrl("");
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const payload = { title, description, date, location, imageUrl };
    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `/api/eventos/${editingId}` : "/api/eventos";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        fetchEvents();
        closeModal();
      } else {
        alert("Error al guardar. Si eres editor, tu solicitud fue enviada.");
        closeModal();
      }
    } catch (error) {
      alert("Error de conexión");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar este evento?")) return;
    try {
      const res = await fetch(`/api/eventos/${id}`, { method: "DELETE" });
      if (res.ok) fetchEvents();
    } catch (error) {
      alert("Error al eliminar");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Calendario de Eventos</h2>
          <p className="text-gray-400">Gestiona las próximas actividades, reuniones y talleres.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-jv-purple hover:bg-jv-turquoise text-white px-4 py-2 rounded-xl flex items-center transition-all duration-300 font-semibold shadow-[0_0_15px_rgba(155,28,201,0.3)]"
        >
          <Plus size={20} className="mr-2" />
          Crear Evento
        </button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Cargando eventos...</div>
        ) : events.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <CalendarDays size={48} className="text-gray-600 mb-4" />
            <p className="text-gray-500">No hay eventos próximos registrados. ¡Empieza a programar actividades!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-800/50 border-b border-gray-800 text-gray-400 text-sm">
                  <th className="p-4 font-medium">Imagen</th>
                  <th className="p-4 font-medium">Evento</th>
                  <th className="p-4 font-medium">Fecha y Hora</th>
                  <th className="p-4 font-medium">Lugar</th>
                  <th className="p-4 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
                    <td className="p-4">
                      {event.imageUrl ? (
                        <div className="w-16 h-12 rounded-lg overflow-hidden border border-gray-700">
                          <Image src={event.imageUrl} alt={event.title} width={64} height={48} className="object-cover w-full h-full" />
                        </div>
                      ) : (
                        <div className="w-16 h-12 rounded-lg bg-gray-800 flex items-center justify-center text-gray-500 border border-gray-700">
                          <CalendarDays size={18} />
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <p className="text-white font-medium">{event.title}</p>
                      <p className="text-xs text-gray-500 max-w-[200px] truncate">{event.description}</p>
                    </td>
                    <td className="p-4 text-gray-400">
                      {new Date(event.date).toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' })}
                    </td>
                    <td className="p-4 text-gray-400">{event.location || "-"}</td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <button onClick={() => openModal(event)} className="p-2 text-gray-400 hover:text-jv-turquoise bg-gray-800 rounded-lg transition-colors">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(event.id)} className="p-2 text-gray-400 hover:text-red-400 bg-gray-800 rounded-lg transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-gray-800">
              <h3 className="text-xl font-bold text-white">
                {editingId ? "Editar Evento" : "Crear Evento"}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Título del Evento</label>
                <input required type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej. Taller de Liderazgo" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Fecha y Hora</label>
                  <input required type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Lugar</label>
                  <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Ej. Sede Central" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Descripción</label>
                <textarea required rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Detalles de la actividad..." className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none resize-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Banner / Foto (Opcional)</label>
                <div className="relative">
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  <div className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white flex items-center justify-between">
                    <span className="truncate text-sm text-gray-400">{imageUrl ? "Imagen cargada (clic para cambiar)" : "Subir imagen..."}</span>
                    <ImageIcon size={18} className="text-gray-400" />
                  </div>
                </div>
                {imageUrl && (
                  <div className="mt-3 w-full h-24 rounded-lg overflow-hidden border border-gray-700 mx-auto">
                    <Image src={imageUrl} alt="Preview" width={400} height={96} className="object-cover w-full h-full" />
                  </div>
                )}
              </div>

              <div className="pt-4 flex space-x-3">
                <button type="button" onClick={closeModal} className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition-colors font-medium">Cancelar</button>
                <button type="submit" disabled={saving} className="flex-1 px-4 py-2 bg-jv-purple hover:bg-jv-turquoise text-white rounded-xl transition-colors font-medium flex justify-center items-center">
                  <Save size={18} className="mr-2" />
                  {saving ? "Guardando..." : "Guardar Evento"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
