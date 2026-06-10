"use client"

import { useState, useEffect } from "react";
import { Check, X, Trash, MessageSquare } from "lucide-react";

export default function AdminMuro() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/muro");
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

  const handleApproval = async (id: string, isApproved: boolean) => {
    try {
      const res = await fetch(`/api/muro/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved })
      });
      if (res.ok) fetchMessages();
    } catch (e) {
      alert("Error al actualizar estado");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este mensaje definitivamente?")) return;
    try {
      const res = await fetch(`/api/muro/${id}`, { method: "DELETE" });
      if (res.ok) fetchMessages();
    } catch (e) {
      alert("Error al eliminar");
    }
  };

  return (
    <div>
      <div className="flex items-center mb-8">
        <MessageSquare className="text-jv-purple mr-3" size={32} />
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Muro Público</h2>
          <p className="text-gray-400">Modera los mensajes de agradecimiento que deja la comunidad.</p>
        </div>
      </div>

      {loading ? (
        <div className="text-gray-400">Cargando...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`bg-gray-900 border rounded-2xl p-6 relative overflow-hidden flex flex-col h-full ${msg.isApproved ? 'border-jv-turquoise/50' : 'border-gray-800'}`}>
              {!msg.isApproved && <div className="absolute top-0 right-0 bg-yellow-500 text-jv-dark text-xs font-bold px-3 py-1 rounded-bl-lg z-10">Pendiente</div>}
              {msg.isApproved && <div className="absolute top-0 right-0 bg-jv-turquoise text-jv-dark text-xs font-bold px-3 py-1 rounded-bl-lg z-10">Aprobado</div>}
              
              <h3 className="text-lg font-bold text-white mb-2">{msg.name}</h3>
              <p className="text-gray-400 text-sm mb-4 flex-grow italic">"{msg.message}"</p>
              <p className="text-xs text-gray-500 mb-4">{new Date(msg.createdAt).toLocaleString()}</p>
              
              <div className="flex justify-between space-x-2 border-t border-gray-800 pt-4 mt-auto">
                <div className="flex space-x-2">
                  {!msg.isApproved ? (
                    <button onClick={() => handleApproval(msg.id, true)} className="flex items-center text-xs font-bold px-3 py-1.5 bg-jv-turquoise/20 text-jv-turquoise hover:bg-jv-turquoise/40 rounded-lg transition-colors">
                      <Check size={14} className="mr-1" /> Aprobar
                    </button>
                  ) : (
                    <button onClick={() => handleApproval(msg.id, false)} className="flex items-center text-xs font-bold px-3 py-1.5 bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/40 rounded-lg transition-colors">
                      <X size={14} className="mr-1" /> Ocultar
                    </button>
                  )}
                </div>
                <button onClick={() => handleDelete(msg.id)} className="p-1.5 bg-red-500/20 text-red-500 hover:bg-red-500/40 rounded-lg transition-colors">
                  <Trash size={16} />
                </button>
              </div>
            </div>
          ))}
          {messages.length === 0 && (
            <div className="col-span-full p-8 text-center text-gray-500 bg-gray-900 border border-gray-800 rounded-2xl">
              No hay mensajes en el muro todavía.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
