import { User, Assessment, IncidentReport, Counseling, MonitoringCase, ChatMessage } from "../types";

// Seed data matching server.ts exactly
const SEED_ASSESSMENTS: Assessment[] = [
  {
    id: "a-1",
    username: "siswa_dummy1",
    nama: "Budi Santoso",
    kelas: "XI-MIPA-2",
    score: 18,
    level: "Sedang",
    answers: {},
    tanggal: "2026-06-18",
    rekomendasi: "Disarankan untuk melakukan konseling online dengan Guru BK guna pencegahan dampak psikologis lebih lanjut."
  },
  {
    id: "a-2",
    username: "siswa_dummy2",
    nama: "Siti Rahma",
    kelas: "X-IPS-1",
    score: 8,
    level: "Ringan",
    answers: {},
    tanggal: "2026-06-19",
    rekomendasi: "Tingkat paparan rendah, tetap waspada dan baca panduan etika bersosial media di Pusat Edukasi."
  }
];

const SEED_REPORTS: IncidentReport[] = [
  {
    id: "r-1",
    namaPelapor: "Budi Santoso",
    username: "siswa_dummy1",
    kelas: "XI-MIPA-2",
    tanggalKejadian: "2026-06-17",
    kronologi: "Saya diejek di grup WhatsApp kelas oleh beberapa orang menggunakan kata-kata kasar dan foto saya diedit sedemikian rupa menjadi bahan bercandaan negatif tiap hari.",
    pihakTerlibat: "Kelompok berteman X (inisial)",
    status: "Dalam Proses",
    tanggalLapor: "2026-06-18"
  }
];

const SEED_COUNSELINGS: Counseling[] = [
  {
    id: "c-1",
    username: "siswa_dummy1",
    siswaNama: "Budi Santoso",
    siswaKelas: "XI-MIPA-2",
    guruNama: "Ibu Sri Wahyuni, S.Pd.",
    tanggal: "2026-06-21",
    waktu: "10:00 - 11:00",
    topik: "Ejekan/Hinaan Verbal di Grup Whatsapp",
    metode: "Chat Online",
    status: "Disetujui",
    tanggalDibuat: "2026-06-18",
    chatHistory: [
      {
        id: "m-1",
        sender: "siswa",
        senderName: "Budi Santoso",
        message: "Selamat pagi Ibu, saya ingin berkonsultasi mengenai perundungan siber yang saya alami.",
        timestamp: "2026-06-18 10:05"
      },
      {
        id: "m-2",
        sender: "guru",
        senderName: "Ibu Sri Wahyuni, S.Pd.",
        message: "Selamat pagi Budi. Sangat baik kamu berani melapor dan mengajukan konseling. Ibu siap mendengarkan cerita kamu besok ya sesuai jadwal.",
        timestamp: "2026-06-18 10:15"
      }
    ]
  }
];

const SEED_MONITORING: MonitoringCase[] = [
  {
    id: "m-case-1",
    reportId: "r-1",
    siswaNama: "Budi Santoso",
    siswaKelas: "XI-MIPA-2",
    jenisKasus: "Pelecehan verbal siber (Group Chat Ridicule)",
    statusPenanganan: "Konseling Berjalan",
    catatanTindakan: [
      "Mengadakan asesmen awal terkait tingkat trauma psikologis siswa.",
      "Melakukan sesi konseling digital pertama untuk stabilisasi emosi.",
      "Membuat agenda mediasi dengan pihak-pihak terkait dalam koordinasi sekolah."
    ],
    perkembanganSiswa: "Siswa mulai merasa didukung, namun masih merasa cemas saat menggunakan media sosial WhatsApp.",
    rencanaTindakLanjut: "Melanjutkan sesi terapi kognitif-perilaku siber dan mempertemukan dengan wali kelas.",
    tanggalUpdate: "2026-06-19"
  }
];

// Helper to check if API is direct and running
let isServerAvailable: boolean | null = null;

