"use client"

import { motion, AnimatePresence } from "framer-motion";
import { Calendar, User, X } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function Comunicados() {
  const [comunicados, setComunicados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedComunicado, setSelectedComunicado] = useState<any | null>(null);

  useEffect(() => {
    fetch("/api/comunicados")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setComunicados(data);
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
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">Últimos <span className="text-transparent bg-clip-text bg-gradient-to-r from-jv-purple to-jv-turquoise">Comunicados</span></h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Entérate de las últimas novedades, notas de prensa y comunicados oficiales.
        </p>
      </motion.div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Cargando comunicados...</div>
      ) : comunicados.length === 0 ? (
        <div className="text-center py-20 bg-gray-900 border border-gray-800 rounded-3xl">
          <p className="text-gray-500">Aún no hay comunicados publicados.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {comunicados.map((comunicado, idx) => (
            <motion.div
              key={comunicado.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-jv-turquoise/50 transition-colors group flex flex-col h-full"
            >
              {comunicado.imageUrl && (
                <div className="h-48 overflow-hidden relative bg-gray-800">
                  <Image 
                    src={comunicado.imageUrl.split(',')[0]} 
                    alt={comunicado.title} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                </div>
              )}
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center text-xs text-gray-400 mb-3 space-x-4">
                  <div className="flex items-center">
                    <Calendar size={14} className="mr-1 text-jv-purple" /> {new Date(comunicado.createdAt).toLocaleDateString('es-ES')}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-jv-purple transition-colors">{comunicado.title}</h3>
                <p className="text-gray-400 text-sm mb-4 whitespace-pre-wrap line-clamp-3">{comunicado.content}</p>
                <div className="mt-auto pt-4">
                  <button 
                    onClick={() => setSelectedComunicado(comunicado)}
                    className="text-sm font-semibold text-white bg-gray-800 hover:bg-jv-purple px-4 py-2 rounded-lg transition-colors"
                  >
                    Leer más
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal for Full Content */}
      <AnimatePresence>
        {selectedComunicado && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col relative shadow-2xl"
            >
              <button 
                onClick={() => setSelectedComunicado(null)}
                className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black text-white p-2 rounded-full transition-colors backdrop-blur-md"
              >
                <X size={20} />
              </button>
              
              <div className="p-6 md:p-10 pt-16">
                <div className="flex items-center text-sm text-gray-400 mb-4">
                  <Calendar size={16} className="mr-2 text-jv-turquoise" /> 
                  {new Date(selectedComunicado.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 leading-tight">
                  {selectedComunicado.title}
                </h2>
                
                {selectedComunicado.imageUrl && (
                  <div className="flex flex-col gap-6 mb-8">
                    {selectedComunicado.imageUrl.split(',').map((url: string, idx: number) => (
                      <img 
                        key={idx} 
                        src={url} 
                        alt={`${selectedComunicado.title} - Imagen ${idx + 1}`} 
                        className="w-full h-auto rounded-xl object-contain bg-black/30 border border-gray-800" 
                      />
                    ))}
                  </div>
                )}
                
                <div className="prose prose-invert prose-lg max-w-none">
                  <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {selectedComunicado.content}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
