"use client"

import { motion } from "framer-motion";
import { Target, Lightbulb, Shield, HeartHandshake } from "lucide-react";
import { useEffect, useState } from "react";

export default function Nosotros() {
  const [data, setData] = useState({ aboutUs: "", mission: "", vision: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/institucional')
      .then(res => res.json())
      .then(json => {
        if (json && !json.error) {
          setData(json);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const values = [
    { 
      icon: <Target size={32} className="text-jv-purple" />, 
      title: "Misión", 
      desc: data.mission || "Impulsar el desarrollo integral de los jóvenes a través de programas educativos, liderazgo y participación ciudadana para construir una sociedad más justa y equitativa." 
    },
    { 
      icon: <Lightbulb size={32} className="text-jv-turquoise" />, 
      title: "Visión", 
      desc: data.vision || "Ser la fundación juvenil líder a nivel nacional, reconocida por su impacto transformador en las nuevas generaciones y su compromiso con el desarrollo sostenible." 
    },
    { 
      icon: <Shield size={32} className="text-jv-white" />, 
      title: "Valores", 
      desc: "Integridad, empatía, innovación, responsabilidad social y trabajo en equipo son los pilares que guían cada una de nuestras acciones." 
    },
    { 
      icon: <HeartHandshake size={32} className="text-red-400" />, 
      title: "Compromiso", 
      desc: "Nos dedicamos a crear oportunidades reales para que cada joven alcance su máximo potencial sin importar su origen." 
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
          <p className="text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed whitespace-pre-wrap">
            {data.aboutUs || "Nacimos con el propósito de ser un puente entre la juventud y las oportunidades. JUVENTUD VIVA es más que una fundación, es un movimiento de jóvenes trabajando por jóvenes."}
          </p>
        )}
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {values.map((val, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="bg-gray-900/50 p-8 rounded-2xl border border-gray-800 hover:border-jv-purple/30 transition-colors"
          >
            <div className="bg-gray-800 w-16 h-16 flex items-center justify-center rounded-2xl mb-6">
              {val.icon}
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">{val.title}</h2>
            <p className="text-gray-400 leading-relaxed whitespace-pre-wrap">{val.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
