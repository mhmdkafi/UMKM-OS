"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Minus, Trash2, CreditCard, Banknote, ShoppingCart, X, CheckCircle2, User, QrCode, Receipt } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PosInterface() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (!savedUser.business_id) {
      setIsLoading(false);
      return;
    }

    setUser(savedUser);
    fetch(`http://localhost:5000/api/products?business_id=${encodeURIComponent(savedUser.business_id)}`)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to load products:", err);
        setIsLoading(false);
      });
  }, []);
  const [cart, setCart] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);
  
  // Payment State
  const [paymentModalType, setPaymentModalType] = useState<"tunai" | "qris" | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [receivedAmount, setReceivedAmount] = useState("");
  const [showReceipt, setShowReceipt] = useState(false);
  const [queueNumber, setQueueNumber] = useState("");

  const categories = ["Semua", ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(p => {
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

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const tax = subtotal * 0.11; // PPN 11%
  const total = subtotal + tax;

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName) return;
    
    // POST to backend API
    try {
      const response = await fetch('http://localhost:5000/api/pos/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_id: user?.business_id,
          cashier_id: user?.id,
          customer_name: customerName,
          total_amount: total,
          payment_method: paymentModalType?.toUpperCase(),
          items: cart
        })
      });
      
      const data = await response.json();
      if (data.success) {
        // Use generated transaction ID for queue number if possible, or random
        setQueueNumber(`A-${data.transaction.id.slice(0,4).toUpperCase()}`);
        setPaymentModalType(null);
        setShowReceipt(true);
        
        if (data.alerts && data.alerts.length > 0) {
          setTimeout(() => {
            alert("⚠️ PERINGATAN STOK:\n\n" + data.alerts.join("\n"));
          }, 300);
        }
      } else {
        alert("Gagal memproses pembayaran");
      }
    } catch (err) {
      console.error(err);
      alert("Error menghubungi server backend");
    }
  };

  const handleFinishTransaction = () => {
    setShowReceipt(false);
    setCart([]);
    setCustomerName("");
    setReceivedAmount("");
    setQueueNumber("");
    setIsMobileCartOpen(false);
  };

  const parsedReceived = parseInt(receivedAmount.replace(/\D/g, '')) || 0;
  const change = parsedReceived - total;

  return (
    <div className="h-[calc(100dvh-4rem)] min-h-[540px] flex flex-col lg:flex-row gap-0 -m-4 sm:-m-6 lg:-m-8 bg-slate-50 relative overflow-hidden">
      
      {/* Product List Section (Left) */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden relative z-0">
        
        {/* Search & Filter Header */}
        <div className="p-4 sm:p-5 lg:p-6 pb-3 space-y-3 bg-white border-b border-slate-200 sticky top-0 z-10">
          <div className="relative max-w-3xl">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-indigo-400" />
            </div>
            <input 
              type="text" 
              placeholder="Cari produk (Muffin, Kopi...)" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-12 pr-4 py-3 bg-slate-100 border border-transparent rounded-xl leading-5 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide max-w-full">
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all duration-200 shadow-sm ${
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
        <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5 lg:p-6 pb-28 lg:pb-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-full text-slate-500 font-medium">Memuat data produk dari Backend API...</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:[grid-template-columns:repeat(auto-fill,minmax(180px,1fr))] 2xl:[grid-template-columns:repeat(auto-fill,minmax(210px,1fr))] gap-3 sm:gap-4 lg:gap-5">
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
                    className="group relative min-w-0 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-0.5 hover:border-indigo-300 transition-all duration-200 flex flex-col cursor-pointer"
                    onClick={() => addToCart(product)}
                  >
                    {qtyInCart > 0 && (
                      <div className="absolute top-2.5 right-2.5 z-10 bg-indigo-600 text-white w-7 h-7 flex items-center justify-center rounded-full text-sm font-bold shadow-lg shadow-indigo-600/30">
                        {qtyInCart}
                      </div>
                    )}
                    
                    <div className="aspect-[4/3] sm:aspect-square lg:aspect-[4/3] w-full relative overflow-hidden bg-slate-100">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-80"></div>
                      <div className="absolute bottom-3 left-3 right-3">
                        <span className="inline-block max-w-full truncate px-2 py-1 bg-white/20 backdrop-blur-md text-white text-[11px] font-semibold rounded-md mb-1.5 border border-white/20">
                          {product.category}
                        </span>
                        <h3 className="font-bold text-white text-base sm:text-lg leading-tight line-clamp-2">{product.name}</h3>
                      </div>
                    </div>
                    <div className="p-3 sm:p-4 flex justify-between items-center gap-2 bg-white">
                      <div className="min-w-0">
                        <p className="text-indigo-600 font-bold text-base sm:text-lg truncate">Rp {product.price.toLocaleString('id-ID')}</p>
                        <p className="text-xs text-slate-400 font-medium mt-0.5">Stok: {product.stock}</p>
                      </div>
                      <button aria-label={`Tambah ${product.name}`} className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            {filteredProducts.length === 0 && (
              <div className="col-span-full py-16 text-center text-slate-500">
                Produk tidak ditemukan.
              </div>
            )}
          </div>
          )}
        </div>

        {/* Mobile Cart Floating Bar */}
        {!isMobileCartOpen && !showReceipt && (
          <div className="lg:hidden fixed bottom-4 left-4 right-4 z-40">
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
        fixed inset-y-0 right-0 z-40 w-full sm:w-[420px] lg:w-[390px] xl:w-[440px] 
        bg-white flex flex-col shadow-[0_0_40px_rgba(0,0,0,0.14)] lg:relative 
        transform transition-transform duration-300 ease-in-out border-l border-slate-200
        ${isMobileCartOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
      `}>
        {/* Cart Header */}
        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-100 flex justify-between items-center bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Pesanan Saat Ini</h2>
              <p className="text-xs text-slate-500 font-medium">Draft Transaksi</p>
            </div>
          </div>
          <button 
            className="lg:hidden p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors"
            onClick={() => setIsMobileCartOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5 bg-slate-50/50">
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
        <div className="bg-white border-t border-slate-100 p-4 sm:p-5 shadow-[0_-10px_40px_rgba(0,0,0,0.03)] z-20">
          <div className="space-y-3 text-sm mb-4">
            <div className="flex justify-between text-slate-500 font-medium">
              <span>Subtotal</span>
              <span className="text-slate-800">Rp {subtotal.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-slate-500 font-medium">
              <span>PPN (11%)</span>
              <span className="text-slate-800">Rp {tax.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between font-black text-xl text-slate-900 pt-4 border-t border-slate-100 border-dashed">
              <span>Total Tagihan</span>
              <span className="text-indigo-600">Rp {total.toLocaleString('id-ID')}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => setPaymentModalType("tunai")}
              disabled={cart.length === 0}
              className="group flex flex-col items-center justify-center gap-1 bg-slate-900 text-white p-4 rounded-2xl font-bold hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-slate-900/20"
            >
              <Banknote className="w-6 h-6 mb-1 text-emerald-400 group-hover:scale-110 transition-transform" />
              Tunai
            </button>
            <button 
              onClick={() => setPaymentModalType("qris")}
              disabled={cart.length === 0}
              className="group flex flex-col items-center justify-center gap-1 bg-indigo-600 text-white p-4 rounded-2xl font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-indigo-600/30"
            >
              <CreditCard className="w-6 h-6 mb-1 text-indigo-200 group-hover:scale-110 transition-transform" />
              QRIS
            </button>
          </div>
        </div>
      </div>

      {/* PAYMENT MODAL */}
      <AnimatePresence>
        {paymentModalType && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setPaymentModalType(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-full"
            >
              <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  {paymentModalType === "tunai" ? <Banknote className="w-6 h-6 text-emerald-600" /> : <QrCode className="w-6 h-6 text-indigo-600" />}
                  Pembayaran {paymentModalType === "tunai" ? "Tunai (Cash)" : "QRIS"}
                </h3>
                <button onClick={() => setPaymentModalType(null)} className="p-2 bg-white hover:bg-slate-100 text-slate-500 rounded-full shadow-sm">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleProcessPayment} className="p-6 overflow-y-auto space-y-6">
                
                {/* Total Tagihan Banner */}
                <div className="bg-indigo-600 text-white rounded-2xl p-6 text-center shadow-inner relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-full bg-indigo-700/50 transform -skew-y-6 origin-bottom-left -z-0"></div>
                  <div className="relative z-10">
                    <p className="text-indigo-200 font-medium mb-1">Total yang harus dibayar</p>
                    <p className="text-4xl font-black tracking-tight">Rp {total.toLocaleString('id-ID')}</p>
                  </div>
                </div>

                {/* Nama Customer */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Nama Pelanggan (Pemesan)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-slate-400" />
                    </div>
                    <input 
                      required autoFocus type="text" value={customerName} onChange={e => setCustomerName(e.target.value)}
                      placeholder="Contoh: Mas Budi"
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all text-lg font-medium"
                    />
                  </div>
                </div>

                {/* Specific Payment Fields */}
                {paymentModalType === "tunai" ? (
                  <div className="space-y-4 pt-2 border-t border-slate-100">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Uang Tunai Diterima</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <span className="text-slate-500 font-bold">Rp</span>
                        </div>
                        <input 
                          required type="number" min={total} value={receivedAmount} onChange={e => setReceivedAmount(e.target.value)}
                          placeholder={total.toString()}
                          className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all font-bold text-xl text-emerald-700"
                        />
                      </div>
                    </div>
                    
                    {parsedReceived >= total && (
                      <div className="flex justify-between items-center bg-emerald-50 text-emerald-800 p-4 rounded-xl border border-emerald-100">
                        <span className="font-bold">Kembalian:</span>
                        <span className="font-black text-xl">Rp {change.toLocaleString('id-ID')}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="pt-2 border-t border-slate-100 flex flex-col items-center">
                    <p className="text-sm font-medium text-slate-500 mb-4 text-center">Silakan minta pelanggan untuk scan QR Code di bawah ini menggunakan aplikasi M-Banking atau E-Wallet.</p>
                    <div className="w-48 h-48 bg-white border-2 border-slate-200 rounded-2xl flex items-center justify-center p-4 shadow-sm">
                      <QrCode className="w-full h-full text-slate-800" strokeWidth={1} />
                    </div>
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={!customerName || (paymentModalType === "tunai" && parsedReceived < total)}
                  className="w-full py-4 px-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
                >
                  <CheckCircle2 className="w-6 h-6" />
                  {paymentModalType === "tunai" ? "Selesaikan Pembayaran" : "Verifikasi & Selesai"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FINAL RECEIPT / SUCCESS OVERLAY */}
      <AnimatePresence>
        {showReceipt && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 50 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl"
            >
              {/* Receipt Header */}
              <div className="bg-emerald-500 p-8 flex flex-col items-center justify-center text-white text-center relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-400 rounded-full mix-blend-multiply opacity-50 blur-xl"></div>
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-emerald-600 rounded-full mix-blend-multiply opacity-50 blur-xl"></div>
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-4 border border-white/30 shadow-lg">
                    <CheckCircle2 className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-black tracking-tight mb-1">Transaksi Sukses!</h2>
                  <p className="text-emerald-100 font-medium">Pembayaran diterima</p>
                </div>
              </div>

              {/* Receipt Details */}
              <div className="p-8 bg-[#fdfdfd] relative">
                {/* Jagged border effect for receipt */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-slate-200 to-transparent opacity-30"></div>
                
                <div className="text-center mb-6">
                  <p className="text-sm text-slate-500 font-medium uppercase tracking-wider mb-1">Nomor Antrean</p>
                  <p className="text-5xl font-black text-slate-900 tracking-tighter">{queueNumber}</p>
                </div>

                <div className="space-y-4 border-t border-slate-200 border-dashed pt-6 mb-8">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Nama Pelanggan</span>
                    <span className="font-bold text-slate-900">{customerName}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Total Item</span>
                    <span className="font-bold text-slate-900">{cart.reduce((s, i) => s + i.qty, 0)} Item</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Metode Pembayaran</span>
                    <span className="font-bold text-slate-900 uppercase">{paymentModalType}</span>
                  </div>
                  
                  {paymentModalType === "tunai" && (
                    <>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500">Total Tagihan</span>
                        <span className="font-bold text-slate-900">Rp {total.toLocaleString('id-ID')}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm text-emerald-600 font-medium">
                        <span>Tunai Diterima</span>
                        <span>Rp {parsedReceived.toLocaleString('id-ID')}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm bg-slate-50 p-3 rounded-lg border border-slate-100 mt-2">
                        <span className="font-bold text-slate-700">Kembalian</span>
                        <span className="font-black text-slate-900">Rp {change.toLocaleString('id-ID')}</span>
                      </div>
                    </>
                  )}
                </div>

                <button 
                  onClick={handleFinishTransaction}
                  className="w-full py-4 px-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                >
                  <Receipt className="w-5 h-5" />
                  Selesai & Tutup
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
