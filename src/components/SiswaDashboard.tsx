import React from "react";
import { 
  AlertTriangle, 
  FileText, 
  CheckCircle, 
  Compass, 
  TrendingUp, 
  ShieldAlert, 
  Clock, 
  ArrowRight,
  MessageSquare,
  Info 
} from "lucide-react";
import { User, Assessment, IncidentReport, Counseling } from "../types";

interface SiswaDashboardProps {
  user: User;
  assessments: Assessment[];
  reports: IncidentReport[];
  counselings: Counseling[];
  setActiveTab: (tab: string) => void;
  setSelectedCounselingId: (id: string | null) => void;
  setIsRequestingCounseling: (req: boolean) => void;
}

export default function SiswaDashboard({
  user,
  assessments,
  reports,
  counselings,
  setActiveTab,
  setSelectedCounselingId,
  setIsRequestingCounseling
}: SiswaDashboardProps) {
  const myAssessments = assessments.filter(a => a.username === user.username);
  const latestAssessment = myAssessments[0];
  const myReports = reports.filter(r => r.username === user.username);
  const myCounselings = counselings.filter(c => c.username === user.username);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Halo, {user.nama}</h2>
          <p className="text-sm text-slate-500 mt-1">
            Portal CyberCare melindungi psikologi & ketenteraman bersosial mediamu. Kami menyediakan bimbingan rahasia.
          </p>
        </div>
        <div className="flex gap-2.5">
          <button 
            onClick={() => setActiveTab("lapor")}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-rose-600/10 cursor-pointer transition-all"
          >
            <AlertTriangle className="w-4 h-4" /> 
            Laporkan Perundungan
          </button>
          <button 
            onClick={() => setActiveTab("asesmen")}
            className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-xs transition-all"
          >
            <FileText className="w-4 h-4" /> 
            Mulai Asesmen Diri
          </button>
        </div>
      </div>

      {/* STATS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* 1. Status Keamanan */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Status Paparan Siber</p>
          <div className="flex items-end justify-between">
            <span className={`text-2xl font-extrabold ${
              !latestAssessment ? "text-slate-400" :
              latestAssessment.level === "Aman" ? "text-emerald-600" :
              latestAssessment.level === "Ringan" ? "text-blue-500" :
              latestAssessment.level === "Sedang" ? "text-amber-500" : "text-rose-600"
            }`}>
              {latestAssessment ? latestAssessment.level : "Belum Asesmen"}
            </span>
            <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
              Sistem Aktif
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full mt-4">
            <div 
              className="h-full bg-indigo-600 rounded-full transition-all duration-500" 
              style={{ width: latestAssessment ? `${Math.min(100, (latestAssessment.score / 24) * 100)}%` : "0%" }} 
            />
          </div>
        </div>

        {/* 2. Skor Nilai Indeks */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Skor Kerentanan</p>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-extrabold text-slate-800">
              {latestAssessment ? `${latestAssessment.score}/24` : "--"}
            </span>
            <span className="text-[10.5px] text-slate-400 font-medium">Batas Aman &lt; 5</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full mt-4">
            <div 
              className="h-full bg-slate-400 rounded-full transition-all duration-500" 
              style={{ width: latestAssessment ? `${(latestAssessment.score / 24) * 100}%` : "0%" }} 
            />
          </div>
        </div>

        {/* 3. Laporan Kasus Milik Anda */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Laporan Diajukan</p>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-extrabold text-slate-800">
              {myReports.length} Laporan
            </span>
            <span className="text-[10.5px] text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded">
              {myReports.filter(r => r.status === "Selesai").length} Tuntas
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full mt-4">
            <div 
              className="h-full bg-indigo-600 rounded-full transition-all duration-500" 
              style={{ width: myReports.length > 0 ? "100%" : "0%" }} 
            />
          </div>
        </div>

        {/* 4. Konseling Terjadwal */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Konseling BK</p>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-extrabold text-slate-800">
              {myCounselings.filter(c => c.status !== "Selesai" && c.status !== "Dibatalkan").length} Sesi
            </span>
            <span className="text-[10.5px] text-slate-400">Aktif</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full mt-4">
            <div 
              className="h-full bg-blue-500 rounded-full transition-all duration-500" 
              style={{ width: myCounselings.filter(c => c.status === "Disetujui").length > 0 ? "100%" : "0%" }} 
            />
          </div>
        </div>

      </div>

      {/* TWO COLUMN SUMMARY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Latest Assessment & Reports */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-slate-200/80 shadow-md space-y-6">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <span className="w-1.5 h-5 bg-indigo-600 rounded-full" />
            Asesmen Kerentanan Terakhirmu
          </h3>

          {latestAssessment ? (
            <div className="p-5 bg-slate-50 border border-slate-150 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-semibold uppercase">Diisi pada: {latestAssessment.tanggal}</span>
                <span className={`text-[10.5px] font-bold px-2.5 py-1 rounded-full ${
                  latestAssessment.level === "Aman" || latestAssessment.level === "Ringan" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-rose-50 text-rose-700 border border-rose-100"
                }`}>
                  Kategori {latestAssessment.level}
                </span>
              </div>
              <p className="text-sm font-bold text-slate-800">Skor Pengalaman Cyberbullying: {latestAssessment.score} / 24</p>
              <p className="text-xs text-slate-600 leading-relaxed bg-white p-3.5 rounded-xl border border-slate-200/50">
                {latestAssessment.rekomendasi}
              </p>
            </div>
          ) : (
            <div className="text-center py-10 px-4 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-800">Kamu belum pernah mengisi Lembar Asesmen</p>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
                Isi kuesioner singkat 8 pertanyaan guna memantau indikasi perlakuan tidak sopan atau intimidasi siber di lingkungan sekolah tepercaya.
              </p>
              <button
                onClick={() => setActiveTab("asesmen")}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm cursor-pointer transition-colors"
              >
                Mulai Evaluasi Sekarang
              </button>
            </div>
          )}

          {/* Incident reports list */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Status Pemantauan Kasus Pelaporan</h4>
            
            {myReports.length > 0 ? (
              <div className="space-y-3">
                {myReports.slice(0, 3).map((item) => (
                  <div key={item.id} className="p-4 bg-white border border-slate-200 rounded-xl hover:shadow-xs transition-shadow flex items-center justify-between">
                    <div className="min-w-0 pr-4">
                      <p className="text-xs font-semibold text-slate-800 truncate">{item.kronologi}</p>
                      <p className="text-[10.5px] text-slate-400 mt-1">Terduga Pelaku: {item.pihakTerlibat} • Kejadian: {item.tanggalKejadian}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${
                      item.status === "Diterima" ? "bg-blue-50 text-blue-600 border border-blue-100" :
                      item.status === "Dalam Proses" ? "bg-amber-50 text-amber-600 border border-amber-100" : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                    }`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-3 py-4 bg-slate-50 rounded-xl border border-slate-150">
                <p className="text-xs text-slate-400 font-medium">Belum ada laporan pengaduan siber aktif milik Anda.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Counseling Sessions & Warnings */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-md space-y-6">
          <h3 className="text-base font-bold text-slate-800">Pertemuan & Konseling BK</h3>

          {myCounselings.length > 0 ? (
            <div className="space-y-4">
              {myCounselings.map((c) => (
                <div key={c.id} className="relative pl-4 border-l-2 border-indigo-500 py-1">
                  <p className="text-[9px] font-bold text-indigo-600 uppercase tracking-widest">{c.tanggal} • {c.waktu}</p>
                  <h4 className="font-bold text-xs text-slate-800 mt-1">{c.topik}</h4>
                  <p className="text-[11px] text-slate-500">Pembimbing: {c.guruNama}</p>
                  <div className="flex gap-1.5 mt-2">
                    <span className="px-1.5 py-0.5 text-[9px] font-bold bg-slate-100 text-slate-600 rounded">
                      {c.metode}
                    </span>
                    <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded ${
                      c.status === "Menunggu" ? "bg-amber-50 text-amber-700" :
                      c.status === "Disetujui" ? "bg-emerald-50 text-emerald-700" : "bg-slate-150 text-slate-700"
                    }`}>
                      {c.status}
                    </span>
                  </div>
                  {c.status === "Disetujui" && (
                    <button
                      onClick={() => { setSelectedCounselingId(c.id); setActiveTab("counseling"); }}
                      className="mt-2.5 text-[10px] text-indigo-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      Buka Ruang Konseling <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center bg-slate-50 border border-dashed border-slate-250 rounded-2xl">
              <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-800">Tidak ada jadwal konseling aktif</p>
              <button
                onClick={() => { setActiveTab("counseling"); setIsRequestingCounseling(true); }}
                className="mt-3 text-[10.5px] bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-1.5 border border-indigo-200 font-bold rounded-lg cursor-pointer"
              >
                + Ajukan Konseling Sekarang
              </button>
            </div>
          )}

          {/* Jaminan Privasi info box */}
          <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-100">
            <div className="flex gap-2">
              <ShieldAlert className="w-4.5 h-4.5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-indigo-805">Privasi Dijamin Penuh</p>
                <p className="text-[10.5px] text-slate-500 leading-relaxed mt-0.5">
                  Seluruh percakapan, tangkapan layar bukti, serta jawaban kuesioner bersifat rahasia di bawah bimbingan Guru BK dan Undang-Undang Perlindungan Anak.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