async function checkServerStatus(): Promise<boolean> {
  if (isServerAvailable !== null) return isServerAvailable;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1200);
    const res = await fetch("/api/assessments", { signal: controller.signal }).catch(() => null);
    clearTimeout(timeout);

    if (res && res.status !== 404) {
      isServerAvailable = true;
    } else {
      isServerAvailable = false;
    }
  } catch (e) {
    isServerAvailable = false;
  }
  return isServerAvailable;
}

// Client Storage Managers
function getLocal<T>(key: string, seed: T): T {
  const item = localStorage.getItem(key);
  if (!item) {
    localStorage.setItem(key, JSON.stringify(seed));
    return seed;
  }
  try {
    return JSON.parse(item);
  } catch (e) {
    return seed;
  }
}

function setLocal<T>(key: string, val: T): void {
  localStorage.setItem(key, JSON.stringify(val));
}

// Client Simulated Logic Functions
export async function apiLogin(username: string, password?: string): Promise<User> {
  const isServer = await checkServerStatus();
  if (isServer) {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password: password || "password" }),
    });
    if (!response.ok) throw new Error("Gagal login, periksa kembali username.");
    return response.json();
  }

  // Simulated Local Authentication
  const u = username.toLowerCase();
  if (u === "siswa") {
    return {
      username: "siswa",
      nama: "Ahmad Rian",
      role: "siswa",
      kelas_nip: "XI-MIPA-1"
    };
  } else if (u === "guru") {
    return {
      username: "guru",
      nama: "Ibu Sri Wahyuni, S.Pd.",
      role: "guru",
      kelas_nip: "19850312 201012 2 003"
    };
  } else {
    const isGuru = u.includes("guru") || u.includes("bk");
    return {
      username: u,
      nama: username.charAt(0).toUpperCase() + username.slice(1),
      role: isGuru ? "guru" : "siswa",
      kelas_nip: isGuru ? "NIP Baru (Simula)" : "Kelas XI-MIPA-Sim"
    };
  }
}

export async function apiGetAssessments(): Promise<Assessment[]> {
  const isServer = await checkServerStatus();
  if (isServer) {
    return fetch("/api/assessments").then(r => r.json());
  }
  return getLocal("cybercare_assessments", SEED_ASSESSMENTS);
}

export async function apiAddAssessment(assessmentData: Partial<Assessment>): Promise<Assessment> {
  const isServer = await checkServerStatus();
  if (isServer) {
    const response = await fetch("/api/assessments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(assessmentData)
    });
    if (!response.ok) throw new Error("Gagal menyimpan asesmen");
    return response.json();
  }

  const items = getLocal("cybercare_assessments", SEED_ASSESSMENTS);
  const newObj: Assessment = {
    id: `a-${Date.now()}`,
    username: assessmentData.username || "siswa",
    nama: assessmentData.nama || "Ahmad Rian",
    kelas: assessmentData.kelas || "XI-MIPA-1",
    score: assessmentData.score || 0,
    level: assessmentData.level as any || "Aman",
    answers: assessmentData.answers || {},
    tanggal: new Date().toISOString().split("T")[0],
    rekomendasi: assessmentData.rekomendasi || "Tidak memerlukan penanganan cepat."
  };
  items.unshift(newObj);
  setLocal("cybercare_assessments", items);
  return newObj;
}

export async function apiGetReports(): Promise<IncidentReport[]> {
  const isServer = await checkServerStatus();
  if (isServer) {
    return fetch("/api/reports").then(r => r.json());
  }
  return getLocal("cybercare_reports", SEED_REPORTS);
}

