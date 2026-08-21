"use client";

import { useState } from "react";
import { Search, Plus, Minus, Trash2, CreditCard, Banknote, ShoppingCart, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const dummyProducts = [
  { id: 1, name: "Kopi Susu Aren", price: 20000, category: "Kopi", stock: 45, image: "bg-amber-800" },
  { id: 2, name: "Americano", price: 15000, category: "Kopi", stock: 120, image: "bg-slate-800" },
  { id: 3, name: "Matcha Latte", price: 25000, category: "Non-Kopi", stock: 30, image: "bg-emerald-600" },
  { id: 4, name: "Caffe Latte", price: 22000, category: "Kopi", stock: 50, image: "bg-amber-600" },
  { id: 5, name: "Croissant Butter", price: 18000, category: "Makanan", stock: 12, image: "bg-yellow-600" },
  { id: 6, name: "Chocolate Muffin", price: 15000, category: "Makanan", stock: 5, image: "bg-amber-900" },
  { id: 7, name: "Red Velvet", price: 28000, category: "Non-Kopi", stock: 20, image: "bg-red-800" },
  { id: 8, name: "Teh Tarik", price: 12000, category: "Non-Kopi", stock: 60, image: "bg-orange-700" },
];

export default function PosInterface() {
  const [cart, setCart] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);

  const categories = ["Semua", ...Array.from(new Set(dummyProducts.map(p => p.category)))];

  const filteredProducts = dummyProducts.filter(p => {
    const matchCat = selectedCategory === "Semua" || p.category === selectedCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const addToCart = (product: any) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const updateQty = (id: number, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = item.qty + delta;
        return newQty > 0 ? { ...item, qty: newQty } : item;
      }
      return item;
    }).filter(item => item.qty > 0)); // Ensure we don't accidentally leave 0 qty items
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const tax = subtotal * 0.11; // PPN 11%
  const total = subtotal + tax;

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col md:flex-row gap-6 -m-4 sm:-m-6 lg:-m-8">
      
      {/* Product List Section (Left) */}
      <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 bg-slate-50 min-h-0 overflow-hidden">
        {/* Search & Filter */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input 
              type="text" 
              placeholder="Cari produk atau scan barcode..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-shadow shadow-sm"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat 
                    ? "bg-slate-900 text-white" 
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto min-h-0 pb-20 md:pb-0">
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <AnimatePresence>
              {filteredProducts.map(product => (
                <motion.button
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col text-left shadow-sm hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <div className={`h-32 w-full ${product.image} relative`}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <span className="absolute bottom-2 left-2 text-white font-semibold text-lg drop-shadow-md">
                      Rp {product.price.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-slate-800 line-clamp-2">{product.name}</h3>
                    <p className="text-xs text-slate-500 mt-1">Stok: {product.stock}</p>
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </div>
        
        {/* Mobile Cart Floating Bar */}
        {!isMobileCartOpen && (
          <div className="md:hidden fixed bottom-4 left-4 right-4 z-40">
            <button 
              onClick={() => setIsMobileCartOpen(true)}
              className="w-full bg-indigo-600 text-white rounded-2xl p-4 shadow-xl flex items-center justify-between font-bold"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <ShoppingCart className="w-6 h-6" />
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {cart.reduce((sum, item) => sum + item.qty, 0)}
                  </span>
                </div>
                <span>Lihat Pesanan</span>
              </div>
              <span>Rp {total.toLocaleString('id-ID')}</span>
            </button>
          </div>
        )}
      </div>

      {/* Cart Section (Right) */}
      <div className={`w-full md:w-96 lg:w-[420px] bg-white border-l border-slate-200 flex flex-col shadow-2xl z-50 md:relative fixed inset-0 md:inset-auto transition-transform duration-300 ${isMobileCartOpen ? "translate-y-0" : "translate-y-full md:translate-y-0"}`}>
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-indigo-600" />
            Pesanan Saat Ini
          </h2>
          <div className="flex items-center gap-3">
            <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-2 py-1 rounded-full hidden md:inline-block">
              {cart.reduce((sum, item) => sum + item.qty, 0)} Item
            </span>
            <button 
              className="md:hidden p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full"
              onClick={() => setIsMobileCartOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
              <ShoppingCart className="w-16 h-16 opacity-20" />
              <p className="font-medium">Belum ada pesanan.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {cart.map(item => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    key={item.id} 
                    className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex gap-3 items-center"
                  >
                    <div className={`w-12 h-12 rounded-lg ${item.image} flex-shrink-0`}></div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-slate-800 text-sm truncate">{item.name}</h4>
                      <p className="text-indigo-600 font-bold text-sm">Rp {(item.price * item.qty).toLocaleString('id-ID')}</p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex items-center bg-slate-100 rounded-lg p-1">
                        <button onClick={() => updateQty(item.id, -1)} className="p-1 hover:bg-white rounded shadow-sm text-slate-600 transition-colors">
                          {item.qty === 1 ? <Trash2 className="w-4 h-4 text-red-500" /> : <Minus className="w-4 h-4" />}
                        </button>
                        <span className="w-8 text-center text-sm font-semibold text-slate-800">{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 1)} className="p-1 hover:bg-white rounded shadow-sm text-slate-600 transition-colors">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Checkout Footer */}
        <div className="bg-white border-t border-slate-200 p-4 space-y-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal</span>
              <span>Rp {subtotal.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Pajak (11%)</span>
              <span>Rp {tax.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between font-bold text-lg text-slate-900 pt-2 border-t border-slate-100">
              <span>Total Tagihan</span>
              <span>Rp {total.toLocaleString('id-ID')}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <button 
              disabled={cart.length === 0}
              className="flex items-center justify-center gap-2 bg-emerald-600 text-white p-3 rounded-xl font-semibold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Banknote className="w-5 h-5" />
              Tunai
            </button>
            <button 
              disabled={cart.length === 0}
              className="flex items-center justify-center gap-2 bg-blue-600 text-white p-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <CreditCard className="w-5 h-5" />
              QRIS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
