"use client";

import { useState } from "react";
import { Plus, Search, UserPlus, ShieldAlert, Edit3, Trash2, KeyRound, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const initialEmployees = [
  { id: 1, name: "Budi Santoso", role: "Owner", accessType: "Email", accessValue: "budi@umkmos.com", status: "Aktif" },
  { id: 2, name: "Siti Aminah", role: "Manager", accessType: "Email", accessValue: "siti@umkmos.com", status: "Aktif" },
  { id: 3, name: "Rian Hidayat", role: "Kasir", accessType: "PIN", accessValue: "••••12", status: "Aktif" },
];

export default function EmployeesPage() {
  const [employees, setEmployees] = useState(initialEmployees);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("Kasir");
  const [newAccessValue, setNewAccessValue] = useState("");

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(search.toLowerCase()) || 
    emp.role.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newAccessValue) return;

    const accessType = newRole === "Kasir" ? "PIN" : "Email";
    
    setEmployees([
      ...employees, 
      {
        id: Date.now(),
        name: newName,
        role: newRole,
        accessType: accessType,
        accessValue: accessType === "PIN" ? `••••${newAccessValue.slice(-2)}` : newAccessValue,
        status: "Aktif"
      }
    ]);
    
    setIsModalOpen(false);
    setNewName("");
    setNewRole("Kasir");
    setNewAccessValue("");
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Manajemen Karyawan</h2>
          <p className="text-slate-500">Atur akses kasir dan manajer ke dalam sistem UMKM OS Anda.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-600/20"
        >
          <UserPlus className="w-5 h-5" />
          Tambah Karyawan
        </button>
      </div>

      {/* Info Card */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5 flex gap-4 items-start">
        <ShieldAlert className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-indigo-900 mb-1">Pemberian Akses (Role)</h3>
          <p className="text-sm text-indigo-700 leading-relaxed">
            Karyawan tidak perlu mendaftar sendiri. Anda sebagai Owner cukup membuatkan akses di halaman ini. <br/>
            Untuk <strong>Kasir</strong>, sistem menggunakan akses <strong>PIN 6 Digit</strong> agar proses login di mesin kasir lebih cepat. Sedangkan untuk <strong>Manajer</strong> menggunakan akses <strong>Email & Password</strong> standar.
          </p>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50">
          <div className="relative max-w-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input 
              type="text" 
              placeholder="Cari nama atau role karyawan..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-slate-200 text-sm text-slate-500">
                <th className="py-4 px-6 font-medium">Nama Karyawan</th>
                <th className="py-4 px-6 font-medium">Role / Peran</th>
                <th className="py-4 px-6 font-medium">Metode Login</th>
                <th className="py-4 px-6 font-medium">Status</th>
                <th className="py-4 px-6 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6">
                    <p className="font-bold text-slate-900">{emp.name}</p>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                      emp.role === 'Owner' ? 'bg-purple-100 text-purple-700' :
                      emp.role === 'Manager' ? 'bg-blue-100 text-blue-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {emp.role}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      {emp.accessType === "Email" ? <Mail className="w-4 h-4 text-slate-400" /> : <KeyRound className="w-4 h-4 text-slate-400" />}
                      <span className="text-sm text-slate-600 font-medium">{emp.accessValue}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      {emp.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button disabled={emp.role === 'Owner'} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button disabled={emp.role === 'Owner'} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredEmployees.length === 0 && (
            <div className="p-12 text-center text-slate-500">
              Karyawan tidak ditemukan.
            </div>
          )}
        </div>
      </div>

      {/* Modal Tambah Karyawan */}
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
                <h3 className="text-xl font-bold text-slate-900">Tambah Karyawan Baru</h3>
              </div>
              
              <form onSubmit={handleAddEmployee} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Nama Lengkap</label>
                  <input 
                    required type="text" value={newName} onChange={e => setNewName(e.target.value)}
                    placeholder="Contoh: Rian Hidayat"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Pilih Peran (Role)</label>
                  <select 
                    value={newRole} onChange={e => setNewRole(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                  >
                    <option value="Kasir">Kasir (Akses via PIN)</option>
                    <option value="Manager">Manajer (Akses via Email)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    {newRole === "Kasir" ? "Buat PIN Akses (6 Digit)" : "Alamat Email Karyawan"}
                  </label>
                  <input 
                    required 
                    type={newRole === "Kasir" ? "password" : "email"}
                    value={newAccessValue} onChange={e => setNewAccessValue(e.target.value)}
                    maxLength={newRole === "Kasir" ? 6 : undefined}
                    placeholder={newRole === "Kasir" ? "123456" : "email@contoh.com"}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all tracking-widest"
                  />
                  {newRole === "Kasir" && (
                    <p className="text-xs text-slate-500 mt-2 flex gap-1 items-start">
                      <KeyRound className="w-3.5 h-3.5 flex-shrink-0" />
                      PIN ini akan digunakan Kasir untuk login cepat di mesin POS/Tablet tanpa perlu memasukkan email.
                    </p>
                  )}
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
                    className="flex-1 py-3 px-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Simpan Data
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
