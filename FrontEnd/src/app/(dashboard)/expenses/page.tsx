"use client";

import { useState, useEffect } from "react";
import { Plus, Search, DollarSign, ArrowDownRight, Tag, Calendar, Edit3, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const API = 'http://localhost:5000/api';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getBusinessId = () => {
    if (typeof window !== 'undefined') {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user.business_id;
    }
    return '';
  };

  const fetchExpenses = () => {
    const bid = getBusinessId();
    if (!bid) return;
    fetch(`${API}/expenses?business_id=${bid}`)
      .then(res => res.json())
      .then(data => setExpenses(data))
      .catch(console.error);
  };

  useEffect(() => { fetchExpenses(); }, []);

  const handleDeleteExpense = async (id: string) => {
    if (!confirm('Hapus pengeluaran ini?')) return;
    try {
      await fetch(`${API}/expenses/${id}`, { method: 'DELETE' });
      fetchExpenses();
    } catch (err) { console.error(err); }
  };

  // Form State Tambah
  const [newName, setNewName] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newCategory, setNewCategory] = useState("Variabel (Variable)");
  const [newDate, setNewDate] = useState("");
  const [newNotes, setNewNotes] = useState("");

  // Form State Edit
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<any>(null);
  const [editName, setEditName] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editCategory, setEditCategory] = useState("Variabel (Variable)");
  const [editDate, setEditDate] = useState("");
  const [editNotes, setEditNotes] = useState("");

  const filteredExpenses = expenses.filter(exp => 
    exp.name.toLowerCase().includes(search.toLowerCase()) || 
    exp.category.toLowerCase().includes(search.toLowerCase())
  );

  const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newAmount || !newDate) return;

    try {
      const bid = getBusinessId();
      const response = await fetch(`${API}/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_id: bid,
          name: newName,
          amount: newAmount,
          category: newCategory,
          date: newDate,
          notes: newNotes
        })
      });
      
      const data = await response.json();
      if (data.success) {
        fetchExpenses();
        setIsModalOpen(false);
        setNewName(""); setNewAmount(""); setNewCategory("Variabel (Variable)"); setNewDate(""); setNewNotes("");
      }
    } catch (err) {
      console.error(err);
      alert('Failed to save expense');
    }
  };

  const handleEditClick = (exp: any) => {
    setEditingExpense(exp);
    setEditName(exp.name);
    setEditAmount(exp.amount.toString());
    setEditCategory(exp.category);
    setEditDate(exp.date);
    setEditNotes(exp.notes || "");
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExpense) return;
    
    try {
      const response = await fetch(`${API}/expenses/${editingExpense.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editName,
          amount: parseFloat(editAmount),
          category: editCategory,
          date: editDate,
          notes: editNotes
        })
      });
      const data = await response.json();
      if (data.success) {
        fetchExpenses();
        setIsEditModalOpen(false);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update expense');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Pengeluaran Operasional</h2>
          <p className="text-slate-500">Catat biaya non-bahan baku (gaji, listrik, sewa) untuk mengetahui Laba Bersih riil.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-rose-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-rose-700 transition-colors shadow-sm shadow-rose-600/20"
        >
          <Plus className="w-5 h-5" />
          Catat Pengeluaran
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center">
            <ArrowDownRight className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Pengeluaran (Tampil)</p>
            <p className="text-2xl font-bold text-slate-900">Rp {totalExpenses.toLocaleString('id-ID')}</p>
          </div>
        </div>
        
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 sm:col-span-2 flex gap-4 items-start">
          <DollarSign className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-indigo-900 mb-1">Dampak terhadap Laba Bersih</h3>
            <p className="text-sm text-indigo-700 leading-relaxed">
              Setiap pengeluaran yang Anda catat di sini akan langsung mengurangi <strong>Gross Profit (Laba Kotor)</strong> pada laporan keuangan. Pastikan tidak ada biaya operasional yang terlewat agar <strong>Net Profit (Laba Bersih)</strong> yang tampil di Dashboard akurat 100%.
            </p>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:max-w-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input 
              type="text" 
              placeholder="Cari nama pengeluaran..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 transition-shadow"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-slate-200 text-sm text-slate-500">
                <th className="py-4 px-6 font-medium">Tanggal</th>
                <th className="py-4 px-6 font-medium">Nama Pengeluaran</th>
                <th className="py-4 px-6 font-medium">Kategori</th>
                <th className="py-4 px-6 font-medium text-right">Nominal</th>
                <th className="py-4 px-6 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredExpenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6 text-slate-600">
                    {new Date(exp.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-bold text-slate-900">{exp.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5 truncate max-w-xs">{exp.notes}</p>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                      <Tag className="w-3 h-3" />
                      {exp.category}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right font-bold text-rose-600">
                    Rp {exp.amount.toLocaleString('id-ID')}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleEditClick(exp)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteExpense(exp.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredExpenses.length === 0 && (
            <div className="p-12 text-center text-slate-500">
              Tidak ada data pengeluaran yang cocok dengan pencarian Anda.
            </div>
          )}
        </div>
      </div>

      {/* Modal Tambah Pengeluaran */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-slate-100">
                <h3 className="text-xl font-bold text-slate-900">Catat Pengeluaran Baru</h3>
              </div>
              
              <form onSubmit={handleAddExpense} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Nama/Deskripsi Biaya</label>
                  <input 
                    required type="text" value={newName} onChange={e => setNewName(e.target.value)}
                    placeholder="Contoh: Pembelian Gas Elpiji 12kg"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:bg-white outline-none transition-all"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Tanggal</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-4 w-4 text-slate-400" />
                      </div>
                      <input 
                        required type="date" value={newDate} onChange={e => setNewDate(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:bg-white outline-none transition-all text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Kategori</label>
                    <select 
                      value={newCategory} onChange={e => setNewCategory(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:bg-white outline-none transition-all text-sm"
                    >
                      <option value="Tetap (Fixed)">Biaya Tetap</option>
                      <option value="Variabel (Variable)">Biaya Variabel</option>
                      <option value="Pemasaran (Marketing)">Pemasaran</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Nominal (Rp)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="text-slate-500 font-bold">Rp</span>
                    </div>
                    <input 
                      required type="number" min="0" value={newAmount} onChange={e => setNewAmount(e.target.value)}
                      placeholder="500000"
                      className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:bg-white outline-none transition-all font-bold text-rose-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Catatan (Opsional)</label>
                  <input 
                    type="text" value={newNotes} onChange={e => setNewNotes(e.target.value)}
                    placeholder="Contoh: Untuk periode bulan Agustus"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:bg-white outline-none transition-all"
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    type="button" onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 px-4 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-3 px-4 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 shadow-md shadow-rose-600/20 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Simpan Biaya
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Edit Pengeluaran */}
      <AnimatePresence>
        {isEditModalOpen && editingExpense && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setIsEditModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-slate-100">
                <h3 className="text-xl font-bold text-slate-900">Edit Pengeluaran</h3>
              </div>
              
              <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Nama/Deskripsi Biaya</label>
                  <input 
                    required type="text" value={editName} onChange={e => setEditName(e.target.value)}
                    placeholder="Contoh: Pembelian Gas Elpiji 12kg"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:bg-white outline-none transition-all"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Tanggal</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-4 w-4 text-slate-400" />
                      </div>
                      <input 
                        required type="date" value={editDate} onChange={e => setEditDate(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:bg-white outline-none transition-all text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Kategori</label>
                    <select 
                      value={editCategory} onChange={e => setEditCategory(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:bg-white outline-none transition-all text-sm"
                    >
                      <option value="Tetap (Fixed)">Biaya Tetap</option>
                      <option value="Variabel (Variable)">Biaya Variabel</option>
                      <option value="Pemasaran (Marketing)">Pemasaran</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Nominal (Rp)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="text-slate-500 font-bold">Rp</span>
                    </div>
                    <input 
                      required type="number" min="0" value={editAmount} onChange={e => setEditAmount(e.target.value)}
                      placeholder="500000"
                      className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:bg-white outline-none transition-all font-bold text-rose-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Catatan (Opsional)</label>
                  <input 
                    type="text" value={editNotes} onChange={e => setEditNotes(e.target.value)}
                    placeholder="Contoh: Untuk periode bulan Agustus"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:bg-white outline-none transition-all"
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    type="button" onClick={() => setIsEditModalOpen(false)}
                    className="flex-1 py-3 px-4 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-3 px-4 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 shadow-md shadow-rose-600/20 transition-colors flex items-center justify-center gap-2"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
