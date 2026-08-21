"use client";

import { motion } from "framer-motion";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Activity,
  AlertTriangle,
  ArrowUpRight
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";

const dataSales = [
  { name: 'Senin', revenue: 4000000, profit: 2400000 },
  { name: 'Selasa', revenue: 3000000, profit: 1398000 },
  { name: 'Rabu', revenue: 2000000, profit: 980000 },
  { name: 'Kamis', revenue: 2780000, profit: 1908000 },
  { name: 'Jumat', revenue: 1890000, profit: 1800000 },
  { name: 'Sabtu', revenue: 5390000, profit: 3800000 },
  { name: 'Minggu', revenue: 6490000, profit: 4300000 },
];

const dataTopProducts = [
  { name: 'Kopi Susu Aren', sales: 120, margin: 60 },
  { name: 'Matcha Latte', sales: 98, margin: 55 },
  { name: 'Croissant', sales: 86, margin: 40 },
  { name: 'Americano', sales: 60, margin: 80 },
];

export default function OwnerDashboard() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Pusat Kendali Owner</h2>
          <p className="text-slate-500">Ringkasan kesehatan bisnis Anda hari ini.</p>
        </div>
        <div className="flex gap-2">
          <select className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm font-medium outline-none">
            <option>Hari Ini</option>
            <option>7 Hari Terakhir</option>
            <option>Bulan Ini</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard 
          title="Total Omzet" 
          value="Rp 8.450.000" 
          change="+15.2%" 
          isPositive={true} 
          icon={<DollarSign className="w-5 h-5 text-indigo-600" />}
        />
        <KpiCard 
          title="Laba Bersih" 
          value="Rp 3.120.000" 
          change="+8.4%" 
          isPositive={true} 
          icon={<Activity className="w-5 h-5 text-emerald-600" />}
        />
        <KpiCard 
          title="Margin Laba Kotor" 
          value="45.5%" 
          change="-2.1%" 
          isPositive={false} 
          icon={<TrendingUp className="w-5 h-5 text-amber-600" />}
        />
        <KpiCard 
          title="Jumlah Transaksi" 
          value="184 Struk" 
          change="+12.0%" 
          isPositive={true} 
          icon={<ShoppingCart className="w-5 h-5 text-blue-600" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-slate-800">Tren Pendapatan & Laba (7 Hari)</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dataSales} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(val) => `Rp${val/1000000}M`} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <Tooltip 
                  formatter={(value) => [`Rp ${(value as number).toLocaleString('id-ID')}`, '']}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" name="Omzet" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                <Area type="monotone" name="Laba Bersih" dataKey="profit" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorProfit)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products & Alerts */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-semibold text-slate-800 mb-4">Produk Margin Tertinggi</h3>
            <div className="space-y-4">
              {dataTopProducts.map((product, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{product.name}</p>
                    <p className="text-xs text-slate-500">{product.sales} porsi terjual</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-md">
                      {product.margin}% Margin
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-red-50 rounded-xl border border-red-100 p-5">
            <div className="flex gap-3 mb-2">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <h3 className="font-semibold text-red-900">Peringatan Stok Menipis</h3>
            </div>
            <p className="text-sm text-red-700 mb-3 ml-8">Susu UHT (Sisa 2 Liter) dan Gula Aren (Sisa 1 Kg) akan habis hari ini berdasarkan prediksi penjualan.</p>
            <button className="ml-8 text-sm font-medium text-red-700 hover:text-red-800 flex items-center gap-1">
              Buat Purchase Order <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
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
