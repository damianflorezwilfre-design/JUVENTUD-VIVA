"use client"
export const dynamic = "force-dynamic";

import { motion } from "framer-motion";
import { Calendar as CalendarIcon, MapPin, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function Eventos() {
  const [eventos, setEventos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvento, setSelectedEvento] = useState<any>(null);

  useEffect(() => {
    fetch("/api/eventos")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setEventos(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  // Helper to check if an event falls on a specific day
  const getEventsForDay = (day: number) => {
    return eventos.filter(evento => {
      const eDate = new Date(evento.date);
      return eDate.getDate() === day && eDate.getMonth() === month && eDate.getFullYear() === year;
    });
  };

  return (
    <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">Calendario de <span className="text-transparent bg-clip-text bg-gradient-to-r from-jv-purple to-jv-turquoise">Actividades</span></h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Mantente al tanto de nuestros próximos talleres, brigadas, reuniones y eventos especiales.
        </p>
      </motion.div>

      {loading ? (
        <div className="text-center py-20 text-gray-400 flex flex-col items-center">
           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-jv-turquoise mb-4"></div>
           Cargando calendario...
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden shadow-2xl">
          {/* Header Calendar */}
          <div className="flex justify-between items-center p-6 border-b border-gray-800 bg-gray-900/50">
            <button onClick={prevMonth} className="p-2 bg-gray-800 hover:bg-jv-purple rounded-xl transition-colors text-white">
              <ChevronLeft size={24} />
            </button>
            <h2 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-wider">
              {monthNames[month]} <span className="text-jv-turquoise">{year}</span>
            </h2>
            <button onClick={nextMonth} className="p-2 bg-gray-800 hover:bg-jv-turquoise rounded-xl transition-colors text-white">
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Grid Calendar */}
          <div className="p-4 md:p-6 overflow-x-auto scrollbar-hide">
            <div className="min-w-[600px] md:min-w-0">
              <div className="grid grid-cols-7 gap-2 md:gap-4 mb-2">
                {dayNames.map(day => (
                  <div key={day} className="text-center text-gray-500 font-bold uppercase text-xs md:text-sm py-2">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-2 md:gap-4">
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`empty-${i}`} className="min-h-[80px] md:min-h-[120px] rounded-xl bg-gray-800/30 border border-gray-800/50"></div>
                ))}
                
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const dayEvents = getEventsForDay(day);
                  const isToday = new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year;

                  return (
                    <div 
                      key={day} 
                      className={`min-h-[100px] md:min-h-[120px] rounded-xl border p-2 flex flex-col transition-all
                        ${isToday ? 'bg-jv-purple/10 border-jv-purple/50' : 'bg-gray-800/50 border-gray-800 hover:border-jv-turquoise/30'}
                      `}
                    >
                      <div className="flex justify-between items-start mb-1 md:mb-2">
                        <span className={`text-sm md:text-lg font-bold ${isToday ? 'text-jv-turquoise' : 'text-gray-400'}`}>
                          {day}
                        </span>
                      </div>
                      
                      <div className="flex flex-col gap-1 overflow-y-auto flex-1 scrollbar-hide">
                        {dayEvents.map(evento => (
                          <div 
                            key={evento.id} 
                            onClick={() => setSelectedEvento(evento)}
                            className="relative overflow-hidden text-[10px] md:text-xs bg-gray-900 border border-gray-700 rounded-md p-1.5 text-white cursor-pointer group shadow-sm hover:border-jv-purple/50 flex flex-col justify-end min-h-[36px] md:min-h-[44px]" 
                            title={evento.title}
                          >
                            {evento.imageUrl && (
                              <>
                                <img src={evento.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                              </>
                            )}
                            <div className="relative z-10 flex flex-col">
                              <span className="font-bold text-jv-turquoise leading-none mb-0.5">
                                {new Date(evento.date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                              <span className="truncate font-medium">{evento.title}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Detalles del Evento */}
      {selectedEvento && (
        <div 
          className="fixed inset-0 bg-black/95 z-[100] flex flex-col items-center justify-center p-4 md:p-8 backdrop-blur-md"
          onClick={() => setSelectedEvento(null)}
        >
          <button 
            onClick={() => setSelectedEvento(null)} 
            className="absolute top-4 right-4 md:top-6 md:right-6 text-white hover:text-jv-turquoise transition-colors p-3 bg-gray-900/80 rounded-full z-[110] shadow-xl"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-3xl max-h-[85vh] bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Banner/Imagen */}
            <div className="w-full bg-gray-800 relative flex-shrink-0">
              {selectedEvento.imageUrl ? (
                <img src={selectedEvento.imageUrl} alt={selectedEvento.title} className="w-full h-auto max-h-[50vh] object-contain bg-black/50" />
              ) : (
                <div className="w-full h-48 md:h-72 flex justify-center items-center">
                  <CalendarIcon size={64} className="text-gray-700" />
                </div>
              )}
              
              {/* Fecha Flotante */}
              <div className="absolute top-4 left-4 bg-jv-purple/90 backdrop-blur-md border border-jv-purple/50 text-white font-bold px-4 py-2 rounded-xl shadow-lg text-center leading-tight">
                <span className="block text-2xl">{new Date(selectedEvento.date).getDate()}</span>
                <span className="block text-xs uppercase">{monthNames[new Date(selectedEvento.date).getMonth()]}</span>
              </div>
            </div>
            
            {/* Contenido */}
            <div className="p-6 md:p-8 overflow-y-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">{selectedEvento.title}</h2>
              
              <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-6 mb-8 bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                <div className="flex items-center text-gray-300">
                  <div className="bg-jv-purple/20 p-2 rounded-lg mr-3">
                    <Clock size={20} className="text-jv-purple" /> 
                  </div>
                  <span className="font-medium text-lg">{new Date(selectedEvento.date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                {selectedEvento.location && (
                  <div className="flex items-center text-gray-300">
                    <div className="bg-jv-turquoise/20 p-2 rounded-lg mr-3">
                      <MapPin size={20} className="text-jv-turquoise" /> 
                    </div>
                    <span className="font-medium">{selectedEvento.location}</span>
                  </div>
                )}
              </div>

              <div className="prose prose-invert max-w-none">
                <h3 className="text-lg font-bold text-jv-turquoise mb-2 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  Detalles de la Actividad
                </h3>
                <p className="text-gray-300 whitespace-pre-wrap leading-relaxed text-base md:text-lg">
                  {selectedEvento.description}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
