"use client"

import { useState, useEffect } from "react";
import { Save, Globe, Mail, Phone, MapPin, Link as LinkIcon, Share2, Settings, BookOpen, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

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

  // Features State
  const [feature1Title, setFeature1Title] = useState("");
  const [feature1Desc, setFeature1Desc] = useState("");
  const [feature2Title, setFeature2Title] = useState("");
  const [feature2Desc, setFeature2Desc] = useState("");
  const [feature3Title, setFeature3Title] = useState("");
  const [feature3Desc, setFeature3Desc] = useState("");
  const [publicBackground, setPublicBackground] = useState("");

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPublicBackground(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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
          setFeature1Title(data.feature1Title || "Liderazgo Comunitario");
          setFeature1Desc(data.feature1Desc || "Formamos jóvenes capaces de liderar iniciativas de impacto social.");
          setFeature2Title(data.feature2Title || "Educación Continua");
          setFeature2Desc(data.feature2Desc || "Ofrecemos talleres y programas para el desarrollo personal y profesional.");
          setFeature3Title(data.feature3Title || "Acción Social");
          setFeature3Desc(data.feature3Desc || "Participamos activamente en la mejora de nuestras comunidades.");
          setPublicBackground(data.publicBackground || "");
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
        body: JSON.stringify({ 
          aboutUs, mission, vision, address, phone, email, facebook, instagram, twitter,
          feature1Title, feature1Desc, feature2Title, feature2Desc, feature3Title, feature3Desc, publicBackground
        })
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

          {/* Tarjetas Editables (Pilares) */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center mb-6 border-b border-gray-800 pb-4">
              <BookOpen className="text-jv-purple mr-3" size={24} />
              <h3 className="text-xl font-semibold text-white">Pilares de la Página Principal</h3>
            </div>
            
            {fetching ? (
              <p className="text-gray-500">Cargando datos...</p>
            ) : (
              <form className="space-y-6">
                <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                  <h4 className="text-jv-turquoise font-semibold mb-3">Tarjeta 1</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">Título</label>
                      <input type="text" value={feature1Title} onChange={(e) => setFeature1Title(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">Descripción</label>
                      <textarea rows={2} value={feature1Desc} onChange={(e) => setFeature1Desc(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none resize-none" />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                  <h4 className="text-jv-purple font-semibold mb-3">Tarjeta 2</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">Título</label>
                      <input type="text" value={feature2Title} onChange={(e) => setFeature2Title(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">Descripción</label>
                      <textarea rows={2} value={feature2Desc} onChange={(e) => setFeature2Desc(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none resize-none" />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                  <h4 className="text-red-400 font-semibold mb-3">Tarjeta 3</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">Título</label>
                      <input type="text" value={feature3Title} onChange={(e) => setFeature3Title(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">Descripción</label>
                      <textarea rows={2} value={feature3Desc} onChange={(e) => setFeature3Desc(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none resize-none" />
                    </div>
                  </div>
                </div>
              </form>
            )}
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

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center mb-6 border-b border-gray-800 pb-4">
              <ImageIcon className="text-jv-purple mr-3" size={24} />
              <h3 className="text-xl font-semibold text-white">Fondo del Portal Público</h3>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm text-gray-400">Selecciona una imagen para que se muestre como fondo fijo en todo el portal público.</p>
              
              <div className="relative">
                <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                <div className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white flex items-center justify-between hover:bg-gray-700 transition-colors">
                  <span className="truncate text-sm text-gray-400">
                    {publicBackground ? "Fondo cargado (haz clic para cambiar)" : "Subir imagen..."}
                  </span>
                  <ImageIcon size={18} className="text-gray-400" />
                </div>
              </div>
              
              {publicBackground && (
                <div className="mt-4 w-full h-32 rounded-xl overflow-hidden border border-gray-700 relative">
                  <Image src={publicBackground} alt="Fondo" fill className="object-cover" />
                </div>
              )}
              
              {publicBackground && (
                <button 
                  onClick={() => setPublicBackground("")}
                  className="w-full mt-2 text-sm text-red-400 hover:text-red-300 bg-red-400/10 hover:bg-red-400/20 py-2 rounded-lg transition-colors"
                >
                  Quitar fondo
                </button>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
