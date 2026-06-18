import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";
import { Heart, Building2, ExternalLink } from "lucide-react";
import Link from "next/link";
import ImpactCalculator from "@/components/ImpactCalculator";

export const revalidate = 60;

export default async function DonacionesPage() {
  const institution = await prisma.institution.findUnique({
    where: { id: "singleton" }
  });

  return (
    <div className="min-h-screen bg-jv-dark text-white font-sans selection:bg-jv-purple/30 selection:text-white flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
            Haz una <span className="text-transparent bg-clip-text bg-gradient-to-r from-jv-turquoise to-jv-purple">Donación</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            Tu aporte nos permite continuar transformando vidas en La Guajira. Cada donación cuenta.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/certificados"
              className="bg-gray-800 hover:bg-gray-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors border border-gray-700"
            >
              Descargar Certificado Tributario
            </Link>
            <Link 
              href="/apadrina"
              className="bg-jv-turquoise/10 hover:bg-jv-turquoise/20 text-jv-turquoise font-semibold px-6 py-3 rounded-xl transition-colors border border-jv-turquoise/30"
            >
              Ver Causas de Padrinazgo
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-16">
          {/* Calculadora */}
          <div>
            <ImpactCalculator 
              calcKitCost={institution?.calcKitCost || 50000} 
              calcMealCost={institution?.calcMealCost || 15000} 
              calcMarketCost={institution?.calcMarketCost || 100000} 
              calcSuppliesCost={institution?.calcSuppliesCost || 30000} 
            />
          </div>

          {/* Medios de Pago */}
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-6">Medios de Aporte</h3>
            
            <div className="space-y-6">
              {institution?.donationLink && (
                <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
                  <div className="flex items-center mb-4">
                    <Heart className="text-red-400 mr-3" size={24} />
                    <h4 className="text-lg font-bold text-white">Donación en Línea</h4>
                  </div>
                  <p className="text-gray-400 mb-4 text-sm">
                    Aporta de manera rápida y segura utilizando tarjeta de crédito, débito o PSE a través de nuestra pasarela de pagos.
                  </p>
                  <a 
                    href={institution.donationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-jv-turquoise hover:bg-white text-jv-dark font-bold px-4 py-3 rounded-xl transition-all shadow-lg flex items-center justify-center"
                  >
                    Donar Ahora <ExternalLink size={18} className="ml-2" />
                  </a>
                </div>
              )}

              {institution?.bankInfo && (
                <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
                  <div className="flex items-center mb-4">
                    <Building2 className="text-jv-purple mr-3" size={24} />
                    <h4 className="text-lg font-bold text-white">Transferencia Bancaria</h4>
                  </div>
                  <p className="text-gray-400 mb-4 text-sm">
                    Puedes hacer una consignación directa a nuestras cuentas oficiales. Por favor envía el comprobante a nuestro correo para generar tu certificado.
                  </p>
                  <div className="bg-gray-900 p-4 rounded-xl border border-gray-700/50">
                    <pre className="text-sm font-mono text-gray-300 whitespace-pre-wrap">{institution.bankInfo}</pre>
                  </div>
                </div>
              )}

              {institution?.donationQrUrl && (
                <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
                  <div className="flex items-center mb-4">
                    <Building2 className="text-jv-turquoise mr-3" size={24} />
                    <h4 className="text-lg font-bold text-white">Código QR</h4>
                  </div>
                  <p className="text-gray-400 mb-4 text-sm">
                    Escanea este código con la aplicación de tu banco o billetera virtual (ej. Nequi, Daviplata, Bancolombia) para realizar tu aporte rápidamente.
                  </p>
                  <div className="flex justify-center bg-gray-900 p-4 rounded-xl border border-gray-700/50">
                    <img 
                      src={institution.donationQrUrl} 
                      alt="Código QR de Donación" 
                      className="max-w-full h-auto max-h-64 object-contain rounded-lg"
                    />
                  </div>
                </div>
              )}

              {!institution?.donationLink && !institution?.bankInfo && !institution?.donationQrUrl && (
                <div className="text-gray-500 text-center py-8">
                  Pronto habilitaremos nuestros canales de donación. ¡Gracias por tu interés!
                </div>
              )}
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
