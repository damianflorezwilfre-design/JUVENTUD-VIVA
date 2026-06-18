import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CertificadosClient from "./CertificadosClient";

export const dynamic = "force-dynamic";

export default function CertificadosPage() {
  return (
    <div className="min-h-screen bg-jv-dark text-white font-sans selection:bg-jv-purple/30 selection:text-white flex flex-col">
      <Navbar />
      <CertificadosClient />
      <Footer />
    </div>
  );
}
