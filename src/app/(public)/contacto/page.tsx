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

  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/mensajes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: formName, 
          email: formEmail, 
          message: formPhone ? `Teléfono: ${formPhone}\n\n${formMessage}` : formMessage 
        })
      });

      if (res.ok) {
        setStatus("success");
        
        // Redirigir a WhatsApp
        let cleanPhone = phone.split('\n')[0].replace(/\D/g, '');
        if (cleanPhone.length === 10) cleanPhone = "57" + cleanPhone; // Default to Colombia
        
        const waMessage = `Hola, mi nombre es ${formName}.\nCorreo: ${formEmail}\n${formPhone ? `Mi teléfono: ${formPhone}\n` : ''}\n${formMessage}`;
        const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waMessage)}`;
        
        window.open(waUrl, "_blank");

        setFormName("");
        setFormPhone("");
        setFormEmail("");
        setFormMessage("");
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 3000);
      }
    } catch (error) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

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
          <form className="space-y-6" onSubmit={handleSubmit}>
            {status === "success" && (
              <div className="bg-green-500/10 border border-green-500/30 text-green-400 p-4 rounded-xl mb-6">
                ¡Mensaje enviado con éxito! Te responderemos pronto.
              </div>
            )}
            {status === "error" && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl mb-6">
                Ocurrió un error al enviar el mensaje. Intenta nuevamente.
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Nombre Completo</label>
                <input required value={formName} onChange={e => setFormName(e.target.value)} type="text" className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-jv-purple transition-colors" placeholder="Tu nombre" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Teléfono</label>
                <input value={formPhone} onChange={e => setFormPhone(e.target.value)} type="tel" className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-jv-purple transition-colors" placeholder="Tu teléfono" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Correo Electrónico</label>
              <input required value={formEmail} onChange={e => setFormEmail(e.target.value)} type="email" className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-jv-turquoise transition-colors" placeholder="tu@correo.com" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Mensaje</label>
              <textarea required value={formMessage} onChange={e => setFormMessage(e.target.value)} rows={4} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-jv-purple transition-colors resize-none" placeholder="¿En qué te podemos ayudar?"></textarea>
            </div>

            <button disabled={status === "loading" || status === "success"} type="submit" className="w-full bg-jv-turquoise hover:bg-jv-purple text-white font-bold py-4 rounded-xl flex items-center justify-center transition-all duration-300 shadow-[0_0_15px_rgba(79,221,230,0.3)] hover:shadow-[0_0_15px_rgba(155,28,201,0.5)] disabled:opacity-50">
              <Send className="mr-2" size={20} />
              {status === "loading" ? "Enviando..." : "Enviar Mensaje"}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
