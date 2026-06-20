import React, { useState } from "react";
import { TrendingUp, Edit, Plus, FileText, CheckCircle } from "lucide-react";
import { MonitoringCase } from "../types";

interface GuruMonitoringProps {
  monitoringCases: MonitoringCase[];
  onSubmitUpdate: (id: string, formData: any) => Promise<void>;
  onAddTindakan: (id: string, tindakan: string) => Promise<void>;
}

export default function GuruMonitoring({
  monitoringCases,
  onSubmitUpdate,
  onAddTindakan
}: GuruMonitoringProps) {
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const selectedCase = monitoringCases.find(mc => mc.id === selectedCaseId);

  const [activeFormType, setActiveFormType] = useState<"view" | "edit">("view");
  const [caseUpdateForm, setCaseUpdateForm] = useState({
    statusPenanganan: "Identifikasi" as "Identifikasi" | "Konseling Berjalan" | "Tindak Lanjut" | "Selesai",
    perkembanganSiswa: "",
    rencanaTindakLanjut: "",
    newTindakanText: ""
  });

  const handleCaseSelect = (caseObj: MonitoringCase) => {
    setSelectedCaseId(caseObj.id);
    setActiveFormType("view");
    setCaseUpdateForm({
      statusPenanganan: caseObj.statusPenanganan,
      perkembanganSiswa: caseObj.perkembanganSiswa,
      rencanaTindakLanjut: caseObj.rencanaTindakLanjut,
      newTindakanText: ""
    });
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCaseId) return;

    try {
      // First add the new tindakan log if entered
      if (caseUpdateForm.newTindakanText.trim() !== "") {
        await onAddTindakan(selectedCaseId, caseUpdateForm.newTindakanText.trim());
      }
      
      // Then send the primary progress details update
      await onSubmitUpdate(selectedCaseId, {
        statusPenanganan: caseUpdateForm.statusPenanganan,
        perkembanganSiswa: caseUpdateForm.perkembanganSiswa,
        rencanaTindakLanjut: caseUpdateForm.rencanaTindakLanjut
      });

      setCaseUpdateForm(prev => ({ ...prev, newTindakanText: "" }));
      setActiveFormType("view");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div id="guru-monitoring-panel" className="space-y-6 animate-fade-in text-slate-805">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Monitoring Kasus Perundungan Siber</h2>
        <p className="text-xs text-slate-500 mt-1">Draf pencatatan komprehensif tindakan sekolah, mediasi sosial, pengenalan pelaku, serta pemulihan psikologi korban.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column: List of cases */}
        <div className="bg-white p-6 rounded-3xl border border-slate-205 shadow-md space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-605" />
            Daftar Kasus Aktif
          </h3>

          {monitoringCases.length > 0 ? (
            <div className="space-y-3">
              {monitoringCases.map((item) => {
                const isSelected = selectedCaseId === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => handleCaseSelect(item)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected 
                        ? "bg-indigo-50/50 border-indigo-400 text-indigo-850 shadow-xs" 
                        : "bg-slate-50/50 border-slate-200/80 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[9.5px] font-bold text-slate-400 uppercase">Update: {item.tanggalUpdate}</span>
                      <span className={`text-[8.5px] font-bold px-1.5 py-0.5 rounded ${
                        item.statusPenanganan === "Identifikasi" ? "bg-red-50 text-red-700" :
                        item.statusPenanganan === "Konseling Berjalan" ? "bg-blue-50 text-blue-700" :
                        item.statusPenanganan === "Tindak Lanjut" ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"
                      }`}>
                        {item.statusPenanganan}
                      </span>
                    </div>
                    <h4 className="font-extrabold text-xs text-slate-800 mt-2 truncate">{item.siswaNama} ({item.siswaKelas})</h4>
                    <p className="text-[10.5px] text-slate-550 truncate mt-0.5">{item.jenisKasus}</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-slate-400 text-center py-10">Belum ada draf pemantauan terbuat.</p>
          )}
        </div>

        {/* Right column: Form details and modifications */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-205 shadow-md p-6 space-y-4">
          
          {selectedCase ? (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Penanganan Komprehensif</span>
                  <h3 className="font-black text-lg text-slate-800 mt-0.5">{selectedCase.siswaNama}</h3>
                  <p className="text-xs text-slate-500 font-semibold">{selectedCase.siswaKelas} • {selectedCase.jenisKasus}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveFormType("view")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      activeFormType === "view" ? "bg-indigo-600 text-white" : "bg-slate-50 hover:bg-slate-100 text-slate-600 border"
                    }`}
                  >
                    Detail Laporan
                  </button>
                  <button
                    onClick={() => setActiveFormType("edit")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      activeFormType === "edit" ? "bg-indigo-600 text-white" : "bg-slate-50 hover:bg-slate-100 text-slate-600 border"
                    }`}
                  >
                    Update Kemajuan
                  </button>
                </div>
              </div>

              {activeFormType === "view" ? (
                <div className="space-y-6 text-xs leading-relaxed">
                  
                  {/* Tindakan logs list */}
                  <div className="space-y-2">
                    <p className="text-slate-450 font-bold uppercase text-[9.5px]">Log Tindakan Sekolah / Guru BK:</p>
                    <div className="space-y-2">
                      {selectedCase.catatanTindakan.map((tind, i) => (
                        <div key={i} className="flex gap-2.5 p-3 bg-slate-50 border border-slate-150 rounded-xl items-start">
                          <span className="w-5 h-5 bg-indigo-50 text-indigo-600 border border-indigo-100 font-bold rounded-full flex items-center justify-center shrink-0 text-[10px]">
                            {i+1}
                          </span>
                          <span className="font-semibold text-slate-700 mt-0.5">{tind}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50/50 border rounded-xl space-y-1">
                      <p className="text-slate-450 font-bold uppercase text-[9px]">Perkembangan Kondisi Siswa:</p>
                      <p className="text-slate-700 font-medium whitespace-pre-line">{selectedCase.perkembanganSiswa || "Belum dicatat."}</p>
                    </div>

                    <div className="p-4 bg-slate-50/50 border rounded-xl space-y-1">
                      <p className="text-slate-450 font-bold uppercase text-[9px]">Rencana Tindak Lanjut Sekolah:</p>
                      <p className="text-slate-700 font-medium whitespace-pre-line">{selectedCase.rencanaTindakLanjut || "Belum dicatat."}</p>
                    </div>
                  </div>

                  <div className="flex justify-between text-[11px] text-slate-400 bg-slate-50 p-2.5 rounded-lg border border-slate-200/50">
                    <span>Kasus Dimulai: {selectedCase.tanggalUpdate}</span>
                    <span>Status: <span className="font-bold text-indigo-600 uppercase">{selectedCase.statusPenanganan}</span></span>
                  </div>

                </div>
              ) : (
                <form onSubmit={handleUpdateSubmit} className="space-y-4">
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-605 uppercase mb-1.5">Status Penanganan Kasus</label>
                    <select
                      value={caseUpdateForm.statusPenanganan}
                      onChange={(e) => setCaseUpdateForm(prev => ({ ...prev, statusPenanganan: e.target.value as any }))}
                      className="w-full px-3.5 py-2 bg-slate-50 text-xs text-slate-705 border rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="Identifikasi">Identifikasi (Analisis Bukti & Pemetaan Korban)</option>
                      <option value="Konseling Berjalan">Konseling Berjalan (Terapi Emosional Mandiri)</option>
                      <option value="Tindak Lanjut">Tindak Lanjut (Mediasi Wali Kelompok / Konseli Wali Kelas)</option>
                      <option value="Selesai">Selesai (Kasus ditutup secara damai & pulih)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-605 uppercase mb-1.5">Tambah Catatan Tindakan Baru (Pilihan)</label>
                    <input
                      type="text"
                      value={caseUpdateForm.newTindakanText}
                      onChange={(e) => setCaseUpdateForm(prev => ({ ...prev, newTindakanText: e.target.value }))}
                      className="w-full px-3.5 py-2.5 bg-slate-50 text-xs text-slate-800 border rounded-lg placeholder-slate-400"
                      placeholder="Contoh: Mengagendakan pemanggilan pelaku siber atau mediasi"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-605 uppercase mb-1.5">Catatan Perkembangan Siswa Terakhir</label>
                      <textarea
                        rows={3}
                        value={caseUpdateForm.perkembanganSiswa}
                        onChange={(e) => setCaseUpdateForm(prev => ({ ...prev, perkembanganSiswa: e.target.value }))}
                        className="w-full px-3.5 py-3 bg-slate-50 text-xs text-slate-800 leading-relaxed border rounded-xl"
                        placeholder="Bagaimana kondisi emosi siswa? Apakah kecemasan mulai turun?"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-605 uppercase mb-1.5">Agenda Tindak Lanjut Sekolah Terdekat</label>
                      <textarea
                        rows={3}
                        value={caseUpdateForm.rencanaTindakLanjut}
                        onChange={(e) => setCaseUpdateForm(prev => ({ ...prev, rencanaTindakLanjut: e.target.value }))}
                        className="w-full px-3.5 py-3 bg-slate-50 text-xs text-slate-800 leading-relaxed border rounded-xl"
                        placeholder="Sebutkan langkah koordinasi berikutnya dari pihak kesiswaan"
                        required
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl cursor-pointer shadow-sm text-center"
                    >
                      Simpan Pemutakhiran Monitoring
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveFormType("view")}
                      className="px-4 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                    >
                      Batalkan
                    </button>
                  </div>
                </form>
              )}

            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-slate-400 h-full text-center">
              <FileText className="w-12 h-12 text-slate-205 mb-2" />
              <p className="text-sm font-bold text-slate-800">Draf Detail Monitoring Belum Terbuka</p>
              <p className="text-xs text-slate-500 mt-1">Silahkan ketuk nama siswa di panel samping kiri Anda untuk membaca, memonitor, atau mengupdate penanganan sekolah.</p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
