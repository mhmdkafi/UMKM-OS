"use client";

import { useState } from "react";
import { Sparkles, Send, User, BrainCircuit, BarChart3, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";

type Message = {
  id: number;
  sender: "ai" | "user";
  text: string;
  type: "text" | "insight";
  icon?: React.ReactNode;
};

const initialMessages: Message[] = [
  { id: 1, sender: "ai", text: "Halo Budi! Saya AI Business Assistant Anda. Ada metrik atau insight yang ingin Anda ketahui hari ini?", type: "text" }
];

export default function AiAssistantPage() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now(), sender: "user", text: input, type: "text" };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      let aiResponse: Message;
      
      if (userMsg.text.toLowerCase().includes("profit") || userMsg.text.toLowerCase().includes("laba")) {
        aiResponse = { 
          id: Date.now() + 1, 
          sender: "ai", 
          text: "[ANALISIS] Profit Anda turun 12% dibanding minggu lalu karena pengeluaran operasional naik Rp 850.000 (pembelian gas & perbaikan AC), meskipun omzet stabil.", 
          type: "insight",
          icon: <TrendingDown className="w-5 h-5 text-red-500" />
        };
      } else {
        aiResponse = { 
          id: Date.now() + 1, 
          sender: "ai", 
          text: "[FAKTA DATA] Produk paling menguntungkan bulan ini adalah Kopi Susu Aren dengan total Laba Kotor Rp 3.450.000 (180 porsi terjual). \n\n[REKOMENDASI] Pertahankan ketersediaan stok Biji Kopi Robusta dan pertimbangkan membuat paket bundling dengan pastry.", 
          type: "insight",
          icon: <BarChart3 className="w-5 h-5 text-emerald-500" />
        };
      }
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center border border-indigo-200">
          <Sparkles className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h2 className="font-bold text-slate-800">AI Business Assistant</h2>
          <p className="text-xs text-slate-500">Menganalisis data dari SQL Database internal Anda</p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-50/30">
        {messages.map(msg => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={msg.id} 
            className={`flex gap-4 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
              msg.sender === "user" ? "bg-slate-200" : "bg-indigo-600"
            }`}>
              {msg.sender === "user" ? <User className="w-4 h-4 text-slate-600" /> : <BrainCircuit className="w-4 h-4 text-white" />}
            </div>
            
            <div className={`max-w-[85%] sm:max-w-[75%] ${
              msg.sender === "user" 
                ? "bg-indigo-600 text-white rounded-2xl rounded-tr-sm px-5 py-3 shadow-sm" 
                : "bg-white border border-slate-200 text-slate-800 rounded-2xl rounded-tl-sm p-5 shadow-sm"
            }`}>
              {msg.type === "insight" && (
                <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-100">
                  {msg.icon}
                  <span className="text-sm font-bold text-slate-900">Insight Bisnis</span>
                </div>
              )}
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
            </div>
          </motion.div>
        ))}
        
        {isTyping && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex gap-4"
          >
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0 mt-1">
              <Sparkles className="w-4 h-4 text-white animate-pulse" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm flex gap-1">
              <span className="w-2 h-2 rounded-full bg-slate-300 animate-bounce"></span>
              <span className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '0.2s' }}></span>
              <span className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '0.4s' }}></span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-slate-200 bg-white">
        <form onSubmit={handleSend} className="relative max-w-4xl mx-auto flex items-center">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tanya apapun tentang data bisnis Anda..." 
            className="w-full pl-4 pr-14 py-3 bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm"
          />
          <button 
            type="submit"
            disabled={!input.trim()}
            className="absolute right-2 p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </form>
        <div className="flex justify-center gap-2 mt-3 flex-wrap">
          <button type="button" onClick={() => setInput("Kenapa profit saya turun minggu ini?")} className="text-xs text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full hover:bg-indigo-100 transition-colors">Kenapa profit saya turun minggu ini?</button>
          <button type="button" onClick={() => setInput("Produk paling menguntungkan?")} className="text-xs text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full hover:bg-indigo-100 transition-colors">Produk paling menguntungkan?</button>
        </div>
      </div>
    </div>
  );
}
