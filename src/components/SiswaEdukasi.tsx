import React, { useState } from "react";
import { Compass, BookOpen, Clock, ShieldAlert, Sparkles, CheckCircle2 } from "lucide-react";
import { EducationalArticle } from "../types";
import { educationalArticles } from "../data";

interface SiswaEdukasiProps {
  onGenerateAiTips: (topic: string) => Promise<string>;
}

export default function SiswaEdukasi({ onGenerateAiTips }: SiswaEdukasiProps) {
  const [eduFilter, setEduFilter] = useState("Semua");
  const [selectedArticleId, setSelectedArticleId] = useState<string>("art-1");
  const [aiTipsTopic, setAiTipsTopic] = useState("Etika Chatting dalam Group Kelas");
  const [aiTipsOutput, setAiTipsOutput] = useState("");
  const [isGeneratingTips, setIsGeneratingTips] = useState(false);

  const filteredArticles = eduFilter === "Semua" 
    ? educationalArticles 
    : educationalArticles.filter(art => art.category === eduFilter);

  const handleGenerateTips = async () => {
    setIsGeneratingTips(true);
    setAiTipsOutput("");
    try {
      const result = await onGenerateAiTips(aiTipsTopic);
      setAiTipsOutput(result);
    } catch (err) {
      setAiTipsOutput("Gagal menghubungkan dengan asisten cerdas.");
    } finally {
      setIsGeneratingTips(false);
    }
  };

  return (
    <div id="siswa-edukasi-panel" className="space-y-8 animate-fade-in text-slate-800">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Pusat Literasi Digital Remaja</h2>
          <p className="text-xs text-slate-500 mt-1">Saring komentar negatif, lindungi kearifan pribadi, serta pelajari tindak balasan sehat berselancar internet.</p>
        </div>
        
        {/* Interactive Categories filters */}
        <div className="flex flex-wrap gap-2">
          {["Semua", "Pencegahan", "Etika", "Keamanan Digital", "Penanganan"].map((cat) => (
            <button
              key={cat}
              onClick={() => setEduFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                eduFilter === cat 
                  ? "bg-indigo-600 text-white" 
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* TWO PANEL KNOWLEDGE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Article Reader Column */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md space-y-6">
          
          {/* Article List widgets */}
          <div className="space-y-3">
            {filteredArticles.map((art) => {
              const isSelected = selectedArticleId === art.id;
              return (
                <div
                  key={art.id}
                  onClick={() => setSelectedArticleId(art.id)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected 
                      ? "bg-indigo-50/20 border-indigo-400 shadow-xs" 
                      : "bg-white border-slate-200 hover:bg-slate-50/50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-indigo-650 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100/55">
                      {art.category}
                    </span>
                    <span className="text-slate-400 text-[10.5px] font-medium">{art.readTime}</span>
                  </div>
                  
                  <h4 className="font-extrabold text-slate-800 text-sm">{art.title}</h4>
                  
                  {isSelected && (
                    <div className="text-xs text-slate-600 leading-relaxed mt-4 pt-4 border-t border-slate-100 whitespace-pre-line">
                      {art.content}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

        {/* Right: Dynamic Tips Generator - Gemini AI Prompt Module */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md space-y-6">
          <div className="p-4 bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-2xl border border-slate-150 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 text-indigo-500/20">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-xs font-black text-indigo-700 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Compass className="w-4 h-4 text-amber-500 animate-spin" />
              Rekomendasi Cepat AI
            </h3>
            <p className="text-[10.5px] text-slate-550 leading-relaxed mb-4">
              Butuh arahan instan? Pilih topik bimbingan siber di bawah, asisten cerdas CyberCare akan merangkum tips praktis melalui Gemini AI.
            </p>

            <div className="space-y-3">
              <label className="block text-[9.5px] font-bold text-slate-505 uppercase">Pilih Pokok Bahasan:</label>
              <select
                value={aiTipsTopic}
                onChange={(e) => setAiTipsTopic(e.target.value)}
                className="w-full px-3 py-2 bg-white text-xs border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="Etika Chatting dalam Group Kelas">Etika Chatting dalam Group Kelas</option>
                <option value="Cara Melindungi Gawai dari Phishing">Cara Melindungi Gawai dari Phishing</option>
                <option value="Tindakan Jika Rekan Kita Dibully secara Siber">Tindakan Jika Rekan Kita Dibully secara Siber</option>
                <option value="Cara Memulihkan Trauma Mental Pasca Bullying">Cara Memulihkan Trauma Mental Pasca Bullying</option>
              </select>

              <button
                onClick={handleGenerateTips}
                disabled={isGeneratingTips}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold rounded-xl cursor-pointer hover:shadow-xs transition-all flex items-center justify-center gap-1.5"
              >
                {isGeneratingTips ? (
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Tanya Panduan Pintar"
                )}
              </button>
            </div>
          </div>

          {/* AI Output Result console */}
          {aiTipsOutput && (
            <div className="p-4.5 bg-emerald-50/40 text-xs text-slate-700 border border-emerald-100 rounded-xl leading-relaxed whitespace-pre-line shadow-xs">
              <div className="flex items-center gap-1.5 mb-2 border-b border-emerald-100/50 pb-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <p className="font-extrabold text-emerald-800 text-[10.5px] uppercase">Rekomendasi Bimbingan:</p>
              </div>
              <p className="text-[11px] font-semibold text-slate-750 whitespace-pre-line">{aiTipsOutput}</p>
            </div>
          )}

          {/* Pedoman Penanganan note */}
          <p className="text-[9px] text-slate-400 text-center leading-relaxed font-semibold uppercase">
            *Materi edukasi bersertifikasi anti perundungan sekolah
          </p>
        </div>

      </div>
    </div>
  );
}
