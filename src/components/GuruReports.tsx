import React from "react";
import { AlertTriangle, Clock, ShieldCheck, UserCheck } from "lucide-react";
import { IncidentReport } from "../types";

interface GuruReportsProps {
  reports: IncidentReport[];
}

export default function GuruReports({ reports }: GuruReportsProps) {
  return (
    <div id="guru-reports-panel" className="space-y-6 animate-fade-in text-slate-800">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Laporan Kasus Masuk (Siswa)</h2>
        <p className="text-xs text-slate-500 mt-1">Uraian laporan perundungan siber yang diajukan oleh siswa-siswi melalui portal digital CyberCare.</p>
      </div>

      {reports.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reports.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-slate-200/80 shadow-md p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">ID Laporan: {item.id}</span>
                  <h3 className="font-extrabold text-sm text-slate-800 mt-1">{item.namaPelapor} ({item.kelas})</h3>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                  item.status === "Diterima" ? "bg-red-50 text-red-600 border border-red-100" :
                  item.status === "Dalam Proses" ? "bg-amber-50 text-amber-600 border border-amber-100" : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                }`}>
                  {item.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div>
                  <p className="text-slate-450 font-bold uppercase text-[9px] mb-0.5">Tanggal Kejadian</p>
                  <p className="text-slate-700">{item.tanggalKejadian}</p>
                </div>
                <div>
                  <p className="text-slate-450 font-bold uppercase text-[9px] mb-0.5">Terduga Pelaku</p>
                  <p className="text-slate-700 font-semibold">{item.pihakTerlibat}</p>
                </div>
              </div>

              <div className="text-xs leading-relaxed text-slate-650 space-y-1 bg-slate-50/50 p-4 border border-slate-100 rounded-xl">
                <p className="text-slate-450 font-bold uppercase text-[9px]">Kronologi Kejadian:</p>
                <p className="font-medium whitespace-pre-line text-slate-750">{item.kronologi}</p>
              </div>

              {item.buktiName && (
                <div className="flex items-center justify-between text-xs border border-indigo-100 bg-indigo-50/20 p-2.5 rounded-lg text-indigo-700">
                  <span className="font-semibold block truncate">File Bukti: {item.buktiName}</span>
                  <span className="text-[9px] bg-indigo-100 border border-indigo-200 px-2 py-0.5 rounded font-black uppercase shrink-0">Screenshot Tersedia</span>
                </div>
              )}

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Tanggal Dilaporkan: {item.tanggalLapor}</span>
                <span className="flex items-center gap-1 text-slate-550 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" /> Jaminan Kerahasiaan BK
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-10 text-center border border-slate-205 py-14">
          <AlertTriangle className="w-12 h-12 text-slate-305 mx-auto mb-3" />
          <p className="text-sm font-bold text-slate-800">Tidak ada laporan kasus tersimpan</p>
          <p className="text-xs text-slate-500 mt-1">Sistem menyembunyikan atau membersihkan kasus-kasus jika sudah tidak relevan.</p>
        </div>
      )}
    </div>
  );
}
