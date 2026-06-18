"use client"

import { motion } from "framer-motion";
import { Calendar, User } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function Noticias() {
  const [noticias, setNoticias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/noticias")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setNoticias(data);
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
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">Últimas <span className="text-transparent bg-clip-text bg-gradient-to-r from-jv-purple to-jv-turquoise">Noticias</span></h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Entérate de las últimas novedades y logros de nuestra fundación.
        </p>
      </motion.div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Cargando noticias...</div>
      ) : noticias.length === 0 ? (
        <div className="text-center py-20 bg-gray-900 border border-gray-800 rounded-3xl">
          <p className="text-gray-500">Aún no hay noticias publicadas.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {noticias.map((noticia, idx) => (
            <motion.div
              key={noticia.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-jv-turquoise/50 transition-colors group flex flex-col h-full"
            >
              {noticia.imageUrl && (
                <div className="h-48 overflow-hidden relative">
                  <Image src={noticia.imageUrl} alt={noticia.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              )}
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center text-xs text-gray-400 mb-3 space-x-4">
                  <div className="flex items-center">
                    <Calendar size={14} className="mr-1 text-jv-purple" /> {new Date(noticia.createdAt).toLocaleDateString('es-ES')}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-jv-purple transition-colors">{noticia.title}</h3>
                <p className="text-gray-400 text-sm mb-4 whitespace-pre-wrap line-clamp-3">{noticia.content}</p>
                <div className="mt-auto pt-4">
                  <button className="text-sm font-semibold text-white bg-gray-800 hover:bg-jv-purple px-4 py-2 rounded-lg transition-colors">
                    Leer más
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
