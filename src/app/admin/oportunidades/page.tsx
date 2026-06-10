"use client"

import { useState, useEffect } from "react";
import { Plus, Edit, Trash, Briefcase, GraduationCap } from "lucide-react";

export default function AdminOportunidades() {
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("EMPLEO");
  const [link, setLink] = useState("");
  const [isActive, setIsActive] = useState(true);

  const fetchOpportunities = async () => {
    try {
      const res = await fetch("/api/oportunidades");
      const data = await res.json();
      setOpportunities(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const openModal = (opp?: any) => {
    if (opp) {
      setEditingId(opp.id);
      setTitle(opp.title);
      setCompany(opp.company);
      setDescription(opp.description);
      setType(opp.type);
      setLink(opp.link);
      setIsActive(opp.isActive);
    } else {
      setEditingId(null);
      setTitle("");
      setCompany("");
      setDescription("");
      setType("EMPLEO");
      setLink("");
      setIsActive(true);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { title, company, description, type, link, isActive };

    try {
      const url = editingId ? `/api/oportunidades/${editingId}` : "/api/oportunidades";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchOpportunities();
      } else {
        alert("Error al guardar");
      }
    } catch (e) {
      alert("Error de conexión");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar esta oportunidad?")) return;
    try {
      const res = await fetch(`/api/oportunidades/${id}`, { method: "DELETE" });
      if (res.ok) fetchOpportunities();
    } catch (e) {
      alert("Error al eliminar");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Bolsa de Oportunidades</h2>
          <p className="text-gray-400">Publica ofertas de empleo o becas de estudio para la red de jóvenes.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-jv-turquoise hover:bg-white text-jv-dark px-4 py-2 rounded-xl flex items-center font-bold transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Nueva Oportunidad
        </button>
      </div>

      {loading ? (
        <div className="text-gray-400">Cargando...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {opportunities.map((opp) => (
            <div key={opp.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col h-full">
              {!opp.isActive && <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg z-10">Inactiva</div>}
              
              <div className="flex items-center mb-4">
                <div className={`p-3 rounded-lg mr-4 ${opp.type === 'BECA' ? 'bg-jv-purple/20 text-jv-purple' : 'bg-jv-turquoise/20 text-jv-turquoise'}`}>
                  {opp.type === 'BECA' ? <GraduationCap size={24} /> : <Briefcase size={24} />}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white line-clamp-1">{opp.title}</h3>
                  <p className="text-sm text-gray-400">{opp.company}</p>
                </div>
              </div>
              
              <p className="text-gray-400 text-sm mb-4 line-clamp-4 flex-grow">{opp.description}</p>
              
              {opp.link && (
                <div className="mb-4">
                  <a href={opp.link} target="_blank" rel="noopener noreferrer" className="text-jv-turquoise text-sm hover:underline">
                    Ver enlace de postulación
                  </a>
                </div>
              )}

              <div className="flex justify-end space-x-2 border-t border-gray-800 pt-4 mt-auto">
                <button onClick={() => openModal(opp)} className="p-2 bg-jv-purple/20 text-jv-purple hover:bg-jv-purple/40 rounded-lg transition-colors">
                  <Edit size={18} />
                </button>
                <button onClick={() => handleDelete(opp.id)} className="p-2 bg-red-500/20 text-red-500 hover:bg-red-500/40 rounded-lg transition-colors">
                  <Trash size={18} />
                </button>
              </div>
            </div>
          ))}
          {opportunities.length === 0 && (
            <div className="col-span-full p-8 text-center text-gray-500 bg-gray-900 border border-gray-800 rounded-2xl">
              No hay oportunidades publicadas.
            </div>
          )}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-white mb-4">{editingId ? "Editar Oportunidad" : "Nueva Oportunidad"}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Tipo de Oportunidad</label>
                  <select value={type} onChange={e => setType(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white">
                    <option value="EMPLEO">Empleo / Práctica</option>
                    <option value="BECA">Beca de Estudio</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Institución / Empresa</label>
                  <input required type="text" value={company} onChange={e => setCompany(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Título de la oferta</label>
                <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Descripción y Requisitos</label>
                <textarea required rows={5} value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white resize-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Enlace de Postulación (Link)</label>
                <input required type="url" placeholder="https://" value={link} onChange={e => setLink(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white" />
              </div>

              <div className="flex items-center mt-2">
                <input type="checkbox" id="isActive" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="mr-2" />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-400">Oportunidad Activa (Visible al público)</label>
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
