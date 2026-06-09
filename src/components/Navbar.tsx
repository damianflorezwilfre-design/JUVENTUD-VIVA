"use client"

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [donationData, setDonationData] = useState({ bankInfo: "", donationLink: "" });

  useState(() => {
    fetch("/api/institucional")
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) setDonationData({ bankInfo: data.bankInfo || "", donationLink: data.donationLink || "" });
      });
  });

  const links = [
    { href: "/", label: "Inicio" },
    { href: "/nosotros", label: "Sobre Nosotros" },
    { href: "/programas", label: "Programas" },
    { href: "/eventos", label: "Eventos" },
    { href: "/voluntariado", label: "Voluntariado" },
    { href: "/noticias", label: "Noticias" },
    { href: "/galeria", label: "Galería" },
    { href: "/documentos", label: "Documentos Públicos" },
    { href: "/transparencia", label: "Transparencia" },
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
              <button
                onClick={() => setShowDonationModal(true)}
                className="px-4 py-2 rounded-full bg-jv-turquoise text-jv-dark hover:bg-white transition-all duration-300 shadow-[0_0_15px_rgba(79,221,230,0.5)] font-bold text-sm"
              >
                DONAR
              </button>
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
                <button
                  onClick={() => { setIsOpen(false); setShowDonationModal(true); }}
                  className="block w-full text-left px-3 py-2 text-base font-bold text-jv-turquoise hover:text-white"
                >
                  DONAR
                </button>
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

      {/* Donation Modal */}
      <AnimatePresence>
        {showDonationModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex justify-center items-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gray-900 border border-jv-turquoise/50 rounded-3xl w-full max-w-md overflow-hidden shadow-[0_0_30px_rgba(79,221,230,0.2)]"
            >
              <div className="flex justify-between items-center p-6 border-b border-gray-800">
                <h3 className="text-2xl font-bold text-white flex items-center">
                  <span className="text-jv-turquoise mr-2">Apoya</span> Nuestra Causa
                </h3>
                <button onClick={() => setShowDonationModal(false)} className="text-gray-400 hover:text-white transition-colors bg-gray-800 rounded-full p-2">
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-8 text-center max-h-[80vh] overflow-y-auto">
                <p className="text-gray-300 mb-6">
                  Con tu donación, nos ayudas a seguir impactando la vida de más jóvenes. Haz tu aporte a través de los siguientes medios:
                </p>
                
                <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 mb-8">
                  <p className="text-white whitespace-pre-wrap font-medium text-lg">
                    {donationData.bankInfo || "Próximamente estaremos recibiendo donaciones. ¡Gracias por tu interés!"}
                  </p>
                  {donationData.donationLink && (
                    <a 
                      href={donationData.donationLink} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-block mt-4 w-full py-3 bg-jv-turquoise text-jv-dark font-bold rounded-xl hover:bg-white transition-colors"
                    >
                      Donar en Línea
                    </a>
                  )}
                </div>

                <div className="border-t border-gray-800 pt-6 mt-6">
                  <h4 className="text-xl font-bold text-white mb-4 text-left">Registrar Transferencia</h4>
                  <p className="text-sm text-gray-400 text-left mb-4">Si realizaste una transferencia, repórtala aquí para registrarla en tesorería y notificarnos por WhatsApp.</p>
                  <form 
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const form = e.currentTarget;
                      const name = (form.elements.namedItem("name") as HTMLInputElement).value;
                      const amount = (form.elements.namedItem("amount") as HTMLInputElement).value;
                      const reference = (form.elements.namedItem("reference") as HTMLInputElement).value;
                      
                      try {
                        const res = await fetch("/api/donaciones", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ name, amount, reference })
                        });
                        
                        if (res.ok) {
                          const waMessage = `¡Hola! Acabo de realizar una donación.\nNombre: ${name}\nMonto: $${amount}\nReferencia: ${reference}`;
                          const waUrl = `https://wa.me/573245083402?text=${encodeURIComponent(waMessage)}`;
                          window.open(waUrl, "_blank");
                          setShowDonationModal(false);
                        } else {
                          alert("Hubo un error al registrar la donación. Inténtalo más tarde.");
                        }
                      } catch(err) {
                        alert("Error de red.");
                      }
                    }}
                    className="space-y-4 text-left"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Tu Nombre</label>
                      <input name="name" required type="text" className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-jv-turquoise focus:outline-none" placeholder="Ej. Ana Gómez" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Monto Donado ($)</label>
                      <input name="amount" required type="number" min="1" className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-jv-turquoise focus:outline-none" placeholder="Ej. 50000" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Número de Comprobante / Referencia</label>
                      <input name="reference" required type="text" className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-jv-turquoise focus:outline-none" placeholder="Ej. 12345678" />
                    </div>
                    <button type="submit" className="w-full py-4 bg-jv-purple hover:bg-jv-turquoise text-white font-bold rounded-xl transition-colors shadow-[0_0_15px_rgba(155,28,201,0.4)]">
                      Registrar y Notificar
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
