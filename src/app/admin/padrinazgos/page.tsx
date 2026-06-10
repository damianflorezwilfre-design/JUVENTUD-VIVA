"use client"

import { useState, useEffect } from "react";
import { Plus, Edit, Trash, Image as ImageIcon, Heart } from "lucide-react";
import Image from "next/image";

export default function AdminPadrinazgos() {
  const [sponsorships, setSponsorships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isActive, setIsActive] = useState(true);

  const fetchSponsorships = async () => {
    try {
      const res = await fetch("/api/padrinazgos");
      const data = await res.json();
      setSponsorships(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSponsorships();
  }, []);

  const openModal = (sponsor?: any) => {
    if (sponsor) {
      setEditingId(sponsor.id);
      setTitle(sponsor.title);
      setDescription(sponsor.description);
      setGoalAmount(sponsor.goalAmount?.toString() || "");
      setCurrentAmount(sponsor.currentAmount?.toString() || "");
      setImageUrl(sponsor.imageUrl || "");
      setIsActive(sponsor.isActive);
    } else {
      setEditingId(null);
      setTitle("");
      setDescription("");
      setGoalAmount("");
      setCurrentAmount("");
      setImageUrl("");
      setIsActive(true);
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
    const payload = { title, description, goalAmount, currentAmount, imageUrl, isActive };

    try {
      const url = editingId ? `/api/padrinazgos/${editingId}` : "/api/padrinazgos";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchSponsorships();
      } else {
        alert("Error al guardar");
      }
    } catch (e) {
      alert("Error de conexión");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar esta causa?")) return;
    try {
      const res = await fetch(`/api/padrinazgos/${id}`, { method: "DELETE" });
      if (res.ok) fetchSponsorships();
    } catch (e) {
      alert("Error al eliminar");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Causas de Padrinazgo</h2>
          <p className="text-gray-400">Gestiona los proyectos o jóvenes que necesitan apadrinamiento.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-jv-turquoise hover:bg-white text-jv-dark px-4 py-2 rounded-xl flex items-center font-bold transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Nueva Causa
        </button>
      </div>

      {loading ? (
        <div className="text-gray-400">Cargando...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sponsorships.map((s) => (
            <div key={s.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
              {!s.isActive && <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg z-10">Inactiva</div>}
              {s.imageUrl && (
                <div className="w-full h-40 rounded-xl overflow-hidden mb-4 relative">
                  <Image src={s.imageUrl} alt={s.title} fill className="object-cover" />
                </div>
              )}
              <h3 className="text-xl font-bold text-white mb-2">{s.title}</h3>
              <p className="text-gray-400 text-sm mb-4 line-clamp-3">{s.description}</p>
              
              <div className="bg-gray-800 rounded-lg p-3 mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-jv-turquoise font-medium">${s.currentAmount}</span>
                  <span className="text-gray-400">Meta: ${s.goalAmount || "0"}</span>
                </div>
                <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-jv-purple to-jv-turquoise h-full rounded-full" 
                    style={{ width: s.goalAmount ? `${Math.min(100, (s.currentAmount / s.goalAmount) * 100)}%` : '0%' }}
                  ></div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 border-t border-gray-800 pt-4">
                <button onClick={() => openModal(s)} className="p-2 bg-jv-purple/20 text-jv-purple hover:bg-jv-purple/40 rounded-lg transition-colors">
                  <Edit size={18} />
                </button>
                <button onClick={() => handleDelete(s.id)} className="p-2 bg-red-500/20 text-red-500 hover:bg-red-500/40 rounded-lg transition-colors">
                  <Trash size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-white mb-4">{editingId ? "Editar Causa" : "Nueva Causa"}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Título</label>
                <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Descripción de la causa</label>
                <textarea required rows={4} value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white resize-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Meta de Recaudación ($)</label>
                  <input type="number" value={goalAmount} onChange={e => setGoalAmount(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Recaudado Actual ($)</label>
                  <input type="number" value={currentAmount} onChange={e => setCurrentAmount(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Imagen de la causa</label>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white" />
                {imageUrl && (
                  <div className="mt-2 w-full h-32 relative rounded-lg overflow-hidden border border-gray-700">
                    <Image src={imageUrl} alt="Preview" fill className="object-cover" />
                  </div>
                )}
              </div>

              <div className="flex items-center">
                <input type="checkbox" id="isActive" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="mr-2" />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-400">Causa Activa (Visible al público)</label>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors">
                  Cancelar
                </button>
                <button type="submit" className="px-4 py-2 bg-jv-purple hover:bg-jv-turquoise text-white rounded-lg transition-colors font-semibold">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
