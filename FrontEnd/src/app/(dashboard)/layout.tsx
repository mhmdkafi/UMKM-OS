"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  Settings,
  Users,
  Wallet,
  MessageSquare,
  Send,
  Minus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeRole, setActiveRole] = useState<"owner" | "manager" | "kasir">("owner");
  const [userName, setUserName] = useState("");
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [businessCategory, setBusinessCategory] = useState("Lainnya");
  const [isAiPopupOpen, setIsAiPopupOpen] = useState(false);
  const [aiMessage, setAiMessage] = useState("");

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (!userStr || !token) {
      router.push('/login');
      return;
    }
    try {
      const user = JSON.parse(userStr);
      setUserName(user.name || 'User');
      setBusinessCategory(user.business_category || 'Lainnya');
      const role = (user.role || 'OWNER').toLowerCase();
      if (role === 'owner') setActiveRole('owner');
      else if (role === 'manager' || role === 'admin') setActiveRole('manager');
      else setActiveRole('kasir');
    } catch { router.push('/login'); }
  }, [router]);

  // Determine which navigation items to show based on the selected role (for demo purposes)
  const getNavItems = () => {
    let inventoryName = "Inventaris & Stok";
    let productsName = "Daftar Produk";

    if (businessCategory === "fnb" || businessCategory === "Food & Beverage (Kuliner)") {
       inventoryName = "Inventaris Bahan Baku";
       productsName = "Menu & Resep";
    } else if (businessCategory === "retail" || businessCategory === "Retail / Toko Kelontong") {
       inventoryName = "Stok Gudang / Inventaris";
       productsName = "Etalase Produk";
    } else if (businessCategory === "fashion" || businessCategory === "Fashion & Pakaian") {
       inventoryName = "Stok Barang / Kain";
       productsName = "Katalog Pakaian";
    } else if (businessCategory === "services" || businessCategory === "Jasa / Salon / Bengkel") {
       inventoryName = "Perlengkapan & Suku Cadang";
       productsName = "Daftar Layanan/Jasa";
    }

    const allItems = [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["owner"] },
      { name: "Kasir (POS)", href: "/pos", icon: ShoppingCart, roles: ["owner", "manager", "kasir"] },
      { name: inventoryName, href: "/inventory", icon: Package, roles: ["owner", "manager"] },
      { name: productsName, href: "/products", icon: Receipt, roles: ["owner", "manager"] },
      { name: "Pengeluaran", href: "/expenses", icon: Wallet, roles: ["owner", "manager"] },
      { name: "Laporan Keuangan", href: "/reports", icon: PieChart, roles: ["owner"] },
      { name: "Manajemen Karyawan", href: "/employees", icon: Users, roles: ["owner"] },
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
          <button 
            onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('user'); router.push('/login'); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-5 h-5 text-slate-400" />
            Keluar
          </button>
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

            <div className="relative">
              <button 
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2 hover:bg-slate-50 p-1.5 rounded-lg transition-colors focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center border border-indigo-200">
                  <User className="w-4 h-4 text-indigo-700" />
                </div>
                {userName && <span className="text-sm font-medium text-slate-700 hidden sm:block">{userName}</span>}
              </button>

              <AnimatePresence>
                {isProfileDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setIsProfileDropdownOpen(false)}
                    ></div>
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 z-50 overflow-hidden"
                    >
                      <div className="py-1">
                        <div className="px-4 py-2 border-b border-slate-100">
                          <p className="text-xs text-slate-500 font-medium">Masuk sebagai</p>
                          <p className="text-sm font-bold text-slate-900 truncate">{userName}</p>
                        </div>
                        <button 
                          onClick={() => {
                            localStorage.removeItem('token');
                            localStorage.removeItem('user');
                            router.push('/login');
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Keluar Akun
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Floating AI Assistant Widget */}
      {activeRole === "owner" && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
          <AnimatePresence>
            {isAiPopupOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                className="bg-white rounded-2xl shadow-2xl border border-indigo-100 w-80 sm:w-96 mb-4 overflow-hidden flex flex-col"
                style={{ height: '450px' }}
              >
                {/* Header AI */}
                <div className="bg-indigo-600 p-4 flex justify-between items-center text-white rounded-t-2xl">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-200" />
                    <div>
                      <h3 className="font-bold text-sm">AI Business Assistant</h3>
                      <p className="text-xs text-indigo-200">Online & siap membantu</p>
                    </div>
                  </div>
                  <button onClick={() => setIsAiPopupOpen(false)} className="text-indigo-200 hover:text-white p-1 rounded-md transition-colors">
                    <Minus className="w-5 h-5" />
                  </button>
                </div>

                {/* Chat Area */}
                <div className="flex-1 p-4 bg-slate-50/50 overflow-y-auto flex flex-col gap-3">
                  <div className="self-start max-w-[85%] bg-white border border-slate-100 p-3 rounded-2xl rounded-tl-sm text-sm text-slate-700 shadow-sm">
                    Halo {userName}! Saya AI Assistant dari UMKM OS. Ada yang bisa saya bantu hari ini? 
                    Misalnya, Anda bisa bertanya "Berapa laba bersih minggu ini?"
                  </div>
                  {/* Fake user message example */}
                  <div className="self-end max-w-[85%] bg-indigo-600 p-3 rounded-2xl rounded-tr-sm text-sm text-white shadow-sm">
                    Berapa laba bersih minggu ini?
                  </div>
                  {/* Fake AI response example */}
                  <div className="self-start max-w-[85%] bg-white border border-slate-100 p-3 rounded-2xl rounded-tl-sm text-sm text-slate-700 shadow-sm">
                    Laba bersih minggu ini adalah <strong>Rp 4.500.000</strong> (naik 12% dari minggu lalu). Pengeluaran terbesar Anda adalah untuk biaya operasional marketing.
                  </div>
                </div>

                {/* Input Area */}
                <div className="p-3 bg-white border-t border-slate-100">
                  <form onSubmit={(e) => { e.preventDefault(); setAiMessage(''); }} className="flex gap-2">
                    <input 
                      type="text" 
                      value={aiMessage}
                      onChange={(e) => setAiMessage(e.target.value)}
                      placeholder="Ketik pesan Anda..." 
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    />
                    <button type="submit" disabled={!aiMessage.trim()} className="bg-indigo-600 text-white p-2.5 rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors">
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button 
            onClick={() => setIsAiPopupOpen(!isAiPopupOpen)}
            className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl shadow-indigo-600/30 transition-transform hover:scale-105 active:scale-95 ${isAiPopupOpen ? 'bg-slate-800' : 'bg-indigo-600'}`}
          >
            {isAiPopupOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
          </button>
        </div>
      )}
    </div>
  );
}
