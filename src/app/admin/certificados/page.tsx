"use client"

import { useState, useRef } from "react";
import { Download, FileText, CheckCircle, GraduationCap, Image as ImageIcon } from "lucide-react";
import { Document, Packer, Paragraph, TextRun, AlignmentType, ImageRun } from "docx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";

export default function AdminCertificados() {
  const [name, setName] = useState("");
  const [hours, setHours] = useState("");
  const [activity, setActivity] = useState("");
  const [date, setDate] = useState("");
  const [leader, setLeader] = useState("Damian Florez");
  const [signature, setSignature] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSignature(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateWord = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              new Paragraph({
                text: "CERTIFICADO DE SERVICIO SOCIAL ESTUDIANTIL OBLIGATORIO",
                heading: "Heading1",
                alignment: AlignmentType.CENTER,
                spacing: { after: 400, before: 400 },
              }),
              new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                spacing: { line: 360, after: 400 },
                children: [
                  new TextRun({
                    text: "Por medio del presente documento, la Fundación Juventud ViVa certifica que el/la joven ",
                    size: 24,
                  }),
                  new TextRun({
                    text: name.toUpperCase(),
                    bold: true,
                    size: 24,
                  }),
                  new TextRun({
                    text: " cumplió satisfactoriamente ",
                    size: 24,
                  }),
                  new TextRun({
                    text: `${hours} horas`,
                    bold: true,
                    size: 24,
                  }),
                  new TextRun({
                    text: " de servicio social estudiantil obligatorio con Juventud ViVa, en actividades de impacto comunitario.",
                    size: 24,
                  }),
                ],
              }),
              new Paragraph({
                spacing: { after: 200 },
                children: [
                  new TextRun({ text: "Detalles de la Actividad:", bold: true, size: 24 })
                ]
              }),
              new Paragraph({
                spacing: { after: 100 },
                children: [
                  new TextRun({ text: "• Fecha: ", bold: true, size: 24 }),
                  new TextRun({ text: date, size: 24 })
                ]
              }),
              new Paragraph({
                spacing: { after: 100 },
                children: [
                  new TextRun({ text: "• Labor / Actividad: ", bold: true, size: 24 }),
                  new TextRun({ text: activity, size: 24 })
                ]
              }),
              new Paragraph({
                spacing: { after: 400 },
                children: [
                  new TextRun({ text: "• Horas cumplidas: ", bold: true, size: 24 }),
                  new TextRun({ text: hours, size: 24 })
                ]
              }),
              new Paragraph({
                spacing: { before: 1000, after: 100 },
                children: [
                  new TextRun({ text: "_______________________________________", size: 24 })
                ]
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: "Firma del líder ViVa", bold: true, size: 24 }),
                ]
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: leader, size: 24 }),
                ]
              })
            ],
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, `Certificado_Servicio_Social_${name.replace(/\s+/g, '_')}.docx`);

    } catch (error) {
      console.error(error);
      alert("Hubo un error al generar el certificado en Word.");
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = () => {
    setLoading(true);
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("CERTIFICADO DE SERVICIO SOCIAL ESTUDIANTIL OBLIGATORIO", 105, 40, { align: "center" });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      const text = `Por medio del presente documento, la Fundación Juventud ViVa certifica que el/la joven ${name.toUpperCase()} cumplió satisfactoriamente ${hours} horas de servicio social estudiantil obligatorio con Juventud ViVa, en actividades de impacto comunitario.`;
      
      const lines = doc.splitTextToSize(text, 150);
      doc.text(lines, 30, 70);

      doc.setFont("helvetica", "bold");
      doc.text("Detalles de la Actividad:", 30, 100);
      
      doc.setFont("helvetica", "normal");
      doc.text(`• Fecha: ${date}`, 30, 110);
      
      const activityLines = doc.splitTextToSize(`• Labor / Actividad: ${activity}`, 150);
      doc.text(activityLines, 30, 120);

      const offset = 120 + (activityLines.length * 7);
      doc.setFont("helvetica", "bold");
      doc.text(`• Horas cumplidas: ${hours}`, 30, offset);

      doc.text("_______________________________________", 30, offset + 40);
      doc.text("Firma del líder ViVa", 30, offset + 48);
      doc.text(leader, 30, offset + 56);

      if (signature) {
        doc.addImage(signature, "PNG", 35, offset + 20, 50, 20); // Ajusta tamaño y posición según necesidad
      }

      doc.save(`Certificado_${name.replace(/\s+/g, '_')}.pdf`);

    } catch (error) {
      console.error(error);
      alert("Hubo un error al generar el certificado en PDF.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Generador de Certificados</h2>
          <p className="text-gray-400">Emite certificados de servicio social estudiantil en formato Word.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center mb-6 border-b border-gray-800 pb-4">
            <GraduationCap className="text-jv-purple mr-3" size={24} />
            <h3 className="text-xl font-semibold text-white">Datos del Estudiante</h3>
          </div>
          
          <form onSubmit={generateWord} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Nombre Completo del Joven</label>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Juan Pérez"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none" 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Horas Cumplidas</label>
                <input 
                  type="number" 
                  required
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  placeholder="Ej. 80"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Fecha</label>
                <input 
                  type="date" 
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Labor / Actividad Realizada</label>
              <textarea 
                required
                rows={3}
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                placeholder="Ej. Apoyo logístico en la jornada de reforestación y recolección de residuos..."
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none resize-none" 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Nombre del Líder (Firma)</label>
                <input 
                  type="text" 
                  required
                  value={leader}
                  onChange={(e) => setLeader(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Firma Digital (Opcional)</label>
                <div className="relative">
                  <input 
                    type="file" 
                    accept="image/png, image/jpeg"
                    onChange={handleSignatureUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  />
                  <div className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white flex items-center justify-between">
                    <span className="truncate text-sm text-gray-400">{signature ? "Firma cargada" : "Subir imagen..."}</span>
                    <ImageIcon size={18} className="text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <button 
                type="submit"
                disabled={loading || !name}
                className="flex-1 bg-jv-purple hover:bg-jv-turquoise text-white px-4 py-3 rounded-xl flex items-center justify-center transition-all duration-300 font-semibold shadow-[0_0_15px_rgba(155,28,201,0.3)] disabled:opacity-50 text-sm"
              >
                <Download size={18} className="mr-2" />
                Descargar en Word
              </button>
              <button 
                type="button"
                onClick={generatePDF}
                disabled={loading || !name}
                className="flex-1 bg-red-500 hover:bg-red-400 text-white px-4 py-3 rounded-xl flex items-center justify-center transition-all duration-300 font-semibold shadow-[0_0_15px_rgba(239,68,68,0.3)] disabled:opacity-50 text-sm"
              >
                <FileText size={18} className="mr-2" />
                Descargar en PDF
              </button>
            </div>
          </form>
        </div>

        {/* Preview Panel */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 relative overflow-hidden flex flex-col items-center justify-center text-center">
          <FileText size={80} className="text-gray-600 mb-4" />
          <h3 className="text-xl font-medium text-gray-300 mb-2">Vista Previa Inactiva</h3>
          <p className="text-gray-500 max-w-sm mb-6">
            Al hacer clic en descargar, se generará un archivo .docx editable con los márgenes, fuentes y formatos oficiales listos para imprimir y firmar.
          </p>
          
          <div className="flex space-x-4 text-sm text-gray-400">
            <span className="flex items-center"><CheckCircle size={14} className="text-green-500 mr-1" /> Formato .docx</span>
            <span className="flex items-center"><CheckCircle size={14} className="text-green-500 mr-1" /> Formato .pdf</span>
            <span className="flex items-center"><CheckCircle size={14} className="text-green-500 mr-1" /> Listo para imprimir</span>
          </div>
        </div>
      </div>
    </div>
  );
}
