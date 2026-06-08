"use client"

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  imageUrl: string | null;
};

export default function TeamSection() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/equipo")
      .then(res => res.json())
      .then(data => {
        setTeam(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading || team.length === 0) return null;

  return (
    <section id="equipo" className="py-24 bg-jv-dark relative z-10 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Nuestro Equipo</h2>
          <p className="text-xl text-gray-400">Conoce a los líderes que hacen posible nuestra misión.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, idx) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group bg-gray-900/50 rounded-2xl p-6 border border-gray-800 hover:border-jv-purple/50 transition-colors flex flex-col items-center text-center"
            >
              <div className="w-32 h-32 rounded-full overflow-hidden mb-6 border-4 border-gray-800 group-hover:border-jv-turquoise transition-colors relative">
                {member.imageUrl ? (
                  <Image src={member.imageUrl} alt={member.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-500 font-bold text-2xl">
                    {member.name.charAt(0)}
                  </div>
                )}
              </div>
              <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
              <p className="text-jv-turquoise font-medium mb-4">{member.role}</p>
              {member.bio && (
                <p className="text-gray-400 text-sm leading-relaxed">
                  {member.bio}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
