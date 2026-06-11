"use client"

import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, ChevronRight, Bot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type ChatMessage = {
  id: string;
  sender: "bot" | "user";
  text: string;
};

export default function GuiaVivaChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch FAQs when component mounts
    fetch("/api/chatbot")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setFaqs(data);
        }
      })
      .catch(err => console.error("Error loading FAQs:", err));
  }, []);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          sender: "bot",
          text: "¡Hola! Soy la Guía ViVa. 🌟 ¿En qué puedo ayudarte hoy?"
        }
      ]);
    }
  }, [isOpen]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleFaqClick = (faq: any) => {
    // Add user question
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: "user", text: faq.question }]);
    
    // Simulate bot typing
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), sender: "bot", text: faq.answer }]);
    }, 1000);
  };

  const handleSendMessage = async (text: string) => {
    // Add user message
    const userMsgId = Date.now().toString();
    setMessages(prev => [...prev, { id: userMsgId, sender: "user", text }]);
    
    setIsTyping(true);
    
    try {
      const res = await fetch("/api/chatbot/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
      });
      
      const data = await res.json();
      
      setIsTyping(false);
      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        sender: "bot", 
        text: data.response || "No pude procesar la respuesta." 
      }]);
    } catch (e) {
      setIsTyping(false);
      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        sender: "bot", 
        text: "Error de conexión. Intenta de nuevo más tarde." 
      }]);
    }
  };

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-28 md:bottom-6 right-6 w-14 h-14 bg-gradient-to-tr from-jv-purple to-jv-turquoise rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-[0_0_20px_rgba(79,221,230,0.5)] hover:scale-110 transition-all z-50 ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
        aria-label="Abrir asistente virtual"
      >
        <Bot size={28} />
      </button>

      {/* Ventana de Chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-28 md:bottom-6 right-4 md:right-6 w-[calc(100vw-32px)] md:w-80 lg:w-96 bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[500px] h-[75vh] md:h-[500px]"
          >
            {/* Cabecera */}
            <div className="bg-gradient-to-r from-jv-purple to-jv-dark p-4 flex justify-between items-center border-b border-gray-700/50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-jv-turquoise/20 flex items-center justify-center text-jv-turquoise">
                  <Bot size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-white leading-tight">Guía ViVa</h3>
                  <p className="text-xs text-jv-turquoise flex items-center">
                    <span className="w-2 h-2 rounded-full bg-green-500 mr-1 animate-pulse"></span>
                    En línea
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-300 hover:text-white p-1 bg-white/5 rounded-full hover:bg-white/10 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Historial de Mensajes */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
              {messages.map((msg) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                      msg.sender === 'user' 
                        ? 'bg-jv-turquoise text-jv-dark rounded-br-none font-medium' 
                        : 'bg-gray-800 text-gray-200 border border-gray-700/50 rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-800 border border-gray-700/50 rounded-2xl rounded-bl-none p-3 px-4">
                    <div className="flex space-x-1.5">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

              {/* Opciones (Botones predeterminados) */}
              <div className="p-4 bg-gray-800/50 border-t border-gray-700/50 flex-shrink-0">
                <p className="text-xs text-gray-400 mb-2 font-medium">Opciones rápidas:</p>
                <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {faqs.map((faq) => (
                    <button
                      key={faq.id}
                      onClick={() => handleFaqClick(faq)}
                      disabled={isTyping}
                      className="whitespace-nowrap text-left text-xs bg-gray-800 hover:bg-jv-purple/20 border border-gray-600 hover:border-jv-purple/50 text-gray-300 rounded-xl px-3 py-2 transition-all flex items-center group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {faq.question}
                    </button>
                  ))}
                  {faqs.length === 0 && (
                    <span className="text-xs text-gray-500">Cargando opciones...</span>
                  )}
                </div>
                
                {/* Text Input */}
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    const input = e.currentTarget.elements.namedItem('message') as HTMLInputElement;
                    if (input.value.trim()) {
                      handleSendMessage(input.value.trim());
                      input.value = '';
                    }
                  }}
                  className="mt-3 relative"
                >
                  <input 
                    name="message"
                    type="text" 
                    placeholder="Escribe tu mensaje..." 
                    disabled={isTyping}
                    className="w-full bg-gray-900 border border-gray-700 rounded-full pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-jv-turquoise transition-colors disabled:opacity-50"
                  />
                  <button 
                    type="submit" 
                    disabled={isTyping}
                    className="absolute right-1 top-1 bottom-1 w-10 bg-jv-purple hover:bg-jv-turquoise rounded-full flex items-center justify-center text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={20} />
                  </button>
                </form>
              </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
