"use client";

import { Download, FileText, Calendar, Printer } from "lucide-react";
import { motion } from "framer-motion";

export default function ReportsPage() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Non-printable Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Laporan Keuangan</h2>
          <p className="text-slate-500">Laba Rugi (Income Statement) Periode Agustus 2026</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        </div>
      </div>

      {/* Report Document (Printable) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 sm:p-12 print:shadow-none print:border-none print:p-0">
        
        {/* Document Header */}
        <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 uppercase tracking-tight">Laba Rugi</h1>
            <p className="text-slate-500 font-medium mt-1">UMKM OS - Kopi Senja</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-slate-800">Periode:</p>
            <p className="text-sm text-slate-600">01 Agustus 2026 - 31 Agustus 2026</p>
            <p className="text-sm text-slate-400 mt-2">Dicetak pada: {new Date().toLocaleDateString('id-ID')}</p>
          </div>
        </div>

        {/* Financial Data Table */}
        <div className="space-y-6">
          
          {/* Pendapatan */}
          <div>
            <h3 className="font-bold text-slate-900 text-lg mb-3">Pendapatan</h3>
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-slate-100">
                  <td className="py-2 pl-4 text-slate-700">Pendapatan Penjualan Kopi</td>
                  <td className="py-2 text-right font-medium text-slate-900">Rp 45.500.000</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2 pl-4 text-slate-700">Pendapatan Penjualan Makanan</td>
                  <td className="py-2 text-right font-medium text-slate-900">Rp 12.300.000</td>
                </tr>
                <tr className="bg-slate-50 font-bold text-slate-900 border-t-2 border-slate-200">
                  <td className="py-3 pl-4">TOTAL PENDAPATAN KOTOR</td>
                  <td className="py-3 text-right">Rp 57.800.000</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* HPP (Harga Pokok Penjualan) */}
          <div>
            <h3 className="font-bold text-slate-900 text-lg mb-3">Harga Pokok Penjualan (HPP)</h3>
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-slate-100">
                  <td className="py-2 pl-4 text-slate-700">Bahan Baku Awal</td>
                  <td className="py-2 text-right font-medium text-slate-900">Rp 8.000.000</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2 pl-4 text-slate-700">Pembelian Bahan Baku</td>
                  <td className="py-2 text-right font-medium text-slate-900">Rp 20.000.000</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2 pl-4 text-slate-700">Bahan Baku Akhir</td>
                  <td className="py-2 text-right font-medium text-slate-900">(Rp 5.500.000)</td>
                </tr>
                <tr className="bg-slate-50 font-bold text-slate-900 border-t-2 border-slate-200">
                  <td className="py-3 pl-4">TOTAL HPP</td>
                  <td className="py-3 text-right">Rp 22.500.000</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Laba Kotor */}
          <div className="bg-indigo-50 border-y-2 border-indigo-200 py-3 px-4 flex justify-between font-bold text-indigo-900 text-lg">
            <span>LABA KOTOR</span>
            <span>Rp 35.300.000</span>
          </div>

          {/* Pengeluaran Operasional */}
          <div>
            <h3 className="font-bold text-slate-900 text-lg mb-3">Pengeluaran Operasional</h3>
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-slate-100">
                  <td className="py-2 pl-4 text-slate-700">Gaji Karyawan</td>
                  <td className="py-2 text-right font-medium text-slate-900">Rp 12.000.000</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2 pl-4 text-slate-700">Sewa Tempat</td>
                  <td className="py-2 text-right font-medium text-slate-900">Rp 5.000.000</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2 pl-4 text-slate-700">Listrik, Air & Internet</td>
                  <td className="py-2 text-right font-medium text-slate-900">Rp 2.500.000</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2 pl-4 text-slate-700">Pemasaran (Ads)</td>
                  <td className="py-2 text-right font-medium text-slate-900">Rp 1.000.000</td>
                </tr>
                <tr className="bg-slate-50 font-bold text-slate-900 border-t-2 border-slate-200">
                  <td className="py-3 pl-4">TOTAL PENGELUARAN</td>
                  <td className="py-3 text-right">Rp 20.500.000</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Laba Bersih */}
          <div className="bg-emerald-50 border-y-4 border-emerald-500 py-4 px-4 flex justify-between items-center">
            <span className="font-bold text-emerald-900 text-xl tracking-tight">LABA BERSIH (NET PROFIT)</span>
            <span className="font-black text-emerald-700 text-2xl">Rp 14.800.000</span>
          </div>
        </div>

        {/* Footer (Signatures) */}
        <div className="mt-20 pt-8 flex justify-between text-center px-10">
          <div>
            <p className="text-slate-500 mb-16">Disiapkan oleh,</p>
            <p className="font-bold text-slate-900 border-t border-slate-400 pt-2 inline-block px-4">Siti (Manajer Keuangan)</p>
          </div>
          <div>
            <p className="text-slate-500 mb-16">Disetujui oleh,</p>
            <p className="font-bold text-slate-900 border-t border-slate-400 pt-2 inline-block px-4">Budi (Owner)</p>
          </div>
        </div>

      </div>

      {/* CSS untuk menyembunyikan elemen UI (Sidebar, Header, Button) saat di-print (PDF) */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body {
            background-color: white !important;
          }
          /* Hide the left sidebar and top header from layout.tsx */
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