export async function apiAddReport(reportData: Partial<IncidentReport>): Promise<IncidentReport> {
  const isServer = await checkServerStatus();
  if (isServer) {
    const response = await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reportData)
    });
    if (!response.ok) throw new Error("Gagal mengirim laporan");
    return response.json();
  }

  const list = getLocal("cybercare_reports", SEED_REPORTS);
  const newRep: IncidentReport = {
    id: `r-${Date.now()}`,
    namaPelapor: reportData.namaPelapor || "Siswa Rahasia",
    username: reportData.username || "siswa",
    kelas: reportData.kelas || "XI-MIPA-1",
    tanggalKejadian: reportData.tanggalKejadian || new Date().toISOString().split("T")[0],
    kronologi: reportData.kronologi || "Siber",
    pihakTerlibat: reportData.pihakTerlibat || "Tidak dikenal",
    buktiName: reportData.buktiName,
    buktiData: reportData.buktiData,
    status: "Diterima",
    tanggalLapor: new Date().toISOString().split("T")[0]
  };
  list.unshift(newRep);
  setLocal("cybercare_reports", list);

  // Auto create monitoring case
  const cases = getLocal("cybercare_monitoring", SEED_MONITORING);
  const newCase: MonitoringCase = {
    id: `m-case-${Date.now()}`,
    reportId: newRep.id,
    siswaNama: newRep.namaPelapor,
    siswaKelas: newRep.kelas,
    jenisKasus: "Laporan Baru: " + (newRep.kronologi.substring(0, 40) + "..."),
    statusPenanganan: "Identifikasi",
    catatanTindakan: ["Siswa mengajukan laporan via CyberCare.", "Menunggu verifikasi laporan oleh Guru BK."],
    perkembanganSiswa: "Laporan baru saja didaftarkan.",
    rencanaTindakLanjut: "Segera panggil siswa pelapor untuk mediasi awal dan validasi bukti siber.",
    tanggalUpdate: new Date().toISOString().split("T")[0]
  };
  cases.unshift(newCase);
  setLocal("cybercare_monitoring", cases);

  return newRep;
}

export async function apiGetCounselings(): Promise<Counseling[]> {
  const isServer = await checkServerStatus();
  if (isServer) {
    return fetch("/api/counselings").then(r => r.json());
  }
  return getLocal("cybercare_counselings", SEED_COUNSELINGS);
}

