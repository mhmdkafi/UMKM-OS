"use client";

import { motion } from "framer-motion";
import { TrendingUp, Mail, Lock, User, Store, Briefcase, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-indigo-100 selection:text-indigo-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center"
        >
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
              <TrendingUp className="text-white w-6 h-6" />
            </div>
            <span className="font-extrabold text-3xl tracking-tight text-slate-900">UMKM OS</span>
          </Link>
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-6 text-center text-2xl font-bold tracking-tight text-slate-900"
        >
          Mulai Digitalisasi Bisnis Anda
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-2 text-center text-sm text-slate-600"
        >
          Sudah punya akun?{' '}
          <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
            Masuk di sini
          </Link>
        </motion.p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl"
      >
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-slate-100">
          <form className="space-y-6" action="#" method="POST">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Info */}
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium leading-6 text-slate-900">
                    Nama Lengkap
                  </label>
                  <div className="mt-2 relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <User className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      className="block w-full rounded-lg border-0 py-2.5 pl-10 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-all"
                      placeholder="Budi Santoso"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium leading-6 text-slate-900">
                    Alamat Email
                  </label>
                  <div className="mt-2 relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="block w-full rounded-lg border-0 py-2.5 pl-10 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-all"
                      placeholder="anda@perusahaan.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium leading-6 text-slate-900">
                    Password
                  </label>
                  <div className="mt-2 relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      className="block w-full rounded-lg border-0 py-2.5 pl-10 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-all"
                      placeholder="Minimal 8 karakter"
                    />
                  </div>
                </div>
              </div>

              {/* Business Info */}
              <div className="space-y-6">
                <div>
                  <label htmlFor="businessName" className="block text-sm font-medium leading-6 text-slate-900">
                    Nama Bisnis
                  </label>
                  <div className="mt-2 relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Store className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      id="businessName"
                      name="businessName"
                      type="text"
                      required
                      className="block w-full rounded-lg border-0 py-2.5 pl-10 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-all"
                      placeholder="Toko Jaya Abadi"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="businessCategory" className="block text-sm font-medium leading-6 text-slate-900">
                    Kategori Bisnis
                  </label>
                  <div className="mt-2 relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Briefcase className="h-5 w-5 text-slate-400" />
                    </div>
                    <select
                      id="businessCategory"
                      name="businessCategory"
                      required
                      className="block w-full rounded-lg border-0 py-2.5 pl-10 pr-10 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-all bg-white"
                    >
                      <option value="">Pilih Kategori...</option>
                      <option value="fnb">Food & Beverage (Kuliner)</option>
                      <option value="retail">Retail / Toko Kelontong</option>
                      <option value="services">Jasa / Salon / Bengkel</option>
                      <option value="fashion">Fashion & Pakaian</option>
                      <option value="other">Lainnya</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button
                type="submit"
                className="flex w-full justify-center items-center gap-2 rounded-lg bg-indigo-600 px-3 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all hover:shadow-md hover:-translate-y-0.5"
              >
                Buat Akun Sekarang <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            
            <p className="text-xs text-center text-slate-500">
              Dengan mendaftar, Anda menyetujui <a href="#" className="text-indigo-600 hover:underline">Syarat & Ketentuan</a> dan <a href="#" className="text-indigo-600 hover:underline">Kebijakan Privasi</a> kami.
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
