import React, { useState, useEffect } from "react";
import { 
  ShieldAlert, 
  BookOpen, 
  Compass, 
  CheckCircle, 
  AlertTriangle, 
  FileText, 
  TrendingUp, 
  Clock, 
  LogOut, 
  RefreshCw,
  MessageSquare
} from "lucide-react";
import { User, Assessment, IncidentReport, Counseling, MonitoringCase } from "./types";
import LoginScreen from "./components/LoginScreen";
import LandingPage from "./components/LandingPage";

// Import modular screens
import SiswaDashboard from "./components/SiswaDashboard";
import SiswaAsesmen from "./components/SiswaAsesmen";
import SiswaLapor from "./components/SiswaLapor";
import SiswaCounseling from "./components/SiswaCounseling";
import SiswaEdukasi from "./components/SiswaEdukasi";
import GuruDashboard from "./components/GuruDashboard";
import GuruReports from "./components/GuruReports";
import GuruCounseling from "./components/GuruCounseling";
import GuruMonitoring from "./components/GuruMonitoring";

export default function App() {
  // Authentication & Profile States
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("cybercare_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [showLogin, setShowLogin] = useState<boolean>(false);

  // Active view tab state
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  // Server state data
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [reports, setReports] = useState<IncidentReport[]>([]);
  const [counselings, setCounselings] = useState<Counseling[]>([]);
  const [monitoringCases, setMonitoringCases] = useState<MonitoringCase[]>([]);
  
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [msgNotification, setMsgNotification] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Active counseling chat room
  const [selectedCounselingId, setSelectedCounselingId] = useState<string | null>(null);
  const [isRequestingCounseling, setIsRequestingCounseling] = useState(false);

  // Sync state data from Express server
  const fetchAllData = async () => {
    setIsDataLoading(true);
    try {
      const [resAss, resRep, resCoun, resMon] = await Promise.all([
        fetch("/api/assessments").then(r => r.json()),
        fetch("/api/reports").then(r => r.json()),
        fetch("/api/counselings").then(r => r.json()),
        fetch("/api/monitoring").then(r => r.json())
      ]);
      setAssessments(resAss);
      setReports(resRep);
      setCounselings(resCoun);
      setMonitoringCases(resMon);
    } catch (err) {
      console.error("Gagal sinkronisasi data dari server.", err);
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    localStorage.setItem("cybercare_user", JSON.stringify(loggedInUser));
    
    if (loggedInUser.role === "siswa") {
      setActiveTab("dashboard");
    } else {
      setActiveTab("guru_dashboard");
    }
    triggerNotice(`Selamat datang kembali, ${loggedInUser.nama}!`, "success");
  };

  const handleLogout = () => {
    localStorage.removeItem("cybercare_user");
    setUser(null);
    setSelectedCounselingId(null);
    triggerNotice("Sesi masuk berhasil diakhiri.", "success");
  };

  const triggerNotice = (text: string, type: "success" | "error" = "success") => {
    setMsgNotification({ text, type });
    setTimeout(() => {
      setMsgNotification(null);
    }, 4000);
  };

  // --- Core API handlers ---

  // 1. Submit quiz responses
  const onSubmitAssessment = async (score: number, level: string, answers: Record<string, number>, rekomendasi: string) => {
    if (!user) return;
    try {
      const response = await fetch("/api/assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: user.username,
          nama: user.nama,
          kelas: user.kelas_nip,
          score,
          level,
          answers,
          rekomendasi
        })
      });

      if (response.ok) {
        triggerNotice("Hasil asesmen cyberbullying berhasil disimpan!", "success");
        fetchAllData();
      } else {
        triggerNotice("Gagal memproses pengajuan instrumen.", "error");
      }
    } catch (err) {
      triggerNotice("Koneksi gagal saat terhubung ke server.", "error");
    }
  };

  // 2. Submit new incident reporting form
  const onSubmitReport = async (formData: any) => {
    if (!user) return;
    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          username: user.username
        })
      });

      if (response.ok) {
        triggerNotice("Laporan siber sukses didaftarkan!", "success");
        fetchAllData();
      } else {
        triggerNotice("Gagal menyimpan form laporan.", "error");
      }
    } catch (err) {
      triggerNotice("Terjadi kegagalan sambungan jaringan.", "error");
    }
  };

  // 3. Request a new face-to-face or digital counseling session
  const onRequestNewSession = async (formData: any) => {
    if (!user) return;
    try {
      const response = await fetch("/api/counselings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          username: user.username,
          siswaNama: user.nama,
          siswaKelas: user.kelas_nip
        })
      });

      if (response.ok) {
        triggerNotice("Permohonan jadwal konseling berhasil dikirim!", "success");
        fetchAllData();
      } else {
        triggerNotice("Form pendaftaran konseling ditolak.", "error");
      }
    } catch (err) {
      triggerNotice("Gagal menghubungi server konseling.", "error");
    }
  };

  // 4. Send chat message
  const onSendChatMessage = async (counselingId: string, messageText: string) => {
    if (!user) return;
    try {
      const response = await fetch(`/api/counselings/${counselingId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: user.role,
          senderName: user.nama,
          message: messageText
        })
      });

      if (response.ok) {
        const updatedObj = await response.json();
        setCounselings(prev => 
          prev.map(c => c.id === updatedObj.id ? updatedObj : c)
        );
      }
    } catch (err) {
      triggerNotice("Gagal meluncurkan tanggapan chat.", "error");
    }
  };

  // 5. Guru action: Accept schedule
  const onAcceptCounseling = async (id: string) => {
    try {
      const response = await fetch(`/api/counselings/${id}/accept`, { method: "POST" });
      if (response.ok) {
        triggerNotice("Agenda bimbingan sukses diapprove!", "success");
        fetchAllData();
      }
    } catch (err) {
      triggerNotice("Gagal menyetujui jadwal bimbingan.", "error");
    }
  };

  // 6. Guru action: Finish session
  const onFinishCounseling = async (id: string) => {
    try {
      const response = await fetch(`/api/counselings/${id}/finish`, { method: "POST" });
      if (response.ok) {
        triggerNotice("Sesi konseling ditandai sebagai Selesai.", "success");
        fetchAllData();
      }
    } catch (err) {
      triggerNotice("Gagal menuntaskan sesi bimbingan.", "error");
    }
  };

  // 7. Guru action: Update monitoring details
  const onSubmitUpdate = async (id: string, formData: any) => {
    try {
      const response = await fetch("/api/monitoring/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          ...formData
        })
      });

      if (response.ok) {
        triggerNotice("Status kemajuan kasus berhasil disimpan!", "success");
        fetchAllData();
      }
    } catch (err) {
      triggerNotice("Gagal memperbarui data draf.", "error");
    }
  };

  // 8. Guru action: Add tindakan log
  const onAddTindakan = async (id: string, tindakanText: string) => {
    try {
      const response = await fetch(`/api/monitoring/${id}/tindakan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tindakan: tindakanText })
      });

      if (response.ok) {
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 9. Generate AI-backed advice on centering topics
  const onGenerateAiTips = async (topic: string): Promise<string> => {
    try {
      const response = await fetch("/api/ai/tips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic })
      });
      if (response.ok) {
        const resJson = await response.json();
        return resJson.tips || "No response received";
      }
    } catch (err) {
      console.error(err);
    }
    return "Gagal memproses draf tips AI.";
  };

  const handleQuickLogin = async (username: string) => {
    const password = username === "siswa" ? "siswa123" : "guru123";
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (response.ok) {
        const userData = await response.json();
        handleLoginSuccess(userData);
      } else {
        triggerNotice("Gagal masuk cepat, periksa jaringan.", "error");
      }
    } catch (err) {
      triggerNotice("Terjadi kesalahan sambungan jaringan.", "error");
    }
  };

  if (!user) {
    if (!showLogin) {
      return <LandingPage onGetStarted={() => setShowLogin(true)} onQuickLogin={handleQuickLogin} />;
    }
    return <LoginScreen onLoginSuccess={handleLoginSuccess} onBack={() => setShowLogin(false)} />;
  }

  // Active counseling schedules
  const myCounselingsCount = counselings.filter(c => c.username === user.username && c.status === "Disetujui").length;
  const pendingRequestsCount = counselings.filter(c => c.status === "Menunggu").length;
  const rawReportsCount = reports.filter(r => r.status === "Diterima").length;

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-800 font-sans overflow-hidden">
      
      {/* TOAST SYSTEM NOTICE */}
      {msgNotification && (
        <div 
          id="toast-notice" 
          className={`fixed top-4 right-4 z-50 max-w-sm w-full bg-white rounded-xl shadow-xl border-l-4 p-4 flex items-center gap-3 transition-all duration-300 ${
            msgNotification.type === "success" ? "border-indigo-500" : "border-rose-500"
          }`}
        >
          <div className={`p-1 rounded-full ${msgNotification.type === "success" ? "bg-indigo-50 text-indigo-600" : "bg-rose-50 text-rose-600"}`}>
            <CheckCircle className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold text-slate-800">CyberCare Notifikasi</p>
            <p className="text-xs text-slate-500">{msgNotification.text}</p>
          </div>
        </div>
      )}

      {/* SIDEBAR MAIN PANEL */}
      <aside id="sidebar-panel" className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between py-6 flex-shrink-0 select-none">
        <div className="px-5">
          {/* Logo Brand */}
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/15">
              <ShieldAlert className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-slate-900 leading-none">CyberCare</h1>
              <span className="text-[9.5px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">Bimbingan Konseling</span>
            </div>
          </div>

          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3.5 px-3">
            Menu Navigasi
          </div>

          {/* Student Menus */}
          {user.role === "siswa" && (
            <nav className="space-y-1">
              <button
                id="tab-siswa-dashboard"
                onClick={() => { setActiveTab("dashboard"); setSelectedCounselingId(null); }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-3 transition-all cursor-pointer ${
                  activeTab === "dashboard" ? "bg-indigo-50 text-indigo-700" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>Beranda Utama</span>
              </button>

              <button
                id="tab-siswa-asesmen"
                onClick={() => { setActiveTab("asesmen"); setSelectedCounselingId(null); }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-3 transition-all cursor-pointer ${
                  activeTab === "asesmen" ? "bg-indigo-50 text-indigo-700" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Asesmen Digital</span>
              </button>

              <button
                id="tab-siswa-lapor"
                onClick={() => { setActiveTab("lapor"); setSelectedCounselingId(null); }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-3 transition-all cursor-pointer ${
                  activeTab === "lapor" ? "bg-indigo-50 text-indigo-700" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Laporkan Kasus</span>
              </button>

              <button
                id="tab-siswa-counseling"
                onClick={() => { setActiveTab("counseling"); setSelectedCounselingId(null); }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-3 transition-all cursor-pointer ${
                  activeTab === "counseling" ? "bg-indigo-50 text-indigo-700" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Cyber Counseling</span>
                {myCounselingsCount > 0 && (
                  <span className="ml-auto w-2 h-2 bg-[#4f46e5] rounded-full" />
                )}
              </button>

              <button
                id="tab-siswa-edukasi"
                onClick={() => { setActiveTab("edukasi"); setSelectedCounselingId(null); }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-3 transition-all cursor-pointer ${
                  activeTab === "edukasi" ? "bg-indigo-50 text-indigo-705" : "text-slate-505 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Pusat Literasi</span>
              </button>
            </nav>
          )}

          {/* Guru BK Menus */}
          {user.role === "guru" && (
            <nav className="space-y-1">
              <button
                id="tab-guru-dashboard"
                onClick={() => { setActiveTab("guru_dashboard"); setSelectedCounselingId(null); }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-3 transition-all cursor-pointer ${
                  activeTab === "guru_dashboard" ? "bg-indigo-50 text-indigo-700" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>Lembaga Guru BK</span>
              </button>

              <button
                id="tab-guru-reports"
                onClick={() => { setActiveTab("guru_reports"); setSelectedCounselingId(null); }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-3 transition-all cursor-pointer ${
                  activeTab === "guru_reports" ? "bg-indigo-50 text-indigo-700" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Kasus Dilaporkan</span>
                {rawReportsCount > 0 && (
                  <span className="ml-auto bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
                    {rawReportsCount}
                  </span>
                )}
              </button>

              <button
                id="tab-guru-counseling"
                onClick={() => { setActiveTab("guru_counseling"); setSelectedCounselingId(null); }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-3 transition-all cursor-pointer ${
                  activeTab === "guru_counseling" ? "bg-indigo-50 text-indigo-700" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Ruang Bimbingan</span>
                {pendingRequestsCount > 0 && (
                  <span className="ml-auto bg-[#4f46e5] text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
                    {pendingRequestsCount}
                  </span>
                )}
              </button>

              <button
                id="tab-guru-monitoring"
                onClick={() => { setActiveTab("guru_monitoring"); setSelectedCounselingId(null); }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-3 transition-all cursor-pointer ${
                  activeTab === "guru_monitoring" ? "bg-indigo-50 text-indigo-700" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span>Monitoring Perkembangan</span>
              </button>
            </nav>
          )}

          {/* Quick Help Box for Student */}
          {user.role === "siswa" && (
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl mt-6">
              <p className="text-[10px] text-indigo-600 font-bold uppercase mb-1">Butuh Bantuan?</p>
              <p className="text-[11px] text-slate-550 leading-relaxed mb-3">Ingin bercerita? Ajukan diskusi rahasia bersama Guru BK tepercaya.</p>
              <button
                onClick={() => { setActiveTab("counseling"); setIsRequestingCounseling(true); }}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shadow-indigo-500/10"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Mulai Diskusi Baru
              </button>
            </div>
          )}
        </div>

        {/* PROFILE CRADLE */}
        <div className="px-5">
          <div className="flex items-center gap-3 border-t border-slate-100 pt-4 mb-3">
            <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-black text-sm">
              {user.nama.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-extrabold text-slate-800 truncate">{user.nama}</p>
              <p className="text-[9.5px] text-slate-400 font-bold uppercase truncate">{user.role}: {user.kelas_nip}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full py-2 border border-slate-200 hover:bg-red-50 hover:text-red-650 rounded-xl text-[10.5px] font-bold text-slate-500 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Keluar Sesi
          </button>
        </div>
      </aside>

      {/* DATA VIEWPORT WORKSPACE */}
      <main id="main-content-panel" className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* HEADER BAR */}
        <header id="header-bar" className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 flex-shrink-0">
          <div className="flex items-center gap-3 text-xs font-bold">
            <span className="text-slate-400 capitalize">{user.role} Portal</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-805 uppercase tracking-wide">
              {activeTab.replace("_", " ")}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={fetchAllData}
              title="Sinc Data"
              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-all cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isDataLoading ? "animate-spin text-indigo-600" : ""}`} />
            </button>
            <div id="real-time" className="text-xs text-slate-400 font-bold flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/60">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Sabtu, 20 Juni 2026</span>
            </div>
          </div>
        </header>

        {/* COMPONENT DESKWORKSPACE */}
        <div className="flex-1 p-8 max-w-7xl w-full mx-auto space-y-8 select-text">
          
          {/* ==================== SISWA SCENES ==================== */}
          {user.role === "siswa" && activeTab === "dashboard" && (
            <SiswaDashboard 
              user={user}
              assessments={assessments}
              reports={reports}
              counselings={counselings}
              setActiveTab={setActiveTab}
              setSelectedCounselingId={setSelectedCounselingId}
              setIsRequestingCounseling={setIsRequestingCounseling}
            />
          )}

          {user.role === "siswa" && activeTab === "asesmen" && (
            <SiswaAsesmen 
              user={user}
              assessments={assessments}
              onSubmitAssessment={onSubmitAssessment}
              setActiveTab={setActiveTab}
              setIsRequestingCounseling={setIsRequestingCounseling}
            />
          )}

          {user.role === "siswa" && activeTab === "lapor" && (
            <SiswaLapor 
              user={user}
              onSubmitReport={onSubmitReport}
              setActiveTab={setActiveTab}
            />
          )}

          {user.role === "siswa" && activeTab === "counseling" && (
            <SiswaCounseling 
              user={user}
              counselings={counselings}
              selectedCounselingId={selectedCounselingId}
              setSelectedCounselingId={setSelectedCounselingId}
              isRequestingCounseling={isRequestingCounseling}
              setIsRequestingCounseling={setIsRequestingCounseling}
              onRequestNewSession={onRequestNewSession}
              onSendChatMessage={onSendChatMessage}
            />
          )}

          {user.role === "siswa" && activeTab === "edukasi" && (
            <SiswaEdukasi 
              onGenerateAiTips={onGenerateAiTips}
            />
          )}


          {/* ==================== GURU SCENES ==================== */}
          {user.role === "guru" && activeTab === "guru_dashboard" && (
            <GuruDashboard 
              user={user}
              assessments={assessments}
              reports={reports}
              counselings={counselings}
              monitoringCases={monitoringCases}
              setActiveTab={setActiveTab}
            />
          )}

          {user.role === "guru" && activeTab === "guru_reports" && (
            <GuruReports 
              reports={reports}
            />
          )}

          {user.role === "guru" && activeTab === "guru_counseling" && (
            <GuruCounseling 
              user={user}
              counselings={counselings}
              selectedCounselingId={selectedCounselingId}
              setSelectedCounselingId={setSelectedCounselingId}
              onAcceptCounseling={onAcceptCounseling}
              onFinishCounseling={onFinishCounseling}
              onSendChatMessage={onSendChatMessage}
            />
          )}

          {user.role === "guru" && activeTab === "guru_monitoring" && (
            <GuruMonitoring 
              monitoringCases={monitoringCases}
              onSubmitUpdate={onSubmitUpdate}
              onAddTindakan={onAddTindakan}
            />
          )}

        </div>
      </main>
    </div>
  );
}
