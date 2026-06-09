"use client"

import { motion } from "framer-motion";
import { FileText, Users, Newspaper, CalendarRange, TrendingUp, Activity } from "lucide-react";
import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const [statsData, setStatsData] = useState({ users: 0, documents: 0, news: 0, programs: 0, username: "", analytics: [] as any[] });
  const [activity, setActivity] = useState<any[]>([]);
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
          username: data.username || "Usuario",
          analytics: data.analytics || []
        });
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching stats:", err);
      });

    fetch("/api/dashboard/activity")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setActivity(data);
        }
      })
      .catch(err => {
        console.error("Error fetching activity:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const stats = [
    { name: "Total Usuarios", value: statsData.users.toString(), icon: <Users size={24} className="text-blue-400" />, change: "Usuarios registrados" },
    { name: "Documentos", value: statsData.documents.toString(), icon: <FileText size={24} className="text-red-400" />, change: "Documentos públicos" },
    { name: "Noticias Publicadas", value: statsData.news.toString(), icon: <Newspaper size={24} className="text-jv-turquoise" />, change: "Artículos en el blog" },
    { name: "Programas Activos", value: statsData.programs.toString(), icon: <CalendarRange size={24} className="text-jv-purple" />, change: "Iniciativas en curso" },
  ];

  const processChartData = () => {
    if (!statsData.analytics || statsData.analytics.length === 0) {
      return [
        { name: 'Lun', portal: 120, fb: 45, ig: 80 },
        { name: 'Mar', portal: 150, fb: 55, ig: 95 },
        { name: 'Mié', portal: 180, fb: 60, ig: 110 },
        { name: 'Jue', portal: 140, fb: 50, ig: 90 },
        { name: 'Vie', portal: 210, fb: 85, ig: 140 },
        { name: 'Sáb', portal: 250, fb: 110, ig: 180 },
        { name: 'Dom', portal: 220, fb: 90, ig: 150 },
      ];
    }
    const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    return statsData.analytics.map((a: any) => ({
      name: diasSemana[new Date(a.date).getDay()],
      portal: a.portalViews,
      fb: a.fbClicks,
      ig: a.igClicks
    }));
  };

  const chartData = processChartData();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Bienvenido al Dashboard, {statsData.username}</h2>
          <p className="text-gray-400">Resumen general de la plataforma JUVENTUD VIVA</p>
        </div>
        <div className="bg-gray-800 border border-gray-700 px-4 py-2 rounded-xl flex items-center space-x-2 text-sm text-gray-300">
          <Activity size={16} className="text-jv-turquoise" />
          <span>Sistema en Línea</span>
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
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-2xl p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white">Tráfico e Interacciones (Últimos Días)</h3>
            <select className="bg-gray-800 border border-gray-700 text-sm text-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:border-jv-purple">
              <option>Esta semana</option>
            </select>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                <XAxis dataKey="name" stroke="#9CA3AF" axisLine={false} tickLine={false} />
                <YAxis stroke="#9CA3AF" axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '0.5rem', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                  cursor={{fill: '#374151', opacity: 0.4}}
                />
                <Bar dataKey="portal" name="Visitas al Portal" fill="#4FDDE6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="fb" name="Clics a Facebook" fill="#9B1CC9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
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
            {activity.length === 0 ? (
              <div className="text-gray-500 text-sm py-4">No hay actividad reciente.</div>
            ) : (
              activity.map((act, idx) => (
                <div key={idx} className="relative pl-6 pb-6 border-l border-gray-800 last:border-0 last:pb-0">
                  <div className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full bg-jv-turquoise"></div>
                  <p className="text-gray-300 font-medium">
                    {act.text}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {formatDistanceToNow(new Date(act.date), { addSuffix: true, locale: es })}
                  </p>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
