"use client"

import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Clock, AlertTriangle, Eye } from "lucide-react";
import { motion } from "framer-motion";

type EditRequest = {
  id: string;
  user: { username: string };
  action: string;
  modelName: string;
  recordId: string;
  proposedData: string | null;
  status: string;
  createdAt: string;
};

export default function AdminSolicitudes() {
  const [requests, setRequests] = useState<EditRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewData, setViewData] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/solicitudes");
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (requestId: string, action: "APPROVE" | "REJECT") => {
    if (!confirm(`¿Estás seguro de ${action === 'APPROVE' ? 'APROBAR' : 'RECHAZAR'} esta solicitud?`)) return;

    try {
      const res = await fetch("/api/solicitudes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, action })
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        fetchRequests();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (e) {
      console.error(e);
      alert("Error al procesar la solicitud");
    }
  };

  const translateModel = (model: string) => {
    const dict: Record<string, string> = {
      'News': 'Noticia',
      'Gallery': 'Galería',
      'Document': 'Documento',
      'Program': 'Programa',
      'Alliance': 'Alianza',
      'RoadmapAction': 'Acción de Hoja de Ruta',
      'Institution': 'Configuración Institucional'
    };
    return dict[model] || model;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Buzón de Solicitudes</h2>
          <p className="text-gray-400">Aprueba o rechaza los cambios propuestos por los editores</p>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-800/50 border-b border-gray-800">
                <th className="p-4 text-sm font-semibold text-gray-300">Editor</th>
                <th className="p-4 text-sm font-semibold text-gray-300">Tipo de Cambio</th>
                <th className="p-4 text-sm font-semibold text-gray-300">Módulo</th>
                <th className="p-4 text-sm font-semibold text-gray-300">Fecha</th>
                <th className="p-4 text-sm font-semibold text-gray-300">Estado</th>
                <th className="p-4 text-sm font-semibold text-gray-300 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">Cargando solicitudes...</td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">No hay solicitudes pendientes.</td>
                </tr>
              ) : (
                requests.map((req) => (
                  <tr key={req.id} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
                    <td className="p-4 text-white font-medium">
                      {req.user?.username || 'Desconocido'}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${req.action === 'DELETE' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                        {req.action === 'DELETE' ? 'ELIMINAR' : 'EDITAR'}
                      </span>
                    </td>
                    <td className="p-4 text-gray-400 text-sm">
                      {translateModel(req.modelName)}
                    </td>
                    <td className="p-4 text-gray-400 text-sm">
                      {new Date(req.createdAt).toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold flex items-center w-max ${
                        req.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-500' :
                        req.status === 'APPROVED' ? 'bg-green-500/20 text-green-400' :
                        'bg-gray-700 text-gray-400'
                      }`}>
                        {req.status === 'PENDING' && <Clock size={12} className="mr-1" />}
                        {req.status === 'APPROVED' && <CheckCircle size={12} className="mr-1" />}
                        {req.status === 'REJECTED' && <XCircle size={12} className="mr-1" />}
                        {req.status === 'PENDING' ? 'Pendiente' : req.status === 'APPROVED' ? 'Aprobado' : 'Rechazado'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end space-x-2">
                        {req.proposedData && (
                          <button onClick={() => setViewData(req.proposedData)} className="p-2 bg-gray-800 text-gray-400 hover:text-white rounded-lg transition-colors" title="Ver Datos Propuestos">
                            <Eye size={16} />
                          </button>
                        )}
                        {req.status === 'PENDING' && (
                          <>
                            <button onClick={() => handleAction(req.id, 'APPROVE')} className="p-2 bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-white rounded-lg transition-colors" title="Aprobar">
                              <CheckCircle size={16} />
                            </button>
                            <button onClick={() => handleAction(req.id, 'REJECT')} className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-colors" title="Rechazar">
                              <XCircle size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {viewData && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-gray-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Datos Propuestos (JSON)</h3>
              <button onClick={() => setViewData(null)} className="text-gray-400 hover:text-white transition-colors">
                <XCircle size={24} />
              </button>
            </div>
            <div className="p-6 overflow-auto max-h-[60vh]">
              <pre className="text-sm text-green-400 bg-black p-4 rounded-lg overflow-x-auto">
                {JSON.stringify(JSON.parse(viewData), null, 2)}
              </pre>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
