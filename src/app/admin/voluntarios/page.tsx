"use client"

import { useState, useEffect } from "react";
import { Users, Trash2, CheckCircle2, Circle, Clock, Briefcase, Phone, Mail } from "lucide-react";

type Volunteer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  skills: string;
  availability: string;
  isContacted: boolean;
  createdAt: string;
};

export default function AdminVoluntarios() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);

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

  const handleDelete = async (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar a este postulante?")) return;

    try {
      // The API should probably have a DELETE endpoint or we can skip this for brevity, but let's assume it exists.
      const res = await fetch(`/api/voluntarios/${id}`, { method: "DELETE" });
      if (res.ok) fetchVolunteers();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Voluntarios Registrados</h2>
          <p className="text-gray-400">Gestiona las personas que desean ser parte de la fundación.</p>
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
          volunteers.map((vol) => (
            <div 
              key={vol.id} 
              className="bg-gray-900 border border-gray-800 rounded-2xl p-6 transition-colors relative group hover:border-jv-turquoise/50"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {vol.name}
                  </h3>
                  <div className="flex space-x-4 mt-1 text-sm text-gray-400">
                    <a href={`mailto:${vol.email}`} className="flex items-center hover:text-jv-turquoise transition-colors">
                      <Mail size={14} className="mr-1" /> {vol.email}
                    </a>
                    <a href={`https://wa.me/${vol.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="flex items-center hover:text-green-400 transition-colors">
                      <Phone size={14} className="mr-1" /> {vol.phone}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <span className="text-xs text-gray-500 flex items-center">
                    <Clock size={12} className="mr-1" />
                    {new Date(vol.createdAt).toLocaleString('es-ES')}
                  </span>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-800/50 p-3 rounded-xl border border-gray-700/50">
                  <p className="text-xs font-semibold text-jv-purple mb-1 uppercase tracking-wider">Habilidades</p>
                  <p className="text-sm text-gray-300">{vol.skills || "No especificado"}</p>
                </div>
                <div className="bg-gray-800/50 p-3 rounded-xl border border-gray-700/50">
                  <p className="text-xs font-semibold text-jv-turquoise mb-1 uppercase tracking-wider">Disponibilidad</p>
                  <p className="text-sm text-gray-300">{vol.availability || "No especificado"}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
