"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Download, Image as ImageIcon, FileText } from "lucide-react";
import OrgChart, { OrgNode } from "@/components/OrgChart";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Document, Packer, Paragraph, ImageRun } from "docx";
import { saveAs } from "file-saver";

export default function AdminOrganigrama() {
  const [nodes, setNodes] = useState<OrgNode[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNode, setEditingNode] = useState<OrgNode | null>(null);
  const [parentId, setParentId] = useState<string | null>(null); // To know where to add a child
  
  // Form state
  const [title, setTitle] = useState("");
  const [name, setName] = useState("");
  const [order, setOrder] = useState(0);

  const fetchNodes = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/organigrama");
      const data = await res.json();
      setNodes(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNodes();
  }, []);

  const openAddModal = (parentId: string | null = null) => {
    setEditingNode(null);
    setParentId(parentId);
    setTitle("");
    setName("");
    setOrder(0);
    setIsModalOpen(true);
  };

  const openEditModal = (node: OrgNode) => {
    setEditingNode(node);
    setParentId(node.parentId);
    setTitle(node.title);
    setName(node.name || "");
    setOrder(node.order || 0);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { title, name, parentId, order };
      
      if (editingNode) {
        await fetch(`/api/organigrama/${editingNode.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      } else {
        await fetch("/api/organigrama", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      }
      setIsModalOpen(false);
      fetchNodes();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar este nodo? Se eliminarán los hijos que dependan de él si no se reasignan (manualmente).")) return;
    try {
      await fetch(`/api/organigrama/${id}`, { method: "DELETE" });
      fetchNodes();
    } catch (e) {
      console.error(e);
    }
  };

  // Export functions
  const captureCanvas = async () => {
    const element = document.getElementById("organigrama-export-container");
    if (!element) return null;
    return await html2canvas(element, { backgroundColor: '#111827', scale: 2 });
  };

  const exportImage = async (format: 'png' | 'jpeg') => {
    const canvas = await captureCanvas();
    if (!canvas) return;
    const imgData = canvas.toDataURL(`image/${format}`);
    const link = document.createElement('a');
    link.href = imgData;
    link.download = `organigrama.${format}`;
    link.click();
  };

  const exportPDF = async () => {
    const canvas = await captureCanvas();
    if (!canvas) return;
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'landscape' });
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, pdfHeight);
    pdf.save("organigrama.pdf");
  };

  const exportWord = async () => {
    const canvas = await captureCanvas();
    if (!canvas) return;
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const arrayBuffer = await blob.arrayBuffer();
      const doc = new Document({
        sections: [{
          properties: {
            // Landscape A4
            page: { size: { width: 16838, height: 11906 } }
          },
          children: [
            new Paragraph({
              children: [
                new ImageRun({
                  data: arrayBuffer,
                  type: "png",
                  transformation: {
                    width: 700,
                    height: (canvas.height * 700) / canvas.width
                  }
                })
              ]
            })
          ]
        }]
      });
      const blobDoc = await Packer.toBlob(doc);
      saveAs(blobDoc, "organigrama.docx");
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Estructura Organizacional</h2>
          <p className="text-gray-400">Construye el organigrama oficial y expórtalo a diferentes formatos.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => exportImage('png')} className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-xl flex items-center text-sm transition-colors border border-gray-700">
            <ImageIcon size={16} className="mr-2" /> PNG
          </button>
          <button onClick={() => exportImage('jpeg')} className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-xl flex items-center text-sm transition-colors border border-gray-700">
            <ImageIcon size={16} className="mr-2" /> JPG
          </button>
          <button onClick={exportPDF} className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-xl flex items-center text-sm transition-colors border border-gray-700">
            <Download size={16} className="mr-2" /> PDF
          </button>
          <button onClick={exportWord} className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-xl flex items-center text-sm transition-colors border border-gray-700">
            <FileText size={16} className="mr-2" /> Word
          </button>
          
          <button onClick={() => openAddModal()} className="bg-jv-purple hover:bg-jv-turquoise text-white px-4 py-2 rounded-xl flex items-center text-sm transition-all shadow-[0_0_10px_rgba(155,28,201,0.3)] ml-2">
            <Plus size={16} className="mr-2" /> Nodo Raíz
          </button>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 overflow-hidden">
        {loading ? (
          <p className="text-gray-400">Cargando organigrama...</p>
        ) : nodes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">No hay estructura definida.</p>
            <button onClick={() => openAddModal()} className="bg-jv-purple px-4 py-2 rounded-xl text-white">Comenzar a crear organigrama</button>
          </div>
        ) : (
          <div>
            <div className="mb-6 pb-6 border-b border-gray-800">
              <h3 className="text-white font-semibold mb-4">Editor Rápido de Nodos</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-300">
                  <thead className="bg-gray-800 text-gray-400">
                    <tr>
                      <th className="px-4 py-2 rounded-tl-lg">Cargo / Título</th>
                      <th className="px-4 py-2">Persona</th>
                      <th className="px-4 py-2">Orden</th>
                      <th className="px-4 py-2 rounded-tr-lg">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {nodes.map(n => (
                      <tr key={n.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                        <td className="px-4 py-3 font-medium">{n.title}</td>
                        <td className="px-4 py-3">{n.name || <span className="text-gray-500 italic">Vacante</span>}</td>
                        <td className="px-4 py-3">{n.order}</td>
                        <td className="px-4 py-3 flex gap-2">
                          <button onClick={() => openEditModal(n)} className="p-1.5 bg-gray-700 text-white rounded hover:bg-jv-purple" title="Editar">
                            <Edit2 size={14} />
                          </button>
                          <button onClick={() => openAddModal(n.id)} className="p-1.5 bg-gray-700 text-white rounded hover:bg-jv-turquoise" title="Añadir Subordinado">
                            <Plus size={14} />
                          </button>
                          <button onClick={() => handleDelete(n.id)} className="p-1.5 bg-gray-700 text-red-400 rounded hover:bg-red-500 hover:text-white" title="Eliminar">
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <h3 className="text-white font-semibold mb-6">Previsualización del Árbol Visual</h3>
            {/* The export container */}
            <div id="organigrama-export-container" className="p-8 bg-gray-900 rounded-xl overflow-x-auto w-full inline-block min-w-max">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-white">Organigrama Institucional</h1>
                <p className="text-gray-400">Juventud ViVa</p>
              </div>
              <OrgChart nodes={nodes} />
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-800">
              <h3 className="text-xl font-bold text-white">{editingNode ? "Editar Nodo" : "Añadir Nodo"}</h3>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Cargo / Título *</label>
                <input required type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Ej: Director General" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-jv-purple" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Nombre de la Persona (Opcional)</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Ej: Juan Pérez" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-jv-purple" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Nodo Superior (Jefe Directo)</label>
                <select value={parentId || ""} onChange={e => setParentId(e.target.value || null)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-jv-purple">
                  <option value="">-- Ninguno (Nodo Raíz) --</option>
                  {nodes.map(n => (
                    <option key={n.id} value={n.id} disabled={editingNode?.id === n.id}>{n.title} {n.name ? `(${n.name})` : ""}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Orden de visualización (Izquierda a Derecha)</label>
                <input type="number" value={order} onChange={e => setOrder(Number(e.target.value))} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-jv-purple" />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-800 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Cancelar</button>
                <button type="submit" className="bg-jv-purple hover:bg-jv-turquoise text-white px-6 py-2 rounded-xl transition-colors shadow-[0_0_15px_rgba(155,28,201,0.3)]">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
