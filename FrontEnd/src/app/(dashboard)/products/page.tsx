"use client";

import { useState } from "react";
import { Plus, Search, Filter, Settings2, Edit3, Trash2, Tag, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const dummyProducts = [
  { 
    id: 1, name: "Kopi Susu Aren", price: 20000, category: "Kopi", cogs: 8500, margin: 57.5,
    recipe: [
      { item: "Biji Kopi Robusta", qty: "18", unit: "gram" },
      { item: "Susu UHT", qty: "120", unit: "ml" },
      { item: "Gula Aren", qty: "20", unit: "ml" },
      { item: "Cup Plastik 16oz", qty: "1", unit: "pcs" }
    ]
  },
  { 
    id: 2, name: "Americano", price: 15000, category: "Kopi", cogs: 4000, margin: 73.3,
    recipe: [
      { item: "Biji Kopi Arabica", qty: "18", unit: "gram" },
      { item: "Air", qty: "200", unit: "ml" },
      { item: "Cup Plastik 16oz", qty: "1", unit: "pcs" }
    ]
  },
  { 
    id: 3, name: "Matcha Latte", price: 25000, category: "Non-Kopi", cogs: 11000, margin: 56.0,
    recipe: [
      { item: "Bubuk Matcha", qty: "20", unit: "gram" },
      { item: "Susu UHT", qty: "150", unit: "ml" },
      { item: "Simple Syrup", qty: "15", unit: "ml" },
      { item: "Cup Plastik 16oz", qty: "1", unit: "pcs" }
    ]
  },
];

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  const filteredProducts = dummyProducts.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto flex flex-col h-[calc(100vh-6rem)]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Produk & Resep (BOM)</h2>
          <p className="text-slate-500">Kelola daftar menu dan resep bahan baku pemotong stok.</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm">
          <Plus className="w-4 h-4" />
          Tambah Produk Baru
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        {/* Left Side: Product List */}
        <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col min-h-0">
          <div className="p-4 border-b border-slate-200 flex gap-4 bg-slate-50/50 flex-shrink-0">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input 
                type="text" 
                placeholder="Cari produk..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="block w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 px-3 py-2 rounded-lg hover:bg-slate-50">
              <Filter className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <div className="divide-y divide-slate-100">
              {filteredProducts.map((product) => (
                <div 
                  key={product.id} 
                  onClick={() => setSelectedProduct(product)}
                  className={`p-4 cursor-pointer transition-colors hover:bg-indigo-50/50 ${
                    selectedProduct?.id === product.id ? "bg-indigo-50/80 border-l-4 border-indigo-600" : "border-l-4 border-transparent"
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-slate-900">{product.name}</h3>
                    <span className="text-sm font-bold text-slate-900">Rp {product.price.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex gap-4 text-sm mt-2">
                    <span className="flex items-center gap-1 text-slate-500">
                      <Tag className="w-3.5 h-3.5" /> {product.category}
                    </span>
                    <span className="text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-full text-xs">
                      Margin: {product.margin}%
                    </span>
                  </div>
                </div>
              ))}
              
              {filteredProducts.length === 0 && (
                <div className="p-8 text-center text-slate-500">
                  Produk tidak ditemukan.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Recipe (BOM) Details */}
        <div className="w-full lg:w-[450px] flex-shrink-0 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col min-h-0">
          {selectedProduct ? (
            <AnimatePresence mode="wait">
              <motion.div 
                key={selectedProduct.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col h-full"
              >
                <div className="p-5 border-b border-slate-200 bg-slate-50 flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-1">{selectedProduct.name}</h3>
                    <p className="text-sm text-slate-500 flex items-center gap-1">
                      <BookOpen className="w-4 h-4" /> Resep / Bill of Materials
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-5 space-y-6">
                  {/* Financial Summary inside Recipe */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                      <p className="text-xs text-slate-500 font-medium mb-1">Harga Jual (Price)</p>
                      <p className="text-lg font-bold text-slate-900">Rp {selectedProduct.price.toLocaleString('id-ID')}</p>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                      <p className="text-xs text-orange-600 font-medium mb-1">Total HPP / COGS</p>
                      <p className="text-lg font-bold text-orange-700">Rp {selectedProduct.cogs.toLocaleString('id-ID')}</p>
                    </div>
                  </div>

                  {/* Recipe List */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-semibold text-slate-800">Komposisi Bahan Baku</h4>
                      <button className="text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                        <Plus className="w-3 h-3" /> Tambah Bahan
                      </button>
                    </div>
                    
                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                          <tr>
                            <th className="px-4 py-2 font-medium">Bahan</th>
                            <th className="px-4 py-2 font-medium text-right">Takaran</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {selectedProduct.recipe.map((r: any, idx: number) => (
                            <tr key={idx} className="hover:bg-slate-50/50">
                              <td className="px-4 py-3 font-medium text-slate-700">{r.item}</td>
                              <td className="px-4 py-3 text-right text-slate-600">
                                <span className="font-semibold text-slate-900">{r.qty}</span> {r.unit}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="text-xs text-slate-400 mt-3 flex items-start gap-1.5">
                      <Settings2 className="w-4 h-4 flex-shrink-0" />
                      Setiap 1 produk terjual di Kasir (POS) akan otomatis mengurangi stok bahan-bahan di atas.
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center space-y-4">
              <BookOpen className="w-16 h-16 opacity-20" />
              <p>Pilih produk di sebelah kiri untuk melihat resep dan HPP.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
