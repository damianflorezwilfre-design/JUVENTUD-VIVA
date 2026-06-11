"use client"

import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Heart, Users, BookOpen } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import AlianzasSection from "@/components/AlianzasSection";
import TeamSection from "@/components/TeamSection";
import OrganigramaSection from "@/components/OrganigramaSection";
import RoadmapSection from "@/components/RoadmapSection";
import ImpactCounters from "@/components/ImpactCounters";
import TestimonialSection from "@/components/TestimonialSection";
import MagicParticles from "@/components/MagicParticles";

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

  // 3D Tilt Effect Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const heroTitleHtml = (institution?.heroTitle || "Empoderando a la Nueva Generación").replace("Nueva Generación", `<span class="text-transparent bg-clip-text bg-gradient-to-r from-jv-purple to-jv-turquoise">Nueva Generación</span>`);


  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-32 pb-24 overflow-hidden perspective-[1000px]">
        {/* Background Image / Overlay */}
        <div className="absolute inset-0 bg-jv-dark z-0">
          <MagicParticles />
          {institution?.publicBackground ? (
            <Image 
              src={institution.publicBackground} 
              alt="Fondo Público" 
              fill 
              className="object-cover opacity-20" 
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-jv-purple/20 to-jv-turquoise/20 opacity-50"></div>
          )}
          {/* Decorative blur circles */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-jv-purple/30 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-jv-turquoise/30 rounded-full blur-[120px]"></div>
        </div>

        {/* 3D Interactive Container */}
        <motion.div 
          className="relative z-10 w-full max-w-5xl mx-auto px-4 flex justify-center items-center"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
        >
          {/* Holographic Glass Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full text-center bg-gray-900/40 backdrop-blur-md border border-white/10 rounded-3xl p-10 md:p-16 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden"
            style={{ transform: "translateZ(50px)", transformStyle: "preserve-3d" }}
          >
            {/* Inner Glows */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-jv-turquoise to-transparent opacity-50"></div>
            <div className="absolute -inset-1 bg-gradient-to-r from-jv-purple/20 to-jv-turquoise/20 blur-xl opacity-50 z-[-1]"></div>

            <motion.div
              style={{ transform: "translateZ(80px)" }}
              className="mb-8 flex justify-center"
            >
              <Image
                src="/logo/juventud-viva.png"
                alt="JUVENTUD VIVA Logo"
                width={200}
                height={200}
                className="drop-shadow-[0_0_35px_rgba(79,221,230,0.6)] hover:drop-shadow-[0_0_50px_rgba(155,28,201,0.8)] transition-all duration-500"
              />
            </motion.div>
            
            <motion.h1
              style={{ transform: "translateZ(100px)" }}
              className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 text-white tracking-tight leading-tight"
              dangerouslySetInnerHTML={{ __html: heroTitleHtml }}
            />
            
            <motion.p
              style={{ transform: "translateZ(60px)" }}
              className="text-lg md:text-xl text-gray-300 mb-10 max-w-3xl mx-auto font-medium"
            >
              {institution?.heroSubtitle || '"No construimos para una elección, construimos para una generación." — Juventud ViVa, Villanueva - La Guajira.'}
            </motion.p>
            
            <motion.div
              style={{ transform: "translateZ(70px)" }}
              className="flex flex-col sm:flex-row gap-6 justify-center"
            >
              <Link
                href="/nosotros"
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-jv-purple to-jv-turquoise hover:from-jv-turquoise hover:to-jv-purple text-white transition-all duration-500 font-bold text-lg flex items-center justify-center group shadow-[0_0_30px_rgba(155,28,201,0.5)] hover:shadow-[0_0_40px_rgba(79,221,230,0.8)] border border-white/20"
              >
                Nuestra Historia
                <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link
                href="#contacto"
                className="px-8 py-4 rounded-xl bg-black/30 backdrop-blur-md border border-white/20 hover:bg-white/10 text-white transition-all duration-300 font-bold text-lg flex items-center justify-center"
              >
                Contacto
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Impact Counters */}
      <ImpactCounters institution={institution} />

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

      {/* Organigrama */}
      <OrganigramaSection />

      {/* Testimonios */}
      <TestimonialSection />

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
