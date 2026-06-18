import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { Heart, Target, TrendingUp } from "lucide-react";

export const revalidate = 60;

export default async function ApadrinaPage() {
  const causes = await prisma.sponsorship.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="min-h-screen bg-jv-dark text-white font-sans selection:bg-jv-purple/30 selection:text-white">
      <Navbar />
      
      <main className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
            Programa de <span className="text-transparent bg-clip-text bg-gradient-to-r from-jv-turquoise to-jv-purple">Padrinazgo</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Transforma una vida de manera directa. Conoce las causas y comunidades que necesitan tu apoyo continuo para lograr un desarrollo sostenible.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {causes.map((cause) => {
            const progress = cause.goalAmount ? (cause.currentAmount / cause.goalAmount) * 100 : 0;
            
            return (
              <div key={cause.id} className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden hover:border-jv-turquoise/50 transition-all duration-300 shadow-2xl flex flex-col group">
                <div className="relative h-64 overflow-hidden">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10"></div>
                  {cause.imageUrl ? (
                    <img 
                      src={cause.imageUrl} 
                      alt={cause.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                      <Heart size={48} className="text-gray-700" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-jv-turquoise text-jv-dark font-bold px-4 py-1.5 rounded-full text-sm z-20 shadow-lg">
                    Causa Social
                  </div>
                </div>

                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="text-2xl font-bold text-white mb-3">{cause.title}</h3>
                  <p className="text-gray-400 mb-6 flex-grow line-clamp-3">{cause.description}</p>
                  
                  <div className="bg-gray-800/50 p-4 rounded-2xl mb-6 border border-gray-700/50">
                    <div className="flex justify-between items-end mb-2">
                      <div>
                        <p className="text-xs text-gray-500 font-medium mb-1">Recaudado</p>
                        <p className="text-lg font-bold text-jv-turquoise">
                          ${cause.currentAmount.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 font-medium mb-1">Meta</p>
                        <p className="text-sm font-bold text-white">
                          ${cause.goalAmount ? cause.goalAmount.toLocaleString() : '0'}
                        </p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-jv-turquoise to-blue-500 h-2.5 rounded-full transition-all duration-1000"
                        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                      ></div>
                    </div>
                  </div>

                  <Link href={`/donaciones?cause=${cause.id}`} className="w-full bg-jv-purple hover:bg-white text-white hover:text-jv-dark font-bold px-6 py-4 rounded-xl transition-all shadow-lg flex items-center justify-center group-hover:scale-[1.02]">
                    <Heart size={20} className="mr-2" />
                    Apadrinar Ahora
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
        
        {causes.length === 0 && (
          <div className="text-center p-12 bg-gray-900 border border-gray-800 rounded-3xl">
            <Heart size={48} className="text-gray-700 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">No hay causas activas</h3>
            <p className="text-gray-400">Actualmente no tenemos programas de padrinazgo publicados. Vuelve pronto.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
