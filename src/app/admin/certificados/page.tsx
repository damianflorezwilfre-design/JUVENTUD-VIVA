"use client"

import { useState, useRef } from "react";
import { Download, FileText, CheckCircle, GraduationCap, Image as ImageIcon } from "lucide-react";
import { Document, Packer, Paragraph, TextRun, AlignmentType, ImageRun } from "docx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";

export default function AdminCertificados() {
  const [name, setName] = useState("");
  const [docType, setDocType] = useState("Cédula de Ciudadanía");
  const [docNumber, setDocNumber] = useState("");
  const [certificateType, setCertificateType] = useState("Estudiantil");
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

  const getIntroText = () => {
    if (certificateType === "Estudiantil") {
      return "Por medio del presente documento, la Organización Juventud ViVa, con sede en Villanueva, Colombia, certifica que el/la joven:";
    }
    return "Por medio del presente documento, la Organización Juventud ViVa, con sede en Villanueva, Colombia, certifica que la persona natural:";
  };

  const getBodyText = () => {
    if (certificateType === "Estudiantil") {
      return `cumplió satisfactoriamente las horas de servicio social estudiantil obligatorio con Juventud ViVa, en actividades de impacto comunitario, conforme a lo establecido por la normativa educativa vigente.`;
    }
    return `participó activa y satisfactoriamente como voluntario/a en actividades de impacto comunitario desarrolladas por Juventud ViVa, demostrando compromiso, responsabilidad y vocación de servicio.`;
  };

  const getTitle = () => {
    return certificateType === "Estudiantil" 
      ? "CERTIFICADO DE SERVICIO SOCIAL ESTUDIANTIL"
      : "CERTIFICADO DE VOLUNTARIADO Y SERVICIO COMUNITARIO";
  };

  const generateWord = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Fetch logo
      const logoRes = await fetch("/logo/juventud-viva.png");
      const logoBuffer = await logoRes.arrayBuffer();

      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 200 },
                children: [
                  new ImageRun({
                    data: logoBuffer,
                    type: "png",
                    transformation: {
                      width: 150,
                      height: 150,
                    },
                  }),
                ]
              }),
              new Paragraph({
                text: "ORGANIZACIÓN\nJuventud ViVa\nVillanueva, Colombia  ·  Reforma: Juventud ViVa",
                alignment: AlignmentType.CENTER,
                spacing: { after: 400 },
              }),
              new Paragraph({
                text: getTitle(),
                heading: "Heading1",
                alignment: AlignmentType.CENTER,
                spacing: { after: 400, before: 400 },
              }),
              new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                spacing: { line: 360, after: 200 },
                children: [
                  new TextRun({
                    text: getIntroText(),
                    size: 24,
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 200, after: 100 },
                children: [
                  new TextRun({
                    text: name.toUpperCase(),
                    bold: true,
                    size: 24,
                  }),
                ]
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 200 },
                children: [
                  new TextRun({
                    text: `${docType}: ${docNumber}`,
                    size: 24,
                  }),
                ]
              }),
              new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                spacing: { line: 360, after: 400 },
                children: [
                  new TextRun({
                    text: getBodyText(),
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
                  new TextRun({ text: "• Fecha de actividad: ", bold: true, size: 24 }),
                  new TextRun({ text: date, size: 24 })
                ]
              }),
              new Paragraph({
                spacing: { after: 100 },
                children: [
                  new TextRun({ text: "• Actividad / Labor: ", bold: true, size: 24 }),
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
                spacing: { after: 400 },
                children: [
                  new TextRun({ text: "Se expide este certificado a solicitud del interesado/a, para los fines que considere pertinentes.", size: 24 })
                ]
              }),
              new Paragraph({
                spacing: { before: 800, after: 100 },
                children: [
                  new TextRun({ text: "_______________________________", size: 24 })
                ]
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: leader, bold: true, size: 24 }),
                ]
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: "Director / Representante Legal", size: 24 }),
                ]
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: "Organización Juventud ViVa", size: 24 }),
                ]
              })
            ],
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, `Certificado_${certificateType}_${name.replace(/\s+/g, '_')}.docx`);

    } catch (error) {
      console.error(error);
      alert("Hubo un error al generar el certificado en Word.");
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = async () => {
    setLoading(true);
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      const logoImg = new window.Image();
      logoImg.src = "/logo/juventud-viva.png";
      await new Promise((resolve) => {
        logoImg.onload = resolve;
        logoImg.onerror = resolve;
      });

      // Header Logo
      try {
        doc.addImage(logoImg, "PNG", 85, 10, 40, 40);
      } catch (e) {
        console.error("Error adding logo", e);
      }

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text("ORGANIZACIÓN\nJuventud ViVa\nVillanueva, Colombia  ·  Reforma: Juventud ViVa", 105, 55, { align: "center" });

      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text(getTitle(), 105, 80, { align: "center" });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      
      const introLines = doc.splitTextToSize(getIntroText(), 150);
      doc.text(introLines, 30, 100);

      let currentY = 100 + (introLines.length * 6) + 10;
      
      doc.setFont("helvetica", "bold");
      doc.text(name.toUpperCase(), 105, currentY, { align: "center" });
      currentY += 6;
      
      doc.setFont("helvetica", "normal");
      doc.text(`${docType}: ${docNumber}`, 105, currentY, { align: "center" });
      currentY += 10;

      const bodyLines = doc.splitTextToSize(getBodyText(), 150);
      doc.text(bodyLines, 30, currentY);
      
      currentY += (bodyLines.length * 6) + 10;

      doc.setFont("helvetica", "bold");
      doc.text("Detalles de la Actividad:", 30, currentY);
      currentY += 8;
      
      doc.setFont("helvetica", "normal");
      doc.text(`• Fecha de actividad: ${date}`, 30, currentY);
      currentY += 8;
      
      const activityLines = doc.splitTextToSize(`• Actividad / Labor: ${activity}`, 150);
      doc.text(activityLines, 30, currentY);
      currentY += (activityLines.length * 6) + 2;

      doc.text(`• Horas cumplidas: ${hours}`, 30, currentY);
      currentY += 15;

      const footerLines = doc.splitTextToSize("Se expide este certificado a solicitud del interesado/a, para los fines que considere pertinentes.", 150);
      doc.text(footerLines, 30, currentY);

      currentY += 30;

      doc.text("_______________________________", 30, currentY);
      doc.setFont("helvetica", "bold");
      doc.text(leader, 30, currentY + 6);
      doc.setFont("helvetica", "normal");
      doc.text("Director / Representante Legal", 30, currentY + 12);
      doc.text("Organización Juventud ViVa", 30, currentY + 18);

      if (signature) {
        // Adjust Y based on signature size
        doc.addImage(signature, "PNG", 35, currentY - 20, 45, 15);
      }

      doc.save(`Certificado_${certificateType}_${name.replace(/\s+/g, '_')}.pdf`);

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
          <p className="text-gray-400">Emite certificados de servicio social o voluntariado.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center mb-6 border-b border-gray-800 pb-4">
            <GraduationCap className="text-jv-purple mr-3" size={24} />
            <h3 className="text-xl font-semibold text-white">Datos del Estudiante / Voluntario</h3>
          </div>
          
          <form onSubmit={generateWord} className="space-y-4">
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Tipo de Certificado</label>
                <select 
                  value={certificateType} 
                  onChange={(e) => setCertificateType(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none"
                >
                  <option value="Estudiantil">Estudiantil (Servicio Social)</option>
                  <option value="Voluntariado">Voluntariado / Comunitario</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Nombre Completo</label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Juan Pérez"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Tipo de Documento</label>
                <select 
                  value={docType} 
                  onChange={(e) => setDocType(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none"
                >
                  <option value="Cédula de Ciudadanía">Cédula de Ciudadanía</option>
                  <option value="Tarjeta de Identidad">Tarjeta de Identidad</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Número de Documento</label>
                <input 
                  type="text" 
                  required
                  value={docNumber}
                  onChange={(e) => setDocNumber(e.target.value)}
                  placeholder="Ej. 1.234.567.890"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none" 
                />
              </div>
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
                placeholder="Ej. Logística comunitaria"
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
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
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
            Al hacer clic en descargar, se generará el certificado de {certificateType === 'Estudiantil' ? 'Servicio Social' : 'Voluntariado'} con los márgenes, fuentes y formatos oficiales listos para imprimir y firmar.
          </p>
          
          <div className="flex space-x-4 text-sm text-gray-400">
            <span className="flex items-center"><CheckCircle size={14} className="text-green-500 mr-1" /> Formato .docx</span>
            <span className="flex items-center"><CheckCircle size={14} className="text-green-500 mr-1" /> Formato .pdf</span>
          </div>
        </div>
      </div>
    </div>
  );
}
