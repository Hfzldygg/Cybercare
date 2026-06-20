import React, { useState } from "react";
import { FileText, CheckCircle, Info, ArrowLeft } from "lucide-react";
import { User, Assessment } from "../types";
import { assessmentQuestions } from "../data";

interface SiswaAsesmenProps {
  user: User;
  assessments: Assessment[];
  onSubmitAssessment: (score: number, level: "Aman" | "Ringan" | "Sedang" | "Berat", answers: Record<string, number>, rekomendasi: string) => Promise<void>;
  setActiveTab: (tab: string) => void;
  setIsRequestingCounseling: (req: boolean) => void;
}

export default function SiswaAsesmen({
  user,
  assessments,
  onSubmitAssessment,
  setActiveTab,
  setIsRequestingCounseling
}: SiswaAsesmenProps) {
  const myAssessments = assessments.filter(a => a.username === user.username);
  const latestAssessment = myAssessments[0];

  const [assessmentStep, setAssessmentStep] = useState<"intro" | "wizard" | "result">("intro");
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [lastQuizResult, setLastQuizResult] = useState<{ score: number; level: "Aman" | "Ringan" | "Sedang" | "Berat"; rekomendasi: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleQuizOptionClick = (questionId: string, score: number) => {
    setQuizAnswers(prev => ({ ...prev, [questionId]: score }));
    if (currentQuizIndex < assessmentQuestions.length - 1) {
      setCurrentQuizIndex(prev => prev + 1);
    }
  };

  const calculateResultAndSubmit = async () => {
    setIsSubmitting(true);
    let totalScore = 0;
    assessmentQuestions.forEach(q => {
      totalScore += quizAnswers[q.id] || 0;
    });

    let level: "Aman" | "Ringan" | "Sedang" | "Berat" = "Aman";
    let rekomendasi = "Anda berada dalam ekosistem digital yang cukup aman. Tetap pelihara kebiasaan berselancar santun, saring komentar negatif, dan bantu teman yang mengalami kesulitan.";

    if (totalScore >= 18) {
      level = "Berat";
      rekomendasi = "Tingkat intimidasi siber yang Anda alami tergolong Sangat Berat dan berisiko tinggi mengganggu stabilitas emosional Anda. Kami SANGAT MENYARANKAN untuk segera membuka menu 'Cyber Counseling' untuk bimbingan pribadi rahasia dengan Ibu Guru BK.";
    } else if (totalScore >= 11) {
      level = "Sedang";
      rekomendasi = "Tingkat paparan cyberbullying yang Anda alami tergolong Sedang. Beberapa tindakan pelaku sudah merusak kenyamanan belajar Anda. Disarankan berkonsultasi santai lewat Chat Online dengan Guru BK untuk penguatan diri.";
    } else if (totalScore >= 5) {
      level = "Ringan";
      rekomendasi = "Tingkat paparan termasuk kategori Ringan. Sering kali berupa ejekan minor atau sindiran tidak langsung. Anda bisa meningkatkan privasi media sosial atau berdiskusi ringan agar masalah tidak meluas.";
    }

    try {
      await onSubmitAssessment(totalScore, level, quizAnswers, rekomendasi);
      setLastQuizResult({ score: totalScore, level, rekomendasi });
      setAssessmentStep("result");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAssessmentWizard = () => {
    setCurrentQuizIndex(0);
    setQuizAnswers({});
    setAssessmentStep("intro");
    setLastQuizResult(null);
  };

  return (
    <div id="siswa-asesmen-panel" className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-md max-w-3xl mx-auto space-y-6 animate-fade-in text-slate-800">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
          <FileText className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Asesmen Kerentanan Cyberbullying</h2>
          <p className="text-xs text-slate-550 mt-0.5">Instrumen Deteksi Dini Pengalaman Siber Sekolah</p>
        </div>
      </div>

      {/* STEP 1: INTRO SCREEN */}
      {assessmentStep === "intro" && (
        <div className="space-y-6">
          <p className="text-sm text-slate-600 leading-relaxed">
            Instrumen digital ini dirancang khusus untuk memetakan tingkat pengalaman cyberbullying yang dialami siswa saat menggunakan platform digital (WhatsApp, Instagram, Game Online). Hasil pemetaan digunakan Guru BK untuk memberikan solusi dukungan mental rahasia.
          </p>

          <div className="bg-amber-50/70 border border-amber-100 p-4 rounded-2xl flex gap-3">
            <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-amber-800 mb-0.5">Aturan Pengisian:</h4>
              <ul className="text-xs text-slate-650 list-disc pl-4 space-y-1">
                <li>Pilihlah opsi jawaban yang paling tulus mewakili kejadian nyata dalam 1-2 bulan terakhir.</li>
                <li>Tidak ada opsi salah dalam kuesioner ini, seluruh data disimpan rahasia demi melindungimu.</li>
                <li>Dapat diulang sewaktu-waktu jika perlakuan negatif di internet kembali terjadi.</li>
              </ul>
            </div>
          </div>

          {latestAssessment && (
            <div className="p-4 bg-slate-50 border border-slate-150 rounded-xl space-y-2">
              <p className="text-xs font-bold text-slate-700">Hasil Pengisian Terakhirmut:</p>
              <div className="flex flex-col sm:flex-row justify-between text-xs gap-1">
                <span>Tanggal Pengisian: <span className="font-semibold text-slate-800">{latestAssessment.tanggal}</span></span>
                <span className="font-bold text-indigo-650 bg-indigo-50 border border-indigo-100 px-20 py-0.5 rounded self-start">
                  Tingkat {latestAssessment.level} ({latestAssessment.score}/24 Poin)
                </span>
              </div>
            </div>
          )}

          <button
            onClick={() => {
              setAssessmentStep("wizard");
              setCurrentQuizIndex(0);
              setQuizAnswers({});
            }}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-850 text-white text-xs font-bold rounded-xl tracking-wide transition-all shadow-md shadow-indigo-500/10 cursor-pointer text-center"
          >
            Mulai Mengisi Kuesioner
          </button>
        </div>
      )}

      {/* STEP 2: PRESENT WIZARD SCREEN */}
      {assessmentStep === "wizard" && (
        <div className="space-y-6">
          {/* Progress Header */}
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
            <span>Instrumen {currentQuizIndex + 1} dari {assessmentQuestions.length}</span>
            <span>{Math.round(((currentQuizIndex) / assessmentQuestions.length) * 100)}% Selesai</span>
          </div>

          <div className="w-full h-1.5 bg-slate-150 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-600 rounded-full transition-all duration-300" 
              style={{ width: `${((currentQuizIndex + 1) / assessmentQuestions.length) * 100}%` }}
            />
          </div>

          {/* Question Box */}
          <div className="text-center py-4 bg-slate-50/50 rounded-2xl p-6 border border-slate-100">
            <span className="text-[10px] bg-indigo-50 border border-indigo-100/50 text-indigo-600 font-bold px-2 py-0.5 rounded-full uppercase">Pertanyaan</span>
            <h3 className="text-sm font-bold text-slate-800 leading-relaxed max-w-xl mx-auto mt-2.5">
              {assessmentQuestions[currentQuizIndex].text}
            </h3>
          </div>

          {/* Options Stack */}
          <div className="space-y-3">
            {assessmentQuestions[currentQuizIndex].options.map((opt, i) => {
              const isSelected = quizAnswers[assessmentQuestions[currentQuizIndex].id] === opt.score;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleQuizOptionClick(assessmentQuestions[currentQuizIndex].id, opt.score)}
                  className={`w-full p-4 text-left text-xs rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                    isSelected 
                      ? "bg-indigo-50 border-indigo-500 text-indigo-800 font-bold shadow-xs" 
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span>{opt.text}</span>
                  <span className={`text-[10px] font-mono font-bold ${isSelected ? "text-indigo-600" : "text-slate-400"}`}>
                    Poin: {opt.score}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Wizard control buttons */}
          <div className="flex justify-between pt-4 border-t border-slate-100 gap-4">
            <button
              type="button"
              disabled={currentQuizIndex === 0}
              onClick={() => setCurrentQuizIndex(prev => prev - 1)}
              className="px-4 py-2.5 text-xs font-semibold text-slate-400 hover:text-slate-700 disabled:opacity-40 cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Sebelumnya
            </button>
            
            {currentQuizIndex === assessmentQuestions.length - 1 ? (
              <button
                type="button"
                onClick={calculateResultAndSubmit}
                disabled={quizAnswers[assessmentQuestions[currentQuizIndex].id] === undefined || isSubmitting}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-45 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer transition-colors"
              >
                {isSubmitting ? "Menyimpan..." : "Kirim Jawaban Asesmen"}
              </button>
            ) : (
              <button
                type="button"
                disabled={quizAnswers[assessmentQuestions[currentQuizIndex].id] === undefined}
                onClick={() => setCurrentQuizIndex(prev => prev + 1)}
                className="px-6 py-2.5 bg-slate-200 text-slate-700 hover:bg-slate-300 disabled:opacity-45 text-xs font-bold rounded-xl cursor-pointer transition-colors"
              >
                Pertanyaan Berikutnya
              </button>
            )}
          </div>
        </div>
      )}

      {/* STEP 3: RESULT PRESENTATION */}
      {assessmentStep === "result" && lastQuizResult && (
        <div className="space-y-6 text-center py-4">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-50 text-indigo-600 rounded-full mb-2">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Survei Selesai Disimpan</h3>
          <p className="text-xs text-slate-500">Kuesionermu telah sukses dianalisis dan dicatat ke dalam database asisten BK.</p>

          <div className="max-w-md mx-auto p-5 bg-slate-50 rounded-2xl border border-slate-200">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Klasifikasi Kerentananmu</p>
            <div className={`text-2xl font-black mb-1 ${
              lastQuizResult.level === "Aman" ? "text-emerald-600" :
              lastQuizResult.level === "Ringan" ? "text-blue-500" :
              lastQuizResult.level === "Sedang" ? "text-amber-500" : "text-rose-600"
            }`}>
              Tingkat {lastQuizResult.level}
            </div>
            <div className="text-xs font-bold text-slate-600">Total Skor Kerentanan: {lastQuizResult.score} / 24 Poin</div>
            
            <div className="mt-4 p-3.5 bg-white text-xs text-slate-600 text-left rounded-xl border border-slate-200 leading-relaxed">
              {lastQuizResult.rekomendasi}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <button
              onClick={resetAssessmentWizard}
              className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              Ulangi Tes Asesmen
            </button>
            <button
              onClick={() => {
                setActiveTab("counseling");
                setIsRequestingCounseling(true);
              }}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
            >
              Mulai Konseling BK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
