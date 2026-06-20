import React, { useState } from "react";
import { motion } from "motion/react";
import { ShieldAlert, BookOpen, Key, Users, Sparkles, MessageSquare, ArrowLeft } from "lucide-react";
import { User } from "../types";
import { apiLogin } from "../lib/apiClient";
import Logo from "./Logo";

interface LoginScreenProps {
  onLoginSuccess: (user: User) => void;
  onBack?: () => void;
}

export default function LoginScreen({ onLoginSuccess, onBack }: LoginScreenProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent, customUser?: string) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    const targetUser = customUser || username;
    const targetPass = customUser ? (customUser === "siswa" ? "siswa123" : "guru123") : password;

    if (!targetUser) {
      setErrorMsg("Username tidak boleh kosong.");
      setIsLoading(false);
      return;
    }

    try {
      const userData = await apiLogin(targetUser, targetPass);
      onLoginSuccess(userData);
    } catch (err: any) {
      setErrorMsg(err.message || "Terjadi kesalahan sambungan jaringan.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="login-container" className="min-h-screen bg-slate-50 flex items-center justify-center p-4 selection:bg-indigo-500 selection:text-white">
      {/* Background soft decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
      <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
      <div className="absolute bottom-10 right-10 w-82 h-82 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-slate-100 p-8 relative">
          
          {onBack && (
            <button
              id="back-to-landing-btn"
              onClick={onBack}
              className="absolute top-6 left-6 text-slate-400 hover:text-slate-700 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer bg-transparent border-0"
              type="button"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Kembali
            </button>
          )}
          
          {/* Brand Logo & Name */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center mb-4 shrink-0">
              <Logo className="w-12 h-12" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-800">
              Cyber<span className="text-indigo-600">Care</span>
            </h1>
            <p className="text-slate-500 text-sm mt-1 max-w-xs mx-auto">
              Layanan Bimbingan & Konseling Digital Pencegahan Cyberbullying
            </p>
          </div>

          {errorMsg && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs text-center font-medium"
            >
              {errorMsg}
            </motion.div>
          )}

          <form onSubmit={(e) => handleLogin(e)} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                Username / Akun
              </label>
              <div className="relative">
                <input
                   type="text"
                   value={username}
                   onChange={(e) => setUsername(e.target.value)}
                   placeholder="Masukkan username anda..."
                   className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-505/20 focus:border-indigo-500 transition-all text-slate-800 placeholder-slate-400"
                   required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <input
                   type="password"
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   placeholder="••••••••"
                   className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-505/20 focus:border-indigo-500 transition-all text-slate-800 placeholder-slate-400"
                   required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium rounded-xl text-sm transition-all shadow-md shadow-indigo-600/10 hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Masuk ke Portal"
              )}
            </button>
          </form>

          {/* Prompt Quick Simulation Logs */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-center text-xs text-slate-400 font-medium mb-3">
              Mulai Eksplorasi Cepat (Akun Simulasi)
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={(e) => handleLogin(e, "siswa")}
                className="py-2.5 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl border border-indigo-150 text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                <Users className="w-4 h-4 text-indigo-600" />
                <span>Masuk Siswa</span>
                <span className="text-[10px] text-indigo-500 font-normal">Ahmad Rian</span>
              </button>
              <button
                type="button"
                onClick={(e) => handleLogin(e, "guru")}
                className="py-2.5 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl border border-blue-100 text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                <ShieldAlert className="w-4 h-4 text-blue-600" />
                <span>Akun Guru BK</span>
                <span className="text-[10px] text-blue-500 font-normal">Ibu Sri Wahyuni</span>
              </button>
            </div>
            <div className="mt-4 text-[10px] text-center text-slate-400 bg-slate-50 rounded-lg p-2 leading-relaxed">
              *Aplikasi mendukung fungsionalitas ganda. Anda dapat membuka dua tab atau beralih akun kapan saja untuk mensimulasikan tanggapan BK Guru secara langsung!
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
