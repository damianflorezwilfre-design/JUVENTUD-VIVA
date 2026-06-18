"use client"
export const revalidate = 60;

import { motion } from "framer-motion";
import { Users, HeartHandshake, Star, Send } from "lucide-react";
import { useState } from "react";

export default function Voluntariado() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", skills: "", availability: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/voluntarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setSuccess(true);
        setFormData({ name: "", email: "", phone: "", skills: "", availability: "" });
      } else {
        alert("Ocurrió un error al enviar tu solicitud. Inténtalo de nuevo.");
      }
    } catch (e) {
      alert("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center space-x-2 bg-jv-purple/20 text-jv-turquoise px-4 py-2 rounded-full mb-6 border border-jv-purple/30">
            <HeartHandshake size={20} />
            <span className="font-semibold text-sm">Únete a nuestra causa</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Sé parte del <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-jv-purple to-jv-turquoise">
              Cambio Real
            </span>
          </h1>
          
          <p className="text-lg text-gray-400 mb-8 max-w-lg">
            Buscamos jóvenes y profesionales apasionados que quieran donar su tiempo y talento para transformar nuestra comunidad.
          </p>

          <div className="space-y-6 mb-12">
            <div className="flex items-start space-x-4">
              <div className="bg-jv-purple/20 p-3 rounded-2xl">
                <Users className="text-jv-purple" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Impacto Directo</h3>
                <p className="text-gray-400 text-sm">Trabaja hombro a hombro con las comunidades que más lo necesitan.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-jv-turquoise/20 p-3 rounded-2xl">
                <Star className="text-jv-turquoise" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Crecimiento Personal</h3>
                <p className="text-gray-400 text-sm">Desarrolla habilidades de liderazgo, empatía y trabajo en equipo.</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gray-900 border border-gray-800 rounded-3xl p-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-jv-purple/10 rounded-full blur-[80px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-jv-turquoise/10 rounded-full blur-[80px] pointer-events-none"></div>
          
          <h2 className="text-2xl font-bold text-white mb-6 relative z-10">Formulario de Postulación</h2>
          
          {success ? (
            <div className="bg-jv-turquoise/10 border border-jv-turquoise/30 rounded-2xl p-8 text-center relative z-10">
              <HeartHandshake size={48} className="text-jv-turquoise mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">¡Gracias por tu interés!</h3>
              <p className="text-gray-400">Hemos recibido tu postulación. Nuestro equipo te contactará pronto para darte la bienvenida.</p>
              <button 
                onClick={() => setSuccess(false)}
                className="mt-6 text-jv-purple hover:text-white font-medium transition-colors"
              >
                Enviar otra solicitud
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Nombre Completo</label>
                  <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-jv-purple focus:outline-none transition-colors" placeholder="Tu nombre" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Teléfono (WhatsApp)</label>
                  <input required type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-jv-purple focus:outline-none transition-colors" placeholder="+57 300 000 0000" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Correo Electrónico</label>
                <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-jv-purple focus:outline-none transition-colors" placeholder="correo@ejemplo.com" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Habilidades o Profesión</label>
                <input type="text" value={formData.skills} onChange={(e) => setFormData({...formData, skills: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-jv-purple focus:outline-none transition-colors" placeholder="Ej. Psicólogo, Diseñador, Carpintero, etc." />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Disponibilidad de Tiempo</label>
                <select value={formData.availability} onChange={(e) => setFormData({...formData, availability: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-jv-purple focus:outline-none transition-colors">
                  <option value="">Selecciona una opción</option>
                  <option value="Fines de semana">Fines de semana</option>
                  <option value="Entre semana (Tardes)">Entre semana (Tardes)</option>
                  <option value="Entre semana (Mañanas)">Entre semana (Mañanas)</option>
                  <option value="Flexible / Proyectos específicos">Flexible / Proyectos específicos</option>
                </select>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 bg-jv-purple hover:bg-jv-turquoise text-white font-bold rounded-xl transition-colors mt-4 flex items-center justify-center disabled:opacity-50 shadow-[0_0_20px_rgba(155,28,201,0.3)] hover:shadow-[0_0_20px_rgba(79,221,230,0.4)]"
              >
                {loading ? "Enviando..." : (
                  <>
                    <Send size={20} className="mr-2" />
                    Enviar Postulación
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>

      </div>
    </div>
  );
}
