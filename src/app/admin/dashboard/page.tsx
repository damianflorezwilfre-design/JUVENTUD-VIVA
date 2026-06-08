"use client"

import { motion } from "framer-motion";
import { FileText, Users, Newspaper, CalendarRange, TrendingUp, Activity } from "lucide-react";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const [statsData, setStatsData] = useState({ users: 0, documents: 0, news: 0, programs: 0, username: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then(res => res.json())
      .then(data => {
        setStatsData({
          users: data.users || 0,
          documents: data.documents || 0,
          news: data.news || 0,
          programs: data.programs || 0,
          username: data.username || "Usuario"
        });
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching stats:", err);
        setLoading(false);
      });
  }, []);

  const stats = [
    { name: "Total Usuarios", value: statsData.users.toString(), icon: <Users size={24} className="text-blue-400" />, change: "Usuarios registrados" },
    { name: "Documentos", value: statsData.documents.toString(), icon: <FileText size={24} className="text-red-400" />, change: "Documentos públicos" },
    { name: "Noticias Publicadas", value: statsData.news.toString(), icon: <Newspaper size={24} className="text-jv-turquoise" />, change: "Artículos en el blog" },
    { name: "Programas Activos", value: statsData.programs.toString(), icon: <CalendarRange size={24} className="text-jv-purple" />, change: "Iniciativas en curso" },
  ];

  const recentActivity = [
    { id: 1, text: "Juan Pérez subió 'Informe_Abril.pdf'", time: "Hace 2 horas" },
    { id: 2, text: "Admin creó la noticia 'Campaña de reciclaje'", time: "Hace 5 horas" },
    { id: 3, text: "María actualizó el programa 'Líderes del Mañana'", time: "Ayer" },
    { id: 4, text: "Admin eliminó una imagen de la galería", time: "Hace 2 días" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Bienvenido al Dashboard, {statsData.username}</h2>
          <p className="text-gray-400">Resumen general de la plataforma JUVENTUD VIVA</p>
        </div>
        <div className="bg-gray-800 border border-gray-700 px-4 py-2 rounded-xl flex items-center space-x-2 text-sm text-gray-300">
          <Activity size={16} className="text-jv-turquoise" />
          <span>Sistema Operativo</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-jv-purple/30 transition-colors"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-gray-800 rounded-xl">
                {stat.icon}
              </div>
              <TrendingUp size={20} className="text-gray-500" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
            <p className="text-sm font-medium text-gray-400 mb-2">{stat.name}</p>
            <p className="text-xs text-gray-500">{stat.change}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Gráfico Simulado */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-2xl p-6"
        >
          <h3 className="text-lg font-bold text-white mb-6">Visitas al sitio web</h3>
          <div className="h-64 flex items-end justify-between space-x-2">
            {[40, 70, 45, 90, 65, 85, 110].map((height, i) => (
              <div key={i} className="w-full flex flex-col items-center group">
                <div 
                  className="w-full bg-gradient-to-t from-jv-purple/20 to-jv-turquoise/80 rounded-t-sm group-hover:to-jv-turquoise transition-all duration-300"
                  style={{ height: `${height}%` }}
                ></div>
                <span className="text-xs text-gray-500 mt-2 block">Día {i+1}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Actividad Reciente */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-gray-900 border border-gray-800 rounded-2xl p-6"
        >
          <h3 className="text-lg font-bold text-white mb-6">Actividad Reciente</h3>
          <div className="space-y-6">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex space-x-4">
                <div className="mt-1 w-2 h-2 bg-jv-turquoise rounded-full flex-shrink-0 relative">
                  <div className="absolute w-0.5 h-10 bg-gray-800 left-1/2 -translate-x-1/2 top-3"></div>
                </div>
                <div>
                  <p className="text-sm text-gray-300 font-medium">{activity.text}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
