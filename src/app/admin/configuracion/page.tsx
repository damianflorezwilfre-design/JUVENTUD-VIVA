"use client"

import { useState, useEffect } from "react";
import { Save, Globe, Mail, Phone, MapPin, Link as LinkIcon, Share2, Settings, BookOpen, Image as ImageIcon, TrendingUp } from "lucide-react";
import Image from "next/image";

export default function AdminConfiguracion() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Institution State
  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [aboutUs, setAboutUs] = useState("");
  const [mission, setMission] = useState("");
  const [vision, setVision] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [twitter, setTwitter] = useState("");
  const [tiktok, setTiktok] = useState("");

  // Features State
  const [feature1Title, setFeature1Title] = useState("");
  const [feature1Desc, setFeature1Desc] = useState("");
  const [feature2Title, setFeature2Title] = useState("");
  const [feature2Desc, setFeature2Desc] = useState("");
  const [feature3Title, setFeature3Title] = useState("");
  const [feature3Desc, setFeature3Desc] = useState("");
  const [publicBackground, setPublicBackground] = useState("");

  // Donations
  const [donationLink, setDonationLink] = useState("");
  const [donationQrUrl, setDonationQrUrl] = useState("");
  const [bankInfo, setBankInfo] = useState("");

  // Impact Counters
  const [stat1Value, setStat1Value] = useState("");
  const [stat1Label, setStat1Label] = useState("");
  const [stat2Value, setStat2Value] = useState("");
  const [stat2Label, setStat2Label] = useState("");
  const [stat3Value, setStat3Value] = useState("");
  const [stat3Label, setStat3Label] = useState("");

  // Transparency Features
  const [transparency1Title, setTransparency1Title] = useState("");
  const [transparency1Desc, setTransparency1Desc] = useState("");
  const [transparency2Title, setTransparency2Title] = useState("");
  const [transparency2Desc, setTransparency2Desc] = useState("");
  const [transparency3Title, setTransparency3Title] = useState("");
  const [transparency3Desc, setTransparency3Desc] = useState("");

  // Impact Calculator
  const [calcKitCost, setCalcKitCost] = useState("");
  const [calcMealCost, setCalcMealCost] = useState("");
  const [calcMarketCost, setCalcMarketCost] = useState("");
  const [calcSuppliesCost, setCalcSuppliesCost] = useState("");

  // WhatsApp Group Notifications
  const [whatsappApiKey, setWhatsappApiKey] = useState("");
  const [whatsappGroupPhone, setWhatsappGroupPhone] = useState("");

  // Portal Theme Override
  const [themeOverride, setThemeOverride] = useState("auto");

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

  const handleQrUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDonationQrUrl(reader.result as string);
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
          setHeroTitle(data.heroTitle || "Empoderando a la Nueva Generación");
          setHeroSubtitle(data.heroSubtitle || '"No construimos para una elección, construimos para una generación." — Juventud ViVa, Villanueva - La Guajira.');
          setAboutUs(data.aboutUs || "");
          setMission(data.mission || "");
          setVision(data.vision || "");
          setAddress(data.address || "");
          setPhone(data.phone || "");
          setEmail(data.email || "");
          setFacebook(data.facebook || "");
          setInstagram(data.instagram || "");
          setTwitter(data.twitter || "");
          setTiktok(data.tiktok || "");
          setFeature1Title(data.feature1Title || "Liderazgo Comunitario");
          setFeature1Desc(data.feature1Desc || "Formamos jóvenes capaces de liderar iniciativas de impacto social.");
          setFeature2Title(data.feature2Title || "Educación Continua");
          setFeature2Desc(data.feature2Desc || "Ofrecemos talleres y programas para el desarrollo personal y profesional.");
          setFeature3Title(data.feature3Title || "Acción Social");
          setFeature3Desc(data.feature3Desc || "Participamos activamente en la mejora de nuestras comunidades.");
          setPublicBackground(data.publicBackground || "");
          setDonationLink(data.donationLink || "");
          setDonationQrUrl(data.donationQrUrl || "");
          setBankInfo(data.bankInfo || "");
          setStat1Value(data.stat1Value || "");
          setStat1Label(data.stat1Label || "");
          setStat2Value(data.stat2Value || "");
          setStat2Label(data.stat2Label || "");
          setStat3Value(data.stat3Value || "");
          setStat3Label(data.stat3Label || "");
          setTransparency1Title(data.transparency1Title || "Auditorías Abiertas");
          setTransparency1Desc(data.transparency1Desc || "Trabajamos bajo estrictos estándares contables. Nuestros libros están siempre abiertos a revisión para nuestros grandes donantes y fundadores.");
          setTransparency2Title(data.transparency2Title || "Máximo Impacto Directo");
          setTransparency2Desc(data.transparency2Desc || "Nos esforzamos por mantener nuestros costos administrativos al mínimo absoluto, asegurando que la mayor parte de tu donación llegue directamente a quienes lo necesitan.");
          setTransparency3Title(data.transparency3Title || "Donantes Comprometidos");
          setTransparency3Desc(data.transparency3Desc || "Nuestra red de aliados confía ciegamente en nosotros gracias a los reportes constantes de impacto que entregamos mes a mes.");
          setCalcKitCost(data.calcKitCost?.toString() || "50000");
          setCalcMealCost(data.calcMealCost?.toString() || "15000");
          setCalcMarketCost(data.calcMarketCost?.toString() || "100000");
          setCalcSuppliesCost(data.calcSuppliesCost?.toString() || "30000");
          setWhatsappApiKey(data.whatsappApiKey || "");
          setWhatsappGroupPhone(data.whatsappGroupPhone || "");
          setThemeOverride(data.themeOverride || "auto");
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
          heroTitle, heroSubtitle, aboutUs, mission, vision, address, phone, email, facebook, instagram, twitter, tiktok,
          feature1Title, feature1Desc, feature2Title, feature2Desc, feature3Title, feature3Desc, publicBackground,
          donationLink, bankInfo, donationQrUrl, stat1Value, stat1Label, stat2Value, stat2Label, stat3Value, stat3Label,
          transparency1Title, transparency1Desc, transparency2Title, transparency2Desc, transparency3Title, transparency3Desc,
          calcKitCost, calcMealCost, calcMarketCost, calcSuppliesCost, whatsappApiKey, whatsappGroupPhone, themeOverride
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
                <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 mb-6">
                  <h4 className="text-jv-turquoise font-semibold mb-3">Textos de la Portada Principal (3D)</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">Título Principal (Hero)</label>
                      <input type="text" value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} placeholder="Ej. Empoderando a la Nueva Generación" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">Frase Inspiracional (Subtítulo)</label>
                      <textarea rows={2} value={heroSubtitle} onChange={(e) => setHeroSubtitle(e.target.value)} placeholder="Ej. No construimos para una elección..." className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none resize-none" />
                    </div>
                  </div>
                </div>

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

          {/* Contadores de Impacto */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center mb-6 border-b border-gray-800 pb-4">
              <BookOpen className="text-jv-purple mr-3" size={24} />
              <h3 className="text-xl font-semibold text-white">Contadores de Impacto</h3>
            </div>
            
            {fetching ? (
              <p className="text-gray-500">Cargando datos...</p>
            ) : (
              <form className="space-y-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                  <h4 className="text-jv-turquoise font-semibold mb-3">Estadística 1</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">Número</label>
                      <input type="text" value={stat1Value} onChange={(e) => setStat1Value(e.target.value)} placeholder="Ej. 500+" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">Texto</label>
                      <input type="text" value={stat1Label} onChange={(e) => setStat1Label(e.target.value)} placeholder="Ej. Jóvenes Impactados" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none" />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                  <h4 className="text-jv-purple font-semibold mb-3">Estadística 2</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">Número</label>
                      <input type="text" value={stat2Value} onChange={(e) => setStat2Value(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">Texto</label>
                      <input type="text" value={stat2Label} onChange={(e) => setStat2Label(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none" />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                  <h4 className="text-red-400 font-semibold mb-3">Estadística 3</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">Número</label>
                      <input type="text" value={stat3Value} onChange={(e) => setStat3Value(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">Texto</label>
                      <input type="text" value={stat3Label} onChange={(e) => setStat3Label(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none" />
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* Pilares de Transparencia */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mt-6">
            <div className="flex items-center mb-6 border-b border-gray-800 pb-4">
              <BookOpen className="text-jv-purple mr-3" size={24} />
              <h3 className="text-xl font-semibold text-white">Pilares de Transparencia</h3>
            </div>
            
            {fetching ? (
              <p className="text-gray-500">Cargando datos...</p>
            ) : (
              <form className="space-y-6">
                <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                  <h4 className="text-jv-turquoise font-semibold mb-3">Pilar 1</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">Título</label>
                      <input type="text" value={transparency1Title} onChange={(e) => setTransparency1Title(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">Descripción</label>
                      <textarea rows={3} value={transparency1Desc} onChange={(e) => setTransparency1Desc(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none resize-none" />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                  <h4 className="text-jv-purple font-semibold mb-3">Pilar 2</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">Título</label>
                      <input type="text" value={transparency2Title} onChange={(e) => setTransparency2Title(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">Descripción</label>
                      <textarea rows={3} value={transparency2Desc} onChange={(e) => setTransparency2Desc(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none resize-none" />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                  <h4 className="text-red-400 font-semibold mb-3">Pilar 3</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">Título</label>
                      <input type="text" value={transparency3Title} onChange={(e) => setTransparency3Title(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">Descripción</label>
                      <textarea rows={3} value={transparency3Desc} onChange={(e) => setTransparency3Desc(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none resize-none" />
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* Calculadora de Impacto */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mt-6">
            <div className="flex items-center mb-6 border-b border-gray-800 pb-4">
              <TrendingUp className="text-jv-purple mr-3" size={24} />
              <h3 className="text-xl font-semibold text-white">Calculadora de Impacto</h3>
            </div>
            
            {fetching ? (
              <p className="text-gray-500">Cargando datos...</p>
            ) : (
              <form className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">1 Kit Escolar ($ COP)</label>
                  <input type="number" value={calcKitCost} onChange={(e) => setCalcKitCost(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white font-mono focus:border-jv-purple focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">1 Desayuno ($ COP)</label>
                  <input type="number" value={calcMealCost} onChange={(e) => setCalcMealCost(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white font-mono focus:border-jv-purple focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">1 Mercado Familiar ($ COP)</label>
                  <input type="number" value={calcMarketCost} onChange={(e) => setCalcMarketCost(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white font-mono focus:border-jv-purple focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Implementos Educ/Deport ($ COP)</label>
                  <input type="number" value={calcSuppliesCost} onChange={(e) => setCalcSuppliesCost(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white font-mono focus:border-jv-purple focus:outline-none" />
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
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1 flex items-center"><LinkIcon size={16} className="mr-2"/> TikTok</label>
                <input type="url" value={tiktok} onChange={(e) => setTiktok(e.target.value)} placeholder="https://tiktok.com/@..." className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-xl col-span-1 md:col-span-2">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <span className="bg-jv-turquoise/20 p-2 rounded-lg mr-3">
                <Settings className="text-jv-turquoise" size={24} />
              </span>
              Temática del Portal (Modo Manual)
            </h2>
            <p className="text-sm text-gray-400 mb-4">Selecciona si quieres que la página cambie de temática automáticamente según la fecha, o si deseas forzar una temática especial (como un cumpleaños).</p>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Forzar Temática:
                </label>
                <select
                  value={themeOverride}
                  onChange={(e) => setThemeOverride(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-jv-turquoise"
                >
                  <option value="auto">🤖 Automático (según la fecha real)</option>
                  <option value="cumpleanos">🎂 Cumpleaños (Pastel y Confeti)</option>
                  <option value="aniversario">🥳 Aniversario de Fundación (Fiesta)</option>
                  <option value="dia-mujer">👩 Día de la Mujer (Morado y Flores)</option>
                  <option value="dia-juventud">🛹 Día de la Juventud (Estrellas y Energía)</option>
                  <option value="dia-nino">🪁 Día del Niño (Juguetes y Colores)</option>
                  <option value="dia-padre">👔 Día del Padre (Azul y Corbatas)</option>
                  <option value="navidad">🎅 Forzar Navidad</option>
                  <option value="halloween">🎃 Forzar Halloween</option>
                  <option value="amor-amistad">💘 Forzar Amor y Amistad</option>
                  <option value="colombia">⚽ Forzar Mundial / Independencia</option>
                </select>
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

          {/* Donaciones */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center mb-6 border-b border-gray-800 pb-4">
              <Globe className="text-jv-purple mr-3" size={24} />
              <h3 className="text-xl font-semibold text-white">Donaciones</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Cuentas Bancarias / Info (Modal)</label>
                <textarea rows={3} value={bankInfo} onChange={(e) => setBankInfo(e.target.value)} placeholder="Ej. Nequi: 300123...&#10;Bancolombia: Ahorros 123..." className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none resize-none" />
                <p className="text-xs text-gray-500 mt-1">Este texto aparecerá en la pequeña ventana cuando el usuario haga clic en Donar.</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1 flex items-center">
                  <ImageIcon size={16} className="mr-2"/> Código QR para Donaciones (Opcional)
                </label>
                <div className="relative h-48 bg-gray-800 border-2 border-dashed border-gray-700 rounded-xl overflow-hidden group hover:border-jv-purple transition-colors">
                  <input type="file" accept="image/*" onChange={handleQrUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  {donationQrUrl ? (
                    <Image src={donationQrUrl} alt="QR Donaciones" fill className="object-contain p-2" />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 group-hover:text-jv-purple transition-colors">
                      <ImageIcon size={32} className="mb-2" />
                      <span className="text-sm">Click o arrastra el QR aquí</span>
                    </div>
                  )}
                </div>
                {donationQrUrl && (
                  <button 
                    onClick={(e) => { e.preventDefault(); setDonationQrUrl(""); }}
                    className="w-full mt-2 text-sm text-red-400 hover:text-red-300 bg-red-400/10 hover:bg-red-400/20 py-2 rounded-lg transition-colors"
                  >
                    Quitar Código QR
                  </button>
                )}
              </div>
              
              <div className="hidden">
                <label className="block text-sm font-medium text-gray-400 mb-1 flex items-center"><LinkIcon size={16} className="mr-2"/> Link Externo de Donación (Opcional)</label>
                <input type="url" value={donationLink} onChange={(e) => setDonationLink(e.target.value)} placeholder="https://mercadopago.com/..." className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none" />
              </div>
            </div>
          </div>

          {/* Notificaciones WhatsApp */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center mb-6 border-b border-gray-800 pb-4">
              <Phone className="text-jv-purple mr-3" size={24} />
              <h3 className="text-xl font-semibold text-white">Notificaciones de WhatsApp</h3>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm text-gray-400 mb-2">Para recibir notificaciones automáticas a tu WhatsApp, guarda el número <strong>+34 644 03 87 31</strong> y envíale el mensaje: <code>I allow callmebot to send me messages</code> para obtener tu API Key.</p>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">CallMeBot API Key</label>
                <input type="text" value={whatsappApiKey} onChange={(e) => setWhatsappApiKey(e.target.value)} placeholder="Ej. 123456" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Tu Número de Teléfono (con código de país)</label>
                <input type="text" value={whatsappGroupPhone} onChange={(e) => setWhatsappGroupPhone(e.target.value)} placeholder="Ej. +573245083402" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none" />
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
