import React from "react";
import { AlertTriangle, Clock, TrendingUp, Check, Users, FileText, Compass } from "lucide-react";
import { User, Assessment, IncidentReport, Counseling, MonitoringCase } from "../types";

interface GuruDashboardProps {
  user: User;
  assessments: Assessment[];
  reports: IncidentReport[];
  counselings: Counseling[];
  monitoringCases: MonitoringCase[];
  setActiveTab: (tab: string) => void;
}

export default function GuruDashboard({
  user,
  assessments,
  reports,
  counselings,
  monitoringCases,
  setActiveTab
}: GuruDashboardProps) {

  // Statistics
  const totalReportsCount = reports.length;
  const pendingCounselingRequests = counselings.filter(c => c.status === "Menunggu").length;
  const activeMonitoringCount = monitoringCases.filter(mc => mc.statusPenanganan !== "Selesai").length;
  const totalAssessmentsCount = assessments.length;

  // High hazard assessments (score >= 11)
  const highRiskStudents = assessments.filter(a => a.score >= 11);

  return (
    <div id="guru-dashboard-panel" className="space-y-8 animate-fade-in text-slate-800">
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Portal Guru BK: {user.nama}</h2>
          <p className="text-xs text-slate-550 mt-1">
            Pantau dan lakukan pembimbingan kasus perundungan siber secara proaktif. Seluruh instrumen dianalisis tersistem.
          </p>
        </div>
        <div id="school-id-badge" className="text-xs font-bold text-slate-500 bg-slate-100 border px-3 py-1.5 rounded-lg">
          Unit Kerja: SMA Negeri 1 Taruna Indonesia
        </div>
      </div>

      {/* STATS MATRIX SECTION */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Total Laporan Masuk</p>
          <div className="flex items-center justify-between">
            <p className="text-3xl font-black text-slate-800">{totalReportsCount}</p>
            <span className="p-2 rounded-xl bg-rose-50 border border-rose-100 text-rose-500">
              <AlertTriangle className="w-5 h-5" />
            </span>
          </div>
          <span className="text-[10.5px] text-rose-600 font-bold flex items-center gap-1.5 mt-3">
            {reports.filter(r => r.status === "Diterima").length} Kasus Belum Ditindak
          </span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Permohonan Konseling</p>
          <div className="flex items-center justify-between">
            <p className="text-3xl font-black text-slate-800">{pendingCounselingRequests}</p>
            <span className="p-2 rounded-xl bg-amber-50 border border-amber-100 text-amber-500">
              <Clock className="w-5 h-5" />
            </span>
          </div>
          <span className="text-[10.5px] text-amber-600 font-bold flex items-center gap-1.5 mt-3">
            Menunggu Persetujuan Jadwal
          </span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Pemantauan Aktif</p>
          <div className="flex items-center justify-between">
            <p className="text-3xl font-black text-slate-800">{activeMonitoringCount}</p>
            <span className="p-2 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-505">
              <TrendingUp className="w-5 h-5" />
            </span>
          </div>
          <span className="text-[10.5px] text-indigo-600 font-bold flex items-center gap-1.5 mt-3">
            Siswa Sedang Dibimbing BK
          </span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Asesmen Terdaftar</p>
          <div className="flex items-center justify-between">
            <p className="text-3xl font-black text-slate-800">{totalAssessmentsCount}</p>
            <span className="p-2 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-550">
              <Check className="w-5 h-5" />
            </span>
          </div>
          <span className="text-[10.5px] text-emerald-600 font-bold flex items-center gap-1.5 mt-3">
            Kuesioner Siswa Teranalisis
          </span>
        </div>
      </div>

      {/* STATS BREAKDOWNS MATRIX */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left column: High Hazard level Assessments (Sedang / Berat) */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              Siswa Berisiko Tinggi (Indikasi Sedang/Berat)
            </h3>
            <span className="text-[10px] bg-rose-550 text-rose-50 font-bold px-2 py-0.5 rounded-full">
              {highRiskStudents.length} Siswa
            </span>
          </div>

          {highRiskStudents.length > 0 ? (
            <div className="space-y-3 max-h-[310px] overflow-y-auto">
              {highRiskStudents.map((stud) => (
                <div key={stud.id} className="p-3.5 bg-slate-50 border border-slate-150 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-extrabold text-slate-800">{stud.nama} ({stud.kelas})</h4>
                    <p className="text-slate-500 mt-1">Skor Kerentanan: <span className="font-bold text-slate-800">{stud.score}/24</span> • diisi pada {stud.tanggal}</p>
                  </div>
                  <span className={`font-black px-2 py-0.5 rounded ${stud.score >= 18 ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                    Tingkat {stud.level}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 text-center py-10">Belum ada siswa terindikasi trauma siber berat dari database pengisian.</p>
          )}
        </div>

        {/* Right column: Recent Incoming Reports */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-blue-600" />
              Pengaduan Kasus Masuk Teranyar
            </h3>
            <button
              onClick={() => setActiveTab("guru_reports")}
              className="text-xs text-indigo-600 font-bold hover:underline cursor-pointer"
            >
              Lihat Semua
            </button>
          </div>

          {reports.length > 0 ? (
            <div className="space-y-3 max-h-[310px] overflow-y-auto">
              {reports.slice(0, 4).map((rep) => (
                <div key={rep.id} className="p-3.5 bg-slate-50 border border-slate-150 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">{rep.namaPelapor} ({rep.kelas})</span>
                    <span className={`text-[9.5px] font-extrabold px-2 py-0.5 rounded-lg ${
                      rep.status === "Diterima" ? "bg-red-50 text-red-600 border border-red-105" :
                      rep.status === "Dalam Proses" ? "bg-amber-50 text-amber-600 border border-amber-105" : "bg-emerald-50 text-emerald-600 border border-emerald-105"
                    }`}>
                      {rep.status}
                    </span>
                  </div>
                  <p className="text-slate-500 line-clamp-2 leading-relaxed">{rep.kronologi}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 text-center py-10">Belum ada pengaduan kasus perundungan siber terdaftar saat ini.</p>
          )}
        </div>

      </div>
    </div>
  );
}
