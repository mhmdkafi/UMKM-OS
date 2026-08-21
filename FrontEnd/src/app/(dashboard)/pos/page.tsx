"use client";

import { useState } from "react";
import { Search, Plus, Minus, Trash2, CreditCard, Banknote, ShoppingCart, X, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const dummyProducts = [
  { id: 1, name: "Kopi Susu Aren", price: 20000, category: "Kopi", stock: 45, image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=500&q=80" },
  { id: 2, name: "Americano", price: 15000, category: "Kopi", stock: 120, image: "https://images.unsplash.com/photo-1551030173-122aabc4489c?w=500&q=80" },
  { id: 3, name: "Matcha Latte", price: 25000, category: "Non-Kopi", stock: 30, image: "https://images.unsplash.com/photo-1536514072410-5019a3c69182?w=500&q=80" },
  { id: 4, name: "Caffe Latte", price: 22000, category: "Kopi", stock: 50, image: "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=500&q=80" },
  { id: 5, name: "Croissant Butter", price: 18000, category: "Makanan", stock: 12, image: "https://images.unsplash.com/photo-1517433627367-17b5e43bc047?w=500&q=80" },
  { id: 6, name: "Chocolate Muffin", price: 15000, category: "Makanan", stock: 5, image: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=500&q=80" },
  { id: 7, name: "Red Velvet Cake", price: 28000, category: "Makanan", stock: 20, image: "https://images.unsplash.com/photo-1586788224331-947f68671caf?w=500&q=80" },
  { id: 8, name: "Teh Tarik", price: 12000, category: "Non-Kopi", stock: 60, image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&q=80" },
];

export default function PosInterface() {
  const [cart, setCart] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

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
    }).filter(item => item.qty > 0));
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const handleCheckout = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setCart([]);
      setIsMobileCartOpen(false);
    }, 2500);
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const tax = subtotal * 0.11; // PPN 11%
  const total = subtotal + tax;

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col md:flex-row gap-0 -m-4 sm:-m-6 lg:-m-8 bg-slate-50/50">
      
      {/* Product List Section (Left) */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden relative z-0">
        
        {/* Search & Filter Header */}
        <div className="p-4 sm:p-6 lg:p-8 pb-4 space-y-4 bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-10">
          <div className="relative max-w-2xl mx-auto md:mx-0">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-indigo-400" />
            </div>
            <input 
              type="text" 
              placeholder="Cari produk (Muffin, Kopi...)" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-12 pr-4 py-3.5 bg-slate-100/80 border-transparent rounded-2xl leading-5 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide max-w-full">
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 shadow-sm ${
                  selectedCategory === cat 
                    ? "bg-slate-900 text-white ring-2 ring-slate-900 ring-offset-2" 
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-32 md:pb-8">
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            <AnimatePresence>
              {filteredProducts.map(product => {
                const qtyInCart = cart.find(item => item.id === product.id)?.qty || 0;
                
                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    key={product.id}
                    className="group relative bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300 flex flex-col cursor-pointer"
                    onClick={() => addToCart(product)}
                  >
                    {/* Badge Qty */}
                    {qtyInCart > 0 && (
                      <div className="absolute top-3 right-3 z-10 bg-indigo-600 text-white w-8 h-8 flex items-center justify-center rounded-full font-bold shadow-lg shadow-indigo-600/30">
                        {qtyInCart}
                      </div>
                    )}
                    
                    <div className="h-40 sm:h-48 w-full relative overflow-hidden bg-slate-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-80"></div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <span className="inline-block px-2.5 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-semibold rounded-lg mb-2 border border-white/20">
                          {product.category}
                        </span>
                        <h3 className="font-bold text-white text-lg leading-tight line-clamp-1">{product.name}</h3>
                      </div>
                    </div>
                    <div className="p-4 flex justify-between items-center bg-white">
                      <div>
                        <p className="text-indigo-600 font-bold text-lg">Rp {(product.price / 1000)}k</p>
                        <p className="text-xs text-slate-400 font-medium mt-0.5">Stok: {product.stock}</p>
                      </div>
                      <button 
                        className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile Cart Floating Bar */}
        {!isMobileCartOpen && (
          <div className="md:hidden fixed bottom-4 left-4 right-4 z-40">
            <button 
              onClick={() => setIsMobileCartOpen(true)}
              className="w-full bg-slate-900 text-white rounded-2xl p-4 shadow-2xl flex items-center justify-between font-bold ring-1 ring-slate-800"
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6 text-white" />
                  </div>
                  <span className="absolute -top-2 -right-2 bg-indigo-500 text-white text-xs w-6 h-6 flex items-center justify-center rounded-full border-2 border-slate-900 shadow-sm">
                    {cart.reduce((sum, item) => sum + item.qty, 0)}
                  </span>
                </div>
                <div className="text-left">
                  <p className="text-sm text-slate-300 font-medium">Lihat Pesanan</p>
                  <p className="text-lg">Rp {total.toLocaleString('id-ID')}</p>
                </div>
              </div>
            </button>
          </div>
        )}
      </div>

      {/* Cart Section (Right) / Mobile Drawer */}
      <div className={`
        fixed inset-y-0 right-0 z-50 w-full md:w-[400px] lg:w-[460px] 
        bg-white flex flex-col shadow-[0_0_40px_rgba(0,0,0,0.1)] md:relative 
        transform transition-transform duration-300 ease-in-out border-l border-slate-200
        ${isMobileCartOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"}
      `}>
        {/* Cart Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Pesanan Saat Ini</h2>
              <p className="text-xs text-slate-500 font-medium">Transaksi #INV-{Date.now().toString().slice(-6)}</p>
            </div>
          </div>
          <button 
            className="md:hidden p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors"
            onClick={() => setIsMobileCartOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-2">
                <ShoppingCart className="w-10 h-10 text-slate-300" />
              </div>
              <p className="font-medium text-slate-500">Belum ada menu yang dipilih.</p>
              <p className="text-sm text-slate-400">Silakan klik produk di sebelah kiri.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {cart.map(item => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, x: 20, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
                    key={item.id} 
                    className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-100 shadow-sm flex gap-4 items-center group hover:border-indigo-100 transition-colors"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover shadow-sm flex-shrink-0" />
                    
                    <div className="flex-1 min-w-0 py-1">
                      <h4 className="font-bold text-slate-800 text-sm sm:text-base truncate">{item.name}</h4>
                      <p className="text-indigo-600 font-bold text-sm mt-1">Rp {(item.price).toLocaleString('id-ID')}</p>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      <button onClick={() => removeFromCart(item.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                      <div className="flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200/60 shadow-inner">
                        <button onClick={() => updateQty(item.id, -1)} className="p-1.5 hover:bg-white rounded-md shadow-sm text-slate-600 transition-all">
                          {item.qty === 1 ? <Trash2 className="w-3.5 h-3.5 text-red-500" /> : <Minus className="w-3.5 h-3.5" />}
                        </button>
                        <span className="w-8 text-center text-sm font-bold text-slate-800">{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 1)} className="p-1.5 hover:bg-white rounded-md shadow-sm text-slate-600 transition-all">
                          <Plus className="w-3.5 h-3.5" />
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
        <div className="bg-white border-t border-slate-100 p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.03)] z-20">
          <div className="space-y-3 text-sm mb-6">
            <div className="flex justify-between text-slate-500 font-medium">
              <span>Subtotal</span>
              <span className="text-slate-800">Rp {subtotal.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-slate-500 font-medium">
              <span>PPN (11%)</span>
              <span className="text-slate-800">Rp {tax.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between font-black text-xl text-slate-900 pt-4 border-t border-slate-100 border-dashed">
              <span>Total</span>
              <span className="text-indigo-600">Rp {total.toLocaleString('id-ID')}</span>
            </div>
          </div>
          
          {showSuccess ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full bg-emerald-50 border border-emerald-200 text-emerald-700 py-4 rounded-2xl font-bold flex justify-center items-center gap-2 shadow-inner"
            >
              <CheckCircle2 className="w-6 h-6" /> Pembayaran Berhasil!
            </motion.div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={handleCheckout}
                disabled={cart.length === 0}
                className="group flex flex-col items-center justify-center gap-1 bg-slate-900 text-white p-4 rounded-2xl font-bold hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-slate-900/20"
              >
                <Banknote className="w-6 h-6 mb-1 text-emerald-400 group-hover:scale-110 transition-transform" />
                Tunai
              </button>
              <button 
                onClick={handleCheckout}
                disabled={cart.length === 0}
                className="group flex flex-col items-center justify-center gap-1 bg-indigo-600 text-white p-4 rounded-2xl font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-indigo-600/30"
              >
                <CreditCard className="w-6 h-6 mb-1 text-indigo-200 group-hover:scale-110 transition-transform" />
                QRIS
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
