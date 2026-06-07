"use client"

import { useState, useEffect } from "react";
import { Save, Globe, Mail, Phone, MapPin, Link as LinkIcon, Share2, Settings, BookOpen } from "lucide-react";

export default function AdminConfiguracion() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Institution State
  const [aboutUs, setAboutUs] = useState("");
  const [mission, setMission] = useState("");
  const [vision, setVision] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [twitter, setTwitter] = useState("");

  useEffect(() => {
    const fetchInstitution = async () => {
      try {
        const res = await fetch("/api/institucional");
        if (res.ok) {
          const data = await res.json();
          setAboutUs(data.aboutUs || "");
          setMission(data.mission || "");
          setVision(data.vision || "");
          setAddress(data.address || "");
          setPhone(data.phone || "");
          setEmail(data.email || "");
          setFacebook(data.facebook || "");
          setInstagram(data.instagram || "");
          setTwitter(data.twitter || "");
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
        body: JSON.stringify({ aboutUs, mission, vision, address, phone, email, facebook, instagram, twitter })
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
                  <textarea rows={4} value={aboutUs} onChange={(e) => setAboutUs(e.target.value)} placeholder="Escribe la descripción de la fundación..." className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Nuestra Misión</label>
                  <textarea rows={4} value={mission} onChange={(e) => setMission(e.target.value)} placeholder="Escribe la misión..." className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Nuestra Visión</label>
                  <textarea rows={4} value={vision} onChange={(e) => setVision(e.target.value)} placeholder="Escribe la visión..." className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none resize-none" />
                </div>
              </form>
            )}
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center mb-6 border-b border-gray-800 pb-4">
              <MapPin className="text-jv-purple mr-3" size={24} />
              <h3 className="text-xl font-semibold text-white">Datos de Contacto</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1 flex items-center"><Mail size={16} className="mr-2"/> Correo Electrónico</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="contacto@juventudviva.org" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1 flex items-center"><Phone size={16} className="mr-2"/> Teléfono</label>
                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+57 300 123 4567" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-400 mb-1">Dirección Física</label>
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Av. Principal 123, Ciudad Central" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none" />
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
                <label className="block text-sm font-medium text-gray-400 mb-1 flex items-center"><LinkIcon size={16} className="mr-2"/> Facebook</label>
                <input type="url" value={facebook} onChange={(e) => setFacebook(e.target.value)} placeholder="https://facebook.com/..." className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1 flex items-center"><LinkIcon size={16} className="mr-2"/> Instagram</label>
                <input type="url" value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="https://instagram.com/..." className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1 flex items-center"><LinkIcon size={16} className="mr-2"/> Twitter / X</label>
                <input type="url" value={twitter} onChange={(e) => setTwitter(e.target.value)} placeholder="https://twitter.com/..." className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none" />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
