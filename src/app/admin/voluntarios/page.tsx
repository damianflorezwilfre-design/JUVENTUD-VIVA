"use client"

import { useState, useEffect } from "react";
import { Users, Trash2, Trash, Check, CheckCircle2, Circle, Clock, Briefcase, Phone, Mail, Download, Trophy } from "lucide-react";
import * as XLSX from "xlsx";

type Volunteer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  skills: string;
  availability: string;
  isContacted: boolean;
  createdAt: string;
  points?: number;
  imageUrl?: string;
};

export default function AdminVoluntarios() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [points, setPoints] = useState<number>(0);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newVolunteer, setNewVolunteer] = useState({ name: "", email: "", phone: "", skills: "", availability: "" });
  const [isAdding, setIsAdding] = useState(false);

  const handleStatusChange = async (id: string, currentStatus: boolean, newPoints?: number, newImageUrl?: string) => {
    try {
      const res = await fetch(`/api/voluntarios/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          isContacted: currentStatus, 
          points: newPoints,
          imageUrl: newImageUrl
        })
      });
      if (res.ok) fetchVolunteers();
    } catch (e) {
      alert("Error al actualizar");
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);
    try {
      const res = await fetch("/api/voluntarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newVolunteer)
      });
      if (res.ok) {
        setShowAddModal(false);
        setNewVolunteer({ name: "", email: "", phone: "", skills: "", availability: "" });
        fetchVolunteers();
      } else {
        alert("Error al añadir voluntario.");
      }
    } catch (error) {
      alert("Error de conexión.");
    } finally {
      setIsAdding(false);
    }
  };

  const fetchVolunteers = async () => {
    try {
      const res = await fetch("/api/voluntarios");
      if (res.ok) {
        const data = await res.json();
        setVolunteers(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(volunteers.map(v => ({
      Nombre: v.name,
      Correo: v.email,
      WhatsApp: v.phone,
      Habilidades: v.skills,
      Disponibilidad: v.availability,
      FechaRegistro: new Date(v.createdAt).toLocaleDateString()
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Voluntarios");
    XLSX.writeFile(workbook, "Voluntarios_Juventud_Viva.xlsx");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar a este postulante?")) return;

    try {
      const res = await fetch(`/api/voluntarios/${id}`, { method: "DELETE" });
      if (res.ok) fetchVolunteers();
    } catch (e) {
      console.error(e);
    }
  };

  const openPointsModal = (vol: any) => {
    setEditingId(vol.id);
    setPoints(vol.points || 0);
    setImageUrl(vol.imageUrl || "");
  };

  const savePoints = async () => {
    if (!editingId) return;
    const vol = volunteers.find(v => v.id === editingId);
    if (vol) {
      await handleStatusChange(editingId, vol.isContacted, points, imageUrl);
      setEditingId(null);
    }
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

  const getRankBadge = (pts: number) => {
    if (pts >= 1000) return <span className="px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-md text-xs font-bold shadow-lg">Diamante 💎</span>;
    if (pts >= 500) return <span className="px-2 py-1 bg-yellow-400 text-yellow-900 rounded-md text-xs font-bold">Oro 🥇</span>;
    if (pts >= 200) return <span className="px-2 py-1 bg-gray-300 text-gray-800 rounded-md text-xs font-bold">Plata 🥈</span>;
    if (pts >= 50) return <span className="px-2 py-1 bg-orange-300 text-orange-900 rounded-md text-xs font-bold">Bronce 🥉</span>;
    return <span className="px-2 py-1 bg-gray-800 text-gray-400 rounded-md text-xs font-bold">Aspirante</span>;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Voluntarios Registrados</h2>
          <p className="text-gray-400">Gestiona las personas que desean ser parte de la fundación.</p>
        </div>
        <div className="flex space-x-2">
          <button onClick={() => setShowAddModal(true)} className="bg-jv-turquoise hover:bg-jv-purple text-white px-4 py-2 rounded-xl transition-colors font-semibold flex items-center space-x-2">
            <span>+ Añadir Voluntario</span>
          </button>
          <button onClick={handleExport} className="bg-jv-purple hover:bg-jv-turquoise text-white px-4 py-2 rounded-xl transition-colors font-semibold flex items-center space-x-2">
            <Download size={20} />
            <span>Exportar a Excel</span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-gray-500">Cargando...</div>
        ) : volunteers.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center flex flex-col items-center">
            <Users size={48} className="text-gray-600 mb-4" />
            <h3 className="text-xl font-medium text-gray-300 mb-2">Sin voluntarios</h3>
            <p className="text-gray-500 mb-6">Aún no hay personas registradas para voluntariado.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-800 bg-gray-800/50">
                  <th className="p-4 text-sm font-semibold text-gray-300">Nombre / Contacto</th>
                  <th className="p-4 text-sm font-semibold text-gray-300">Rango & Puntos</th>
                  <th className="p-4 text-sm font-semibold text-gray-300">Habilidades</th>
                  <th className="p-4 text-sm font-semibold text-gray-300">Disponibilidad</th>
                  <th className="p-4 text-sm font-semibold text-gray-300">Estado</th>
                  <th className="p-4 text-sm font-semibold text-gray-300 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {volunteers.map((vol) => (
                  <tr key={vol.id} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {vol.imageUrl && <img src={vol.imageUrl} className="w-10 h-10 rounded-full object-cover" />}
                        <div>
                          <p className="text-white font-medium">{vol.name}</p>
                          <div className="flex gap-2 text-xs text-gray-500">
                            <a href={`mailto:${vol.email}`} className="hover:text-jv-turquoise">{vol.email}</a>
                            <a href={`https://wa.me/${vol.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="hover:text-green-400">{vol.phone}</a>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      {getRankBadge(vol.points || 0)}
                      <p className="text-xs text-gray-400 mt-1">{vol.points || 0} pts</p>
                    </td>
                    <td className="p-4 text-sm text-gray-300">{vol.skills}</td>
                    <td className="p-4 text-sm text-gray-300">{vol.availability}</td>
                    <td className="p-4">
                      <button 
                        onClick={() => handleStatusChange(vol.id, !vol.isContacted, vol.points, vol.imageUrl)}
                        className={`px-3 py-1 text-xs font-bold rounded-full ${
                          vol.isContacted 
                            ? 'bg-jv-turquoise/20 text-jv-turquoise' 
                            : 'bg-yellow-500/20 text-yellow-500'
                        }`}
                      >
                        {vol.isContacted ? 'Contactado' : 'Pendiente'}
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => openPointsModal(vol)} className="px-3 py-2 text-sm font-bold text-jv-purple hover:bg-jv-purple/20 bg-jv-purple/10 border border-jv-purple/30 rounded-xl transition-colors mr-2 inline-flex items-center gap-2" title="Asignar Puntos">
                        <Trophy size={16} /> Rango / Puntos
                      </button>
                      <button onClick={() => handleDelete(vol.id)} className="p-2 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors">
                        <Trash size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal para Editar Puntos */}
      {editingId && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-xl font-bold text-white mb-4">Gamificación del Voluntario</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Puntos Asignados</label>
                <input 
                  type="number" 
                  value={points} 
                  onChange={e => setPoints(parseInt(e.target.value) || 0)} 
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white font-mono" 
                />
                <p className="text-xs text-gray-500 mt-1">Bronce (50), Plata (200), Oro (500), Diamante (1000)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Foto para el Salón de la Fama</label>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm" />
                {imageUrl && (
                  <img src={imageUrl} alt="Preview" className="mt-2 w-16 h-16 object-cover rounded-full border-2 border-jv-purple" />
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button onClick={() => setEditingId(null)} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors">
                Cancelar
              </button>
              <button onClick={savePoints} className="px-4 py-2 bg-jv-purple hover:bg-jv-turquoise text-white rounded-lg transition-colors font-semibold">
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Añadir Voluntario Manual */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-xl font-bold text-white mb-4">Añadir Voluntario Manual</h3>
            
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Nombre Completo</label>
                <input required type="text" value={newVolunteer.name} onChange={e => setNewVolunteer({...newVolunteer, name: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Correo Electrónico</label>
                <input required type="email" value={newVolunteer.email} onChange={e => setNewVolunteer({...newVolunteer, email: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Teléfono</label>
                <input required type="text" value={newVolunteer.phone} onChange={e => setNewVolunteer({...newVolunteer, phone: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Habilidades</label>
                <input type="text" value={newVolunteer.skills} onChange={e => setNewVolunteer({...newVolunteer, skills: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Disponibilidad</label>
                <input type="text" value={newVolunteer.availability} onChange={e => setNewVolunteer({...newVolunteer, availability: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white" />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors">
                  Cancelar
                </button>
                <button type="submit" disabled={isAdding} className="px-4 py-2 bg-jv-purple hover:bg-jv-turquoise text-white rounded-lg transition-colors font-semibold disabled:opacity-50">
                  {isAdding ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
