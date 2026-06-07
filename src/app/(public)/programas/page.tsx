"use client"

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function Programas() {
  const programas = [
    {
      id: 1,
      title: "Líderes del Mañana",
      category: "Liderazgo",
      description: "Programa de formación intensiva para jóvenes de 15 a 20 años en habilidades blandas, oratoria y gestión de proyectos sociales.",
      image: "https://images.unsplash.com/photo-1529390079861-591de354faf5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 2,
      title: "Tech para Todos",
      category: "Educación",
      description: "Cursos de programación básica, diseño web y alfabetización digital para reducir la brecha tecnológica en comunidades vulnerables.",
      image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 3,
      title: "Arte y Cultura Viva",
      category: "Cultura",
      description: "Talleres de música, pintura, teatro y danza como herramientas de expresión y prevención de la violencia juvenil.",
      image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
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
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">Nuestros <span className="text-transparent bg-clip-text bg-gradient-to-r from-jv-purple to-jv-turquoise">Programas</span></h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Conoce las iniciativas con las que estamos transformando realidades y construyendo un mejor futuro para nuestra juventud.
        </p>
      </motion.div>

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
            <div className="h-48 overflow-hidden relative">
              <div className="absolute inset-0 bg-jv-dark/20 group-hover:bg-transparent transition-colors z-10"></div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={prog.image} alt={prog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <span className="absolute top-4 right-4 bg-jv-purple text-white text-xs font-bold px-3 py-1 rounded-full z-20">
                {prog.category}
              </span>
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-jv-turquoise transition-colors">{prog.title}</h3>
              <p className="text-gray-400 mb-6 flex-grow">{prog.description}</p>
              <button className="text-jv-turquoise font-semibold flex items-center hover:text-white transition-colors">
                Ver Detalles <ArrowRight className="ml-2 w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
