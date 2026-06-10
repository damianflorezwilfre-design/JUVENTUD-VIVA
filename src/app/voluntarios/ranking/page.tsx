import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";
import { Trophy, Star, Medal, Award } from "lucide-react";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function RankingPage() {
  const volunteers = await prisma.volunteer.findMany({
    where: { points: { gt: 0 } },
    orderBy: { points: 'desc' },
    take: 50
  });

  const getRankInfo = (pts: number) => {
    if (pts >= 1000) return { name: "Diamante", color: "from-purple-500 to-pink-500", icon: <Trophy size={24} className="text-white" /> };
    if (pts >= 500) return { name: "Oro", color: "from-yellow-400 to-yellow-600", icon: <Award size={24} className="text-white" /> };
    if (pts >= 200) return { name: "Plata", color: "from-gray-300 to-gray-500", icon: <Medal size={24} className="text-white" /> };
    if (pts >= 50) return { name: "Bronce", color: "from-orange-300 to-orange-600", icon: <Star size={24} className="text-white" /> };
    return { name: "Aspirante", color: "from-gray-700 to-gray-800", icon: <Star size={24} className="text-gray-400" /> };
  };

  return (
    <div className="min-h-screen bg-jv-dark text-white font-sans selection:bg-jv-purple/30 selection:text-white flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-24 px-6 md:px-12 max-w-5xl mx-auto w-full">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-4 bg-jv-purple/10 rounded-full mb-6 border border-jv-purple/20">
            <Trophy className="text-jv-purple" size={40} />
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
            Salón de la <span className="text-transparent bg-clip-text bg-gradient-to-r from-jv-turquoise to-jv-purple">Fama</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Reconocemos a los voluntarios más destacados que con su dedicación y esfuerzo constante hacen posible nuestra labor en La Guajira.
          </p>
        </div>

        <div className="space-y-4">
          {volunteers.map((vol, index) => {
            const rank = getRankInfo(vol.points || 0);
            const isTop3 = index < 3;
            
            return (
              <div 
                key={vol.id} 
                className={`relative flex items-center p-6 rounded-2xl border ${isTop3 ? 'bg-gray-800/80 border-gray-700 shadow-xl transform hover:scale-[1.01] transition-transform' : 'bg-gray-900 border-gray-800'} overflow-hidden`}
              >
                {isTop3 && (
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-jv-turquoise to-jv-purple"></div>
                )}
                
                <div className="w-12 text-2xl font-black text-gray-500 text-center mr-4">
                  #{index + 1}
                </div>

                <div className="relative mr-6">
                  {vol.imageUrl ? (
                    <img src={vol.imageUrl} alt={vol.name} className="w-16 h-16 rounded-full object-cover border-2 border-gray-700" />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-800 border-2 border-gray-700 flex items-center justify-center font-bold text-xl text-gray-500">
                      {vol.name.charAt(0)}
                    </div>
                  )}
                  {isTop3 && (
                    <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br ${rank.color} flex items-center justify-center shadow-lg border-2 border-gray-900`}>
                      <span className="text-xs font-bold text-white">{index + 1}</span>
                    </div>
                  )}
                </div>

                <div className="flex-grow">
                  <h3 className={`font-bold ${isTop3 ? 'text-xl text-white' : 'text-lg text-gray-200'}`}>
                    {vol.name}
                  </h3>
                  <p className="text-sm text-gray-400 truncate max-w-xs md:max-w-md">
                    {vol.skills || "Voluntario Activo"}
                  </p>
                </div>

                <div className="flex flex-col items-end justify-center ml-4">
                  <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${rank.color} mb-2 shadow-lg flex items-center`}>
                    <span className="text-xs font-bold text-white">{rank.name}</span>
                  </div>
                  <div className="font-mono text-jv-turquoise font-bold">
                    {vol.points} <span className="text-xs text-gray-500">pts</span>
                  </div>
                </div>
              </div>
            );
          })}

          {volunteers.length === 0 && (
            <div className="text-center p-12 bg-gray-900 border border-gray-800 rounded-3xl">
              <Star size={48} className="text-gray-700 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Aún no hay puntos asignados</h3>
              <p className="text-gray-400">Pronto verás aquí a nuestros voluntarios más activos.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
