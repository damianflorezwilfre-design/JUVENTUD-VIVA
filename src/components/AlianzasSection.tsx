"use client"

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

type Alliance = {
  id: string;
  name: string;
  logoUrl: string;
  website: string | null;
};

export default function AlianzasSection() {
  const [alianzas, setAlianzas] = useState<Alliance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/alianzas")
      .then(res => res.json())
      .then(data => {
        setAlianzas(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading || alianzas.length === 0) return null;

  return (
    <section id="alianzas" className="py-20 bg-gray-900 relative z-10 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Nuestras Alianzas</h2>
          <p className="text-xl text-gray-400">Organizaciones y entidades que construyen el futuro con nosotros.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-8 md:gap-16 items-center">
          {alianzas.map((alianza, idx) => (
            <motion.a
              key={alianza.id}
              href={alianza.website || "#"}
              target={alianza.website ? "_blank" : "_self"}
              rel="noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group block relative w-32 h-32 md:w-48 md:h-48 bg-white/5 rounded-2xl p-6 hover:bg-white/10 transition-colors border border-white/5 hover:border-jv-purple/30"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={alianza.logoUrl} 
                alt={alianza.name} 
                className="w-full h-full object-contain filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
              />
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
