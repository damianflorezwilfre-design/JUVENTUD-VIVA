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
          <div className="p-4 md:p-6">
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
                    className={`min-h-[80px] md:min-h-[120px] rounded-xl border p-2 flex flex-col transition-all
                      ${isToday ? 'bg-jv-purple/10 border-jv-purple/50' : 'bg-gray-800/50 border-gray-800 hover:border-jv-turquoise/30'}
                    `}
                  >
                    <div className="flex justify-between items-start mb-1 md:mb-2">
                      <span className={`text-sm md:text-lg font-bold ${isToday ? 'text-jv-turquoise' : 'text-gray-400'}`}>
                        {day}
                      </span>
                      {dayEvents.length > 0 && (
                        <span className="w-2 h-2 rounded-full bg-jv-purple md:hidden"></span>
                      )}
                    </div>
                    
                    <div className="hidden md:flex flex-col gap-1 overflow-y-auto max-h-[80px]">
                      {dayEvents.map(evento => (
                        <div key={evento.id} className="text-xs bg-gray-900 border border-gray-700 rounded-md p-1.5 text-white truncate hover:bg-jv-purple/20 hover:border-jv-purple/50 cursor-pointer" title={evento.title}>
                          <span className="font-bold text-jv-turquoise mr-1">{new Date(evento.date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
                          {evento.title}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Lista detallada de eventos del mes actual */}
      {!loading && eventos.filter(e => new Date(e.date).getMonth() === month && new Date(e.date).getFullYear() === year).length > 0 && (
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-white mb-8 border-b border-gray-800 pb-4">Detalle de Actividades - {monthNames[month]}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {eventos
              .filter(e => new Date(e.date).getMonth() === month && new Date(e.date).getFullYear() === year)
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .map((evento, idx) => (
              <motion.div
                key={evento.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-jv-purple/50 transition-colors group flex flex-col h-full"
              >
                <div className="h-48 overflow-hidden relative bg-gray-800">
                  {evento.imageUrl ? (
                    <Image src={evento.imageUrl} alt={evento.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex justify-center items-center">
                      <CalendarIcon size={48} className="text-gray-700" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-jv-dark/80 backdrop-blur-md border border-jv-purple/30 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                    {new Date(evento.date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-jv-turquoise transition-colors">{evento.title}</h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-400">
                      <Clock size={16} className="mr-2 text-jv-purple" /> 
                      {new Date(evento.date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    {evento.location && (
                      <div className="flex items-start text-sm text-gray-400">
                        <MapPin size={16} className="mr-2 text-jv-turquoise mt-0.5 shrink-0" /> 
                        <span>{evento.location}</span>
                      </div>
                    )}
                  </div>

                  <p className="text-gray-400 text-sm mb-6 flex-1 whitespace-pre-wrap">{evento.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
