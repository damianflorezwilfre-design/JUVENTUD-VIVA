import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MapViewer from "@/components/MapViewer";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

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

        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-4 md:p-8 shadow-2xl h-[600px] w-full">
          <MapViewer pins={pins} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
