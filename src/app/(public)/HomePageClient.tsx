"use client"

import { useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Heart, Users, BookOpen } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import AlianzasSection from "@/components/AlianzasSection";
import TeamSection from "@/components/TeamSection";
import RoadmapSection from "@/components/RoadmapSection";

export default function HomePageClient({ institution }: { institution: any }) {
  useEffect(() => {
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "view" })
    }).catch(e => console.error("Error tracking view", e));
  }, []);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image / Overlay */}
        <div className="absolute inset-0 bg-jv-dark z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-jv-purple/20 to-jv-turquoise/20 opacity-50"></div>
          {/* Decorative blur circles */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-jv-purple/30 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-jv-turquoise/30 rounded-full blur-[120px]"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8 flex justify-center"
          >
            <Image
              src="/logo/juventud-viva.png"
              alt="JUVENTUD VIVA Logo"
              width={250}
              height={250}
              className="drop-shadow-[0_0_25px_rgba(79,221,230,0.5)]"
            />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-6 text-white tracking-tight"
          >
            Empoderando a la <span className="text-transparent bg-clip-text bg-gradient-to-r from-jv-purple to-jv-turquoise">Nueva Generación</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto"
          >
            "No construimos para una elección, construimos para una generación." — Juventud ViVa, Villanueva - La Guajira.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center pb-24"
          >
            <Link
              href="/nosotros"
              className="px-8 py-4 rounded-full bg-jv-purple hover:bg-jv-turquoise text-white transition-all duration-300 font-semibold text-lg flex items-center justify-center group shadow-[0_0_20px_rgba(155,28,201,0.4)] hover:shadow-[0_0_20px_rgba(79,221,230,0.6)]"
            >
              Nuestra Historia
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/contacto"
              className="px-8 py-4 rounded-full bg-transparent border-2 border-jv-turquoise text-jv-turquoise hover:bg-jv-turquoise/10 transition-all duration-300 font-semibold text-lg flex items-center justify-center"
            >
              Contacto
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-24 bg-jv-dark relative z-10 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-10"
          >
            {[
              { icon: <Users size={40} className="text-jv-turquoise" />, title: institution?.feature1Title || "Liderazgo Comunitario", desc: institution?.feature1Desc || "Formamos jóvenes capaces de liderar iniciativas de impacto social." },
              { icon: <BookOpen size={40} className="text-jv-purple" />, title: institution?.feature2Title || "Educación Continua", desc: institution?.feature2Desc || "Ofrecemos talleres y programas para el desarrollo personal y profesional." },
              { icon: <Heart size={40} className="text-red-400" />, title: institution?.feature3Title || "Acción Social", desc: institution?.feature3Desc || "Participamos activamente en la mejora de nuestras comunidades." }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                variants={fadeIn}
                className="bg-gray-900/50 p-8 rounded-2xl border border-gray-800 hover:border-jv-purple/50 transition-colors group"
              >
                <div className="mb-6 bg-gray-800 w-16 h-16 flex items-center justify-center rounded-xl group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Hoja de Ruta */}
      <RoadmapSection />

      {/* Equipo */}
      <TeamSection />

      {/* Alianzas */}
      <AlianzasSection />

      {/* Contact Section */}
      <section className="py-24 bg-jv-dark relative z-10 border-t border-gray-800" id="contacto">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Déjanos un Mensaje</h2>
          <p className="text-xl text-gray-400 mb-8">¿Quieres sumarte, proponer una alianza o saber más? Escríbenos.</p>
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
