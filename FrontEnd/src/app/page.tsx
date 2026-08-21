"use client";

import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Box, CheckCircle2, ChevronRight, Menu, MessageSquare, ShieldCheck, Sparkles, TrendingUp, Users, Zap } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                <TrendingUp className="text-white w-5 h-5" />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900">UMKM OS</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#fitur" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Fitur</Link>
              <Link href="#solusi" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Solusi Sektor</Link>
              <Link href="#ai" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">AI Assistant</Link>
              <Link href="#harga" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Harga</Link>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900">Masuk</Link>
              <Link href="/register" className="text-sm font-medium bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition-all shadow-sm hover:shadow-indigo-200 hover:shadow-md">
                Coba Gratis
              </Link>
            </div>
            <div className="md:hidden flex items-center">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-600">
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-1 shadow-lg">
            <Link href="#fitur" className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-md">Fitur</Link>
            <Link href="#solusi" className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-md">Solusi Sektor</Link>
            <Link href="#ai" className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-md">AI Assistant</Link>
            <Link href="/login" className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-md">Masuk</Link>
            <Link href="/register" className="block px-3 py-2 text-base font-medium text-indigo-600 hover:bg-indigo-50 rounded-md">Coba Gratis</Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100 via-slate-50 to-slate-50"></div>
          {/* Decorative blur elements */}
          <div className="absolute top-1/4 -left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-1/3 -right-20 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-semibold mb-6"
            >
              <Sparkles className="w-4 h-4" />
              <span>Sistem Operasi Bisnis UMKM #1 di Indonesia</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 leading-tight"
            >
              Satu Platform Untuk <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                Semua Kebutuhan Bisnis
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Mulai dari retail, jasa, hingga F&B. Kelola penjualan, pantau stok presisi, hitung laba bersih otomatis, dan ambil keputusan cerdas dengan AI Assistant.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link href="/register" className="w-full sm:w-auto px-8 py-4 rounded-full bg-slate-900 text-white font-medium text-lg hover:bg-slate-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-2 group">
                Mulai Gratis Sekarang
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="#demo" className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-slate-700 font-medium text-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                Lihat Demo
              </Link>
            </motion.div>
          </div>

          {/* Dashboard Preview Mockup */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-20 relative mx-auto max-w-5xl"
          >
            <div className="rounded-2xl border border-slate-200/60 bg-white/50 p-2 backdrop-blur-xl shadow-2xl">
              <div className="rounded-xl overflow-hidden border border-slate-100 bg-slate-50 flex items-center justify-center min-h-[400px] md:min-h-[600px] relative">
                {/* Mockup UI implementation */}
                <div className="absolute inset-0 flex flex-col">
                  {/* Mockup Header */}
                  <div className="h-14 border-b border-slate-200 bg-white flex items-center px-6 justify-between">
                    <div className="flex gap-4 items-center">
                      <div className="w-4 h-4 rounded-full bg-red-400"></div>
                      <div className="w-4 h-4 rounded-full bg-amber-400"></div>
                      <div className="w-4 h-4 rounded-full bg-green-400"></div>
                    </div>
                    <div className="h-6 w-64 bg-slate-100 rounded-md"></div>
                    <div className="h-8 w-8 rounded-full bg-indigo-100"></div>
                  </div>
                  {/* Mockup Body */}
                  <div className="flex-1 flex p-6 gap-6 bg-slate-50/50">
                    <div className="w-64 space-y-4 hidden md:block">
                      <div className="h-10 bg-indigo-50 rounded-lg border border-indigo-100"></div>
                      <div className="h-10 bg-white rounded-lg border border-slate-100"></div>
                      <div className="h-10 bg-white rounded-lg border border-slate-100"></div>
                      <div className="h-10 bg-white rounded-lg border border-slate-100"></div>
                    </div>
                    <div className="flex-1 flex flex-col gap-6">
                      <div className="flex gap-4">
                        {[1, 2, 3, 4].map(i => (
                          <div key={i} className="flex-1 h-24 bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col justify-between">
                            <div className="h-4 w-20 bg-slate-100 rounded"></div>
                            <div className="h-8 w-32 bg-slate-200 rounded"></div>
                          </div>
                        ))}
                      </div>
                      <div className="flex-1 flex gap-6">
                        <div className="flex-[2] bg-white rounded-xl border border-slate-200 shadow-sm"></div>
                        <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col p-4 relative overflow-hidden">
                           {/* Mock AI chat */}
                           <div className="text-sm font-medium text-slate-800 mb-4 flex items-center gap-2">
                             <Sparkles className="w-4 h-4 text-indigo-500" />
                             AI Business Assistant
                           </div>
                           <div className="flex flex-col gap-3">
                             <div className="self-end bg-indigo-50 text-indigo-900 p-3 rounded-2xl rounded-tr-sm text-xs max-w-[85%]">
                               Berapa laba bersih minggu ini?
                             </div>
                             <div className="self-start bg-slate-100 text-slate-700 p-3 rounded-2xl rounded-tl-sm text-xs max-w-[90%] border border-slate-200">
                               Laba bersih minggu ini <b>Rp 4.500.000</b> (naik 12% dari minggu lalu). Pengeluaran terbesar adalah biaya operasional marketing.
                             </div>
                           </div>
                           <div className="absolute bottom-4 left-4 right-4 h-10 border border-slate-200 rounded-full flex items-center px-4 bg-slate-50">
                             <div className="w-full h-2 bg-slate-200 rounded-full"></div>
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="fitur" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-indigo-600 font-semibold tracking-wide uppercase text-sm mb-3">Fitur Inti</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Sistem Lengkap, Bukan Sekadar Kasir</h3>
            <p className="text-lg text-slate-600">Dirancang untuk mengatasi masalah operasional harian yang kompleks menjadi otomatis dan mudah dipahami.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Zap className="w-6 h-6 text-amber-500" />}
              title="POS & Transaksi Super Cepat"
              desc="Kasir digital yang dioptimalkan untuk kecepatan. Mendukung pembayaran Tunai & QRIS, serta otomatis memotong stok secara real-time."
              color="bg-amber-50"
            />
            <FeatureCard 
              icon={<Box className="w-6 h-6 text-blue-500" />}
              title="Manajemen Inventaris & BOM"
              desc="Atur resep (BOM) atau bundel produk untuk sektor retail. Sistem melacak HPP/COGS dinamis menggunakan metode Average Cost."
              color="bg-blue-50"
            />
            <FeatureCard 
              icon={<BarChart3 className="w-6 h-6 text-emerald-500" />}
              title="Dashboard Laba Bersih Riil"
              desc="Lupakan menghitung manual di Excel. Catat pengeluaran operasional dan ketahui margin serta laba bersih bisnis detik itu juga."
              color="bg-emerald-50"
            />
          </div>
        </div>
      </section>

      {/* AI Section */}
      <section id="ai" className="py-24 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-indigo-600 rounded-full mix-blend-screen filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-3xl opacity-20"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                <span>Teknologi Terbaru</span>
              </div>
              <h2 className="text-4xl font-bold mb-6 leading-tight">Bertanya Pada Data Anda Seperti Bertanya Pada Ahli.</h2>
              <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                Fitur AI Business Assistant membaca langsung dari database Anda yang terenkripsi dan terisolasi. Tidak perlu membaca grafik rumit, cukup tanyakan dengan bahasa sehari-hari.
              </p>
              
              <ul className="space-y-4 mb-10">
                {['"Produk apa yang paling menguntungkan bulan ini?"', '"Kenapa profit saya turun minggu lalu?"', '"Kapan saya harus restock barang X?"'].map((q, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-indigo-400 flex-shrink-0" />
                    <span className="text-slate-200 font-medium">{q}</span>
                  </li>
                ))}
              </ul>
              
              <Link href="/register" className="inline-flex items-center gap-2 text-indigo-400 font-semibold hover:text-indigo-300 transition-colors">
                Pelajari lebih lanjut tentang keamanan AI kami <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            {/* Interactive/Mock AI Chat */}
            <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl p-6 relative">
              <div className="flex flex-col gap-6">
                <div className="self-end bg-indigo-600 text-white p-4 rounded-2xl rounded-tr-sm text-sm max-w-[85%] shadow-md">
                  Tolong buatkan analisa penjualan cabang utama hari ini.
                </div>
                <div className="self-start bg-slate-700 text-slate-100 p-4 rounded-2xl rounded-tl-sm text-sm max-w-[90%] border border-slate-600 shadow-md">
                  <p className="mb-3">Berikut adalah ringkasan hari ini:</p>
                  <div className="bg-slate-800 p-3 rounded-lg border border-slate-600 mb-3 flex justify-between items-center">
                    <span className="text-slate-400">Total Omzet</span>
                    <span className="font-bold text-emerald-400">Rp 8.240.000</span>
                  </div>
                  <p>Luar biasa! Penjualan Anda <strong>naik 15%</strong> dibanding Selasa lalu. Produk paling laku adalah "Paket Premium Jasa A" yang berkontribusi 40% pada laba hari ini.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Target Sectors / Personas */}
      <section id="solusi" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-indigo-600 font-semibold tracking-wide uppercase text-sm mb-3">Satu OS, Multi Sektor</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Siapapun Peran Anda, Kami Membantu</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <PersonaCard 
              title="Untuk Pemilik Bisnis (Owner)"
              desc="Pantau kesehatan bisnis dari mana saja. Dapatkan laporan real-time dan notifikasi stok menipis langsung ke HP Anda."
              icon={<TrendingUp className="w-5 h-5 text-indigo-600" />}
            />
            <PersonaCard 
              title="Untuk Manager / Admin"
              desc="Audit stok tanpa pusing, manajemen supplier mudah, dan kontrol pengeluaran harian yang rapi."
              icon={<ShieldCheck className="w-5 h-5 text-indigo-600" />}
            />
            <PersonaCard 
              title="Untuk Kasir / Staff"
              desc="Antarmuka kasir yang sangat simpel, minim klik, mengurangi antrian, dan mencegah selisih uang kasir."
              icon={<Users className="w-5 h-5 text-indigo-600" />}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-indigo-600"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Siap Mengambil Kendali Bisnis Anda?</h2>
          <p className="text-indigo-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            Bergabung dengan ratusan UMKM yang telah beralih menggunakan sistem pintar untuk mengembangkan usahanya secara berkelanjutan.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/register" className="px-8 py-4 rounded-full bg-white text-indigo-600 font-bold text-lg hover:bg-slate-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
              Coba Gratis 14 Hari
            </Link>
            <Link href="#contact" className="px-8 py-4 rounded-full bg-indigo-700 text-white font-semibold text-lg border border-indigo-500 hover:bg-indigo-800 transition-all">
              Hubungi Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-12 border-t border-slate-800 text-slate-400 text-sm text-center">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center">
              <TrendingUp className="text-white w-3 h-3" />
            </div>
            <span className="font-bold text-lg tracking-tight text-white">UMKM OS</span>
          </div>
          <p className="mb-4">&copy; 2026 UMKM Business OS. All rights reserved.</p>
          <p className="text-xs text-slate-500">Mendukung digitalisasi dan kemajuan UMKM Indonesia.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc, color }: { icon: React.ReactNode, title: string, desc: string, color: string }) {
  return (
    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all group">
      <div className={`w-14 h-14 rounded-xl ${color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h4 className="text-xl font-bold text-slate-900 mb-3">{title}</h4>
      <p className="text-slate-600 leading-relaxed">{desc}</p>
    </div>
  );
}

function PersonaCard({ title, desc, icon }: { title: string, desc: string, icon: React.ReactNode }) {
  return (
    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
      <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center mb-4 border border-indigo-100">
        {icon}
      </div>
      <h4 className="text-lg font-bold text-slate-900 mb-2">{title}</h4>
      <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}
