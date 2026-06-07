"use client"

import { useState, useEffect } from "react";
import { Mail, Trash2, CheckCircle2, Circle, Clock } from "lucide-react";

type Message = {
  id: string;
  name: string;
  email: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export default function AdminMensajes() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/mensajes");
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const toggleReadStatus = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/mensajes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: !currentStatus })
      });
      if (res.ok) {
        fetchMessages();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar este mensaje?")) return;

    try {
      const res = await fetch(`/api/mensajes/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchMessages();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Buzón de Mensajes</h2>
          <p className="text-gray-400">Lee y gestiona los mensajes enviados desde el formulario público.</p>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-gray-500">Cargando...</div>
        ) : messages.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center flex flex-col items-center">
            <Mail size={48} className="text-gray-600 mb-4" />
            <h3 className="text-xl font-medium text-gray-300 mb-2">Bandeja vacía</h3>
            <p className="text-gray-500 mb-6">Aún no hay mensajes del público.</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`bg-gray-900 border rounded-2xl p-6 transition-colors relative group ${
                msg.isRead ? 'border-gray-800 opacity-75' : 'border-jv-purple/50 bg-jv-purple/5'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <button onClick={() => toggleReadStatus(msg.id, msg.isRead)}>
                    {msg.isRead ? (
                      <CheckCircle2 className="text-gray-500 hover:text-jv-turquoise transition-colors" size={24} />
                    ) : (
                      <Circle className="text-jv-purple hover:text-jv-turquoise transition-colors fill-jv-purple/20" size={24} />
                    )}
                  </button>
                  <div>
                    <h3 className={`text-lg font-bold ${msg.isRead ? 'text-gray-300' : 'text-white'}`}>
                      {msg.name}
                    </h3>
                    <a href={`mailto:${msg.email}`} className="text-sm text-jv-turquoise hover:underline">
                      {msg.email}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <span className="text-xs text-gray-500 flex items-center">
                    <Clock size={12} className="mr-1" />
                    {new Date(msg.createdAt).toLocaleString('es-ES')}
                  </span>
                  <button 
                    onClick={() => handleDelete(msg.id)}
                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              
              <div className={`pl-10 text-sm ${msg.isRead ? 'text-gray-400' : 'text-gray-300'} whitespace-pre-wrap`}>
                {msg.message}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
