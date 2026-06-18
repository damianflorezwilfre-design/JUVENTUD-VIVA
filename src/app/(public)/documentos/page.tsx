"use client"
export const revalidate = 60;

import { motion } from "framer-motion";
import { FileText, Download, FileSpreadsheet, FileIcon, Search, Eye, Filter } from "lucide-react";
import { useState, useEffect } from "react";

export default function Documentos() {
  const [documentos, setDocumentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

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

  const filteredDocs = documentos.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (doc.description && doc.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === "all" || doc.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="py-20 px-4 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">Documentos <span className="text-transparent bg-clip-text bg-gradient-to-r from-jv-purple to-jv-turquoise">Públicos</span></h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Accede a nuestros informes, convocatorias y formatos de manera rápida y transparente.
        </p>
      </motion.div>

      {/* Buscador y Filtros */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="flex flex-col md:flex-row gap-4 mb-8"
      >
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={20} className="text-gray-500" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-gray-900 border border-gray-800 rounded-2xl text-white focus:border-jv-turquoise focus:outline-none transition-colors"
            placeholder="Buscar por título o palabra clave..."
          />
        </div>
        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Filter size={20} className="text-gray-500" />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-gray-900 border border-gray-800 rounded-2xl text-white focus:border-jv-purple focus:outline-none transition-colors appearance-none"
          >
            <option value="all">Todos los formatos</option>
            <option value="pdf">Documentos PDF</option>
            <option value="excel">Hojas de Cálculo</option>
            <option value="word">Archivos Word</option>
          </select>
        </div>
      </motion.div>

      <div className="bg-gray-900/50 rounded-2xl border border-gray-800 overflow-hidden shadow-xl">
        {loading ? (
          <div className="text-center py-16 text-gray-400 flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-jv-turquoise mb-4"></div>
            Cargando documentos...
          </div>
        ) : filteredDocs.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <FileText size={48} className="mx-auto mb-4 text-gray-700" />
            <p className="text-xl font-semibold text-gray-300">No se encontraron documentos</p>
            <p className="mt-2 text-sm">Intenta buscar con otros términos o filtros.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 divide-y divide-gray-800/50">
            {filteredDocs.map((doc, idx) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="p-6 flex flex-col md:flex-row md:items-center justify-between hover:bg-gray-800/50 transition-all group"
              >
                <div className="flex items-start md:items-center space-x-4 mb-4 md:mb-0">
                  <div className="p-3 bg-gray-800 rounded-xl group-hover:scale-110 transition-transform shadow-lg">
                    {getIcon(doc.type)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-jv-turquoise transition-colors">{doc.title}</h3>
                    {doc.description && (
                      <p className="text-gray-400 text-sm mt-1 mb-2 max-w-xl">{doc.description}</p>
                    )}
                    <div className="flex items-center text-xs font-semibold text-gray-500 mt-1 space-x-3">
                      <span className="uppercase tracking-wider px-2 py-1 bg-gray-800 rounded-md">{doc.type}</span>
                      <span>•</span>
                      <span>{new Date(doc.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 self-end md:self-auto">
                  <a 
                    href={doc.fileUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center justify-center px-4 py-2 rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-300 shadow-sm border border-gray-700"
                    title="Vista Previa"
                  >
                    <Eye size={18} className="mr-2" />
                    <span className="text-sm font-semibold">Ver</span>
                  </a>
                  <a 
                    href={doc.fileUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    download 
                    className="flex items-center justify-center px-4 py-2 rounded-xl bg-jv-purple/10 text-jv-purple hover:bg-jv-purple hover:text-white transition-all duration-300 shadow-sm border border-jv-purple/20"
                    title="Descargar Documento"
                  >
                    <Download size={18} className="mr-2" />
                    <span className="text-sm font-semibold">Descargar</span>
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
