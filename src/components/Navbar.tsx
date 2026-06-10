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
    { href: "/nosotros", label: "Sobre Nosotros" },
    { href: "/programas", label: "Programas" },
    { href: "/eventos", label: "Eventos" },
    { href: "/voluntariado", label: "Voluntariado" },
    { href: "/voluntarios/ranking", label: "Salón de la Fama" },
    { href: "/apadrina", label: "Padrinazgo" },
    { href: "/oportunidades", label: "Oportunidades" },
    { href: "/muro", label: "Muro" },
    { href: "/mapa", label: "Impacto" },
  ];

  return (
    <>
      <nav className="fixed w-full z-50 bg-jv-dark/90 backdrop-blur-md border-b border-jv-purple/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <Image
                  src="/logo/juventud-viva.png"
                  alt="JUVENTUD VIVA"
                  width={70}
                  height={70}
                  className="object-contain"
                />
              </Link>
            </div>
            
            <div className="hidden lg:flex space-x-6 items-center">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-jv-white hover:text-jv-turquoise transition-colors duration-300 font-medium text-sm"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/donaciones"
                className="px-4 py-2 rounded-full bg-jv-turquoise text-jv-dark hover:bg-white transition-all duration-300 shadow-[0_0_15px_rgba(79,221,230,0.5)] font-bold text-sm"
              >
                DONAR
              </Link>
              <Link
                href="/admin/login"
                className="px-4 py-2 rounded-full bg-jv-purple hover:bg-jv-turquoise text-white transition-all duration-300 shadow-[0_0_15px_rgba(155,28,201,0.5)] font-semibold text-sm"
              >
                Portal Admin
              </Link>
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
