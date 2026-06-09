"use client"

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

export default function TestimonialSection() {
  const [testimonios, setTestimonios] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetch("/api/testimonios")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setTestimonios(data);
        }
      })
      .catch(err => console.error(err));
  }, []);

  if (testimonios.length === 0) return null;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonios.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonios.length - 1 : prev - 1));
  };

  return (
    <section className="py-24 bg-jv-dark relative z-10 border-t border-gray-800 overflow-hidden">
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-jv-purple/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute top-1/2 right-0 w-64 h-64 bg-jv-turquoise/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-jv-white">
            Historias de <span className="text-transparent bg-clip-text bg-gradient-to-r from-jv-purple to-jv-turquoise">Impacto</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Detrás de cada número hay una vida transformada. Conoce a los protagonistas de nuestra historia.
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          <div className="absolute -left-4 md:-left-12 top-1/2 -translate-y-1/2 z-20">
            <button onClick={prevSlide} className="p-3 bg-gray-800 hover:bg-jv-purple text-white rounded-full transition-colors">
              <ChevronLeft size={24} />
            </button>
          </div>
          
          <div className="absolute -right-4 md:-right-12 top-1/2 -translate-y-1/2 z-20">
            <button onClick={nextSlide} className="p-3 bg-gray-800 hover:bg-jv-turquoise text-white rounded-full transition-colors">
              <ChevronRight size={24} />
            </button>
          </div>

          <div className="overflow-hidden relative min-h-[300px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="bg-gray-900 border border-gray-800 rounded-3xl p-8 md:p-12 text-center"
              >
                <Quote size={48} className="text-jv-purple/50 mx-auto mb-6" />
                <p className="text-xl md:text-2xl text-gray-300 font-medium italic mb-8 leading-relaxed">
                  "{testimonios[currentIndex].content}"
                </p>
                
                <div className="flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-800 mb-4 border-2 border-jv-turquoise">
                    {testimonios[currentIndex].imageUrl ? (
                      <Image src={testimonios[currentIndex].imageUrl} alt={testimonios[currentIndex].name} width={64} height={64} className="object-cover w-full h-full" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold text-xl">
                        {testimonios[currentIndex].name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <h4 className="text-white font-bold text-lg">{testimonios[currentIndex].name}</h4>
                  <p className="text-jv-turquoise text-sm font-medium">{testimonios[currentIndex].role}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          
          <div className="flex justify-center mt-8 space-x-2">
            {testimonios.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-3 h-3 rounded-full transition-all ${idx === currentIndex ? 'bg-jv-turquoise w-8' : 'bg-gray-700'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
