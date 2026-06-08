"use client";

import { useEffect, useState } from "react";
import OrgChart, { OrgNode } from "./OrgChart";
import { motion } from "framer-motion";

export default function OrganigramaSection() {
  const [nodes, setNodes] = useState<OrgNode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/organigrama")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setNodes(data);
        }
      })
      .catch(e => console.error("Error fetching organigrama", e))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (nodes.length === 0) return null; // Don't show if empty

  return (
    <section className="py-24 bg-gray-900 border-t border-gray-800 relative z-10" id="organigrama">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Estructura Organizacional</h2>
          <p className="text-xl text-gray-400">Conoce cómo estamos organizados para lograr nuestro impacto.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <OrgChart nodes={nodes} />
        </motion.div>
      </div>
    </section>
  );
}
