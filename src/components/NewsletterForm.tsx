"use client"

import { useState } from "react";
import { Send } from "lucide-react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage(data.message || "¡Gracias por suscribirte!");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Ocurrió un error");
      }
    } catch (err) {
      setStatus("error");
      setMessage("Error de red");
    }
  };

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold text-jv-white mb-2 flex items-center">
        Suscríbete al Newsletter
      </h3>
      <p className="text-gray-400 text-sm mb-4">
        Déjanos tu correo y entérate de nuestras próximas brigadas y eventos.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
        <div className="relative">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@correo.com"
            required
            className="w-full bg-gray-900 border border-gray-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-jv-turquoise transition-colors"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="absolute right-2 top-2 bottom-2 bg-jv-purple hover:bg-jv-turquoise text-white p-2 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50"
          >
            <Send size={16} />
          </button>
        </div>
        {status === "success" && <p className="text-sm text-jv-turquoise mt-1">{message}</p>}
        {status === "error" && <p className="text-sm text-red-400 mt-1">{message}</p>}
      </form>
    </div>
  );
}
