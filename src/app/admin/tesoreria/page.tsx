"use client"

import { useState, useEffect } from "react";
import { DollarSign, PlusCircle, TrendingUp, TrendingDown, Calendar, FileText, Download } from "lucide-react";
import { motion } from "framer-motion";

type FinanceRecord = {
  id: string;
  type: "INGRESO" | "EGRESO";
  description: string;
  amount: number;
  date: string;
  proofUrl: string | null;
  createdAt: string;
  donorDocument?: string | null;
};

export default function AdminTesoreria() {
  const [records, setRecords] = useState<FinanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  // Form state
  const [type, setType] = useState<"INGRESO" | "EGRESO">("INGRESO");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [proofUrl, setProofUrl] = useState("");
  const [donorDocument, setDonorDocument] = useState("");

  const fetchRecords = async () => {
    try {
      const res = await fetch("/api/tesoreria");
      if (res.ok) {
        const data = await res.json();
        setRecords(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return;

    const payload = { 
      type, 
      description, 
      amount, 
      date: date || undefined, 
      proofUrl, 
      donorDocument: type === 'INGRESO' ? donorDocument : undefined 
    };

    try {
      const res = await fetch("/api/tesoreria", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setIsAdding(false);
        setDescription("");
        setAmount("");
        setDate("");
        setProofUrl("");
        setDonorDocument("");
        fetchRecords();
      } else {
        alert("Error al guardar el registro.");
      }
    } catch (e) {
      alert("Error de conexión");
    }
  };

  const totalIngresos = records.filter(r => r.type === "INGRESO").reduce((acc, curr) => acc + curr.amount, 0);
  const totalEgresos = records.filter(r => r.type === "EGRESO").reduce((acc, curr) => acc + curr.amount, 0);
  const balance = totalIngresos - totalEgresos;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(val);
  };

  const handleExportCSV = () => {
    if (records.length === 0) {
      alert("No hay registros para exportar.");
      return;
    }
    
    const headers = ["Fecha", "Tipo", "Concepto", "NIT/CC", "Monto", "Fecha de Registro"];
    const rows = records.map(r => [
      new Date(r.date).toLocaleDateString('es-ES'),
      r.type,
      `"${r.description.replace(/"/g, '""')}"`,
      r.donorDocument || "",
      r.amount.toString(),
      new Date(r.createdAt).toLocaleDateString('es-ES')
    ]);
    
    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Reporte_Tesoreria_${new Date().toLocaleDateString('es-ES').replace(/\//g, '-')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Tesorería</h2>
          <p className="text-gray-400">Control interno de ingresos, gastos y balance general.</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={handleExportCSV}
            className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-xl flex items-center transition-all duration-300 font-semibold"
          >
            <Download size={20} className="mr-2" />
            Exportar Excel
          </button>
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="bg-jv-purple hover:bg-jv-turquoise text-white px-4 py-2 rounded-xl flex items-center transition-all duration-300 font-semibold"
          >
            <PlusCircle size={20} className="mr-2" />
            Nuevo Registro
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm mb-1">Balance Total</p>
              <h3 className={`text-3xl font-bold ${balance >= 0 ? 'text-jv-turquoise' : 'text-red-400'}`}>
                {formatCurrency(balance)}
              </h3>
            </div>
            <div className="p-3 bg-jv-turquoise/10 rounded-xl">
              <DollarSign className="text-jv-turquoise" size={24} />
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Ingresos</p>
              <h3 className="text-3xl font-bold text-green-400">
                {formatCurrency(totalIngresos)}
              </h3>
            </div>
            <div className="p-3 bg-green-400/10 rounded-xl">
              <TrendingUp className="text-green-400" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Egresos</p>
              <h3 className="text-3xl font-bold text-red-400">
                {formatCurrency(totalEgresos)}
              </h3>
            </div>
            <div className="p-3 bg-red-400/10 rounded-xl">
              <TrendingDown className="text-red-400" size={24} />
            </div>
          </div>
        </div>
      </div>

      {isAdding && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 border border-jv-purple/30 rounded-2xl p-6 mb-8"
        >
          <h3 className="text-xl font-bold text-white mb-4">Registrar Movimiento</h3>
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Tipo de Movimiento</label>
              <select 
                value={type}
                onChange={(e) => setType(e.target.value as "INGRESO" | "EGRESO")}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none"
              >
                <option value="INGRESO">Ingreso (Entrada de dinero)</option>
                <option value="EGRESO">Egreso (Gasto/Salida)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Monto (COP)</label>
              <input 
                type="number" 
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Ej. 50000"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none" 
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-1">Concepto / Descripción</label>
              <input 
                type="text" 
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ej. Donación evento X, Compra de materiales..."
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none" 
              />
            </div>
            {type === 'INGRESO' && (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">NIT o Cédula del Donante (Opcional)</label>
                <input 
                  type="text" 
                  value={donorDocument} 
                  onChange={e => setDonorDocument(e.target.value)} 
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white font-mono"
                  placeholder="Ej. 900123456" 
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Fecha</label>
              <input 
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none" 
              />
            </div>
            <div className="flex items-end justify-end md:col-span-2 mt-4">
              <button 
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 text-gray-400 hover:text-white mr-4"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                className="bg-jv-purple hover:bg-jv-turquoise text-white px-6 py-2 rounded-xl transition-all font-semibold"
              >
                Guardar Registro
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
          <h3 className="font-semibold text-white flex items-center">
            <FileText className="mr-2 text-jv-purple" size={20} />
            Historial de Movimientos
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-800/50 text-gray-400 text-sm">
              <tr className="border-b border-gray-800">
                <th className="px-6 py-3 font-medium">Fecha</th>
                <th className="px-6 py-3 font-medium">Tipo</th>
                <th className="px-6 py-3 font-medium">Concepto</th>
                <th className="px-6 py-3 font-medium">NIT/CC</th>
                <th className="px-6 py-3 font-medium text-right">Monto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">Cargando registros...</td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No hay movimientos registrados.</td>
                </tr>
              ) : (
                records.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-300">
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-2 text-gray-500" />
                        {new Date(record.date).toLocaleDateString('es-ES')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        record.type === "INGRESO" ? "bg-green-400/10 text-green-400" : "bg-red-400/10 text-red-400"
                      }`}>
                        {record.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">{record.description}</td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-500">{record.donorDocument || "-"}</td>
                    <td className={`px-6 py-4 text-sm font-semibold text-right ${
                      record.type === "INGRESO" ? "text-green-400" : "text-red-400"
                    }`}>
                      {record.type === "INGRESO" ? "+" : "-"}{formatCurrency(record.amount)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
