"use client"

import { motion } from "framer-motion";
import { Target, Lightbulb, Shield, HeartHandshake } from "lucide-react";
import { useEffect, useState } from "react";

export default function Nosotros() {
  const [data, setData] = useState({ aboutUs: "", mission: "", vision: "" });
  const [historyEvents, setHistoryEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/institucional').then(res => res.json()),
      fetch('/api/historia').then(res => res.json())
    ])
    .then(([instJson, histJson]) => {
      if (instJson && !instJson.error) setData(instJson);
      if (Array.isArray(histJson)) setHistoryEvents(histJson);
      setLoading(false);
    })
    .catch(() => setLoading(false));
  }, []);

  const values = [
    { 
      icon: <Target size={32} className="text-white" />, 
      title: "Misión", 
      desc: data.mission || "Impulsar el desarrollo integral de los jóvenes a través de programas educativos, liderazgo y participación ciudadana para construir una sociedad más justa y equitativa.",
      bgIcon: "bg-gradient-to-br from-jv-purple to-purple-600",
      glow: "from-jv-purple/20",
      border: "hover:border-jv-purple/50"
    },
    { 
      icon: <Lightbulb size={32} className="text-jv-dark" />, 
      title: "Visión", 
      desc: data.vision || "Ser la fundación juvenil líder a nivel nacional, reconocida por su impacto transformador en las nuevas generaciones y su compromiso con el desarrollo sostenible.",
      bgIcon: "bg-gradient-to-br from-jv-turquoise to-teal-400",
      glow: "from-jv-turquoise/20",
      border: "hover:border-jv-turquoise/50"
    },
    { 
      icon: <Shield size={32} className="text-jv-dark" />, 
      title: "Valores", 
      desc: "Integridad, empatía, innovación, responsabilidad social y trabajo en equipo son los pilares que guían cada una de nuestras acciones.",
      bgIcon: "bg-gradient-to-br from-gray-100 to-gray-300",
      glow: "from-gray-400/20",
      border: "hover:border-gray-400/50"
    },
    { 
      icon: <HeartHandshake size={32} className="text-white" />, 
      title: "Compromiso", 
      desc: "Nos dedicamos a crear oportunidades reales para que cada joven alcance su máximo potencial sin importar su origen.",
      bgIcon: "bg-gradient-to-br from-red-500 to-rose-600",
      glow: "from-red-500/20",
      border: "hover:border-red-500/50"
    },
  ];

  return (
    <div className="py-20 px-4 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16 mt-10"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">Nuestra <span className="text-transparent bg-clip-text bg-gradient-to-r from-jv-purple to-jv-turquoise">Historia</span></h1>
        
        {loading ? (
          <div className="h-24 flex items-center justify-center">
            <span className="text-jv-purple animate-pulse">Cargando información...</span>
          </div>
        ) : (
          <p className="text-lg text-gray-300 max-w-4xl mx-auto leading-relaxed whitespace-pre-wrap text-justify relative z-10 px-4 md:px-8">
            {data.aboutUs || "Nacimos con el propósito de ser un puente entre la juventud y las oportunidades. JUVENTUD VIVA es más que una fundación, es un movimiento de jóvenes trabajando por jóvenes."}
          </p>
        )}
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        {/* Decorative background blur */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-jv-purple/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>
        
        {values.map((val, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.15 }}
            className={`group relative overflow-hidden bg-gray-900/60 backdrop-blur-sm p-8 rounded-3xl border border-gray-800/80 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${val.border}`}
          >
            <div className={`absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br ${val.glow} to-transparent opacity-0 group-hover:opacity-100 blur-3xl transition-opacity duration-700 rounded-full`}></div>
            
            <div className={`relative z-10 w-16 h-16 flex items-center justify-center rounded-2xl mb-6 shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 ${val.bgIcon}`}>
              {val.icon}
            </div>
            
            <h2 className="relative z-10 text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-colors">
              {val.title}
            </h2>
            
            <p className="relative z-10 text-gray-400 leading-relaxed whitespace-pre-wrap text-justify group-hover:text-gray-300 transition-colors duration-300">
              {val.desc}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Timeline Section */}
      {historyEvents.length > 0 && (
        <div className="mt-32 relative z-10 max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white">Línea de <span className="text-transparent bg-clip-text bg-gradient-to-r from-jv-turquoise to-jv-purple">Tiempo</span></h2>
          </div>
          
          <div className="relative">
            {/* Center Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-jv-turquoise via-jv-purple to-transparent opacity-30 rounded-full"></div>
            
            {historyEvents.map((evt: any, idx: number) => {
              const isEven = idx % 2 === 0;
              return (
                <div key={evt.id} className="mb-12 flex justify-between items-center w-full relative">
                  {/* Circle on the line */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-jv-dark border-4 border-jv-turquoise z-10 shadow-[0_0_15px_rgba(79,221,230,0.6)]"></div>
                  
                  {/* Left Side (Empty or Content) */}
                  <div className={`w-5/12 ${isEven ? 'pr-8 text-right' : ''}`}>
                    {isEven && (
                      <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                      >
                        <h3 className="text-3xl font-black text-jv-turquoise mb-2">{evt.year}</h3>
                        <h4 className="text-xl font-bold text-white mb-2">{evt.title}</h4>
                        <p className="text-gray-400 text-sm leading-relaxed">{evt.description}</p>
                      </motion.div>
                    )}
                  </div>
                  
                  {/* Right Side (Empty or Content) */}
                  <div className={`w-5/12 ${!isEven ? 'pl-8 text-left' : ''}`}>
                    {!isEven && (
                      <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                      >
                        <h3 className="text-3xl font-black text-jv-purple mb-2">{evt.year}</h3>
                        <h4 className="text-xl font-bold text-white mb-2">{evt.title}</h4>
                        <p className="text-gray-400 text-sm leading-relaxed">{evt.description}</p>
                      </motion.div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
