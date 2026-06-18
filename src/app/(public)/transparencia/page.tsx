"use client"
export const revalidate = 60;

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { ShieldCheck, TrendingUp, Users, Heart } from "lucide-react";
import Link from "next/link";

const COLORS = ['#9B1CC9', '#4FDDE6', '#FF5B5B', '#FFC13B', '#4F8A8B'];

export default function TransparenciaPage() {
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [institution, setInstitution] = useState<any>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/transparencia").then(res => res.json()),
      fetch("/api/institucional").then(res => res.json())
    ])
    .then(([transparenciaData, instData]) => {
      if (transparenciaData.chartData) {
        setChartData(transparenciaData.chartData);
      }
      setInstitution(instData);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  return (
    <div className="py-20 px-4 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
          Nuestra <span className="text-transparent bg-clip-text bg-gradient-to-r from-jv-purple to-jv-turquoise">Transparencia</span>
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Creemos que la honestidad es la base de todo. Aquí te mostramos cómo invertimos cada donación para maximizar nuestro impacto en los jóvenes de La Guajira.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-10 h-[500px] flex flex-col justify-center shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-jv-purple to-jv-turquoise"></div>
          <h3 className="text-2xl font-bold text-white mb-2 text-center">Distribución de Recursos</h3>
          {loading ? (
            <div className="flex-1 flex justify-center items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-jv-turquoise"></div>
            </div>
          ) : (
            <div className="flex-1 w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="40%"
                    cy="50%"
                    innerRadius={90}
                    outerRadius={140}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0.2)" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff', borderRadius: '10px' }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(value: any) => [`${value}%`, 'Presupuesto']}
                  />
                  <Legend 
                    layout="vertical" 
                    verticalAlign="middle" 
                    align="right"
                    wrapperStyle={{ paddingLeft: "20px", fontSize: "14px" }}
                    iconType="circle" 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-8"
        >
          <div className="flex items-start">
            <div className="flex-shrink-0 p-3 bg-jv-purple/10 rounded-xl mr-4">
              <ShieldCheck className="text-jv-purple" size={32} />
            </div>
            <div>
              <h4 className="text-xl font-bold text-white mb-2">{institution?.transparency1Title || "Auditorías Abiertas"}</h4>
              <p className="text-gray-400 leading-relaxed">{institution?.transparency1Desc || "Trabajamos bajo estrictos estándares contables. Nuestros libros están siempre abiertos a revisión para nuestros grandes donantes y fundadores."}</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 p-3 bg-jv-turquoise/10 rounded-xl mr-4">
              <TrendingUp className="text-jv-turquoise" size={32} />
            </div>
            <div>
              <h4 className="text-xl font-bold text-white mb-2">{institution?.transparency2Title || "Máximo Impacto Directo"}</h4>
              <p className="text-gray-400 leading-relaxed">{institution?.transparency2Desc || "Nos esforzamos por mantener nuestros costos administrativos al mínimo absoluto, asegurando que la mayor parte de tu donación llegue directamente a quienes lo necesitan."}</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 p-3 bg-red-500/10 rounded-xl mr-4">
              <Heart className="text-red-400" size={32} />
            </div>
            <div>
              <h4 className="text-xl font-bold text-white mb-2">{institution?.transparency3Title || "Donantes Comprometidos"}</h4>
              <p className="text-gray-400 leading-relaxed">{institution?.transparency3Desc || "Nuestra red de aliados confía ciegamente en nosotros gracias a los reportes constantes de impacto que entregamos mes a mes."}</p>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-gray-900 border border-gray-800 rounded-3xl p-10 text-center"
      >
        <h3 className="text-3xl font-bold text-white mb-4">¿Quieres ver nuestros Informes Legales?</h3>
        <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
          Visita nuestro hub de documentos públicos donde podrás descargar en PDF nuestros estados financieros, presupuestos aprobados y estatutos de la fundación.
        </p>
        <Link 
          href="/documentos" 
          className="inline-block bg-jv-turquoise hover:bg-white text-jv-dark font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(79,221,230,0.4)]"
        >
          Ver Documentos Públicos
        </Link>
      </motion.div>
    </div>
  );
}
