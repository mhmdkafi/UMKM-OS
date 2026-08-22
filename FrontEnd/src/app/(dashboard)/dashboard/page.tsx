"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Activity,
  AlertTriangle,
  Receipt
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
} from "recharts";

const API = 'http://localhost:5000/api';

const fmt = (v: number) => `Rp ${v.toLocaleString('id-ID')}`;

export default function OwnerDashboard() {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    const businessId = userStr ? JSON.parse(userStr).business_id : '';
    const url = businessId ? `${API}/dashboard/summary?business_id=${businessId}` : `${API}/dashboard/summary`;

    fetch(url)
      .then(res => res.json())
      .then(data => { setSummary(data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-slate-500 font-medium">Memuat data dashboard dari Backend API...</div>
      </div>
    );
  }

  const kpi = summary?.kpiCards || {};
  const topProducts = summary?.topProducts || [];
  const lowStock = summary?.lowStockAlerts || [];
  const chartData = summary?.chartData || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Pusat Kendali Owner</h2>
          <p className="text-slate-500">Ringkasan kesehatan bisnis Anda — data langsung dari Database.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard 
          title="Total Omzet" 
          value={fmt(kpi.totalOmzet || 0)} 
          change={`${kpi.totalTransactions || 0} transaksi`} 
          isPositive={true} 
          icon={<DollarSign className="w-5 h-5 text-indigo-600" />}
        />
        <KpiCard 
          title="Laba Bersih" 
          value={fmt(kpi.labaBersih || 0)} 
          change={kpi.labaBersih > 0 ? "Positif" : "Negatif"} 
          isPositive={(kpi.labaBersih || 0) > 0} 
          icon={<Activity className="w-5 h-5 text-emerald-600" />}
        />
        <KpiCard 
          title="Margin Laba Kotor" 
          value={`${kpi.margin || 0}%`} 
          change={kpi.margin > 30 ? "Sehat" : "Perlu ditingkatkan"} 
          isPositive={(kpi.margin || 0) > 30} 
          icon={<TrendingUp className="w-5 h-5 text-amber-600" />}
        />
        <KpiCard 
          title="AOV (Rata-rata/Transaksi)" 
          value={fmt(kpi.aov || 0)} 
          change={`HPP: ${fmt(kpi.totalCogs || 0)}`} 
          isPositive={true} 
          icon={<Receipt className="w-5 h-5 text-blue-600" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart — Real 7-day data */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-semibold text-slate-800">Tren 7 Hari Terakhir</h3>
              <p className="text-xs text-slate-400 mt-0.5">Omzet vs Laba Kotor harian</p>
            </div>
          </div>
          <div className="h-[300px] w-full">
            {chartData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                Belum ada data transaksi untuk ditampilkan.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(val) => `Rp${val/1000}K`} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <Tooltip 
                    formatter={(value) => [`Rp ${(value as number).toLocaleString('id-ID')}`, '']}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" name="Omzet" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                  <Area type="monotone" name="Laba Kotor" dataKey="profit" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorProfit)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Top Products & Alerts */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-semibold text-slate-800 mb-4">Produk Terlaris (by Profit)</h3>
            <div className="space-y-4">
              {topProducts.length > 0 ? topProducts.map((product: any, i: number) => (
                <div key={i} className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{product.name}</p>
                    <p className="text-xs text-slate-500">{product.sales} terjual</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-md">
                      {fmt(product.grossProfit ?? product.revenue)}
                    </span>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-slate-400">Belum ada data penjualan</p>
              )}
            </div>
          </div>

          {lowStock.length > 0 ? (
            <div className="bg-red-50 rounded-xl border border-red-100 p-5">
              <div className="flex gap-3 mb-2">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <h3 className="font-semibold text-red-900">Peringatan Stok Menipis</h3>
              </div>
              <ul className="ml-8 space-y-1">
                {lowStock.map((item: any, i: number) => (
                  <li key={i} className="text-sm text-red-700">
                    <strong>{item.name}</strong> — Sisa: {item.stock} {item.unit} (Min: {item.minStock})
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="bg-emerald-50 rounded-xl border border-emerald-100 p-5">
              <div className="flex gap-3">
                <Activity className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-emerald-900">Stok Aman</h3>
                  <p className="text-sm text-emerald-700">Semua bahan baku dalam kondisi stok yang cukup.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function KpiCard({ title, value, change, isPositive, icon }: any) {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
          isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
        }`}>
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {change}
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h4 className="text-2xl font-bold text-slate-900">{value}</h4>
      </div>
    </motion.div>
  );
}
