"use client";

import { useState, useEffect, useRef } from "react";
import { Sparkles, Send, User, BrainCircuit, BarChart3, TrendingDown, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const API = 'http://localhost:5000/api';

type Message = {
  id: number;
  sender: "ai" | "user";
  text: string;
  type: "text" | "insight" | "error";
  icon?: React.ReactNode;
};

const SUGGESTIONS = [
  "Berapa laba bersih saya?",
  "Produk apa yang paling menguntungkan?",
  "Stok bahan baku apa yang menipis?",
  "Berapa total pengeluaran operasional saya?",
  "Bagaimana kondisi omzet saya?",
];

export default function AiAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [userName, setUserName] = useState("Owner");
  const [businessId, setBusinessId] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setUserName(user.name || 'Owner');
      setBusinessId(user.business_id || '');
    }
  }, []);

  useEffect(() => {
    if (userName) {
      setMessages([{
        id: 1,
        sender: "ai",
        text: `Halo ${userName}! Saya AI Business Assistant UMKM OS Anda.\n\nSaya dapat menjawab pertanyaan tentang data bisnis Anda secara real-time — omzet, laba, stok bahan baku, produk terlaris, dan lainnya.\n\nCoba tanyakan sesuatu! 👇`,
        type: "text"
      }]);
    }
  }, [userName]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent, overrideText?: string) => {
    e.preventDefault();
    const questionText = overrideText || input.trim();
    if (!questionText) return;

    const userMsg: Message = { id: Date.now(), sender: "user", text: questionText, type: "text" };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch(`${API}/ai/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: questionText, business_id: businessId }),
      });

      const data = await response.json();

      if (data.success) {
        const fullText = data.data.answer + (data.data.recommendation ? `\n\n[REKOMENDASI] ${data.data.recommendation}` : '');
        const isPositive = !questionText.toLowerCase().includes('turun');

        const aiResponse: Message = {
          id: Date.now() + 1,
          sender: "ai",
          text: fullText,
          type: "insight",
          icon: isPositive
            ? <BarChart3 className="w-5 h-5 text-emerald-500" />
            : <TrendingDown className="w-5 h-5 text-red-500" />,
        };
        setMessages(prev => [...prev, aiResponse]);
      } else {
        throw new Error('Failed');
      }
    } catch (err) {
      const errMsg: Message = {
        id: Date.now() + 1,
        sender: "ai",
        text: "Maaf, terjadi kesalahan saat menghubungi server. Pastikan backend berjalan di port 5000 dan coba lagi.",
        type: "error",
        icon: <AlertCircle className="w-5 h-5 text-red-500" />,
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center border border-indigo-200">
          <Sparkles className="w-5 h-5 text-indigo-600" />
        </div>
        <div className="flex-1">
          <h2 className="font-bold text-slate-800">AI Business Assistant</h2>
          <p className="text-xs text-slate-500">Menganalisis data bisnis riil dari SQL Database internal Anda</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Online
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-50/30">
        <AnimatePresence initial={false}>
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
                  : msg.type === "error"
                    ? "bg-red-50 border border-red-200 text-red-800 rounded-2xl rounded-tl-sm p-5 shadow-sm"
                    : "bg-white border border-slate-200 text-slate-800 rounded-2xl rounded-tl-sm p-5 shadow-sm"
              }`}>
                {(msg.type === "insight" || msg.type === "error") && msg.sender === "ai" && (
                  <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-100">
                    {msg.icon}
                    <span className="text-sm font-bold text-slate-900">
                      {msg.type === "error" ? "Terjadi Kesalahan" : "Insight Bisnis"}
                    </span>
                  </div>
                )}
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isTyping && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex gap-4"
          >
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0 mt-1">
              <Sparkles className="w-4 h-4 text-white animate-pulse" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm flex gap-1 items-center">
              <span className="text-xs text-slate-400 mr-2">Menganalisis data...</span>
              <span className="w-2 h-2 rounded-full bg-slate-300 animate-bounce"></span>
              <span className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '0.2s' }}></span>
              <span className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '0.4s' }}></span>
            </div>
          </motion.div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-slate-200 bg-white">
        <form onSubmit={handleSend} className="relative max-w-4xl mx-auto flex items-center mb-3">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tanya apapun tentang data bisnis Anda..." 
            className="w-full pl-4 pr-14 py-3 bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isTyping}
            className="absolute right-2 p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </form>
        <div className="flex justify-center gap-2 flex-wrap max-w-4xl mx-auto">
          {SUGGESTIONS.map((s, i) => (
            <button 
              key={i}
              type="button" 
              onClick={(e) => handleSend(e as any, s)} 
              disabled={isTyping}
              className="text-xs text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full hover:bg-indigo-100 transition-colors disabled:opacity-50"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
