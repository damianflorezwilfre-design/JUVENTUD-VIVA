"use client"

import { useState, useEffect } from "react";
import { Plus, Edit, Trash, MessageSquare } from "lucide-react";

export default function AdminChatbot() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [order, setOrder] = useState("0");

  const fetchFaqs = async () => {
    try {
      const res = await fetch("/api/chatbot");
      const data = await res.json();
      setFaqs(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const openModal = (faq?: any) => {
    if (faq) {
      setEditingId(faq.id);
      setQuestion(faq.question);
      setAnswer(faq.answer);
      setOrder(faq.order.toString());
    } else {
      setEditingId(null);
      setQuestion("");
      setAnswer("");
      setOrder(faqs.length.toString());
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { question, answer, order };

    try {
      const url = editingId ? `/api/chatbot/${editingId}` : "/api/chatbot";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchFaqs();
      } else {
        alert("Error al guardar");
      }
    } catch (e) {
      alert("Error de conexión");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar esta pregunta?")) return;
    try {
      const res = await fetch(`/api/chatbot/${id}`, { method: "DELETE" });
      if (res.ok) fetchFaqs();
    } catch (e) {
      alert("Error al eliminar");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Chatbot Guía ViVa</h2>
          <p className="text-gray-400">Configura las preguntas y respuestas predeterminadas del Asistente Virtual.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-jv-turquoise hover:bg-white text-jv-dark px-4 py-2 rounded-xl flex items-center font-bold transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Nueva Pregunta
        </button>
      </div>

      {loading ? (
        <div className="text-gray-400">Cargando...</div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-800 bg-gray-800/50">
                  <th className="p-4 text-sm font-semibold text-gray-300 w-16">Orden</th>
                  <th className="p-4 text-sm font-semibold text-gray-300">Pregunta del Usuario</th>
                  <th className="p-4 text-sm font-semibold text-gray-300">Respuesta del Bot</th>
                  <th className="p-4 text-sm font-semibold text-gray-300 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {faqs.map((faq) => (
                  <tr key={faq.id} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
                    <td className="p-4 text-gray-400 font-mono">{faq.order}</td>
                    <td className="p-4 text-jv-turquoise font-medium">"{faq.question}"</td>
                    <td className="p-4 text-gray-300 text-sm">{faq.answer}</td>
                    <td className="p-4 text-right">
                      <button onClick={() => openModal(faq)} className="p-2 text-jv-purple hover:bg-jv-purple/20 rounded-lg transition-colors mr-2">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDelete(faq.id)} className="p-2 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors">
                        <Trash size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {faqs.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-gray-500">
                      No hay preguntas configuradas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-2xl">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <MessageSquare className="mr-2 text-jv-turquoise" size={24} />
              {editingId ? "Editar Interacción" : "Nueva Interacción"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Pregunta (Botón que verá el usuario)</label>
                <input required type="text" value={question} onChange={e => setQuestion(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-turquoise focus:outline-none transition-colors" placeholder="Ej. ¿Cómo puedo donar?" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Respuesta del Asistente</label>
                <textarea required rows={4} value={answer} onChange={e => setAnswer(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white resize-none focus:border-jv-turquoise focus:outline-none transition-colors" placeholder="Ej. Puedes donar visitando la sección..." />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Orden de aparición</label>
                <input type="number" value={order} onChange={e => setOrder(e.target.value)} className="w-32 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-turquoise focus:outline-none transition-colors" />
              </div>

              <div className="flex justify-end space-x-3 mt-8">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors">
                  Cancelar
                </button>
                <button type="submit" className="px-4 py-2 bg-jv-purple hover:bg-jv-turquoise text-white rounded-lg transition-colors font-semibold">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
