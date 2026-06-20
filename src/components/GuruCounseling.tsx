import React, { useState } from "react";
import { MessageSquare, Check, Calendar, Send, Clock, UserCheck, ArrowLeft } from "lucide-react";
import { Counseling, User } from "../types";

interface GuruCounselingProps {
  user: User;
  counselings: Counseling[];
  selectedCounselingId: string | null;
  setSelectedCounselingId: (id: string | null) => void;
  onAcceptCounseling: (id: string) => Promise<void>;
  onFinishCounseling: (id: string) => Promise<void>;
  onSendChatMessage: (counselingId: string, messageText: string) => Promise<void>;
}

export default function GuruCounseling({
  user,
  counselings,
  selectedCounselingId,
  setSelectedCounselingId,
  onAcceptCounseling,
  onFinishCounseling,
  onSendChatMessage
}: GuruCounselingProps) {
  const [chatInputText, setChatInputText] = useState("");
  const [isSendingChat, setIsSendingChat] = useState(false);
  const activeCounselingRoom = counselings.find(c => c.id === selectedCounselingId);

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
    <div id="guru-counseling-panel" className="space-y-6 animate-fade-in text-slate-805">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Konseling & Pertemuan BK (Daftar Sesi)</h2>
        <p className="text-xs text-slate-500 mt-1">Selesai/Setujui jadwal diskusi tatap muka digital, whatsapp call, atau chat dari murid sekolah.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Sesi List */}
        <div className={`bg-white rounded-3xl p-6 border border-slate-205 shadow-md space-y-4 ${activeCounselingRoom ? "hidden lg:block" : "block"}`}>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-600" />
            Agenda Masuk Konseling
          </h3>

          {counselings.length > 0 ? (
            <div className="space-y-3">
              {counselings.map((c) => {
                const isSelected = selectedCounselingId === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCounselingId(c.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected 
                        ? "bg-indigo-50/50 border-indigo-400 text-indigo-850 shadow-xs" 
                        : "bg-slate-50/50 border-slate-200/80 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[9.5px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded uppercase">{c.metode}</span>
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                        c.status === "Menunggu" ? "bg-amber-50 text-amber-700" :
                        c.status === "Disetujui" ? "bg-emerald-50 text-emerald-700" : "bg-slate-200 text-slate-700"
                      }`}>
                        {c.status}
                      </span>
                    </div>
                    <h4 className="font-extrabold text-xs text-slate-800 mt-2.5 truncate">{c.topik}</h4>
                    <p className="text-[10.5px] text-slate-500 mt-0.5">Siswa: {c.siswaNama} ({c.siswaKelas})</p>
                    <p className="text-[10.5px] text-slate-400 font-mono mt-1">{c.tanggal} • {c.waktu}</p>

                    {c.status === "Menunggu" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAcceptCounseling(c.id);
                        }}
                        className="mt-3 w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10.5px] rounded-lg transition-colors cursor-pointer text-center block"
                      >
                        Setujui Pertemuan Sesi
                      </button>
                    )}

                    {c.status === "Disetujui" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onFinishCounseling(c.id);
                        }}
                        className="mt-3 w-full py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-250 font-bold text-[10.5px] rounded-lg transition-colors cursor-pointer text-center block"
                      >
                        Tandai Sesi Selesai
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-slate-400 text-center py-10 font-medium">Belum ada agenda bimbingan didaftarkan.</p>
          )}
        </div>

        {/* Right Column: Live Chat Console */}
        <div className={`lg:col-span-2 bg-white rounded-3xl border border-slate-205 shadow-md flex flex-col h-[520px] overflow-hidden ${!activeCounselingRoom ? "hidden lg:flex" : "flex"}`}>
          
          {activeCounselingRoom ? (
            <>
              {/* Chat Header */}
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-150 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <button
                    onClick={() => setSelectedCounselingId(null)}
                    className="lg:hidden p-1.5 hover:bg-slate-200 rounded-lg text-slate-500 flex items-center gap-1 shrink-0"
                    title="Kembali ke agenda"
                  >
                    <ArrowLeft className="w-4 h-4 text-slate-600" />
                    <span className="text-xs font-bold">Daftar</span>
                  </button>
                  <div className="min-w-0">
                    <h4 className="font-bold text-[9px] text-slate-400 uppercase tracking-widest leading-none">Nama Siswa / Sesi Terpilih</h4>
                    <h3 className="font-extrabold text-xs sm:text-sm text-slate-800 truncate mt-1 leading-tight">{activeCounselingRoom.siswaNama} ({activeCounselingRoom.siswaKelas})</h3>
                    <p className="text-[10.5px] text-slate-505 mt-0.5 truncate">Topik: <span className="font-semibold text-indigo-600">{activeCounselingRoom.topik}</span></p>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-indigo-50 border border-indigo-100/50 px-2.5 py-1 rounded-full shrink-0">
                  <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="text-[9px] font-bold text-indigo-600 hidden sm:inline">{activeCounselingRoom.status}</span>
                </div>
              </div>

              {/* Conversation list */}
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

              {/* Console Input */}
              {activeCounselingRoom.status === "Selesai" ? (
                <div className="p-4 bg-slate-100 border-t border-slate-150 text-center text-xs text-slate-500 font-medium">
                  Sesi konseling telah diakhiri secara tuntas. Terima kasih atas kepedulian bimbingannya.
                </div>
              ) : activeCounselingRoom.status !== "Disetujui" ? (
                <div className="p-4 bg-slate-100 border-t border-slate-150 text-center text-xs text-slate-500 font-medium">
                  Persilakan murid memulai dengan menyetujui jadwal pertemuan konseling di panel samping.
                </div>
              ) : (
                <form onSubmit={handleSendChat} className="p-4 bg-white border-t border-slate-150 flex gap-2">
                  <input
                    type="text"
                    value={chatInputText}
                    onChange={(e) => setChatInputText(e.target.value)}
                    placeholder="Tulis balasan bimbingan santun draf Guru BK...."
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
              <p className="text-sm font-bold text-slate-800">Ruang Obrolan Konseling Belum Terbuka</p>
              <p className="text-xs text-slate-400 max-w-sm mt-1">
                Silahkan pilih salah satu bimbingan terdaftar di panel samping kiri Anda untuk mengobrol atau mengontrol progres status bimbingan.
              </p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
