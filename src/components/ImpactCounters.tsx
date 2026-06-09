"use client"

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export default function ImpactCounters({ institution }: { institution: any }) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const stats = [
    { value: institution?.stat1Value || "500+", label: institution?.stat1Label || "Jóvenes Impactados" },
    { value: institution?.stat2Value || "20+", label: institution?.stat2Label || "Proyectos Realizados" },
    { value: institution?.stat3Value || "10+", label: institution?.stat3Label || "Comunidades Atendidas" },
  ];

  // If all are completely empty (the default fallback), we can still show them, or hide if we want.
  // We'll show them to have default content.

  return (
    <section ref={ref} className="py-20 bg-gray-900 border-t border-b border-gray-800 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              className="text-center"
            >
              <div className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-jv-purple to-jv-turquoise mb-2">
                {stat.value}
              </div>
              <div className="text-lg text-gray-400 font-medium uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
