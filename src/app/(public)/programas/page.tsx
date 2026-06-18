"use client"
export const revalidate = 60;

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function Programas() {
  const [programas, setProgramas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/programas")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setProgramas(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="py-20 px-4 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16 pt-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">Nuestros <span className="text-transparent bg-clip-text bg-gradient-to-r from-jv-purple to-jv-turquoise">Programas</span></h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Conoce las iniciativas con las que estamos transformando realidades y construyendo un mejor futuro para nuestra juventud.
        </p>
      </motion.div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Cargando programas...</div>
      ) : programas.length === 0 ? (
        <div className="text-center py-20 bg-gray-900 border border-gray-800 rounded-3xl">
          <p className="text-gray-500">Aún no hay programas registrados.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programas.map((prog, idx) => (
            <motion.div
              key={prog.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-jv-purple/50 transition-colors group flex flex-col"
            >
              <div className="h-48 overflow-hidden relative bg-gray-800">
                <div className="absolute inset-0 bg-jv-dark/20 group-hover:bg-transparent transition-colors z-10"></div>
                {prog.imageUrl && (
                  <Image src={prog.imageUrl} alt={prog.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                )}
                <span className="absolute top-4 right-4 bg-jv-purple text-white text-xs font-bold px-3 py-1 rounded-full z-20">
                  {prog.category}
                </span>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-jv-turquoise transition-colors">{prog.title}</h3>
                <p className="text-gray-400 mb-6 flex-grow whitespace-pre-wrap line-clamp-3">{prog.description}</p>
                <button className="text-jv-turquoise font-semibold flex items-center hover:text-white transition-colors">
                  Ver Detalles <ArrowRight className="ml-2 w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
