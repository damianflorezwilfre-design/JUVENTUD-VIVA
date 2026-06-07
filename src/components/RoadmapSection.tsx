"use client"

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, PlayCircle } from "lucide-react";

type RoadmapAction = {
  id: string;
  title: string;
  description: string;
  date: string | null;
  status: "pending" | "in-progress" | "completed";
};

export default function RoadmapSection() {
  const [actions, setActions] = useState<RoadmapAction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/hoja-de-ruta")
      .then(res => res.json())
      .then(data => {
        setActions(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading || actions.length === 0) return null;

  return (
    <section className="py-24 bg-jv-dark relative z-10 border-t border-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Hoja de Ruta</h2>
          <p className="text-xl text-gray-400">Nuestro plan de acción para transformar la juventud.</p>
        </div>

        <div className="relative border-l border-gray-700 ml-3 md:ml-0 md:mx-auto">
          {actions.map((action, idx) => (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="mb-10 ml-8 md:ml-12 relative"
            >
              {/* Timeline dot */}
              <span className="absolute -left-[41px] md:-left-[57px] top-1 h-6 w-6 rounded-full bg-gray-900 border-2 border-jv-purple flex items-center justify-center">
                {action.status === 'completed' && <CheckCircle2 size={14} className="text-jv-turquoise" />}
                {action.status === 'in-progress' && <PlayCircle size={14} className="text-jv-purple" />}
                {action.status === 'pending' && <Clock size={14} className="text-gray-500" />}
              </span>

              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-jv-purple/30 transition-colors shadow-lg">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <h3 className="text-xl font-bold text-white">{action.title}</h3>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    action.status === 'completed' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                    action.status === 'in-progress' ? 'bg-jv-purple/10 text-jv-purple border border-jv-purple/20' :
                    'bg-gray-800 text-gray-400 border border-gray-700'
                  }`}>
                    {action.status === 'completed' ? 'Completado' :
                     action.status === 'in-progress' ? 'En Progreso' : 'Pendiente'}
                  </span>
                </div>
                {action.date && (
                  <p className="text-sm text-jv-turquoise font-medium mb-3">{action.date}</p>
                )}
                <p className="text-gray-400 leading-relaxed">{action.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
