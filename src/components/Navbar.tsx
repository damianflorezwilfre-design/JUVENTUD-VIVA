"use client"

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: "/", label: "Inicio" },
    { href: "/nosotros", label: "Nosotros" },
    { href: "/programas", label: "Programas" },
    { href: "/eventos", label: "Eventos" },
    { href: "/voluntariado", label: "Voluntarios" },
    { href: "/voluntarios/ranking", label: "Ranking" },
    { href: "/apadrina", label: "Apadrina" },
    { href: "/oportunidades", label: "Oportunidades" },
    { href: "/muro", label: "Muro" },
    { href: "/mapa", label: "Impacto" },
  ];

  return (
    <>
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] lg:w-max max-w-7xl z-50 bg-jv-dark/80 backdrop-blur-xl border border-jv-purple/30 rounded-full shadow-[0_8px_32px_rgba(155,28,201,0.2)] transition-all duration-300">
        <div className="px-4 lg:px-6">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center mr-6">
              <Link href="/">
                <Image
                  src="/logo/juventud-viva.png"
                  alt="JUVENTUD VIVA"
                  width={50}
                  height={50}
                  className="object-contain hover:scale-105 transition-transform drop-shadow-[0_0_10px_rgba(155,28,201,0.5)]"
                />
              </Link>
            </div>
            
            <div className="hidden lg:flex space-x-5 items-center">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative text-gray-300 hover:text-white transition-all duration-300 font-medium text-[13px] whitespace-nowrap group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-jv-turquoise transition-all duration-300 group-hover:w-full group-hover:shadow-[0_0_8px_rgba(79,221,230,0.8)]"></span>
                </Link>
              ))}
              <div className="flex items-center space-x-3 pl-4 border-l border-gray-700">
                <Link
                  href="/donaciones"
                  className="px-5 py-1.5 rounded-full bg-gradient-to-r from-jv-turquoise to-blue-400 text-jv-dark hover:from-white hover:to-white hover:text-jv-dark transition-all duration-300 shadow-[0_0_15px_rgba(79,221,230,0.4)] hover:shadow-[0_0_20px_rgba(79,221,230,0.8)] font-bold text-[13px] whitespace-nowrap"
                >
                  DONAR
                </Link>
                <Link
                  href="/admin/login"
                  className="px-5 py-1.5 rounded-full bg-gray-800 border border-jv-purple/50 text-white hover:bg-jv-purple hover:border-jv-purple transition-all duration-300 shadow-[0_0_10px_rgba(155,28,201,0.2)] hover:shadow-[0_0_20px_rgba(155,28,201,0.6)] font-semibold text-[13px] whitespace-nowrap"
                >
                  Admin
                </Link>
              </div>
            </div>

            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-jv-white hover:text-jv-turquoise focus:outline-none"
              >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-jv-dark border-b border-jv-purple/20"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 text-base font-medium text-jv-white hover:text-jv-turquoise hover:bg-jv-purple/10 rounded-md"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/donaciones"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-left px-3 py-2 text-base font-bold text-jv-turquoise hover:text-white"
                >
                  DONAR
                </Link>
                <Link
                  href="/admin/login"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 text-base font-medium text-jv-purple hover:text-jv-white"
                >
                  Portal Admin
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
