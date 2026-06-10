"use client"

import { useState, useEffect } from "react";
import { Box, PlusCircle, Download, PackageOpen, Tag, Trash2, Edit } from "lucide-react";
import { motion } from "framer-motion";
import * as XLSX from "xlsx";

type InventoryItem = {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  description: string | null;
  updatedAt: string;
};

export default function AdminInventario() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Útiles Escolares");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("Unidades");
  const [description, setDescription] = useState("");

  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editQuantity, setEditQuantity] = useState("");

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/inventario");
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !quantity) return;

    try {
      const res = await fetch("/api/inventario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, category, quantity, unit, description })
      });

      if (res.ok) {
        setIsAdding(false);
        setName("");
        setCategory("Útiles Escolares");
        setQuantity("");
        setUnit("Unidades");
        setDescription("");
        fetchItems();
      } else {
        alert("Error al guardar el artículo.");
      }
    } catch (e) {
      alert("Error de conexión");
    }
  };

  const handleUpdateQuantity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItemId || !editQuantity) return;

    try {
      const res = await fetch(`/api/inventario/${editingItemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: editQuantity })
      });

      if (res.ok) {
        setEditingItemId(null);
        setEditQuantity("");
        fetchItems();
      } else {
        alert("Error al actualizar la cantidad.");
      }
    } catch (e) {
      alert("Error de conexión");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar este artículo del inventario?")) return;
    try {
      const res = await fetch(`/api/inventario/${id}`, { method: "DELETE" });
      if (res.ok) fetchItems();
    } catch (e) {
      console.error(e);
    }
  };

  const handleExportCSV = () => {
    if (items.length === 0) {
      alert("No hay registros para exportar.");
      return;
    }
    
    const worksheet = XLSX.utils.json_to_sheet(items.map(i => ({
      Articulo: i.name,
      Categoria: i.category,
      Cantidad: i.quantity,
      Unidad: i.unit,
      Descripcion: i.description || "",
      UltimaActualizacion: new Date(i.updatedAt).toLocaleDateString('es-ES')
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventario");
    XLSX.writeFile(workbook, "Inventario_Juventud_Viva.xlsx");
  };

  const totalItems = items.reduce((acc, curr) => acc + curr.quantity, 0);
  const categoriesCount = new Set(items.map(i => i.category)).size;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Inventario de Especies</h2>
          <p className="text-gray-400">Control de donaciones en físico (bodega y materiales).</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={handleExportCSV}
            className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-xl flex items-center transition-all duration-300 font-semibold"
          >
            <Download size={20} className="mr-2 hidden sm:block" />
            <span className="hidden sm:inline">Exportar</span> Excel
          </button>
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="bg-jv-purple hover:bg-jv-turquoise text-white px-4 py-2 rounded-xl flex items-center transition-all duration-300 font-semibold"
          >
            <PlusCircle size={20} className="mr-2" />
            Nuevo <span className="hidden sm:inline ml-1">Artículo</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total de Unidades en Bodega</p>
              <h3 className="text-3xl font-bold text-jv-turquoise">{totalItems}</h3>
            </div>
            <div className="p-3 bg-jv-turquoise/10 rounded-xl">
              <PackageOpen className="text-jv-turquoise" size={24} />
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm mb-1">Categorías de Inventario</p>
              <h3 className="text-3xl font-bold text-jv-purple">{categoriesCount}</h3>
            </div>
            <div className="p-3 bg-jv-purple/10 rounded-xl">
              <Tag className="text-jv-purple" size={24} />
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
          <h3 className="text-xl font-bold text-white mb-4">Registrar Nuevo Artículo</h3>
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Nombre del Artículo</label>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Cuadernos cuadriculados, Arroz"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Categoría</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none"
              >
                <option value="Alimentos">Alimentos</option>
                <option value="Útiles Escolares">Útiles Escolares</option>
                <option value="Juguetes">Juguetes</option>
                <option value="Ropa">Ropa</option>
                <option value="Medicamentos">Medicamentos</option>
                <option value="Otros">Otros</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Cantidad Inicial</label>
              <input 
                type="number" 
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Ej. 50"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Unidad de Medida</label>
              <select 
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none"
              >
                <option value="Unidades">Unidades</option>
                <option value="Libras">Libras</option>
                <option value="Kilos">Kilos</option>
                <option value="Cajas">Cajas</option>
                <option value="Bolsas">Bolsas</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-1">Descripción / Notas (Opcional)</label>
              <input 
                type="text" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ej. Donación de empresa X, Vencimiento en dic..."
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
                Guardar Artículo
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
          <h3 className="font-semibold text-white flex items-center">
            <Box className="mr-2 text-jv-purple" size={20} />
            Lista de Artículos
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead className="bg-gray-800/50 text-gray-400 text-sm">
              <tr className="border-b border-gray-800">
                <th className="px-6 py-3 font-medium">Artículo</th>
                <th className="px-6 py-3 font-medium">Categoría</th>
                <th className="px-6 py-3 font-medium">Stock / Cantidad</th>
                <th className="px-6 py-3 font-medium">Descripción</th>
                <th className="px-6 py-3 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">Cargando inventario...</td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">Bodega vacía. Añade tu primer artículo.</td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{item.name}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-800 text-gray-300">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <span className={`text-lg font-bold ${item.quantity <= 0 ? 'text-red-400' : 'text-jv-turquoise'}`}>
                          {item.quantity}
                        </span>
                        <span className="text-sm text-gray-400">{item.unit}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">{item.description || "-"}</td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => {
                          setEditingItemId(item.id);
                          setEditQuantity(item.quantity.toString());
                        }} 
                        className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors mr-2"
                        title="Actualizar Stock"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal to Edit Quantity */}
      {editingItemId && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-xl font-bold text-white mb-4">Actualizar Stock</h3>
            <p className="text-gray-400 text-sm mb-4">Ajusta la cantidad total en bodega (suma si entran donaciones, resta si salen).</p>
            
            <form onSubmit={handleUpdateQuantity}>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Nueva Cantidad Total</label>
                <input 
                  type="number" 
                  value={editQuantity} 
                  onChange={e => setEditQuantity(e.target.value)} 
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white font-bold text-lg" 
                  autoFocus
                />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setEditingItemId(null)} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors">
                  Cancelar
                </button>
                <button type="submit" className="px-4 py-2 bg-jv-purple hover:bg-jv-turquoise text-white rounded-lg transition-colors font-semibold">
                  Actualizar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
