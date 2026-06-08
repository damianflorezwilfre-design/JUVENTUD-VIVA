"use client"

import { useState, useEffect } from "react";
import { Users, Plus, Edit2, Trash2, Save, X, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

export default function AdminEquipo() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [bio, setBio] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [order, setOrder] = useState("0");
  const [saving, setSaving] = useState(false);

  const fetchMembers = async () => {
    try {
      const res = await fetch("/api/equipo");
      if (res.ok) {
        const data = await res.json();
        setMembers(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const openModal = (member?: any) => {
    if (member) {
      setEditingId(member.id);
      setName(member.name);
      setRole(member.role);
      setBio(member.bio || "");
      setImageUrl(member.imageUrl || "");
      setOrder(member.order?.toString() || "0");
    } else {
      setEditingId(null);
      setName("");
      setRole("");
      setBio("");
      setImageUrl("");
      setOrder("0");
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
    
    const payload = { name, role, bio, imageUrl, order: parseInt(order) };
    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `/api/equipo/${editingId}` : "/api/equipo";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        fetchMembers();
        closeModal();
      } else {
        alert("Error al guardar");
      }
    } catch (error) {
      alert("Error de conexión");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar a este miembro del equipo?")) return;
    try {
      const res = await fetch(`/api/equipo/${id}`, { method: "DELETE" });
      if (res.ok) fetchMembers();
    } catch (error) {
      alert("Error al eliminar");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Organigrama y Equipo</h2>
          <p className="text-gray-400">Gestiona los miembros del equipo directivo y administrativo.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-jv-purple hover:bg-jv-turquoise text-white px-4 py-2 rounded-xl flex items-center transition-all duration-300 font-semibold shadow-[0_0_15px_rgba(155,28,201,0.3)]"
        >
          <Plus size={20} className="mr-2" />
          Añadir Miembro
        </button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Cargando equipo...</div>
        ) : members.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No hay miembros registrados. Añade uno nuevo.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-800/50 border-b border-gray-800 text-gray-400 text-sm">
                  <th className="p-4 font-medium">Foto</th>
                  <th className="p-4 font-medium">Nombre</th>
                  <th className="p-4 font-medium">Cargo</th>
                  <th className="p-4 font-medium">Orden</th>
                  <th className="p-4 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member.id} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
                    <td className="p-4">
                      {member.imageUrl ? (
                        <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-700">
                          <Image src={member.imageUrl} alt={member.name} width={48} height={48} className="object-cover w-full h-full" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-gray-500 border border-gray-700">
                          <Users size={20} />
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-white font-medium">{member.name}</td>
                    <td className="p-4 text-gray-400">{member.role}</td>
                    <td className="p-4 text-gray-400">{member.order}</td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <button onClick={() => openModal(member)} className="p-2 text-gray-400 hover:text-jv-turquoise bg-gray-800 rounded-lg transition-colors">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(member.id)} className="p-2 text-gray-400 hover:text-red-400 bg-gray-800 rounded-lg transition-colors">
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
                {editingId ? "Editar Miembro" : "Añadir Miembro"}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Nombre Completo</label>
                <input required type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Cargo / Rol</label>
                  <input required type="text" value={role} onChange={(e) => setRole(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Orden de aparición</label>
                  <input type="number" value={order} onChange={(e) => setOrder(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Perfil / Biografía</label>
                <textarea rows={3} value={bio} onChange={(e) => setBio(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none resize-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Foto (Opcional)</label>
                <div className="relative">
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  <div className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white flex items-center justify-between">
                    <span className="truncate text-sm text-gray-400">{imageUrl ? "Foto cargada (haz clic para cambiar)" : "Subir imagen..."}</span>
                    <ImageIcon size={18} className="text-gray-400" />
                  </div>
                </div>
                {imageUrl && (
                  <div className="mt-3 w-16 h-16 rounded-full overflow-hidden border border-gray-700 mx-auto">
                    <Image src={imageUrl} alt="Preview" width={64} height={64} className="object-cover w-full h-full" />
                  </div>
                )}
              </div>

              <div className="pt-4 flex space-x-3">
                <button type="button" onClick={closeModal} className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition-colors font-medium">Cancelar</button>
                <button type="submit" disabled={saving} className="flex-1 px-4 py-2 bg-jv-purple hover:bg-jv-turquoise text-white rounded-xl transition-colors font-medium flex justify-center items-center">
                  <Save size={18} className="mr-2" />
                  {saving ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
