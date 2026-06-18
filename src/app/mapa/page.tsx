import dynamic from 'next/dynamic';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";

const MapViewer = dynamic(() => import("@/components/MapViewer"), { ssr: false });

export const revalidate = 60;

export default async function MapaPage() {
  const pins = await prisma.mapPin.findMany({
    orderBy: { date: 'desc' }
  });

  return (
    <div className="min-h-screen bg-jv-dark text-white font-sans selection:bg-jv-purple/30 selection:text-white flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
            Mapa de <span className="text-transparent bg-clip-text bg-gradient-to-r from-jv-turquoise to-jv-purple">Impacto</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Explora las comunidades en La Guajira donde Juventud ViVa está generando un cambio positivo a través de nuestros programas.
          </p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-2 md:p-4 shadow-2xl h-[800px] w-full">
          <MapViewer pins={pins} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
