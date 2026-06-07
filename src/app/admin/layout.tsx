"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Image as ImageIcon, Users, LogOut, Settings, Newspaper, CalendarRange } from "lucide-react";
import Image from "next/image";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const handleLogout = async () => {
    // A simple client-side clearing, better done via API, but for demo:
    document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "/admin/login";
  };

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const menu = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/admin/dashboard" },
    { name: "Documentos", icon: <FileText size={20} />, path: "/admin/documentos" },
    { name: "Noticias", icon: <Newspaper size={20} />, path: "/admin/noticias" },
    { name: "Programas", icon: <CalendarRange size={20} />, path: "/admin/programas" },
    { name: "Galería", icon: <ImageIcon size={20} />, path: "/admin/galeria" },
    { name: "Alianzas", icon: <Users size={20} />, path: "/admin/alianzas" },
    { name: "Hoja de Ruta", icon: <LayoutDashboard size={20} />, path: "/admin/hoja-de-ruta" },
    { name: "Mensajes", icon: <FileText size={20} />, path: "/admin/mensajes" },
    { name: "Certificados", icon: <FileText size={20} />, path: "/admin/certificados" },
    { name: "Tesorería", icon: <LayoutDashboard size={20} />, path: "/admin/tesoreria" },
    { name: "Usuarios", icon: <Users size={20} />, path: "/admin/usuarios" },
  ];

  return (
    <div className="flex h-screen bg-jv-dark text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col h-full z-20">
        <div className="p-6 flex justify-center items-center border-b border-gray-800 h-20">
           <Image
              src="/logo/juventud-viva.png"
              alt="JUVENTUD VIVA"
              width={140}
              height={40}
              className="object-contain"
            />
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto mt-4">
          {menu.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                pathname === item.path 
                  ? "bg-jv-purple/20 text-jv-turquoise border border-jv-purple/30" 
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800 space-y-2">
          <Link href="/admin/configuracion" className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
            <Settings size={20} />
            <span className="font-medium">Configuración</span>
          </Link>
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors w-full"
          >
            <LogOut size={20} />
            <span className="font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-jv-dark">
        <header className="h-20 bg-gray-900 border-b border-gray-800 flex items-center px-8 justify-between z-10">
          <h1 className="text-xl font-bold text-white">Panel de Administración</h1>
          <div className="flex items-center space-x-4">
             <div className="w-10 h-10 rounded-full bg-jv-purple flex items-center justify-center font-bold text-white border-2 border-jv-turquoise">
               A
             </div>
             <div>
               <p className="text-sm font-semibold">Administrador</p>
               <p className="text-xs text-gray-400">admin@juventudviva.org</p>
             </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-8 relative">
          {/* Decorative background blur */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-jv-purple/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
          {children}
        </div>
      </main>
    </div>
  );
}
