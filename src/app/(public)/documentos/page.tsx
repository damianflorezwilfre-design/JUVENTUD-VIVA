"use client"
export const dynamic = "force-dynamic";

import { motion } from "framer-motion";
import { FileText, Download, FileSpreadsheet, FileIcon } from "lucide-react";
import { useState, useEffect } from "react";

export default function Documentos() {
  const [documentos, setDocumentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/documentos")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setDocumentos(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case "pdf": return <FileText className="text-red-400" size={32} />;
      case "excel": return <FileSpreadsheet className="text-green-400" size={32} />;
      case "word": return <FileIcon className="text-blue-400" size={32} />;
      default: return <FileText className="text-gray-400" size={32} />;
    }
  };

  return (
    <div className="py-20 px-4 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">Documentos <span className="text-transparent bg-clip-text bg-gradient-to-r from-jv-purple to-jv-turquoise">Públicos</span></h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Accede a nuestros informes, convocatorias y formatos de manera rápida y transparente.
        </p>
      </motion.div>

      <div className="bg-gray-900/50 rounded-2xl border border-gray-800 overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-gray-400">Cargando documentos...</div>
        ) : documentos.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No hay documentos públicos disponibles por el momento.</div>
        ) : (
          <div className="grid grid-cols-1 divide-y divide-gray-800">
            {documentos.map((doc, idx) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="p-6 flex items-center justify-between hover:bg-gray-800/50 transition-colors group"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gray-800 rounded-xl group-hover:scale-110 transition-transform">
                    {getIcon(doc.type)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-jv-turquoise transition-colors">{doc.title}</h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1 space-x-4">
                      <span>{new Date(doc.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                  </div>
                </div>
                <a 
                  href={doc.fileUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  download 
                  className="flex items-center justify-center p-3 rounded-full bg-jv-purple/10 text-jv-purple hover:bg-jv-purple hover:text-white transition-all duration-300"
                >
                  <Download size={20} />
                </a>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
