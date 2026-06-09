"use client"
export const dynamic = "force-dynamic";

import { motion } from "framer-motion";
import { Calendar, MapPin, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function Eventos() {
  const [eventos, setEventos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/eventos")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setEventos(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">Próximos <span className="text-transparent bg-clip-text bg-gradient-to-r from-jv-purple to-jv-turquoise">Eventos</span></h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Descubre nuestras próximas actividades, talleres y reuniones. ¡Te esperamos!
        </p>
      </motion.div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Cargando eventos...</div>
      ) : eventos.length === 0 ? (
        <div className="text-center py-20 bg-gray-900 border border-gray-800 rounded-3xl">
          <Calendar size={64} className="mx-auto text-gray-700 mb-4" />
          <h3 className="text-2xl font-bold text-gray-300 mb-2">No hay eventos próximos</h3>
          <p className="text-gray-500">Pronto publicaremos nuevas actividades. Mantente atento a nuestras redes.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {eventos.map((evento, idx) => (
            <motion.div
              key={evento.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-jv-purple/50 transition-colors group flex flex-col h-full"
            >
              <div className="h-48 overflow-hidden relative bg-gray-800">
                {evento.imageUrl ? (
                  <Image src={evento.imageUrl} alt={evento.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex justify-center items-center">
                    <Calendar size={48} className="text-gray-700" />
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-jv-dark/80 backdrop-blur-md border border-jv-purple/30 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                  {new Date(evento.date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-jv-turquoise transition-colors">{evento.title}</h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-400">
                    <Clock size={16} className="mr-2 text-jv-purple" /> 
                    {new Date(evento.date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  {evento.location && (
                    <div className="flex items-start text-sm text-gray-400">
                      <MapPin size={16} className="mr-2 text-jv-turquoise mt-0.5 shrink-0" /> 
                      <span>{evento.location}</span>
                    </div>
                  )}
                </div>

                <p className="text-gray-400 text-sm mb-6 flex-1 whitespace-pre-wrap">{evento.description}</p>
                
                <button className="w-full font-semibold text-white bg-gray-800 group-hover:bg-jv-purple px-4 py-3 rounded-xl transition-colors">
                  Agendar / Participar
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