export async function apiAddCounseling(counselingData: Partial<Counseling>): Promise<Counseling> {
  const isServer = await checkServerStatus();
  if (isServer) {
    const response = await fetch("/api/counselings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(counselingData)
    });
    if (!response.ok) throw new Error("Gagal mendaftarkan konseling");
    return response.json();
  }

  const list = getLocal("cybercare_counselings", SEED_COUNSELINGS);
  const newC: Counseling = {
    id: `c-${Date.now()}`,
    username: counselingData.username || "siswa",
    siswaNama: counselingData.siswaNama || "Ahmad Rian",
    siswaKelas: counselingData.siswaKelas || "XI-MIPA-1",
    guruNama: counselingData.guruNama || "Ibu Sri Wahyuni, S.Pd.",
    tanggal: counselingData.tanggal || new Date().toISOString().split("T")[0],
    waktu: counselingData.waktu || "09:00 - 10:00",
    topik: counselingData.topik || "Konsultasi Umum",
    metode: counselingData.metode as any || "Chat Online",
    status: "Menunggu",
    tanggalDibuat: new Date().toISOString().split("T")[0],
    chatHistory: [
      {
        id: `m-init`,
        sender: "ai",
        senderName: "Sistem",
        message: `Konseling dijadwalkan dengan metode ${counselingData.metode || "Chat Online"}. Menunggu persetujuan Guru BK.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]
  };
  list.unshift(newC);
  setLocal("cybercare_counselings", list);
  return newC;
}

export async function apiSendChatMessage(
  counselingId: string,
  sender: "siswa" | "guru",
  senderName: string,
  messageText: string
): Promise<Counseling> {
  const isServer = await checkServerStatus();
  if (isServer) {
    const response = await fetch(`/api/counselings/${counselingId}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sender, senderName, message: messageText })
    });
    if (!response.ok) throw new Error("Gagal mengirim pesan chat");
    return response.json();
  }

  const list = getLocal("cybercare_counselings", SEED_COUNSELINGS);
  const target = list.find(c => c.id === counselingId);
  if (!target) throw new Error("Counseling room not found");

  const newMsg: ChatMessage = {
    id: `msg-${Date.now()}`,
    sender,
    senderName,
    message: messageText,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
  target.chatHistory.push(newMsg);

  if (sender === "siswa") {
    // Simulated system automated response matching express fallback
    const fallbacks = [
      `Halo ${target.siswaNama}, terima kasih telah menceritakan hal ini kepada Ibu. Ibu sangat memahami perasaan sedih dan tertekan yang kamu alami akibat perlakuan cyberbullying ini. Ibu pastikan bahwa kamu tidak sendirian menghadapi ini, dan pihak sekolah akan mendukungmu sepenuh hati. Tetap kuat ya. Apakah kamu bisa menceritakan kapan pertama kali tindakan ejekan siber tersebut terjadi?`,
      `Terima kasih telah berbagi cerita dengan Ibu. Ketahuilah bahwa tindakan intimidasi di media sosial itu sama sekali bukan kesalahanmu. Ibu menyarankan kamu untuk sementara waktu meminimalisir interaksi di platform tersebut atau melakukan block agar suasana hatimu tenang terlebih dahulu. Ibu di sini siap mendengarkan keluh kesahmu lebih lanjut.`,
      `Ibu mengerti kecemasanmu. Segala rahasia dan cerita yang kamu bagikan di CyberCare ini aman bersama bimbingan konseling. Mari kita diskusikan langkah terbaik berikutnya untuk mengumpulkan bukti agar kita bisa panggil dan mediasi bersama guru BK serta pihak berwenang di sekolah.`
    ];
    const aiResponse = fallbacks[Math.floor(Math.random() * fallbacks.length)];
    target.chatHistory.push({
      id: `msg-${Date.now() + 1}`,
      sender: "guru",
      senderName: target.guruNama,
      message: aiResponse,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  }

  setLocal("cybercare_counselings", list);
  return target;
}

export async function apiAcceptCounseling(id: string): Promise<Counseling> {
  const isServer = await checkServerStatus();
  if (isServer) {
    const response = await fetch(`/api/counselings/${id}/accept`, { method: "POST" });
    if (!response.ok) throw new Error("Gagal menerima konseling");
    return response.json();
  }

  const list = getLocal("cybercare_counselings", SEED_COUNSELINGS);
  const target = list.find(c => c.id === id);
  if (!target) throw new Error("Counseling not found");

  target.status = "Disetujui";
  target.chatHistory.push({
    id: `m-accept-${Date.now()}`,
    sender: "ai",
    senderName: "Sistem",
    message: "Jadwal konseling telah disetujui oleh Guru BK. Silakan memulai komunikasi.",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });

  setLocal("cybercare_counselings", list);
  return target;
}

export async function apiFinishCounseling(id: string): Promise<Counseling> {
  const isServer = await checkServerStatus();
  if (isServer) {
    const response = await fetch(`/api/counselings/${id}/finish`, { method: "POST" });
    if (!response.ok) throw new Error("Gagal menyudahi konseling");
    return response.json();
  }

  const list = getLocal("cybercare_counselings", SEED_COUNSELINGS);
  const target = list.find(c => c.id === id);
  if (!target) throw new Error("Counseling not found");

  target.status = "Selesai";
  target.chatHistory.push({
    id: `m-finish-${Date.now()}`,
    sender: "ai",
    senderName: "Sistem",
    message: "Sesi bimbingan konseling hari ini telah sukses diselesaikan.",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });

  setLocal("cybercare_counselings", list);
  return target;
}

export async function apiGetMonitoring(): Promise<MonitoringCase[]> {
  const isServer = await checkServerStatus();
  if (isServer) {
    return fetch("/api/monitoring").then(r => r.json());
  }
  return getLocal("cybercare_monitoring", SEED_MONITORING);
}

export async function apiUpdateMonitoring(id: string, updateData: any): Promise<MonitoringCase> {
  const isServer = await checkServerStatus();
  if (isServer) {
    const response = await fetch("/api/monitoring/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...updateData })
    });
    if (!response.ok) throw new Error("Gagal mengupdate kasus");
    return response.json();
  }

  const cases = getLocal("cybercare_monitoring", SEED_MONITORING);
  const index = cases.findIndex(c => c.id === id);
  if (index === -1) throw new Error("Case monitoring not found");

  cases[index] = {
    ...cases[index],
    statusPenanganan: updateData.statusPenanganan || cases[index].statusPenanganan,
    catatanTindakan: updateData.catatanTindakan || cases[index].catatanTindakan,
    perkembanganSiswa: updateData.perkembanganSiswa || cases[index].perkembanganSiswa,
    rencanaTindakLanjut: updateData.rencanaTindakLanjut || cases[index].rencanaTindakLanjut,
    tanggalUpdate: new Date().toISOString().split("T")[0]
  };

  setLocal("cybercare_monitoring", cases);
  return cases[index];
}

export async function apiAddTindakan(id: string, tindakanText: string): Promise<MonitoringCase> {
  const isServer = await checkServerStatus();
  if (isServer) {
    const response = await fetch(`/api/monitoring/${id}/tindakan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tindakan: tindakanText })
    });
    if (!response.ok) throw new Error("Gagal menambah catatan tindakan");
    return response.json();
  }

  const cases = getLocal("cybercare_monitoring", SEED_MONITORING);
  const target = cases.find(c => c.id === id);
  if (!target) throw new Error("Case not found");

  if (tindakanText) {
    target.catatanTindakan.push(tindakanText);
  }
  target.tanggalUpdate = new Date().toISOString().split("T")[0];
  setLocal("cybercare_monitoring", cases);
  return target;
}

export async function apiGenerateAiTips(topic: string): Promise<string> {
  const isServer = await checkServerStatus();
  if (isServer) {
    const response = await fetch("/api/ai/tips", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic })
    });
    if (response.ok) {
      const resJson = await response.json();
      return resJson.tips || "Gagal memproses draf tips AI.";
    }
  }

  const fallbackTips: Record<string, string> = {
    "etika chatting dalam group kelas": "1. Berpikir Sebelum Berbagi: Pastikan kalimat Anda tidak memicu salah paham.\n2. Kutip dengan Sopan: Selalu hargai karya dan tulisan orang lain di dunia maya.\n3. Jangan Menirukan Kebencian: Abaikan ujaran kebencian ketimbang melawannya dengan api kemarahan serupa.\n4. Sopan dalam Group Chat: Gunakan tata bahasa santun di grup kelas.",
    "cara melindungi gawai dari phishing": "1. Kunci Akun Media Sosial: Atur setelan privasi menjadi personal/dikunci.\n2. Sandi Ganda (2FA): Aktifkan otentikasi dua faktor di Instagram, WhatsApp, dan TikTok.\n3. Bijak Berteman: Jangan menyetujui permintaan pertemanan dari orang asing yang mencurigakan.\n4. Batasi Penyebaran Lokasi: Hindari menyematkan lokasi waktu-nyata demi keselamatan fisik.",
    "cara menyikapi ejekan di grup": "1. Tangkap Layar (Screenshot): Simpan bukti digital secara lengkap dan tertata.\n2. Bloking Akun Pelaku: Hentikan akses pelaku siber untuk melukai ketenteraman emosi Anda.\n3. Ceritakan dan Laporkan: Gunakan forum CyberCare ini untuk bimbingan rahasia dengan Guru BK.\n4. Luangkan Waktu Offline: Segarkan pikiran Anda dengan berinteraksi bersama keluarga dan sahabat."
  };

  const key = topic.toLowerCase();
  for (const k of Object.keys(fallbackTips)) {
    if (key.includes(k) || k.includes(key)) {
      return fallbackTips[k];
    }
  }

  return fallbackTips["cara menyikapi ejekan di grup"];
}
