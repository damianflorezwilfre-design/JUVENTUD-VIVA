"use client"
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function Contacto() {
  const [address, setAddress] = useState("Av. Principal 123, Ciudad Central, Colombia");
  const [phone, setPhone] = useState("+57 300 123 4567\nLun - Vie, 9:00am - 6:00pm");
  const [email, setEmail] = useState("contacto@juventudviva.org");

  useEffect(() => {
    fetch("/api/institucional")
      .then(res => res.json())
      .then(data => {
        if (data.address) setAddress(data.address);
        if (data.phone) setPhone(data.phone);
        if (data.email) setEmail(data.email);
      })
      .catch(e => console.error("Error fetching contact info", e));
  }, []);

  return (
    <div className="py-20 px-4 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">Contáctanos</h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          ¿Tienes dudas, sugerencias o quieres formar parte de nuestro equipo? Escríbenos y nos pondremos en contacto contigo lo más pronto posible.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-gray-900/50 rounded-3xl p-8 md:p-12 border border-gray-800">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-white mb-8">Información de Contacto</h2>
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="bg-jv-purple/20 p-4 rounded-xl mr-6">
                <MapPin className="text-jv-purple" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-white text-lg">Dirección</h3>
                <p className="text-gray-400 mt-1 whitespace-pre-wrap">{address}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-jv-turquoise/20 p-4 rounded-xl mr-6">
                <Phone className="text-jv-turquoise" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-white text-lg">Teléfono</h3>
                <p className="text-gray-400 mt-1 whitespace-pre-wrap">{phone}</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-blue-500/20 p-4 rounded-xl mr-6">
                <Mail className="text-blue-400" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-white text-lg">Correo Electrónico</h3>
                <p className="text-gray-400 mt-1 whitespace-pre-wrap">{email}</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Nombre Completo</label>
                <input type="text" className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-jv-purple transition-colors" placeholder="Tu nombre" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Teléfono</label>
                <input type="tel" className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-jv-purple transition-colors" placeholder="Tu teléfono" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Correo Electrónico</label>
              <input type="email" className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-jv-turquoise transition-colors" placeholder="tu@correo.com" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Mensaje</label>
              <textarea rows={4} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-jv-purple transition-colors resize-none" placeholder="¿En qué te podemos ayudar?"></textarea>
            </div>

            <button type="submit" className="w-full bg-jv-purple hover:bg-jv-turquoise text-white font-bold py-4 rounded-xl flex items-center justify-center transition-all duration-300 shadow-[0_0_15px_rgba(155,28,201,0.3)] hover:shadow-[0_0_15px_rgba(79,221,230,0.5)]">
              <Send className="mr-2" size={20} />
              Enviar Mensaje
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
