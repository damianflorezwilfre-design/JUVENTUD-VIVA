"use client"

import { useState, useEffect } from "react";
import { Plus, Edit, Trash, MapPin as MapPinIcon } from "lucide-react";
import Image from "next/image";
import dynamic from 'next/dynamic';

// Leaflet CSS needs to be imported globally or here.
// In Nextjs, we'll just require it.
import 'leaflet/dist/leaflet.css';

// Dynamically import the map components so they only render on the client
const MapSelector = dynamic(() => import('@/components/MapSelector'), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-800 rounded-lg flex items-center justify-center text-gray-500">Cargando mapa...</div>
});

export default function AdminMapa() {
  const [pins, setPins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [lat, setLat] = useState<number>(11.5444); // Default to Riohacha
  const [lng, setLng] = useState<number>(-72.9072);
  const [imageUrl, setImageUrl] = useState("");
  const [date, setDate] = useState("");

  const fetchPins = async () => {
    try {
      const res = await fetch("/api/mapa");
      const data = await res.json();
      setPins(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPins();
  }, []);

  const openModal = (pin?: any) => {
    if (pin) {
      setEditingId(pin.id);
      setTitle(pin.title);
      setDescription(pin.description);
      setLocation(pin.location);
      setLat(pin.lat);
      setLng(pin.lng);
      setImageUrl(pin.imageUrl || "");
      setDate(pin.date ? new Date(pin.date).toISOString().split('T')[0] : "");
    } else {
      setEditingId(null);
      setTitle("");
      setDescription("");
      setLocation("");
      setLat(11.5444);
      setLng(-72.9072);
      setImageUrl("");
      setDate(new Date().toISOString().split('T')[0]);
    }
    setIsModalOpen(true);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { title, description, location, lat, lng, imageUrl, date };

    try {
      const url = editingId ? `/api/mapa/${editingId}` : "/api/mapa";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchPins();
      } else {
        alert("Error al guardar");
      }
    } catch (e) {
      alert("Error de conexión");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este pin?")) return;
    try {
      const res = await fetch(`/api/mapa/${id}`, { method: "DELETE" });
      if (res.ok) fetchPins();
    } catch (e) {
      alert("Error al eliminar");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Mapa de Impacto</h2>
          <p className="text-gray-400">Agrega marcadores en el mapa de las zonas impactadas.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-jv-turquoise hover:bg-white text-jv-dark px-4 py-2 rounded-xl flex items-center font-bold transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Nuevo Marcador
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
                  <th className="p-4 text-sm font-semibold text-gray-300">Foto</th>
                  <th className="p-4 text-sm font-semibold text-gray-300">Título</th>
                  <th className="p-4 text-sm font-semibold text-gray-300">Lugar</th>
                  <th className="p-4 text-sm font-semibold text-gray-300">Fecha</th>
                  <th className="p-4 text-sm font-semibold text-gray-300">Coordenadas</th>
                  <th className="p-4 text-sm font-semibold text-gray-300 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pins.map((pin) => (
                  <tr key={pin.id} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
                    <td className="p-4">
                      {pin.imageUrl ? (
                        <div className="w-12 h-12 rounded-lg overflow-hidden relative">
                          <Image src={pin.imageUrl} alt="" fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                          <MapPinIcon className="text-gray-500" size={20} />
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <p className="text-white font-medium">{pin.title}</p>
                      <p className="text-xs text-gray-500 truncate max-w-[200px]">{pin.description}</p>
                    </td>
                    <td className="p-4 text-gray-400">{pin.location}</td>
                    <td className="p-4 text-gray-400">
                      {new Date(pin.date).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <span className="text-xs font-mono bg-gray-800 text-jv-turquoise px-2 py-1 rounded">
                        {pin.lat.toFixed(4)}, {pin.lng.toFixed(4)}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => openModal(pin)} className="p-2 text-jv-purple hover:bg-jv-purple/20 rounded-lg transition-colors mr-2">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDelete(pin.id)} className="p-2 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors">
                        <Trash size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {pins.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">
                      No hay marcadores aún. ¡Agrega el primero!
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
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-white mb-4">{editingId ? "Editar Marcador" : "Nuevo Marcador"}</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Título de la actividad</label>
                  <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Descripción del impacto</label>
                  <textarea required rows={4} value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white resize-none" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Lugar (Ej. Uribia)</label>
                    <input required type="text" value={location} onChange={e => setLocation(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Fecha</label>
                    <input required type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Imagen de la actividad</label>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white" />
                  {imageUrl && (
                    <div className="mt-2 w-full h-32 relative rounded-lg overflow-hidden border border-gray-700">
                      <Image src={imageUrl} alt="Preview" fill className="object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Ubicación en el Mapa</label>
                <div className="h-[300px] rounded-xl overflow-hidden border border-gray-700 mb-4">
                  <MapSelector lat={lat} lng={lng} onChange={(newLat, newLng) => { setLat(newLat); setLng(newLng); }} />
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs text-gray-500 bg-gray-800 p-3 rounded-lg">
                  <div>Latitud: <span className="text-white font-mono">{lat.toFixed(6)}</span></div>
                  <div>Longitud: <span className="text-white font-mono">{lng.toFixed(6)}</span></div>
                </div>

                <div className="flex justify-end space-x-3 mt-8">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors">
                    Cancelar
                  </button>
                  <button type="submit" className="px-4 py-2 bg-jv-purple hover:bg-jv-turquoise text-white rounded-lg transition-colors font-semibold">
                    Guardar Marcador
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
