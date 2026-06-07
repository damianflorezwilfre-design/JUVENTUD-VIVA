"use client"

import { useState, useEffect } from "react";
import { PlusCircle, Trash2, Globe, Image as ImageIcon, Users } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

type Alliance = {
  id: string;
  name: string;
  logoUrl: string;
  website: string | null;
};

export default function AdminAlianzas() {
  const [alianzas, setAlianzas] = useState<Alliance[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [website, setWebsite] = useState("");

  const fetchAlianzas = async () => {
    try {
      const res = await fetch("/api/alianzas");
      if (res.ok) {
        const data = await res.json();
        setAlianzas(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlianzas();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !logoUrl) return;

    try {
      const res = await fetch("/api/alianzas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, logoUrl, website })
      });

      if (res.ok) {
        setIsAdding(false);
        setName("");
        setLogoUrl("");
        setWebsite("");
        fetchAlianzas();
      } else {
        alert("Error al guardar la alianza.");
      }
    } catch (e) {
      alert("Error de conexión");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar esta alianza?")) return;

    try {
      const res = await fetch(`/api/alianzas/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchAlianzas();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Red de Alianzas</h2>
          <p className="text-gray-400">Gestiona las organizaciones, empresas e instituciones aliadas.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-jv-purple hover:bg-jv-turquoise text-white px-4 py-2 rounded-xl flex items-center transition-all duration-300 font-semibold shadow-[0_0_15px_rgba(155,28,201,0.3)]"
        >
          <PlusCircle size={20} className="mr-2" />
          Nueva Alianza
        </button>
      </div>

      {isAdding && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 border border-jv-purple/30 rounded-2xl p-6 mb-8"
        >
          <h3 className="text-xl font-bold text-white mb-4">Agregar Alianza</h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Nombre del Aliado</label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Cámara de Comercio..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Enlace Web (Opcional)</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-2.5 text-gray-500" size={18} />
                  <input 
                    type="url" 
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white focus:border-jv-purple focus:outline-none" 
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Enlace del Logo (URL)</label>
              <div className="relative">
                <ImageIcon className="absolute left-3 top-2.5 text-gray-500" size={18} />
                <input 
                  type="url" 
                  required
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="https://ejemplo.com/logo.png"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white focus:border-jv-purple focus:outline-none" 
                />
              </div>
            </div>
            
            {logoUrl && (
              <div className="mt-4 p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center h-32 w-32 relative mx-auto">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logoUrl} alt="Preview" className="max-h-full max-w-full object-contain" onError={(e) => e.currentTarget.src = 'https://via.placeholder.com/150?text=Error'} />
              </div>
            )}

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
                Guardar Aliado
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-jv-purple"></div>
        </div>
      ) : alianzas.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center flex flex-col items-center">
          <Users size={48} className="text-gray-600 mb-4" />
          <h3 className="text-xl font-medium text-gray-300 mb-2">No hay alianzas registradas</h3>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            Agrega los logos de las empresas y organizaciones que apoyan a Juventud Viva para mostrarlos en la página principal.
          </p>
          <button 
            onClick={() => setIsAdding(true)}
            className="text-jv-purple hover:text-jv-turquoise font-medium"
          >
            + Agregar primera alianza
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {alianzas.map((alianza) => (
            <div key={alianza.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 relative group flex flex-col items-center hover:border-jv-purple/30 transition-colors">
              <button 
                onClick={() => handleDelete(alianza.id)}
                className="absolute top-2 right-2 p-2 bg-red-500/10 text-red-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
              >
                <Trash2 size={16} />
              </button>
              
              <div className="h-24 w-full flex items-center justify-center bg-white/5 rounded-xl p-4 mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={alianza.logoUrl} alt={alianza.name} className="max-h-full max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300" />
              </div>
              
              <h3 className="font-semibold text-white text-center text-sm">{alianza.name}</h3>
              {alianza.website && (
                <a href={alianza.website} target="_blank" rel="noreferrer" className="text-xs text-jv-turquoise mt-1 hover:underline flex items-center">
                  <Globe size={10} className="mr-1" /> Visitar Web
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
