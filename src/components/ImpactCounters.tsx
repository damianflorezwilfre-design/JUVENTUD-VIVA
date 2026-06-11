"use client"

import { motion, animate } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";

function AnimatedNumber({ value, inView }: { value: string; inView: boolean }) {
  const numMatch = value.match(/\d+/);
  const numericVal = numMatch ? parseInt(numMatch[0], 10) : 0;
  const prefix = numMatch ? value.substring(0, numMatch.index) : "";
  const suffix = numMatch ? value.substring((numMatch.index || 0) + numMatch[0].length) : value;

  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    if (inView) {
      const controls = animate(0, numericVal, {
        duration: 2.5,
        ease: "easeOut",
        onUpdate(v) {
          setDisplayValue(Math.floor(v).toString());
        }
      });
      return () => controls.stop();
    }
  }, [inView, numericVal]);

  if (!numMatch) return <>{value}</>;
  return <>{prefix}{displayValue}{suffix}</>;
}

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
                <AnimatedNumber value={stat.value} inView={inView} />
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
