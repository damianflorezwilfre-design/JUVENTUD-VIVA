"use client";
import { Home, Users, Calendar, Heart, Shield } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function MobileBottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Inicio", href: "/", icon: <Home size={20} /> },
    { name: "Nosotros", href: "/nosotros", icon: <Users size={20} /> },
    { name: "Muro", href: "/muro", icon: <Heart size={20} /> },
    { name: "Transparencia", href: "/transparencia", icon: <Shield size={20} /> },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full z-[9990] p-4 pointer-events-none">
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 20 }}
        className="pointer-events-auto bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-2xl flex justify-around items-center p-3 shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
      >
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 relative ${
                isActive ? "text-jv-turquoise" : "text-gray-400 hover:text-white"
              }`}
            >
              {isActive && (
                <motion.div 
                  layoutId="bottom-nav-indicator"
                  className="absolute inset-0 bg-white/10 rounded-xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10 mb-1">{item.icon}</span>
              <span className="text-[10px] font-medium relative z-10">{item.name}</span>
            </Link>
          );
        })}
      </motion.div>
    </div>
  );
}
