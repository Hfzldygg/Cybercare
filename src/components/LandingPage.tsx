import React from "react";
import { motion } from "motion/react";
import { 
  Shield, 
  Users, 
  MessageSquare, 
  BookOpen, 
  ArrowRight, 
  ShieldAlert, 
  FileText, 
  BarChart, 
  Heart, 
  Clock, 
  Lock,
  MessageCircle,
  HelpCircle
} from "lucide-react";
import Logo from "./Logo";

interface LandingPageProps {
  onGetStarted: () => void;
  onQuickLogin: (role: "siswa" | "guru") => void;
}

export default function LandingPage({ onGetStarted, onQuickLogin }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans selection:bg-indigo-500 selection:text-white relative overflow-x-hidden">
      
      {/* Decorative Subtle Grid Overlay from Screenshot */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] opacity-60 pointer-events-none" />

      {/* HEADER SECTION */}
      <header className="relative z-20 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 shadow-sm/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between w-full">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center shrink-0">
              <Logo className="w-9 h-9" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900 leading-none">CyberCare</h1>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-1">
                Cyberbullying Care & Counseling System
              </span>
            </div>
          </div>

          {/* Navigation Links from Screenshot */}
          <nav className="hidden lg:flex items-center gap-8 text-sm text-slate-500">
            <a href="#" className="relative font-bold text-[#4f46e5] border-b-2 border-[#4f46e5] pb-1.5 px-1">
              Beranda
            </a>
            <a href="#tentang-kami" className="hover:text-[#4f46e5] font-medium transition-colors">
              Tentang Kami
            </a>
            <a href="#fitur" className="hover:text-[#4f46e5] font-medium transition-colors">
              Fitur
            </a>
            <a href="#edukasi" className="hover:text-[#4f46e5] font-medium transition-colors">
              Edukasi
            </a>
            <a href="#sekolah" className="hover:text-[#4f46e5] font-medium transition-colors">
              Untuk Sekolah
            </a>
            <a href="#kontak" className="hover:text-[#4f46e5] font-medium transition-colors">
              Kontak
            </a>
          </nav>

          {/* Header CTA Button */}
          <div>
            <button
              onClick={onGetStarted}
              className="px-5 py-2.5 bg-[#4f46e5] hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/10 flex items-center gap-2 cursor-pointer hover:scale-[1.02] duration-200"
            >
              <span>Masuk / Login</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-16 lg:pt-20 lg:pb-24 grid lg:grid-cols-12 gap-12 items-center">
        
        {/* Left text column */}
        <div className="lg:col-span-5 text-left flex flex-col justify-center">
          
          {/* Badge top */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-[11px] font-bold text-indigo-700 w-fit mb-5"
          >
            <span className="text-xs">✓</span>
            <span>Aman • Peduli • Terpercaya</span>
          </motion.div>

          {/* Main Title Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-[45px] lg:leading-[1.2] font-black tracking-tight text-[#0f172a] mb-5"
          >
            Tempat Aman untuk Berbagi, Didengar, dan Mendapatkan <span className="text-[#3b3df2]">Bantuan</span>
          </motion.h2>

          {/* Description Paragraph */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm sm:text-base text-slate-500 leading-relaxed mb-8 max-w-lg"
          >
            CyberCare hadir untuk mendukung siswa menghadapi permasalahan cyberbullying melalui layanan konseling, edukasi, dan pendampingan secara online.
          </motion.p>

          {/* Duel Perspective Live Buttons (Pre-select login) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap items-center gap-4"
          >
            <button
              onClick={() => onQuickLogin("siswa")}
              className="flex items-center gap-2.5 px-6 py-3.5 bg-[#4f46e5] text-white font-bold text-xs rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-605/15 cursor-pointer transform hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Users className="w-4 h-4 text-white/90" />
              <span>Saya Siswa</span>
            </button>

            <button
              onClick={() => onQuickLogin("guru")}
              className="flex items-center gap-2.5 px-6 py-3.5 bg-white border border-indigo-150 text-indigo-700 font-bold text-xs rounded-xl hover:bg-indigo-50/50 shadow-sm cursor-pointer transform hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Shield className="w-4 h-4 text-indigo-600" />
              <span>Saya Guru BK</span>
            </button>
          </motion.div>
        </div>

        {/* Right illustration column matching layout from screenshot */}
        <div className="lg:col-span-7 flex items-center justify-center relative">
          
          {/* Custom vector composition matching screenshot */}
          <div className="w-full max-w-xl aspect-[1.15] relative flex items-center justify-center">
            
            {/* Background Big Circular Lavender Glow with Dots Pattern */}
            <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-[#eceffd] via-[#f3f6ff] to-[#f8fafe] shadow-inner opacity-90 -z-15" />
            
            {/* Floating Plus decorative items */}
            <div className="absolute top-[20%] left-[8%] text-[#a5b4fc] text-xl font-bold font-mono select-none">+</div>
            <div className="absolute bottom-[28%] left-[10%] text-[#818cf8]/70 text-2xl font-bold font-mono select-none">+</div>
            <div className="absolute top-[40%] right-[6%] text-[#a5b4fc] text-lg font-bold font-mono select-none">+</div>
            <div className="absolute top-[12%] right-[22%] text-[#c7d2fe] text-md font-bold font-mono select-none">+</div>

            {/* FLOATING BRAND MASCOT SHIELD IN THE CENTER BACKGROUND */}
            <div className="absolute top-[10%] left-1/2 -translate-x-1/2 -translate-y-4 w-40 h-40 bg-white/40 rounded-full flex items-center justify-center filter backdrop-blur-[2px] opacity-90">
              <div className="w-28 h-28 bg-[#5c5dfa] rounded-3xl flex items-center justify-center shadow-xl shadow-[#5c5dfa]/30 animate-bounce delay-500 duration-[4s]">
                <svg viewBox="0 0 100 100" className="w-18 h-18 text-white" fill="currentColor">
                  <path d="M50 10 L15 22 V50 C15 72 35 88 50 93 C65 88 85 72 85 50 V22 L50 10 Z" />
                  {/* Internal design matching Brand Logo */}
                  <circle cx="38" cy="38" r="7" fill="#5c5dfa" />
                  <circle cx="62" cy="38" r="7" fill="#5c5dfa" />
                  <path d="M38 48 C28 48 28 65 50 78 C72 65 72 48 62 48 C57 48 54 52 50 54 C46 52 43 48 38 48 Z" fill="#5c5dfa" />
                </svg>
              </div>
            </div>

            {/* TWO CHARACTER AVATARS REPRESENTING SISWA PEREMPUAN & SISWA LAKI-LAKI */}
            <div className="absolute inset-0 flex items-end justify-between px-10 pb-2 z-10">
              
              {/* Left Student (Female, hoodie pink/lilac looking at phone) */}
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="w-[45%] flex flex-col items-center relative translate-y-[-2%] hover:translate-y-[-4%] transition-transform duration-300"
              >
                {/* SVG Character representation of Female Student */}
                <svg viewBox="0 0 120 150" className="w-full drop-shadow-lg filter drop-shadow-[#ddd]">
                  {/* Hair back */}
                  <path d="M35,30 C35,25 45,5 75,5 C100,5 105,25 105,35 L105,65 L35,65 Z" fill="#2d3748" />
                  {/* Hoodie Hood back */}
                  <path d="M30,65 C30,60 90,60 90,65 L95,85 L25,85 Z" fill="#b993e3" />
                  {/* Neck */}
                  <rect x="52" y="55" width="16" height="15" fill="#fbd38d" />
                  {/* Face */}
                  <path d="M42,28 C42,16 78,16 78,28 L78,55 C78,63 42,63 42,55 Z" fill="#fed7e2" />
                  {/* Hair Front / Bangs */}
                  <path d="M42,28 C50,15 70,15 78,28 C74,18 46,18 42,28 Z" fill="#1a202c" />
                  {/* Eyes (Look down slightly) */}
                  <ellipse cx="50" cy="38" rx="2" ry="3" fill="#2d3748" />
                  <ellipse cx="68" cy="38" rx="2" ry="3" fill="#2d3748" />
                  {/* Smile */}
                  <path d="M56,47 Q59,51 62,47" stroke="#2d3748" strokeWidth="2" strokeLinecap="round" fill="none" />
                  {/* Hoodie Body */}
                  <path d="M22,75 Q46,72 50,75 L50,150 L10,150 Z" fill="#d6bcfa" />
                  <path d="M98,75 Q74,72 70,75 L70,150 L110,150 Z" fill="#d6bcfa" />
                  <rect x="42" y="75" width="36" height="75" fill="#c3aeef" />
                  {/* Dark Smartphone in her hands */}
                  <rect x="40" y="112" width="16" height="26" rx="3" fill="#1a202c" transform="rotate(-10 40 112)" />
                  <rect x="42" y="114" width="12" height="22" rx="1" fill="#4a5568" transform="rotate(-10 40 112)" />
                  {/* Hands holding the phone */}
                  <circle cx="43" cy="125" r="5" fill="#fed7e2" />
                  <circle cx="56" cy="122" r="5" fill="#fed7e2" />
                </svg>
              </motion.div>

              {/* Right Student (Male, blue hoodie working on laptop) */}
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="w-[45%] flex flex-col items-center relative hover:translate-y-[-2%] transition-transform duration-300"
              >
                {/* SVG Character representation of Male Student */}
                <svg viewBox="0 0 120 150" className="w-full drop-shadow-lg filter drop-shadow-[#ddd]">
                  {/* Hair */}
                  <path d="M30,25 C30,12 85,8 85,25 L88,40 L32,40 Z" fill="#2d3748" />
                  {/* Neck */}
                  <rect x="52" y="47" width="16" height="15" fill="#e2e8f0" />
                  {/* Face */}
                  <path d="M42,24 C42,12 78,12 78,24 L78,48 C78,56 42,56 42,48 Z" fill="#fbd38d" />
                  {/* Eyes (Look straight/down towards laptop) */}
                  <circle cx="50" cy="34" r="2.5" fill="#2d3748" />
                  <circle cx="68" cy="34" r="2.5" fill="#2d3748" />
                  {/* Smile */}
                  <path d="M55,42 Q59,46 63,42" stroke="#2d3748" strokeWidth="2" strokeLinecap="round" fill="none" />
                  {/* Hoodie Body */}
                  <path d="M18,65 Q45,63 50,65 L50,150 L6,150 Z" fill="#667eea" />
                  <path d="M102,65 Q75,63 70,65 L70,150 L114,150 Z" fill="#667eea" />
                  <rect x="42" y="65" width="36" height="85" fill="#5a67d8" />
                  {/* Grey Laptop Screen side facing him */}
                  <path d="M72,112 L102,112 L106,132 L68,132 Z" fill="#cbd5e0" />
                  <path d="M74,114 L100,114 L104,130 L70,130 Z" fill="#e2e8f0" />
                  {/* Laptop base */}
                  <rect x="62" y="132" width="46" height="4" rx="1" fill="#718096" />
                  {/* Male Arm reaching laptop */}
                  <circle cx="56" cy="130" r="5" fill="#fbd38d" />
                </svg>
              </motion.div>

            </div>

            {/* FLOATING EMBLAMATIC ICONS FROM SCREENSHOT */}
            {/* Top-Left Chat bubble icon */}
            <div className="absolute top-[18%] left-[10%] z-20">
              <motion.div 
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-lg shadow-indigo-650/10 border border-slate-100"
              >
                <MessageSquare className="w-5 h-5 text-indigo-400" />
              </motion.div>
            </div>

            {/* Top-Right Heart icon */}
            <div className="absolute top-[18%] right-[12%] z-20">
              <motion.div 
                animate={{ y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 0.5 }}
                className="w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-lg shadow-indigo-650/10 border border-slate-100"
              >
                <Heart className="w-5 h-5 fill-indigo-400 text-indigo-400" />
              </motion.div>
            </div>

            {/* Bottom-Right Lock/Protection icon */}
            <div className="absolute bottom-[35%] right-[8%] z-20">
              <motion.div 
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay: 1 }}
                className="w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-lg shadow-indigo-650/10 border border-slate-100"
              >
                <Lock className="w-4 h-4 text-indigo-400" />
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* SERVICE SECTION ("Layanan CyberCare") */}
      <section id="fitur" className="max-w-7xl mx-auto px-6 py-16 lg:py-20 border-t border-slate-100">
        
        {/* Title center */}
        <div className="text-center mb-12 sm:mb-16">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 inline-block relative pb-2.5">
            Layanan <span className="text-[#3b3df2]">CyberCare</span>
            {/* The signature blue underline from screenshot */}
            <span className="absolute bottom-0 left-12 right-12 h-[3.5px] bg-[#3b3df2] rounded-full" />
          </h3>
          <p className="text-[#64748b] text-sm mt-3.5 max-w-2xl mx-auto">
            Berbagai fitur untuk membantu siswa dan guru BK dalam pencegahan dan penanganan cyberbullying.
          </p>
        </div>

        {/* 2 Rows, 3 Columns Responsive Grid of 6 Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* CARD 1: Asesmen */}
          <div className="bg-white rounded-[24px] border border-slate-100 p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <div className="w-14 h-14 bg-[#eff2ff] rounded-full flex items-center justify-center mb-4.5 shadow-sm text-[#4f46e5]">
              <FileText className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900 mb-2">Asesmen</h4>
            <p className="text-slate-500 text-xs leading-relaxed max-w-[240px]">
              Ukur tingkat pengalaman cyberbullying yang dialami siswa.
            </p>
          </div>

          {/* CARD 2: Lapor Cyberbullying */}
          <div className="bg-white rounded-[24px] border border-slate-100 p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <div className="w-14 h-14 bg-[#eff2ff] rounded-full flex items-center justify-center mb-4.5 shadow-sm text-[#4f46e5]">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900 mb-2">Lapor Cyberbullying</h4>
            <p className="text-slate-500 text-xs leading-relaxed max-w-[240px]">
              Laporkan kejadian cyberbullying dengan aman dan mudah.
            </p>
          </div>

          {/* CARD 3: Cyber Counseling */}
          <div className="bg-white rounded-[24px] border border-slate-100 p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <div className="w-14 h-14 bg-[#eff2ff] rounded-full flex items-center justify-center mb-4.5 shadow-sm text-[#4f46e5]">
              <MessageCircle className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900 mb-2">Cyber Counseling</h4>
            <p className="text-slate-500 text-xs leading-relaxed max-w-[240px]">
              Layanan konseling online bersama guru BK secara terjadwal.
            </p>
          </div>

          {/* CARD 4: Pusat Edukasi */}
          <div className="bg-white rounded-[24px] border border-slate-100 p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <div className="w-14 h-14 bg-[#eff2ff] rounded-full flex items-center justify-center mb-4.5 shadow-sm text-[#4f46e5]">
              <BookOpen className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900 mb-2">Pusat Edukasi</h4>
            <p className="text-slate-500 text-xs leading-relaxed max-w-[240px]">
              Materi edukatif seputar cyberbullying dan literasi digital.
            </p>
          </div>

          {/* CARD 5: Dashboard Guru BK */}
          <div className="bg-white rounded-[24px] border border-slate-100 p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <div className="w-14 h-14 bg-[#eff2ff] rounded-full flex items-center justify-center mb-4.5 shadow-sm text-[#4f46e5]">
              <BarChart className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900 mb-2">Dashboard Guru BK</h4>
            <p className="text-slate-500 text-xs leading-relaxed max-w-[240px]">
              Kelola data, laporan, konseling, dan monitoring secara terintegrasi.
            </p>
          </div>

          {/* CARD 6: Monitoring Kasus */}
          <div className="bg-white rounded-[24px] border border-slate-100 p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <div className="w-14 h-14 bg-[#eff2ff] rounded-full flex items-center justify-center mb-4.5 shadow-sm text-[#4f46e5]">
              <Shield className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900 mb-2">Monitoring Kasus</h4>
            <p className="text-slate-500 text-xs leading-relaxed max-w-[240px]">
              Pantau perkembangan kasus dan hasil layanan secara sistematis.
            </p>
          </div>

        </div>

        {/* BOTTOM TRIPLE/QUADRUPLE HORIZONTAL TRUST BAR */}
        <div id="tentang-kami" className="mt-16 bg-[#f5f8ff] rounded-[24px] p-6 border border-indigo-100/70 flex flex-col md:flex-row justify-between items-stretch gap-6 divide-y md:divide-y-0 md:divide-x divide-indigo-100">
          
          {/* Badge 1: Aman */}
          <div className="flex-1 flex items-center gap-4 py-3 md:py-0 md:px-4 first:pl-0">
            <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
              <Shield className="w-5 h-5 fill-indigo-100" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-850">Aman & Terpercaya</p>
              <p className="text-[11px] text-slate-500">Data dijaga kerahasiaannya.</p>
            </div>
          </div>

          {/* Badge 2: Akses Mudah */}
          <div className="flex-1 flex items-center gap-4 py-4 md:py-0 md:px-6">
            <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-850">Akses Mudah</p>
              <p className="text-[11px] text-slate-500">Kapan saja, di mana saja.</p>
            </div>
          </div>

          {/* Badge 3: Respons Cepat */}
          <div className="flex-1 flex items-center gap-4 py-4 md:py-0 md:px-6">
            <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-850">Respons Cepat</p>
              <p className="text-[11px] text-slate-500">Bantuan lebih cepat & tepat.</p>
            </div>
          </div>

          {/* Badge 4: Peduli */}
          <div className="flex-1 flex items-center gap-4 py-3 md:py-0 md:pl-6 last:pr-0">
            <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
              <Heart className="w-5 h-5 fill-indigo-100" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-850">Peduli & Empati</p>
              <p className="text-[11px] text-slate-500">Kami mendengar, kami peduli.</p>
            </div>
          </div>

        </div>

      </section>

      {/* FOOTER SECTION */}
      <footer id="kontak" className="relative z-10 max-w-7xl mx-auto px-6 py-12 text-center border-t border-slate-200/50 mt-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-bold">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 flex items-center justify-center shrink-0">
              <Logo className="w-5 h-5" />
            </div>
            <span>© 2026 CyberCare. Bimbingan & Konseling Digital Mandiri.</span>
          </div>
          <div className="flex gap-4">
            <span className="text-[#3b3df2]">Pencegahan Siber Sekolah</span>
            <span>UKS & BK Kolaborasi</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
