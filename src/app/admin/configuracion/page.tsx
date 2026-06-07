"use client"

import { useState, useEffect } from "react";
import { Save, Globe, Mail, Phone, MapPin, Link, Share2, Settings, BookOpen } from "lucide-react";

export default function AdminConfiguracion() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Institution State
  const [aboutUs, setAboutUs] = useState("");
  const [mission, setMission] = useState("");
  const [vision, setVision] = useState("");

  useEffect(() => {
    const fetchInstitution = async () => {
      try {
        const res = await fetch("/api/institucional");
        if (res.ok) {
          const data = await res.json();
          setAboutUs(data.aboutUs || "");
          setMission(data.mission || "");
          setVision(data.vision || "");
        }
      } catch (e) {
        console.error("Error fetching institution data", e);
      } finally {
        setFetching(false);
      }
    };
    fetchInstitution();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch("/api/institucional", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aboutUs, mission, vision })
      });

      if (res.ok) {
        alert("Información Institucional guardada correctamente");
      } else {
        alert("Hubo un error al guardar");
      }
    } catch (e) {
      console.error(e);
      alert("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Configuración del Sitio</h2>
          <p className="text-gray-400">Gestiona la información general, institucional y de contacto.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={loading || fetching}
          className="bg-jv-purple hover:bg-jv-turquoise text-white px-6 py-2 rounded-xl flex items-center transition-all duration-300 font-semibold shadow-[0_0_15px_rgba(155,28,201,0.3)] disabled:opacity-50"
        >
          <Save size={20} className="mr-2" />
          {loading ? "Guardando..." : "Guardar Cambios"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Columna Izquierda: Información General */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* NUEVO: Información Institucional */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center mb-6 border-b border-gray-800 pb-4">
              <BookOpen className="text-jv-purple mr-3" size={24} />
              <h3 className="text-xl font-semibold text-white">Información Institucional (Nosotros)</h3>
            </div>
            
            {fetching ? (
              <p className="text-gray-500">Cargando datos...</p>
            ) : (
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Quiénes Somos</label>
                  <textarea 
                    rows={4}
                    value={aboutUs}
                    onChange={(e) => setAboutUs(e.target.value)}
                    placeholder="Escribe la descripción de la fundación..."
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none resize-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Nuestra Misión</label>
                  <textarea 
                    rows={4}
                    value={mission}
                    onChange={(e) => setMission(e.target.value)}
                    placeholder="Escribe la misión..."
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none resize-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Nuestra Visión</label>
                  <textarea 
                    rows={4}
                    value={vision}
                    onChange={(e) => setVision(e.target.value)}
                    placeholder="Escribe la visión..."
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none resize-none" 
                  />
                </div>
              </form>
            )}
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center mb-6 border-b border-gray-800 pb-4">
              <Globe className="text-jv-purple mr-3" size={24} />
              <h3 className="text-xl font-semibold text-white">Información General (Footer)</h3>
            </div>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Nombre de la Organización</label>
                <input 
                  type="text" 
                  defaultValue="Fundación Juventud Viva"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Descripción Corta</label>
                <textarea 
                  rows={3}
                  defaultValue="Impulsando el desarrollo y liderazgo de las nuevas generaciones. Juntos construimos un futuro vibrante."
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none resize-none" 
                />
              </div>
            </form>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center mb-6 border-b border-gray-800 pb-4">
              <MapPin className="text-jv-purple mr-3" size={24} />
              <h3 className="text-xl font-semibold text-white">Datos de Contacto</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1 flex items-center"><Mail size={16} className="mr-2"/> Correo Electrónico</label>
                <input 
                  type="email" 
                  defaultValue="contacto@juventudviva.org"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1 flex items-center"><Phone size={16} className="mr-2"/> Teléfono</label>
                <input 
                  type="text" 
                  defaultValue="+57 300 123 4567"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none" 
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-400 mb-1">Dirección Física</label>
                <input 
                  type="text" 
                  defaultValue="Av. Principal 123, Ciudad Central"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Redes y Sistema */}
        <div className="space-y-6">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center mb-6 border-b border-gray-800 pb-4">
              <Share2 className="text-jv-purple mr-3" size={24} />
              <h3 className="text-xl font-semibold text-white">Redes Sociales</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1 flex items-center"><Link size={16} className="mr-2"/> Facebook</label>
                <input 
                  type="url" 
                  placeholder="https://facebook.com/..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1 flex items-center"><Link size={16} className="mr-2"/> Instagram</label>
                <input 
                  type="url" 
                  placeholder="https://instagram.com/..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1 flex items-center"><Link size={16} className="mr-2"/> Twitter / X</label>
                <input 
                  type="url" 
                  placeholder="https://twitter.com/..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none" 
                />
              </div>
            </div>
          </div>

          <div className="bg-jv-purple/10 border border-jv-purple/30 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Settings size={100} />
            </div>
            <h3 className="text-xl font-semibold text-jv-turquoise mb-2">Estado del Sistema</h3>
            <p className="text-gray-300 text-sm mb-4">Todos los sistemas operativos.</p>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex justify-between border-b border-jv-purple/20 pb-1">
                <span>Base de Datos</span>
                <span className="text-green-400 font-medium">Conectada (Neon)</span>
              </li>
              <li className="flex justify-between border-b border-jv-purple/20 pb-1">
                <span>Versión</span>
                <span>v1.0.0</span>
              </li>
              <li className="flex justify-between pb-1">
                <span>Entorno</span>
                <span className="text-yellow-400">Desarrollo</span>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
