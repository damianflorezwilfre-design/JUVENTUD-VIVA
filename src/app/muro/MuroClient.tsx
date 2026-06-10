"use client"

import { useState, useEffect } from "react";
import { MessageSquare, Heart, Send } from "lucide-react";
import { motion } from "framer-motion";

export default function MuroClient() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/muro?public=true");
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) return;

    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/muro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, message })
      });

      if (res.ok) {
        setSuccess(true);
        setName("");
        setMessage("");
        setTimeout(() => setSuccess(false), 5000);
      } else {
        setError("Error al enviar el mensaje");
      }
    } catch (e) {
      setError("Error de red");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex-grow pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto w-full">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
          Muro de <span className="text-transparent bg-clip-text bg-gradient-to-r from-jv-turquoise to-jv-purple">Agradecimientos</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          Un espacio donde nuestra comunidad comparte su gratitud y experiencias con Juventud ViVa.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        <div className="lg:col-span-1">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl sticky top-32"
          >
            <div className="flex items-center mb-6">
              <MessageSquare className="text-jv-purple mr-3" size={28} />
              <h3 className="text-2xl font-bold text-white">Deja tu mensaje</h3>
            </div>
            <p className="text-gray-400 mb-8 text-sm leading-relaxed">
              ¿Has sido parte de nuestros programas o te inspira nuestra labor? ¡Déjanos un mensaje! (Todos los mensajes son revisados antes de publicarse).
            </p>

            {success ? (
              <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6 text-center">
                <Heart className="text-green-400 mx-auto mb-3" size={32} />
                <p className="text-green-400 font-bold mb-1">¡Mensaje enviado!</p>
                <p className="text-green-500/80 text-sm">Gracias por tus palabras. Lo publicaremos pronto.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Tu Nombre</label>
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-jv-turquoise focus:outline-none transition-colors"
                    placeholder="Ej. María Pérez"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Tu Mensaje</label>
                  <textarea 
                    required
                    rows={4}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-jv-turquoise focus:outline-none transition-colors resize-none"
                    placeholder="Escribe aquí tu agradecimiento o testimonio..."
                  ></textarea>
                </div>
                {error && <p className="text-red-400 text-sm">{error}</p>}
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-jv-purple to-jv-turquoise hover:from-jv-turquoise hover:to-jv-purple text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg flex items-center justify-center disabled:opacity-50 mt-4"
                >
                  {isSubmitting ? "Enviando..." : <><Send size={18} className="mr-2" /> Enviar Mensaje</>}
                </button>
              </form>
            )}
          </motion.div>
        </div>

        <div className="lg:col-span-2">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-gray-900 border border-gray-800 rounded-3xl p-6 h-48"></div>
              ))}
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center p-12 bg-gray-900 border border-gray-800 rounded-3xl">
              <MessageSquare size={48} className="text-gray-700 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Sé el primero</h3>
              <p className="text-gray-400">Aún no hay mensajes públicos. ¡Anímate a dejar el tuyo en el formulario!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-max">
              {messages.map((msg, idx) => (
                <motion.div 
                  key={msg.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="bg-gray-900 border border-gray-800 rounded-3xl p-6 hover:border-jv-turquoise/30 transition-all shadow-xl flex flex-col h-full"
                >
                  <Heart className="text-jv-purple/20 absolute top-6 right-6" size={48} />
                  <p className="text-gray-300 italic mb-6 flex-grow text-lg relative z-10">"{msg.message}"</p>
                  <div className="mt-auto border-t border-gray-800 pt-4 flex items-center justify-between">
                    <p className="font-bold text-jv-turquoise">{msg.name}</p>
                    <p className="text-xs text-gray-500">{new Date(msg.createdAt).toLocaleDateString()}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
