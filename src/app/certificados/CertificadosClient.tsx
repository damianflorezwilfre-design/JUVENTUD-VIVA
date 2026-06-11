"use client"

import { useState, useRef } from "react";
import { Search, Download, FileText, CheckCircle } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { motion } from "framer-motion";

export default function CertificadosClient() {
  const [documento, setDocumento] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ records: any[], totalDonated: number } | null>(null);
  const [error, setError] = useState("");
  
  const certificateRef = useRef<HTMLDivElement>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!documento) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(`/api/certificados?document=${documento}`);
      const data = await res.json();

      if (res.ok) {
        setResult(data);
      } else {
        setError(data.error || "Error al buscar");
      }
    } catch (e) {
      setError("Error de red");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!certificateRef.current) return;
    
    try {
      const canvas = await html2canvas(certificateRef.current, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4"
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Certificado_Donacion_${documento}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Hubo un error al generar el PDF.");
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(val);
  };

  return (
    <main className="pt-32 pb-24 px-6 md:px-12 max-w-5xl mx-auto min-h-[80vh]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center justify-center p-3 bg-jv-purple/10 rounded-full mb-4">
          <FileText className="text-jv-purple" size={32} />
        </div>
        <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Certificados de <span className="text-transparent bg-clip-text bg-gradient-to-r from-jv-turquoise to-jv-purple">Donación</span></h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Descarga el certificado de las donaciones que has realizado a Juventud ViVa para tus beneficios tributarios.
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-gray-900 border border-gray-800 rounded-2xl p-6 md:p-8 shadow-2xl max-w-2xl mx-auto mb-12"
      >
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <label className="block text-sm font-medium text-gray-400 mb-2">NIT o Cédula de Ciudadanía</label>
            <input 
              type="text" 
              value={documento}
              onChange={e => setDocumento(e.target.value)}
              placeholder="Ej. 1234567890"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-jv-turquoise focus:outline-none transition-colors font-mono"
              required
            />
          </div>
          <div className="flex items-end">
            <button 
              type="submit"
              disabled={loading}
              className="w-full md:w-auto bg-gradient-to-r from-jv-turquoise to-blue-500 hover:from-blue-400 hover:to-jv-turquoise text-jv-dark font-bold px-8 py-3 rounded-xl transition-all shadow-lg flex items-center justify-center disabled:opacity-50"
            >
              {loading ? "Buscando..." : <><Search size={20} className="mr-2" /> Buscar</>}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-center">
            {error}
          </div>
        )}
      </motion.div>

      {result && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center"
        >
          <div className="mb-6 flex space-x-4">
            <button 
              onClick={handleDownloadPDF}
              className="bg-jv-purple hover:bg-jv-turquoise text-white hover:text-jv-dark font-bold px-6 py-3 rounded-xl transition-all shadow-lg flex items-center"
            >
              <Download size={20} className="mr-2" />
              Descargar PDF
            </button>
          </div>

          {/* Certificado Oculto/Visible para renderizar */}
          <div className="w-full max-w-[297mm] overflow-x-auto pb-8">
            <div 
              ref={certificateRef}
              className="bg-white text-gray-900 w-[297mm] h-[210mm] p-16 relative flex flex-col items-center justify-center mx-auto shadow-2xl border border-gray-200"
              style={{ backgroundImage: "radial-gradient(#f3f4f6 1px, transparent 1px)", backgroundSize: "20px 20px" }}
            >
              <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-r from-jv-turquoise to-jv-purple"></div>
              <div className="absolute bottom-0 left-0 w-full h-4 bg-gradient-to-r from-jv-purple to-jv-turquoise"></div>
              
              <div className="text-center mb-8">
                <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">FUNDACIÓN JUVENTUD VIVA</h1>
                <p className="text-gray-500">NIT: 901.456.789-0</p>
              </div>

              <div className="flex items-center justify-center mb-8">
                <CheckCircle className="text-jv-turquoise mr-3" size={40} />
                <h2 className="text-3xl font-bold text-gray-800">CERTIFICADO DE DONACIÓN</h2>
              </div>

              <div className="text-center max-w-3xl mb-12 text-lg leading-relaxed text-gray-700">
                Certificamos que el donante con documento de identidad / NIT <span className="font-bold">"{documento}"</span>, ha realizado aportes voluntarios a nuestra organización durante el año en curso, sumando un total de:
              </div>

              <div className="text-5xl font-black text-jv-purple mb-12">
                {formatCurrency(result.totalDonated)}
              </div>

              <div className="text-center text-gray-600 max-w-3xl mb-16">
                Estos recursos han sido destinados exclusivamente al desarrollo de nuestros programas sociales en La Guajira, contribuyendo a la nutrición, educación y empoderamiento de nuestras comunidades.
              </div>

              <div className="flex justify-between w-full max-w-4xl mt-auto pt-8 border-t-2 border-gray-200 px-4">
                <div className="text-center">
                  <div className="w-40 h-px bg-gray-400 mb-2 mx-auto"></div>
                  <p className="font-bold text-gray-800">Representante Legal</p>
                  <p className="text-sm text-gray-500">Fundación Juventud ViVa</p>
                </div>
                <div className="text-center">
                  <div className="w-40 h-px bg-gray-400 mb-2 mx-auto"></div>
                  <p className="font-bold text-gray-800">Tesorero/a</p>
                  <p className="text-sm text-gray-500">Fundación Juventud ViVa</p>
                </div>
                <div className="text-center">
                  <p className="font-medium text-gray-600">Expedido el:</p>
                  <p className="font-bold text-gray-800">{new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </main>
  );
}
