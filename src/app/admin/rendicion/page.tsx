"use client"

import { useState, useEffect } from "react";
import { FileText, Download, FileType2, Building, DollarSign, Users, Briefcase, Calendar } from "lucide-react";

export default function RendicionCuentasPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/rendicion")
      .then(res => res.json())
      .then(resData => {
        setData(resData);
        setLoading(false);
      });
  }, []);

  const formatCurrency = (val: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(val);

  const downloadPDF = async () => {
    try {
      const { jsPDF } = await import("jspdf");
      const html2canvas = (await import("html2canvas")).default;
      
      const doc = new jsPDF('p', 'mm', 'a4');
      
      doc.setFontSize(22);
      doc.setTextColor(0, 0, 0);
      doc.text("Rendición de Cuentas - Juventud Viva", 105, 20, { align: "center" });
      
      doc.setFontSize(12);
      doc.text(`Fecha de generación: ${new Date().toLocaleDateString()}`, 105, 30, { align: "center" });

      doc.setFontSize(16);
      doc.text("1. Resumen de Impacto", 20, 50);
      doc.setFontSize(12);
      doc.text(`Voluntarios Registrados: ${data.volunteers}`, 25, 60);
      doc.text(`Alianzas Estratégicas: ${data.alliances}`, 25, 70);
      doc.text(`Historias / Testimonios: ${data.testimonies}`, 25, 80);

      doc.setFontSize(16);
      doc.text("2. Programas y Eventos", 20, 100);
      doc.setFontSize(12);
      doc.text(`Programas Activos: ${data.programs}`, 25, 110);
      doc.text(`Eventos Realizados: ${data.events}`, 25, 120);
      doc.text(`Padrinazgos Activos: ${data.sponsorships}`, 25, 130);

      doc.setFontSize(16);
      doc.text("3. Estado Financiero", 20, 150);
      doc.setFontSize(12);
      doc.text(`Ingresos Totales: ${formatCurrency(data.finances.ingresos)}`, 25, 160);
      doc.text(`Egresos Totales: ${formatCurrency(data.finances.egresos)}`, 25, 170);
      doc.text(`Saldo Disponible: ${formatCurrency(data.finances.saldo)}`, 25, 180);
      
      doc.save("Rendicion_de_Cuentas_JuventudViva.pdf");
    } catch (e) {
      console.error(e);
      alert("Error al generar PDF");
    }
  };

  const downloadWord = async () => {
    try {
      const { Document, Packer, Paragraph, TextRun, HeadingLevel } = await import("docx");
      const { saveAs } = await import("file-saver");

      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({
              text: "Rendición de Cuentas - Juventud Viva",
              heading: HeadingLevel.HEADING_1,
            }),
            new Paragraph({
              text: `Fecha de generación: ${new Date().toLocaleDateString()}\n`,
            }),
            new Paragraph({ text: "1. Resumen de Impacto", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ children: [new TextRun({ text: `Voluntarios Registrados: ${data.volunteers}` })] }),
            new Paragraph({ children: [new TextRun({ text: `Alianzas Estratégicas: ${data.alliances}` })] }),
            new Paragraph({ children: [new TextRun({ text: `Historias / Testimonios: ${data.testimonies}` })] }),
            
            new Paragraph({ text: "2. Programas y Eventos", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ children: [new TextRun({ text: `Programas Activos: ${data.programs}` })] }),
            new Paragraph({ children: [new TextRun({ text: `Eventos Realizados: ${data.events}` })] }),
            new Paragraph({ children: [new TextRun({ text: `Padrinazgos Activos: ${data.sponsorships}` })] }),

            new Paragraph({ text: "3. Estado Financiero", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ children: [new TextRun({ text: `Ingresos Totales: ${formatCurrency(data.finances.ingresos)}` })] }),
            new Paragraph({ children: [new TextRun({ text: `Egresos Totales: ${formatCurrency(data.finances.egresos)}` })] }),
            new Paragraph({ children: [new TextRun({ text: `Saldo Disponible: ${formatCurrency(data.finances.saldo)}` })] }),
          ],
        }],
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, "Rendicion_de_Cuentas_JuventudViva.docx");
    } catch (e) {
      console.error(e);
      alert("Error al generar Word");
    }
  };

  if (loading) return <div className="text-white">Cargando métricas...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Rendición de Cuentas</h2>
          <p className="text-gray-400">Genera reportes gerenciales automáticos con la información de la web.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={downloadPDF} className="bg-red-500/10 text-red-500 border border-red-500/30 hover:bg-red-500 hover:text-white px-4 py-2 rounded-xl transition-colors font-semibold flex items-center gap-2">
            <FileType2 size={20} />
            <span>Descargar PDF</span>
          </button>
          <button onClick={downloadWord} className="bg-blue-500/10 text-blue-500 border border-blue-500/30 hover:bg-blue-500 hover:text-white px-4 py-2 rounded-xl transition-colors font-semibold flex items-center gap-2">
            <FileText size={20} />
            <span>Descargar Word</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Volunteers & Community */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
             <Users size={100} />
          </div>
          <div className="flex items-center space-x-3 mb-4">
             <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-500 flex items-center justify-center">
               <Users size={20} />
             </div>
             <h3 className="font-semibold text-white">Comunidad</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Voluntarios Registrados</span>
              <span className="text-white font-bold">{data?.volunteers}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Alianzas</span>
              <span className="text-white font-bold">{data?.alliances}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Testimonios</span>
              <span className="text-white font-bold">{data?.testimonies}</span>
            </div>
          </div>
        </div>

        {/* Programs & Events */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
             <Briefcase size={100} />
          </div>
          <div className="flex items-center space-x-3 mb-4">
             <div className="w-10 h-10 rounded-xl bg-jv-turquoise/20 text-jv-turquoise flex items-center justify-center">
               <Calendar size={20} />
             </div>
             <h3 className="font-semibold text-white">Operaciones</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Programas</span>
              <span className="text-white font-bold">{data?.programs}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Eventos</span>
              <span className="text-white font-bold">{data?.events}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Padrinazgos</span>
              <span className="text-white font-bold">{data?.sponsorships}</span>
            </div>
          </div>
        </div>

        {/* Finances */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
             <DollarSign size={100} />
          </div>
          <div className="flex items-center space-x-3 mb-4">
             <div className="w-10 h-10 rounded-xl bg-green-500/20 text-green-500 flex items-center justify-center">
               <DollarSign size={20} />
             </div>
             <h3 className="font-semibold text-white">Finanzas</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Ingresos</span>
              <span className="text-green-400 font-bold">{formatCurrency(data?.finances?.ingresos || 0)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Egresos</span>
              <span className="text-red-400 font-bold">{formatCurrency(data?.finances?.egresos || 0)}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-800">
              <span className="text-white font-medium">Saldo</span>
              <span className="text-white font-bold">{formatCurrency(data?.finances?.saldo || 0)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-jv-purple/10 border border-jv-purple/20 p-6 rounded-2xl flex flex-col items-center justify-center text-center">
        <Building size={48} className="text-jv-purple mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Generación Automática</h3>
        <p className="text-gray-400 max-w-2xl">
          El reporte consolidará todos estos datos en un formato formal y limpio que podrás presentar de manera transparente.
          Usa los botones superiores para descargar el archivo en el formato que mejor se adapte a tus necesidades.
        </p>
      </div>
    </div>
  );
}
