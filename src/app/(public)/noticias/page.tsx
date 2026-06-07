"use client"

import { motion } from "framer-motion";
import { Calendar, User } from "lucide-react";

export default function Noticias() {
  const noticias = [
    {
      id: 1,
      title: "Gran éxito en la jornada de limpieza comunitaria",
      excerpt: "Más de 200 jóvenes se reunieron este fin de semana para revitalizar el parque central de la ciudad.",
      date: "15 May, 2026",
      author: "Equipo JUVENTUD VIVA",
      image: "https://images.unsplash.com/photo-1594708767771-a7502209ff51?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 2,
      title: "Lanzamiento del nuevo programa 'Tech para Todos'",
      excerpt: "Abrimos inscripciones para los nuevos cursos de programación gratuitos dirigidos a jóvenes de colegios públicos.",
      date: "10 May, 2026",
      author: "Coordinación de Educación",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 3,
      title: "Alianza estratégica con empresas locales",
      excerpt: "Hemos firmado un convenio con 5 empresas líderes de la región para ofrecer pasantías a nuestros graduados.",
      date: "02 May, 2026",
      author: "Dirección General",
      image: "https://images.unsplash.com/photo-1556761175-5973dc0f32d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
  ];

  return (
    <div className="py-20 px-4 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">Noticias y <span className="text-transparent bg-clip-text bg-gradient-to-r from-jv-purple to-jv-turquoise">Eventos</span></h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Entérate de las últimas novedades, logros y próximos eventos de nuestra fundación.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {noticias.map((noticia, idx) => (
          <motion.div
            key={noticia.id}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-jv-turquoise/50 transition-colors group"
          >
            <div className="h-48 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={noticia.image} alt={noticia.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-6">
              <div className="flex items-center text-xs text-gray-400 mb-3 space-x-4">
                <div className="flex items-center">
                  <Calendar size={14} className="mr-1 text-jv-purple" /> {noticia.date}
                </div>
                <div className="flex items-center">
                  <User size={14} className="mr-1 text-jv-turquoise" /> {noticia.author}
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 hover:text-jv-purple transition-colors cursor-pointer">{noticia.title}</h3>
              <p className="text-gray-400 text-sm mb-4">{noticia.excerpt}</p>
              <button className="text-sm font-semibold text-white bg-gray-800 hover:bg-jv-purple px-4 py-2 rounded-lg transition-colors">
                Leer más
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
