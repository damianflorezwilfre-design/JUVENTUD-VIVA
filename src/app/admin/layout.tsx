"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { LayoutDashboard, FileText, Image as ImageIcon, Users, LogOut, Settings, Newspaper, CalendarRange, Wallet, Heart, MapPin, MessageSquare, Briefcase, Box } from "lucide-react";
import Image from "next/image";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [session, setSession] = useState<any>(null);
  const [notifications, setNotifications] = useState({ unreadMessages: 0, pendingRequests: 0 });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (pathname !== '/admin/login') {
      fetch('/api/auth/me')
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data) setSession(data);
        });

      // Poll or fetch notifications once per navigation
      fetch('/api/admin/notifications')
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data) setNotifications(data);
        });
    }
  }, [pathname]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    // A simple client-side clearing, better done via API, but for demo:
    document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "/";
  };

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const allMenu = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/admin/dashboard", id: "dashboard" },
    { name: "Mensajes", icon: <FileText size={20} />, path: "/admin/mensajes", id: "mensajes", badge: notifications.unreadMessages },
    { name: "Solicitudes", icon: <FileText size={20} />, path: "/admin/solicitudes", id: "solicitudes", badge: notifications.pendingRequests },
    { name: "Rendición de Cuentas", icon: <FileText size={20} />, path: "/admin/rendicion", id: "rendicion" },
    { name: "Voluntarios", icon: <Users size={20} />, path: "/admin/voluntarios", id: "voluntarios" },
    { name: "Tesorería", icon: <Wallet size={20} />, path: "/admin/tesoreria", id: "tesoreria" },
    { name: "Inventario", icon: <Box size={20} />, path: "/admin/inventario", id: "inventario" },
    { name: "Documentos", icon: <FileText size={20} />, path: "/admin/documentos", id: "documentos" },
    { name: "Noticias", icon: <Newspaper size={20} />, path: "/admin/noticias", id: "noticias" },
    { name: "Padrinazgos", icon: <Heart size={20} />, path: "/admin/padrinazgos", id: "padrinazgos" },
    { name: "Mapa de Impacto", icon: <MapPin size={20} />, path: "/admin/mapa", id: "mapa" },
    { name: "Eventos", icon: <CalendarRange size={20} />, path: "/admin/eventos", id: "eventos" },
    { name: "Programas", icon: <CalendarRange size={20} />, path: "/admin/programas", id: "programas" },
    { name: "Galería", icon: <ImageIcon size={20} />, path: "/admin/galeria", id: "galeria" },
    { name: "Historias de Impacto", icon: <ImageIcon size={20} />, path: "/admin/testimonios", id: "testimonios" },
    { name: "Muro Público", icon: <MessageSquare size={20} />, path: "/admin/muro", id: "muro" },
    { name: "Oportunidades", icon: <Briefcase size={20} />, path: "/admin/oportunidades", id: "oportunidades" },
    { name: "Alianzas", icon: <Users size={20} />, path: "/admin/alianzas", id: "alianzas" },
    { name: "Equipo", icon: <Users size={20} />, path: "/admin/equipo", id: "equipo" },
    { name: "Hoja de Ruta", icon: <LayoutDashboard size={20} />, path: "/admin/hoja-de-ruta", id: "hoja-de-ruta" },
    { name: "Certificados", icon: <FileText size={20} />, path: "/admin/certificados", id: "certificados" },
    { name: "Organigrama", icon: <Users size={20} />, path: "/admin/organigrama", id: "organigrama" },
    { name: "Usuarios", icon: <Users size={20} />, path: "/admin/usuarios", id: "usuarios" },
  ];

  const allowedModules = session?.modules ? session.modules.split(',') : [];
  const menu = session?.role === 'SUPER_ADMIN' 
    ? allMenu 
    : allMenu.filter(item => allowedModules.includes(item.id) || item.id === 'dashboard');

  return (
    <div className="flex h-screen bg-jv-dark text-white overflow-hidden">
      
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-gray-900 border-r border-gray-800 flex flex-col h-full z-40 transform transition-transform duration-300 md:relative md:translate-x-0 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6 flex justify-center items-center border-b border-gray-800 h-20 relative">
           <Image
              src="/logo/juventud-viva.png"
              alt="JUVENTUD VIVA"
              width={140}
              height={40}
              className="object-contain"
            />
            {/* Close button inside sidebar for mobile */}
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="md:hidden absolute right-4 text-gray-400 hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto mt-4 custom-scrollbar">
          {menu.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${
                pathname === item.path 
                  ? "bg-jv-purple/20 text-jv-turquoise border border-jv-purple/30" 
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <div className="flex items-center space-x-3">
                {item.icon}
                <span className="font-medium text-sm md:text-base">{item.name}</span>
              </div>
              {item.badge !== undefined ? (
                <span className={`text-white text-xs font-bold px-2 py-0.5 rounded-full ${item.badge > 0 ? 'bg-red-500' : 'bg-gray-700 text-gray-400'}`}>
                  {item.badge}
                </span>
              ) : null}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800 space-y-2 shrink-0">
          {session?.role === 'SUPER_ADMIN' && (
            <Link href="/admin/configuracion" className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
              <Settings size={20} />
              <span className="font-medium text-sm md:text-base">Configuración</span>
            </Link>
          )}
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors w-full"
          >
            <LogOut size={20} />
            <span className="font-medium text-sm md:text-base">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-jv-dark w-full">
        <header className="h-20 bg-gray-900 border-b border-gray-800 flex items-center px-4 md:px-8 justify-between z-10 shrink-0">
          <div className="flex items-center space-x-3">
            {/* Hamburger Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden text-gray-400 hover:text-white p-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
            <h1 className="text-lg md:text-xl font-bold text-white hidden sm:block">Panel de Administración</h1>
          </div>
          
          <div className="flex items-center space-x-3 md:space-x-4">
             <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-jv-purple flex items-center justify-center font-bold text-white border-2 border-jv-turquoise text-sm md:text-base">
               A
             </div>
             <div className="hidden sm:block">
               <p className="text-xs md:text-sm font-semibold">Administrador</p>
               <p className="text-[10px] md:text-xs text-gray-400">admin@juventudviva.org</p>
             </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 relative">
          {/* Decorative background blur */}
          <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-jv-purple/5 rounded-full blur-[80px] md:blur-[100px] -z-10 pointer-events-none"></div>
          {children}
        </div>
      </main>
    </div>
  );
}
