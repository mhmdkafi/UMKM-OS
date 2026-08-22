"use client";

import { useState, useEffect } from "react";
import { Download } from "lucide-react";

const API = 'http://localhost:5000/api';
const fmt = (v: number) => `Rp ${v.toLocaleString('id-ID')}`;

export default function ReportsPage() {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    setCurrentUser(user);
    const businessId = user?.business_id || '';
    const url = businessId ? `${API}/dashboard/reports?business_id=${businessId}` : `${API}/dashboard/reports`;

    fetch(url)
      .then(res => res.json())
      .then(data => { setReport(data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-slate-500 font-medium">Memuat laporan keuangan dari Database...</div>
      </div>
    );
  }

  const pendapatan = report?.pendapatan || { total: 0, jumlahTransaksi: 0 };
  const cogs = report?.cogs || { total: 0 };
  const grossProfit = report?.grossProfit || 0;
  const pengeluaran = report?.pengeluaran || { total: 0, byCategory: {}, items: [] };
  const labaRugi = report?.labaRugi || 0;
  const businessName = report?.businessName || currentUser?.business_name || 'UMKM OS';
  const ownerName = currentUser?.name || 'Owner';

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Non-printable Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Laporan Keuangan</h2>
          <p className="text-slate-500">Laba Rugi (Income Statement) — Data real-time dari Database</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            Download / Cetak PDF
          </button>
        </div>
      </div>

      {/* Report Document (Printable) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 sm:p-12 print:shadow-none print:border-none print:p-0">
        
        {/* Document Header */}
        <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 uppercase tracking-tight">Laporan Laba Rugi</h1>
            <p className="text-slate-500 font-medium mt-1">{businessName}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-slate-800">Periode:</p>
            <p className="text-sm text-slate-600">All-Time (Data dari Database)</p>
            <p className="text-sm text-slate-400 mt-2">Dicetak pada: {new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
          </div>
        </div>

        {/* Financial Data Table */}
        <div className="space-y-6">
          
          {/* Pendapatan */}
          <div>
            <h3 className="font-bold text-slate-900 text-lg mb-3">I. Pendapatan (Revenue)</h3>
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-slate-100">
                  <td className="py-2 pl-4 text-slate-700">Total Pendapatan Penjualan ({pendapatan.jumlahTransaksi} transaksi)</td>
                  <td className="py-2 text-right font-medium text-slate-900">{fmt(pendapatan.total)}</td>
                </tr>
                <tr className="bg-slate-50 font-bold text-slate-900 border-t-2 border-slate-200">
                  <td className="py-3 pl-4">TOTAL PENDAPATAN KOTOR</td>
                  <td className="py-3 text-right">{fmt(pendapatan.total)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* HPP / COGS */}
          <div>
            <h3 className="font-bold text-slate-900 text-lg mb-3">II. HPP / COGS (Harga Pokok Penjualan)</h3>
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-slate-100">
                  <td className="py-2 pl-4 text-slate-700">Total HPP Bahan Baku (berdasarkan resep & WAC)</td>
                  <td className="py-2 text-right font-medium text-red-600">({fmt(cogs.total)})</td>
                </tr>
                <tr className="bg-slate-50 font-bold text-slate-900 border-t-2 border-slate-200">
                  <td className="py-3 pl-4">TOTAL HPP / COGS</td>
                  <td className="py-3 text-right text-red-700">({fmt(cogs.total)})</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Laba Kotor */}
          <div className="bg-indigo-50 border-y-2 border-indigo-200 py-3 px-4 flex justify-between font-bold text-indigo-900 text-lg">
            <span>LABA KOTOR (GROSS PROFIT)</span>
            <span>{fmt(grossProfit)}</span>
          </div>

          {/* Pengeluaran Operasional */}
          <div>
            <h3 className="font-bold text-slate-900 text-lg mb-3">III. Pengeluaran Operasional</h3>
            <table className="w-full text-sm">
              <tbody>
                {pengeluaran.items.length > 0 ? pengeluaran.items.map((exp: any, i: number) => (
                  <tr key={i} className="border-b border-slate-100">
                    <td className="py-2 pl-4 text-slate-700">{exp.name} <span className="text-xs text-slate-400">({exp.category})</span></td>
                    <td className="py-2 text-right font-medium text-slate-900">({fmt(exp.amount)})</td>
                  </tr>
                )) : (
                  <tr className="border-b border-slate-100">
                    <td className="py-2 pl-4 text-slate-400 italic">Belum ada pengeluaran operasional yang dicatat</td>
                    <td className="py-2 text-right text-slate-400">Rp 0</td>
                  </tr>
                )}
                <tr className="bg-slate-50 font-bold text-slate-900 border-t-2 border-slate-200">
                  <td className="py-3 pl-4">TOTAL PENGELUARAN OPERASIONAL</td>
                  <td className="py-3 text-right">({fmt(pengeluaran.total)})</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Laba Bersih */}
          <div className={`border-y-4 py-4 px-4 flex justify-between items-center ${labaRugi >= 0 ? 'bg-emerald-50 border-emerald-500' : 'bg-red-50 border-red-500'}`}>
            <span className={`font-bold text-xl tracking-tight ${labaRugi >= 0 ? 'text-emerald-900' : 'text-red-900'}`}>LABA BERSIH (NET PROFIT)</span>
            <span className={`font-black text-2xl ${labaRugi >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>{fmt(labaRugi)}</span>
          </div>
        </div>

        {/* Footer (Signatures) — dynamic from logged in user */}
        <div className="mt-20 pt-8 flex justify-between text-center px-10">
          <div>
            <p className="text-slate-500 mb-16">Disiapkan oleh,</p>
            <p className="font-bold text-slate-900 border-t border-slate-400 pt-2 inline-block px-4">{ownerName}</p>
          </div>
          <div>
            <p className="text-slate-500 mb-16">Tanggal,</p>
            <p className="font-bold text-slate-900 border-t border-slate-400 pt-2 inline-block px-4">{new Date().toLocaleDateString('id-ID')}</p>
          </div>
        </div>

      </div>

      {/* CSS untuk menyembunyikan elemen UI saat di-print (PDF) */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body {
            background-color: white !important;
          }
          header, nav, .fixed {
            display: none !important;
          }
          main {
            padding: 0 !important;
            margin: 0 !important;
          }
        }
      `}} />
    </div>
  );
}
