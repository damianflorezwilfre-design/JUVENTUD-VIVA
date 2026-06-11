import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone, Heart } from "lucide-react";
import { prisma } from "@/lib/prisma";
import SocialTrackingLink from "./SocialTrackingLink";
import NewsletterForm from "./NewsletterForm";

export default async function Footer() {
  const institution = await prisma.institution.findUnique({
    where: { id: "singleton" }
  });

  const address = institution?.address || "Av. Principal 123, Ciudad Central";
  const phone = institution?.phone || "+57 300 123 4567";
  const email = institution?.email || "contacto@juventudviva.org";
  
  const facebook = institution?.facebook || "#";
  const instagram = institution?.instagram || "#";
  const twitter = institution?.twitter || "#";
  const tiktok = institution?.tiktok || "#";

  return (
    <footer className="bg-jv-dark border-t border-jv-purple/30 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="col-span-1 md:col-span-1">
            <Link href="/">
              <Image
                src="/logo/juventud-viva.png"
                alt="JUVENTUD VIVA"
                width={150}
                height={50}
                className="object-contain mb-4"
              />
            </Link>
            <p className="text-gray-400 text-sm mb-4">
              Impulsando el desarrollo y liderazgo de las nuevas generaciones. Juntos construimos un futuro vibrante.
            </p>
            <div className="flex space-x-4">
              <SocialTrackingLink href={facebook} network="fbClick" className="text-gray-400 hover:text-jv-turquoise transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </SocialTrackingLink>
              <SocialTrackingLink href={instagram} network="igClick" className="text-gray-400 hover:text-jv-purple transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </SocialTrackingLink>
              <a href={twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-jv-turquoise transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              </a>
              <a href={tiktok} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-jv-purple transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-jv-white mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li><Link href="/nosotros" className="text-gray-400 hover:text-jv-turquoise transition-colors">Sobre Nosotros</Link></li>
              <li><Link href="/programas" className="text-gray-400 hover:text-jv-turquoise transition-colors">Programas</Link></li>
              <li><Link href="/transparencia" className="text-gray-400 hover:text-jv-turquoise transition-colors">Transparencia</Link></li>
              <li><Link href="/apadrina" className="text-gray-400 hover:text-jv-turquoise transition-colors">Causas de Padrinazgo</Link></li>
              <li><Link href="/certificados" className="text-gray-400 hover:text-jv-turquoise transition-colors">Certificados Tributarios</Link></li>
              <li><Link href="/voluntarios/ranking" className="text-gray-400 hover:text-jv-turquoise transition-colors">Salón de la Fama</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-jv-white mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={18} className="text-jv-purple mr-2 mt-1 flex-shrink-0" />
                <span className="text-gray-400 text-sm">{address}</span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="text-jv-purple mr-2 flex-shrink-0" />
                <span className="text-gray-400 text-sm">{phone}</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="text-jv-purple mr-2 flex-shrink-0" />
                <span className="text-gray-400 text-sm">{email}</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-jv-white mb-4 flex items-center">
              Apóyanos con una Donación
              <Heart size={18} className="ml-2 text-red-400" />
            </h3>
            <p className="text-gray-400 text-sm mb-4">Haz tu aporte y ayúdanos a construir un mejor futuro para los jóvenes vulnerables de La Guajira.</p>
            <form className="flex flex-col space-y-2 mb-6" action="/donaciones">
              <button
                type="submit"
                className="px-4 py-3 bg-jv-purple hover:bg-jv-turquoise text-white rounded-xl transition-all duration-300 font-semibold shadow-[0_0_15px_rgba(155,28,201,0.3)] hover:shadow-[0_0_15px_rgba(79,221,230,0.5)] flex items-center justify-center"
              >
                Hacer Donación Ahora
              </button>
            </form>
            
            <NewsletterForm />
          </div>

        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} JUVENTUD VIVA. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
