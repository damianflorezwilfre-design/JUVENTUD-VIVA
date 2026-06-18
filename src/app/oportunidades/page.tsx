import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";
import { Briefcase, GraduationCap, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function OportunidadesPage() {
  const oportunidades = await prisma.opportunity.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="min-h-screen bg-jv-dark text-white font-sans selection:bg-jv-purple/30 selection:text-white flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
            Bolsa de <span className="text-transparent bg-clip-text bg-gradient-to-r from-jv-turquoise to-jv-purple">Oportunidades</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Impulsamos tu futuro. Descubre ofertas de empleo, prácticas y becas de estudio exclusivas para la red de Juventud ViVa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {oportunidades.map((opp) => (
            <div key={opp.id} className="bg-gray-900 border border-gray-800 rounded-3xl p-8 hover:border-jv-purple/50 transition-all duration-300 shadow-2xl flex flex-col group">
              <div className="flex items-center mb-6">
                <div className={`p-4 rounded-2xl mr-4 ${opp.type === 'BECA' ? 'bg-jv-purple/20 text-jv-purple' : 'bg-jv-turquoise/20 text-jv-turquoise'}`}>
                  {opp.type === 'BECA' ? <GraduationCap size={32} /> : <Briefcase size={32} />}
                </div>
                <div>
                  <div className={`text-xs font-bold px-3 py-1 rounded-full inline-block mb-2 ${opp.type === 'BECA' ? 'bg-jv-purple/10 text-jv-purple' : 'bg-jv-turquoise/10 text-jv-turquoise'}`}>
                    {opp.type === 'BECA' ? 'Beca de Estudio' : 'Empleo / Práctica'}
                  </div>
                  <h3 className="text-xl font-bold text-white line-clamp-2 leading-tight">{opp.title}</h3>
                </div>
              </div>
              
              <div className="mb-6 border-b border-gray-800 pb-6">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Institución / Empresa</p>
                <p className="text-lg font-semibold text-gray-300">{opp.company}</p>
              </div>

              <p className="text-gray-400 mb-8 flex-grow whitespace-pre-wrap text-sm leading-relaxed">{opp.description}</p>
              
              <a 
                href={opp.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className={`w-full font-bold px-6 py-4 rounded-xl transition-all shadow-lg flex items-center justify-center group-hover:scale-[1.02] ${
                  opp.type === 'BECA' 
                    ? 'bg-jv-purple hover:bg-white text-white hover:text-jv-dark' 
                    : 'bg-jv-turquoise hover:bg-white text-jv-dark'
                }`}
              >
                Postularse Ahora <ArrowRight size={20} className="ml-2" />
              </a>
            </div>
          ))}
        </div>

        {oportunidades.length === 0 && (
          <div className="text-center p-12 bg-gray-900 border border-gray-800 rounded-3xl">
            <Briefcase size={48} className="text-gray-700 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">No hay oportunidades activas</h3>
            <p className="text-gray-400">Actualmente no tenemos nuevas vacantes o becas publicadas. Mantente atento a nuestras redes.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
