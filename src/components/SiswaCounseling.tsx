import React, { useState } from "react";
import { MessageSquare, Calendar, Compass, Clock, Send, Plus, ShieldAlert, UserCheck } from "lucide-react";
import { User, Counseling } from "../types";

interface SiswaCounselingProps {
  user: User;
  counselings: Counseling[];
  selectedCounselingId: string | null;
  setSelectedCounselingId: (id: string | null) => void;
  isRequestingCounseling: boolean;
  setIsRequestingCounseling: (req: boolean) => void;
  onRequestNewSession: (formData: any) => Promise<void>;
  onSendChatMessage: (counselingId: string, messageText: string) => Promise<void>;
}

export default function SiswaCounseling({
  user,
  counselings,
  selectedCounselingId,
  setSelectedCounselingId,
  isRequestingCounseling,
  setIsRequestingCounseling,
  onRequestNewSession,
  onSendChatMessage
}: SiswaCounselingProps) {
  const myCounselings = counselings.filter(c => c.username === user.username);
  const activeCounselingRoom = counselings.find(c => c.id === selectedCounselingId);

  const [chatInputText, setChatInputText] = useState("");
  const [isSendingChat, setIsSendingChat] = useState(false);
  const [newSessionFormData, setNewSessionFormData] = useState({
    guruNama: "Ibu Sri Wahyuni, S.Pd.",
    tanggal: new Date().toISOString().split("T")[0],
    waktu: "10:00 - 11:00",
    topik: "",
    metode: "Chat Online" as "Chat Online" | "Video Call" | "Tatap Muka"
  });

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSessionFormData.topik || newSessionFormData.topik.trim().length < 5) {
      alert("Harap isi deskripsi topik minimal 5 karakter.");
      return;
    }
    try {
      await onRequestNewSession(newSessionFormData);
      setIsRequestingCounseling(false);
      setNewSessionFormData(prev => ({ ...prev, topik: "" }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCounselingId || !chatInputText.trim()) return;

    setIsSendingChat(true);
    const textToSend = chatInputText;
    setChatInputText("");
    try {
      await onSendChatMessage(selectedCounselingId, textToSend);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSendingChat(false);
    }
  };

  return (
    <div id="siswa-counseling-panel" className="space-y-8 animate-fade-in text-slate-850">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Cyber Counseling Sekolah</h2>
          <p className="text-xs text-slate-500 mt-1">Konsultasikan keluh kesah siber seputar kenyamanan belajarmu dengan penanganan profesional.</p>
        </div>
        <button
          onClick={() => setIsRequestingCounseling(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-lg shadow-indigo-600/10 cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4" /> Ajukan Sesi Konseling Baru
        </button>
      </div>

      {/* REQUEST MODAL FORM */}
      {isRequestingCounseling && (
        <div className="p-6 bg-white rounded-3xl border-2 border-indigo-500 shadow-xl space-y-4 max-w-lg mx-auto">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <h3 className="font-extrabold text-sm text-slate-800">Formulir Pendaftaran Jadwal Konseling</h3>
            <button onClick={() => setIsRequestingCounseling(false)} className="text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer">Batal</button>
          </div>
          
          <form onSubmit={handleCreateSession} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1.5">Pilih Guru Pembimbing BK</label>
              <select 
                value={newSessionFormData.guruNama}
                onChange={(e) => setNewSessionFormData(prev => ({ ...prev, guruNama: e.target.value }))}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700"
              >
                <option value="Ibu Sri Wahyuni, S.Pd.">Ibu Sri Wahyuni, S.Pd. (Spesialisasi Remaja & Cyberbullying)</option>
                <option value="Bapak Hermawan, S.Psi.">Bapak Hermawan, S.Psi. (Konselor Rehabilitasi Kesehatan Mental)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1.5">Rencana Pertemuan</label>
                <input
                  type="date"
                  value={newSessionFormData.tanggal}
                  onChange={(e) => setNewSessionFormData(prev => ({ ...prev, tanggal: e.target.value }))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1.5">Pilihan Jam / Waktu</label>
                <select
                  value={newSessionFormData.waktu}
                  onChange={(e) => setNewSessionFormData(prev => ({ ...prev, waktu: e.target.value }))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700"
                >
                  <option value="09:00 - 10:00">09:00 - 10:00 WIB</option>
                  <option value="10:00 - 11:00">10:00 - 11:00 WIB</option>
                  <option value="13:00 - 14:00">13:00 - 14:00 WIB</option>
                  <option value="14:00 - 15:00">14:00 - 15:00 WIB</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1.5">Metode Konseling</label>
              <select
                value={newSessionFormData.metode}
                onChange={(e) => setNewSessionFormData(prev => ({ ...prev, metode: e.target.value as any }))}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700"
              >
                <option value="Chat Online">Chat Online (Sistem Rahasia CyberCare)</option>
                <option value="Video Call">Panggilan Video Google Meet</option>
                <option value="Tatap Muka">Tatap Muka Langsung di Ruang BK</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1.5">Uraian Topik Masalah / Keluhan Utama</label>
              <input
                type="text"
                value={newSessionFormData.topik}
                onChange={(e) => setNewSessionFormData(prev => ({ ...prev, topik: e.target.value }))}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 placeholder-slate-400"
                placeholder="Contoh: Merasa trauma siber, ejekan terus menerus di grup wa"
                required
              />
            </div>

            <div className="pt-3 flex gap-2">
              <button
                type="submit"
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl cursor-pointer shadow-sm"
              >
                Daftarkan Pengajuan
              </button>
              <button
                type="button"
                onClick={() => setIsRequestingCounseling(false)}
                className="px-4 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Kembali
              </button>
            </div>
          </form>
        </div>
      )}

      {/* THREE COLUMN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Sesi List */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-indigo-50 pb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-600" />
            Jadwal Bimbingan Siber
          </h3>

          {myCounselings.length > 0 ? (
            <div className="space-y-3">
              {myCounselings.map((c) => {
                const isSelected = selectedCounselingId === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => {
                      setSelectedCounselingId(c.id);
                      setIsRequestingCounseling(false);
                    }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected 
                        ? "bg-indigo-50/50 border-indigo-400 text-indigo-850 shadow-xs" 
                        : "bg-slate-50/50 border-slate-200/60 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[9.5px] font-bold text-slate-400 block uppercase">{c.tanggal}</span>
                      <span className={`text-[8.5px] font-bold px-1.5 py-0.5 rounded ${
                        c.status === "Menunggu" ? "bg-amber-50 text-amber-700" :
                        c.status === "Disetujui" ? "bg-emerald-50 text-emerald-700" : "bg-slate-200 text-slate-750"
                      }`}>
                        {c.status}
                      </span>
                    </div>
                    <h4 className="font-extrabold text-xs text-slate-800 mt-1 truncate">{c.topik}</h4>
                    <p className="text-[10.5px] text-slate-500">Medsos BK: {c.guruNama}</p>
                    
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-200/40">
                      <span className="text-[9.5px] font-semibold bg-white border px-1.5 py-0.5 rounded text-slate-650">
                        {c.metode}
                      </span>
                      <span className="text-[9.5px] text-slate-400 font-mono">
                        {c.waktu}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-slate-400 text-center py-10 font-medium bg-slate-50 rounded-xl border border-dashed">
              Belum terdaftar bimbingan siber. Silahkan ketuk tombol "Ajukan Sesi Konseling Baru".
            </p>
          )}
        </div>

        {/* Right Column: Live Chat Interface */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 shadow-md flex flex-col h-[520px] overflow-hidden">
          
          {activeCounselingRoom ? (
            <>
              {/* Chat Header */}
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-150 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider">Topik Konseling</h4>
                  <h3 className="font-extrabold text-sm text-slate-800 truncate max-w-sm mt-0.5">{activeCounselingRoom.topik}</h3>
                  <p className="text-[10.5px] text-slate-500 mt-0.5">Pendamping: <span className="font-semibold text-indigo-600">{activeCounselingRoom.guruNama}</span></p>
                </div>
                <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-100/50 px-3 py-1 rounded-full shrink-0">
                  <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="text-[9.5px] font-bold text-indigo-600">Sesi BK {activeCounselingRoom.status}</span>
                </div>
              </div>

              {/* Chat Box Conversation */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/15">
                {activeCounselingRoom.chatHistory.map((msg, i) => {
                  const isMe = msg.sender === user.role;
                  return (
                    <div 
                      key={msg.id || i} 
                      className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                    >
                      <span className="text-[9px] text-slate-400 font-bold mb-1 px-1">{msg.senderName}</span>
                      <div className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                        isMe 
                          ? "bg-indigo-600 text-white rounded-tr-none shadow-xs" 
                          : msg.sender === "ai" 
                            ? "bg-amber-150 text-amber-850 border border-amber-200 rounded-tl-none font-medium"
                            : "bg-white text-slate-800 border border-slate-200/80 rounded-tl-none shadow-xs"
                      }`}>
                        <p className="whitespace-pre-line text-[11.5px]">{msg.message}</p>
                        <span className={`block text-[8px] text-right mt-1.5 ${isMe ? "text-indigo-200" : "text-slate-400 font-medium"}`}>
                          {msg.timestamp}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Input section */}
              {activeCounselingRoom.status === "Selesai" ? (
                <div className="p-4 bg-slate-100 border-t border-slate-150 text-center text-xs text-slate-500 font-medium">
                  Sesi konseling telah diakhiri secara tuntas oleh Guru BK. Terima kasih atas partisipasi aktif Anda.
                </div>
              ) : activeCounselingRoom.status !== "Disetujui" ? (
                <div className="p-4 bg-slate-100 border-t border-slate-150 text-center text-xs text-slate-500 font-medium">
                  Menunggu Guru BK menyetujui jadwal untuk mengaktifkan obrolan konseling online.
                </div>
              ) : (
                <form onSubmit={handleSendChat} className="p-4 bg-white border-t border-slate-150 flex gap-2">
                  <input
                    type="text"
                    value={chatInputText}
                    onChange={(e) => setChatInputText(e.target.value)}
                    placeholder="Sampaikan apa yang terjadi and perasaanmu secara leluasa..."
                    className="flex-1 px-4 py-2.5 bg-slate-50 text-xs text-slate-800 border border-slate-200/80 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <button
                    type="submit"
                    disabled={isSendingChat || !chatInputText.trim()}
                    className="px-4.5 py-2.5 bg-indigo-600 hover:bg-indigo-750 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center justify-center cursor-pointer transition-colors"
                  >
                    {isSendingChat ? "..." : <Send className="w-4 h-4" />}
                  </button>
                </form>
              )}
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-400">
              <MessageSquare className="w-12 h-12 text-slate-200 mb-2" />
              <p className="text-sm font-bold text-slate-800">Ruang Obrolan Konseling BK Belum Dibuka</p>
              <p className="text-xs text-slate-400 max-w-sm mt-1">
                Silahkan pilih salah satu bimbingan terdaftar di panel samping kiri Anda, atau buat registrasi pertemuan baru terlebih dahulu.
              </p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
