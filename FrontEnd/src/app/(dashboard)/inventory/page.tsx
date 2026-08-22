"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Filter, AlertTriangle, ArrowDownToLine, ArrowUpRight, History, Trash2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const API = 'http://localhost:5000/api';

export default function InventoryPage() {
  const [search, setSearch] = useState("");
  const [inventory, setInventory] = useState<any[]>([]);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [adjustType, setAdjustType] = useState<'in' | 'out'>('in');
  const [adjustAmount, setAdjustAmount] = useState("");
  const [adjustNotes, setAdjustNotes] = useState("");

  // Add form state
  const [newName, setNewName] = useState("");
  const [newUnit, setNewUnit] = useState("Gram");
  const [newStock, setNewStock] = useState("");
  const [newMinStock, setNewMinStock] = useState("");
  const [businessCategory, setBusinessCategory] = useState("Lainnya");

  const fetchInventory = () => {
    fetch(`${API}/inventory`)
      .then(res => res.json())
      .then(data => setInventory(data))
      .catch(console.error);
  };

  useEffect(() => {
    fetchInventory();
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        const cat = user.business_category || 'Lainnya';
        setBusinessCategory(cat);
        if (cat === "fnb" || cat === "Food & Beverage (Kuliner)") {
          setNewUnit("Gram");
        } else {
          setNewUnit("Pcs");
        }
      } catch (e) {}
    }
  }, []);

  let itemLabel = "Item";
  let itemLabelLower = "item";
  let itemExample = "Barang A";
  let pageTitle = "Inventaris & Stok";
  let pageSubtitle = "Pantau pergerakan stok dan ketersediaan barang.";
  let availableUnits = ["Pcs", "Box", "Kg", "Liter", "Unit"];

  if (businessCategory === "fnb" || businessCategory === "Food & Beverage (Kuliner)") {
     itemLabel = "Bahan Baku";
     itemLabelLower = "bahan baku";
     itemExample = "Susu Almond";
     pageTitle = "Inventaris Bahan Baku";
     pageSubtitle = "Pantau pergerakan stok dan ketersediaan bahan baku.";
     availableUnits = ["Gram", "Kg", "ml", "Liter", "Pcs", "Dus", "Pak"];
  } else if (businessCategory === "retail" || businessCategory === "Retail / Toko Kelontong") {
     itemLabel = "Barang";
     itemLabelLower = "barang";
     itemExample = "Sabun Cuci";
     pageTitle = "Stok Gudang";
     pageSubtitle = "Pantau pergerakan stok dan ketersediaan barang jualan.";
     availableUnits = ["Pcs", "Dus", "Pak", "Karton", "Botol", "Renteng", "Kg", "Gram"];
  } else if (businessCategory === "fashion" || businessCategory === "Fashion & Pakaian") {
     itemLabel = "Pakaian";
     itemLabelLower = "pakaian / kain";
     itemExample = "Kemeja Flanel";
     pageTitle = "Stok Barang / Kain";
     pageSubtitle = "Pantau pergerakan stok dan ketersediaan pakaian dan kain.";
     availableUnits = ["Pcs", "Lusin", "Kodi", "Meter", "Gulung"];
  } else if (businessCategory === "services" || businessCategory === "Jasa / Salon / Bengkel") {
     itemLabel = "Perlengkapan";
     itemLabelLower = "perlengkapan";
     itemExample = "Oli Mesin";
     pageTitle = "Perlengkapan & Suku Cadang";
     pageSubtitle = "Pantau pergerakan stok perlengkapan dan suku cadang.";
     availableUnits = ["Pcs", "Set", "Botol", "Liter", "Tube"];
  }

  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase()) || 
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  const totalItems = inventory.length;
  const criticalItems = inventory.filter(i => i.status === 'Kritis' || i.status === 'Menipis').length;

  const handleAdjust = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem || !adjustAmount) return;
    try {
      await fetch(`${API}/inventory/adjust`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedItem.id,
          type: adjustType,
          amount: parseFloat(adjustAmount),
          notes: adjustNotes || `${adjustType === 'in' ? 'Stock In' : 'Stock Out'} manual`,
        }),
      });
      setShowAdjustModal(false);
      setAdjustAmount("");
      setAdjustNotes("");
      fetchInventory();
    } catch (err) { console.error(err); }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newStock) return;
    try {
      const biz = inventory[0]?.business_id;
      await fetch(`${API}/inventory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_id: biz,
          name: newName,
          unit: newUnit,
          stock: newStock,
          min_stock_alert: newMinStock || "0",
        }),
      });
      setShowAddModal(false);
      setNewName(""); setNewUnit("Gram"); setNewStock(""); setNewMinStock("");
      fetchInventory();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(`Hapus ${itemLabelLower} ini?`)) return;
    try {
      await fetch(`${API}/inventory/${id}`, { method: 'DELETE' });
      fetchInventory();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{pageTitle}</h2>
          <p className="text-slate-500">{pageSubtitle}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-50 transition-colors shadow-sm">
            <Plus className="w-4 h-4" />
            Tambah {itemLabel}
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
            <h4 className="text-2xl font-bold text-slate-900">{totalItems}</h4>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-red-50 rounded-lg text-red-600">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Stok Kritis / Menipis</p>
            <h4 className="text-2xl font-bold text-slate-900">{criticalItems} Item</h4>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600">
            <ArrowUpRight className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Stok Aman</p>
            <h4 className="text-2xl font-bold text-slate-900">{totalItems - criticalItems} Item</h4>
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
              placeholder={`Cari ${itemLabelLower}...`} 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-slate-200 text-sm text-slate-500">
                <th className="py-4 px-6 font-medium">Nama {itemLabel}</th>
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
                    <p className="text-xs text-slate-400 mt-1">Update: {item.lastUpdate}</p>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-semibold text-slate-900">{item.stock}</span> {item.unit}
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-600">{item.minStock} {item.unit}</td>
                  <td className="py-4 px-6">
                    {item.status === 'Kritis' || item.status === 'Menipis' ? (
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
                    <div className="flex justify-end gap-2">
                      <button onClick={() => { setSelectedItem(item); setAdjustType('in'); setShowAdjustModal(true); }} className="text-indigo-600 hover:text-indigo-900 text-sm font-medium px-2 py-1 rounded hover:bg-indigo-50">
                        Adjust
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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

      {/* Adjust Stock Modal */}
      <AnimatePresence>
        {showAdjustModal && selectedItem && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-900">Adjust Stok: {selectedItem.name}</h3>
                <button onClick={() => setShowAdjustModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleAdjust} className="space-y-4">
                <div className="flex gap-2">
                  <button type="button" onClick={() => setAdjustType('in')} className={`flex-1 py-2 rounded-lg font-medium text-sm ${adjustType === 'in' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}>Stock In (+)</button>
                  <button type="button" onClick={() => setAdjustType('out')} className={`flex-1 py-2 rounded-lg font-medium text-sm ${adjustType === 'out' ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-600'}`}>Stock Out (-)</button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Jumlah ({selectedItem.unit})</label>
                  <input type="number" value={adjustAmount} onChange={e => setAdjustAmount(e.target.value)} required className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900" placeholder="Contoh: 500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Catatan</label>
                  <input type="text" value={adjustNotes} onChange={e => setAdjustNotes(e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900" placeholder="Beli dari supplier, dll" />
                </div>
                <button type="submit" className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors">Simpan Adjustment</button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Ingredient Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-900">Tambah {itemLabel}</h3>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleAdd} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nama {itemLabel}</label>
                  <input type="text" value={newName} onChange={e => setNewName(e.target.value)} required className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900" placeholder={`Contoh: ${itemExample}`} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Satuan</label>
                  <select value={newUnit} onChange={e => setNewUnit(e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900">
                    {availableUnits.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Stok Awal</label>
                    <input type="number" value={newStock} onChange={e => setNewStock(e.target.value)} required className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Batas Minimum</label>
                    <input type="number" value={newMinStock} onChange={e => setNewMinStock(e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900" />
                  </div>
                </div>
                <button type="submit" className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors">Simpan</button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
