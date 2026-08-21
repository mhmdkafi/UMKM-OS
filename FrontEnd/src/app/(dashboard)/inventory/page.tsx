"use client";

import { useState } from "react";
import { Plus, Search, Filter, AlertTriangle, ArrowDownToLine, ArrowUpRight, History } from "lucide-react";
import { motion } from "framer-motion";

const dummyInventory = [
  { id: 1, name: "Biji Kopi Robusta", category: "Bahan Baku", stock: 12, unit: "Kg", minStock: 5, lastUpdate: "2026-08-20", status: "Aman" },
  { id: 2, name: "Biji Kopi Arabica", category: "Bahan Baku", stock: 8, unit: "Kg", minStock: 5, lastUpdate: "2026-08-21", status: "Aman" },
  { id: 3, name: "Susu UHT Full Cream", category: "Bahan Baku", stock: 2, unit: "Liter", minStock: 10, lastUpdate: "2026-08-21", status: "Kritis" },
  { id: 4, name: "Gula Aren Cair", category: "Bahan Baku", stock: 1, unit: "Liter", minStock: 3, lastUpdate: "2026-08-19", status: "Kritis" },
  { id: 5, name: "Cup Plastik 16oz", category: "Packaging", stock: 450, unit: "Pcs", minStock: 200, lastUpdate: "2026-08-15", status: "Aman" },
  { id: 6, name: "Sedotan Ramah Lingkungan", category: "Packaging", stock: 800, unit: "Pcs", minStock: 300, lastUpdate: "2026-08-15", status: "Aman" },
];

export default function InventoryPage() {
  const [search, setSearch] = useState("");

  const filteredInventory = dummyInventory.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase()) || 
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Manajemen Inventaris</h2>
          <p className="text-slate-500">Pantau pergerakan stok dan ketersediaan bahan baku.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-50 transition-colors shadow-sm">
            <ArrowDownToLine className="w-4 h-4" />
            Stock In
          </button>
          <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm">
            <History className="w-4 h-4" />
            Opname / Adjust
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
            <ArrowDownToLine className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Item (SKU)</p>
            <h4 className="text-2xl font-bold text-slate-900">124</h4>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-red-50 rounded-lg text-red-600">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Stok Kritis / Habis</p>
            <h4 className="text-2xl font-bold text-slate-900">2 Item</h4>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600">
            <ArrowUpRight className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Nilai Aset Gudang (WAC)</p>
            <h4 className="text-2xl font-bold text-slate-900">Rp 12.450.000</h4>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
          <div className="relative w-full sm:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input 
              type="text" 
              placeholder="Cari bahan baku..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 px-3 py-2 rounded-lg hover:bg-slate-50 w-full sm:w-auto justify-center">
            <Filter className="w-4 h-4" />
            Filter Kategori
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-slate-200 text-sm text-slate-500">
                <th className="py-4 px-6 font-medium">Nama Barang</th>
                <th className="py-4 px-6 font-medium">Kategori</th>
                <th className="py-4 px-6 font-medium">Stok Tersedia</th>
                <th className="py-4 px-6 font-medium">Batas Minimum</th>
                <th className="py-4 px-6 font-medium">Status</th>
                <th className="py-4 px-6 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInventory.map((item) => (
                <motion.tr 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  key={item.id} 
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  <td className="py-4 px-6">
                    <p className="font-semibold text-slate-900">{item.name}</p>
                    <p className="text-xs text-slate-400 mt-1">Diupdate: {item.lastUpdate}</p>
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-600">{item.category}</td>
                  <td className="py-4 px-6">
                    <span className="font-semibold text-slate-900">{item.stock}</span> {item.unit}
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-600">{item.minStock} {item.unit}</td>
                  <td className="py-4 px-6">
                    {item.status === 'Kritis' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                        {item.status}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        {item.status}
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                      Detail
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          
          {filteredInventory.length === 0 && (
            <div className="p-8 text-center text-slate-500">
              Barang tidak ditemukan.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
