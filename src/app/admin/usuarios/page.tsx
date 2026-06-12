"use client"

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { UserPlus, Edit2, Trash2, X, Search, ShieldAlert, CheckSquare } from "lucide-react";

type User = {
  id: string;
  username: string;
  role?: string;
  modules?: string;
  createdAt?: string;
};

const AVAILABLE_MODULES = [
  { id: "mensajes", name: "Mensajes" },
  { id: "solicitudes", name: "Solicitudes" },
  { id: "rendicion", name: "Rendición de Cuentas" },
  { id: "voluntarios", name: "Voluntarios" },
  { id: "tesoreria", name: "Tesorería" },
  { id: "inventario", name: "Inventario" },
  { id: "documentos", name: "Documentos" },
  { id: "noticias", name: "Noticias" },
  { id: "padrinazgos", name: "Padrinazgos" },
  { id: "mapa", name: "Mapa de Impacto" },
  { id: "eventos", name: "Eventos" },
  { id: "programas", name: "Programas" },
  { id: "galeria", name: "Galería" },
  { id: "testimonios", name: "Salón de Fama / Testimonios" },
  { id: "muro", name: "Muro Público" },
  { id: "oportunidades", name: "Oportunidades" },
  { id: "alianzas", name: "Alianzas" },
  { id: "equipo", name: "Equipo" },
  { id: "historia", name: "Historia" },
  { id: "hoja-de-ruta", name: "Hoja de Ruta" },
  { id: "certificados", name: "Certificados" },
  { id: "organigrama", name: "Organigrama" },
  { id: "chatbot", name: "Chatbot AI" },
];

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Form State
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [role, setRole] = useState("EDITOR");

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/usuarios");
      if (res.ok) {
        const data = await res.json();
        setUsuarios(data);
        setIsDemoMode(false);
      } else {
        throw new Error("No database connected");
      }
    } catch (e) {
      console.warn("Using demo mode for users due to database connection error.");
      setIsDemoMode(true);
      // Fallback for Demo without DB
      setUsuarios([
        { id: "1", username: "admin", role: "SUPER_ADMIN", createdAt: new Date().toISOString() },
        { id: "2", username: "editor_noticias", role: "EDITOR", modules: "noticias", createdAt: new Date().toISOString() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const openModal = (user?: User) => {
    if (user) {
      setEditingId(user.id);
      setUsername(user.username);
      setPassword(""); // Don't show password, leave blank to not update
      setRole(user.role || "EDITOR");
      setSelectedModules(user.modules ? user.modules.split(',') : []);
    } else {
      setEditingId(null);
      setUsername("");
      setPassword("");
      setRole("EDITOR");
      setSelectedModules([]);
    }
    setIsModalOpen(true);
  };

  const handleModuleToggle = (moduleId: string) => {
    setSelectedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(m => m !== moduleId)
        : [...prev, moduleId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isDemoMode) {
      alert("⚠️ ESTÁS EN MODO DEMO: No tienes la base de datos conectada. El usuario no se guardará de forma real.");
      setIsModalOpen(false);
      return;
    }

    const payload = { 
      username, 
      ...(password ? { password } : {}),
      role,
      modules: role === 'SUPER_ADMIN' ? '' : selectedModules.join(',')
    };

    try {
      const url = editingId ? `/api/usuarios/${editingId}` : "/api/usuarios";
      const method = editingId ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchUsuarios();
      } else {
        const data = await res.json();
        alert(`Error al guardar: ${data.error || 'Desconocido'}`);
      }
    } catch (e) {
      console.error(e);
      alert("Error de conexión al guardar.");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (name === 'admin') {
      alert("No puedes eliminar al administrador principal.");
      return;
    }

    if (confirm(`¿Estás seguro de eliminar al usuario '${name}'?`)) {
      if (isDemoMode) {
        alert("En modo demo no se pueden eliminar usuarios reales.");
        return;
      }

      try {
        const res = await fetch(`/api/usuarios/${id}`, { method: "DELETE" });
        if (res.ok) {
          fetchUsuarios();
        } else {
          alert("Error al eliminar.");
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Gestión de Usuarios y Permisos</h2>
          <p className="text-gray-400">Administra los accesos de los miembros al portal</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-jv-purple hover:bg-jv-turquoise text-white px-4 py-2 rounded-xl flex items-center transition-all duration-300 font-semibold shadow-[0_0_15px_rgba(155,28,201,0.3)]"
        >
          <UserPlus size={20} className="mr-2" />
          Nuevo Usuario
        </button>
      </div>

      {isDemoMode && (
        <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-xl p-4 mb-6 flex items-start space-x-3">
          <ShieldAlert className="text-yellow-500 mt-0.5" size={20} />
          <div>
            <h4 className="text-yellow-500 font-bold text-sm">Modo Demostración Activo</h4>
            <p className="text-yellow-500/80 text-sm mt-1">
              No tienes la base de datos PostgreSQL configurada. Los datos que ves son de prueba. Los usuarios nuevos que intentes crear no podrán iniciar sesión hasta que conectes la base de datos.
            </p>
          </div>
        </div>
      )}

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Buscar usuario..." 
              className="bg-gray-800 border border-gray-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-jv-purple text-sm w-64 transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-800/50 border-b border-gray-800">
                <th className="p-4 text-sm font-semibold text-gray-300">Usuario</th>
                <th className="p-4 text-sm font-semibold text-gray-300">Rol</th>
                <th className="p-4 text-sm font-semibold text-gray-300">Módulos Permitidos</th>
                <th className="p-4 text-sm font-semibold text-gray-300 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">Cargando usuarios...</td>
                </tr>
              ) : usuarios.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">No hay usuarios registrados.</td>
                </tr>
              ) : (
                usuarios.map((user) => (
                  <tr key={user.id} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
                    <td className="p-4 text-white font-medium flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-jv-purple/20 text-jv-purple flex items-center justify-center font-bold text-sm uppercase">
                        {user.username.charAt(0)}
                      </div>
                      <span>{user.username}</span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${user.role === 'SUPER_ADMIN' ? 'bg-red-500/20 text-red-400' : 'bg-jv-turquoise/20 text-jv-turquoise'}`}>
                        {user.role === 'SUPER_ADMIN' ? 'Administrador' : 'Editor Restringido'}
                      </span>
                    </td>
                    <td className="p-4 text-gray-400 text-sm">
                      {user.role === 'SUPER_ADMIN' ? 'Todos los módulos' : (user.modules || 'Ninguno')}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <button onClick={() => openModal(user)} className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white rounded-lg transition-colors" title="Editar">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(user.id, user.username)} className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-colors" title="Eliminar" disabled={user.username === 'admin'}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal CRUD */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col"
          >
            <div className="p-6 border-b border-gray-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">{editingId ? "Editar Usuario" : "Crear Nuevo Usuario"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="overflow-y-auto p-6">
              <form id="user-form" onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Nombre de Usuario</label>
                  <input 
                    required 
                    type="text" 
                    value={username} 
                    onChange={e => setUsername(e.target.value)} 
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none disabled:opacity-50" 
                    placeholder="ej. carlos_lopez"
                    disabled={editingId !== null && username === 'admin'}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    {editingId ? "Nueva Contraseña (dejar en blanco para no cambiar)" : "Contraseña"}
                  </label>
                  <input 
                    required={!editingId} 
                    type="password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none" 
                    placeholder="••••••••"
                  />
                </div>

                {!(editingId && username === 'admin') && (
                  <>
                    <div className="pt-4 border-t border-gray-800">
                      <label className="block text-sm font-medium text-gray-400 mb-2">Rol del Usuario</label>
                      <select 
                        value={role} 
                        onChange={e => setRole(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-jv-purple focus:outline-none"
                      >
                        <option value="EDITOR">Editor Restringido (Requiere aprobación para editar/eliminar)</option>
                        <option value="SUPER_ADMIN">Administrador Principal (Acceso total)</option>
                      </select>
                    </div>

                    {role === 'EDITOR' && (
                      <div className="pt-4">
                        <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center">
                          <CheckSquare size={16} className="mr-2" /> Módulos Permitidos
                        </label>
                        <div className="grid grid-cols-2 gap-2 bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                          {AVAILABLE_MODULES.map(mod => (
                            <label key={mod.id} className="flex items-center space-x-2 cursor-pointer group">
                              <input 
                                type="checkbox"
                                checked={selectedModules.includes(mod.id)}
                                onChange={() => handleModuleToggle(mod.id)}
                                className="w-4 h-4 rounded border-gray-600 text-jv-purple focus:ring-jv-purple bg-gray-700"
                              />
                              <span className="text-gray-300 group-hover:text-white text-sm transition-colors">{mod.name}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </form>
            </div>

            <div className="p-6 border-t border-gray-800 flex justify-end space-x-3 bg-gray-900">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors">Cancelar</button>
              <button type="submit" form="user-form" className="px-4 py-2 rounded-lg bg-jv-purple hover:bg-jv-turquoise text-white font-semibold transition-colors">Guardar Usuario</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
