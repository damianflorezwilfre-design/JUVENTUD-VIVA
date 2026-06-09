"use client"

import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/mensajes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message })
      });

      if (res.ok) {
        setStatus("success");
        setName("");
        setEmail("");
        setMessage("");
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
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto mt-8">
      {status === "success" && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-500/10 border border-green-500/30 text-green-400 p-4 rounded-xl flex items-center justify-center mb-6"
        >
          <CheckCircle2 className="mr-2" />
          ¡Mensaje enviado con éxito! Te responderemos pronto.
        </motion.div>
      )}

      {status === "error" && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl flex items-center justify-center mb-6"
        >
          Ocurrió un error al enviar el mensaje. Intenta nuevamente.
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Tu Nombre</label>
          <input 
            type="text" 
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-jv-turquoise focus:outline-none transition-colors"
            placeholder="Juan Pérez"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Correo Electrónico</label>
          <input 
            type="email" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-jv-turquoise focus:outline-none transition-colors"
            placeholder="juan@ejemplo.com"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">Mensaje</label>
        <textarea 
          required
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-jv-turquoise focus:outline-none transition-colors resize-none"
          placeholder="Hola, me gustaría ser parte de..."
        />
      </div>

      <button 
        type="submit"
        disabled={status === "loading" || status === "success"}
        className="w-full bg-jv-purple hover:bg-jv-turquoise text-white px-6 py-4 rounded-xl font-bold flex items-center justify-center transition-all duration-300 shadow-[0_0_20px_rgba(155,28,201,0.4)] hover:shadow-[0_0_20px_rgba(28,201,183,0.6)] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "loading" ? "Enviando..." : (
          <>
            <Send size={20} className="mr-2" /> Enviar Mensaje
          </>
        )}
      </button>
    </form>
  );
}
