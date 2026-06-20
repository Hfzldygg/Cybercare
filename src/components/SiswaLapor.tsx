import React, { useState } from "react";
import { AlertTriangle, CheckCircle, Check, Info } from "lucide-react";
import { User } from "../types";

interface SiswaLaporProps {
  user: User;
  onSubmitReport: (formData: any) => Promise<void>;
  setActiveTab: (tab: string) => void;
}

export default function SiswaLapor({
  user,
  onSubmitReport,
  setActiveTab
}: SiswaLaporProps) {
  const [reportSuccess, setReportSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reportFormData, setReportFormData] = useState({
    namaPelapor: user.nama,
    kelas: user.kelas_nip,
    tanggalKejadian: new Date().toISOString().split("T")[0],
    kronologi: "",
    pihakTerlibat: "",
    buktiName: "",
    buktiData: ""
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setReportFormData(prev => ({
        ...prev,
        buktiName: file.name,
        buktiData: "Tangkapan_Layar_" + file.name
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportFormData.kronologi || reportFormData.kronologi.trim().length < 15) {
      alert("Mohon jelaskan rincian kronologi secara lengkap minimal 15 karakter.");
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmitReport(reportFormData);
      setReportSuccess(true);
      // Reset
      setReportFormData({
        namaPelapor: user.nama,
        kelas: user.kelas_nip,
        tanggalKejadian: new Date().toISOString().split("T")[0],
        kronologi: "",
        pihakTerlibat: "",
        buktiName: "",
        buktiData: ""
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="siswa-lapor-panel" className="max-w-2xl mx-auto bg-white rounded-3xl p-8 border border-slate-200/80 shadow-md space-y-6 animate-fade-in text-slate-800">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl border border-rose-100">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-800">Laporkan Kasus Cyberbullying</h2>
          <p className="text-xs text-slate-500 mt-0.5">Pendampingan proteksi terpercaya oleh dewan Guru BK sekolah</p>
        </div>
      </div>

      {reportSuccess ? (
        <div className="text-center py-6 space-y-4">
          <div className="inline-flex p-3 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Laporan Pengaduan Terkirim!</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            Laporan Anda telah terdaftar. Draf pemantauan kemajuan kasus otomatis diterbitkan dan ditinjau secara tertutup oleh Guru BK demi menjaga kesejahteraan emosimu.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => setReportSuccess(false)}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
            >
              Ajukan Pengaduan Lain
            </button>
            <button
              onClick={() => setActiveTab("dashboard")}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm cursor-pointer"
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="bg-slate-50 border border-slate-150 p-4 rounded-2xl flex gap-3 text-xs text-slate-600 leading-relaxed mb-2">
            <Info className="w-4.5 h-4.5 text-blue-500 shrink-0 mt-0.5" />
            <p>
              Setiap pengaduan dijamin bebas dari intimidasi sekunder. Guru BK akan menelaah kronologi siber secara diskret tanpa membuka detail namamu apabila diminta saat pemanggilan pelaku.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase">Nama Lengkap / Korban</label>
              <input
                type="text"
                value={reportFormData.namaPelapor}
                onChange={(e) => setReportFormData(prev => ({ ...prev, namaPelapor: e.target.value }))}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800"
                placeholder="Identitas Pelapor"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase">Kelas / Unit</label>
              <input
                type="text"
                value={reportFormData.kelas}
                onChange={(e) => setReportFormData(prev => ({ ...prev, kelas: e.target.value }))}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800"
                placeholder="Rincian Kelas"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase">Tanggal Kejadian Siber</label>
              <input
                type="date"
                value={reportFormData.tanggalKejadian}
                onChange={(e) => setReportFormData(prev => ({ ...prev, tanggalKejadian: e.target.value }))}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase">Terduga Pihak Terlibat / Pelaku</label>
              <input
                type="text"
                value={reportFormData.pihakTerlibat}
                onChange={(e) => setReportFormData(prev => ({ ...prev, pihakTerlibat: e.target.value }))}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800"
                placeholder="Nama Teman, Geng, / Akun Medsos Pelaku"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase">Uraian Ringkas Kronologi Kejadian</label>
            <textarea
              rows={4}
              value={reportFormData.kronologi}
              onChange={(e) => setReportFormData(prev => ({ ...prev, kronologi: e.target.value }))}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 placeholder-slate-400 leading-relaxed"
              placeholder="Mohon ceritakan kronologi secara rinci (di platform apa, apa yang diucapkan/diperbuat pelaku, ketakutan yang Anda rasakan, draf kejadian minimal 15 huruf)"
              required
            />
          </div>

          {/* Screenshot File upload block */}
          <div className="p-4 bg-slate-50 border border-dashed border-slate-250 rounded-xl">
            <label className="block text-xs font-bold text-slate-700 mb-1">Unggah Tangkapan Layar (Screenshot Bukti Obrolan)</label>
            <p className="text-[10.5px] text-slate-400 mb-3">Sertakan screenshot pesan berupa celaan siber, fitnah siber, atau tindakan menyudutkan lainnya.</p>
            
            <div className="flex items-center gap-4">
              <input
                type="file"
                id="screenshot-evidence"
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
              <label
                htmlFor="screenshot-evidence"
                className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer transition-colors inline-block"
              >
                Pilih Berkas Screenshot
              </label>
              
              {reportFormData.buktiName ? (
                <span className="text-xs text-indigo-600 font-bold flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" /> {reportFormData.buktiName}
                </span>
              ) : (
                <span className="text-xs text-slate-400 font-medium">Belum melampirkan berkas bukti</span>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-45 text-white font-bold text-xs rounded-xl tracking-wide transition-all shadow-md shadow-indigo-500/10 cursor-pointer"
          >
            {isSubmitting ? "Mengirim Laporan..." : "Kirim Laporan Pengaduan Siber"}
          </button>
        </form>
      )}
    </div>
  );
}
