"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Receipt, 
  PieChart, 
  Sparkles, 
  LogOut,
  Menu,
  X,
  TrendingUp,
  User,
  Settings
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeRole, setActiveRole] = useState<"owner" | "manager" | "kasir">("owner");

  // Determine which navigation items to show based on the selected role (for demo purposes)
  const getNavItems = () => {
    const allItems = [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["owner"] },
      { name: "Kasir (POS)", href: "/pos", icon: ShoppingCart, roles: ["owner", "manager", "kasir"] },
      { name: "Inventaris & Stok", href: "/inventory", icon: Package, roles: ["owner", "manager"] },
      { name: "Produk & Resep", href: "/products", icon: Receipt, roles: ["owner", "manager"] },
      { name: "Laporan Keuangan", href: "/reports", icon: PieChart, roles: ["owner"] },
      { name: "AI Assistant", href: "/ai", icon: Sparkles, roles: ["owner"] },
    ];
    return allItems.filter(item => item.roles.includes(activeRole));
  };

  const navItems = getNavItems();
  
  // Kasir POS usually needs full width, so we might want to collapse sidebar automatically
  const isPosRoute = pathname === "/pos";

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/50 z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out flex flex-col ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } ${isPosRoute ? "md:-translate-x-full" : "md:translate-x-0"} md:relative md:flex`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <TrendingUp className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">UMKM OS</span>
          </Link>
          <button className="md:hidden text-slate-500" onClick={() => setSidebarOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          <div className="mb-6 px-3">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Menu Utama</p>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors mb-1 ${
                    isActive 
                      ? "bg-indigo-50 text-indigo-700" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? "text-indigo-600" : "text-slate-400"}`} />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="p-4 border-t border-slate-200">
          <Link href="/login" className="flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors">
            <LogOut className="w-5 h-5 text-slate-400 group-hover:text-red-500" />
            Keluar
          </Link>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className={`text-slate-500 hover:text-slate-700 ${isPosRoute ? "" : "md:hidden"}`}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-semibold text-slate-800 hidden sm:block">
              {navItems.find(item => item.href === pathname)?.name || "Dashboard"}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Role Selector (For Demo Purposes) */}
            <div className="flex items-center gap-2 mr-4 border-r border-slate-200 pr-4">
              <span className="text-xs text-slate-500 font-medium">Simulasi Role:</span>
              <select 
                value={activeRole} 
                onChange={(e) => setActiveRole(e.target.value as any)}
                className="text-sm bg-slate-50 border border-slate-200 rounded-md px-2 py-1 outline-none focus:border-indigo-500"
              >
                <option value="owner">Owner</option>
                <option value="manager">Manager / Admin</option>
                <option value="kasir">Kasir</option>
              </select>
            </div>

            <button className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center border border-indigo-200">
              <User className="w-4 h-4 text-indigo-700" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
