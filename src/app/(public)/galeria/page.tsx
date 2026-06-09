"use client"
export const dynamic = "force-dynamic";

import { motion } from "framer-motion";

export default function Galeria() {
  return (
    <div className="py-20 px-4 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16 pt-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">Nuestra <span className="text-transparent bg-clip-text bg-gradient-to-r from-jv-purple to-jv-turquoise">Galería</span></h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Un recorrido visual por el impacto y las sonrisas que hemos construido juntos.
        </p>
      </motion.div>

      <div className="text-center py-20 bg-gray-900 border border-gray-800 rounded-3xl">
        <p className="text-gray-500">Aún no hay fotos publicadas en la galería.</p>
      </div>
    </div>
  );
}
