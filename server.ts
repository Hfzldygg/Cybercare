import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory Database
interface User {
  username: string;
  nama: string;
  role: "siswa" | "guru";
  kelas_nip: string;
}

interface Assessment {
  id: string;
  username: string;
  nama: string;
  kelas: string;
  score: number;
  level: "Aman" | "Ringan" | "Sedang" | "Berat";
  answers: Record<string, string>;
  tanggal: string;
  rekomendasi: string;
}

interface IncidentReport {
  id: string;
  namaPelapor: string;
  username: string;
  kelas: string;
  tanggalKejadian: string;
  kronologi: string;
  pihakTerlibat: string;
  buktiName?: string;
  buktiData?: string; // base64 or placeholder
  status: "Diterima" | "Dalam Proses" | "Selesai";
  tanggalLapor: string;
}

interface ChatMessage {
  id: string;
  sender: "siswa" | "guru" | "ai";
  senderName: string;
  message: string;
  timestamp: string;
}

interface Counseling {
  id: string;
  username: string;
  siswaNama: string;
  siswaKelas: string;
  guruNama: string;
  tanggal: string;
  waktu: string;
  topik: string;
  metode: "Chat Online" | "Video Call" | "Tatap Muka";
  status: "Menunggu" | "Disetujui" | "Selesai" | "Dibatalkan";
  chatHistory: ChatMessage[];
  tanggalDibuat: string;
}

interface MonitoringCase {
  id: string;
  reportId?: string;
  siswaNama: string;
  siswaKelas: string;
  jenisKasus: string;
  statusPenanganan: "Identifikasi" | "Konseling Berjalan" | "Tindak Lanjut" | "Selesai";
  catatanTindakan: string[];
  perkembanganSiswa: string;
  rencanaTindakLanjut: string;
  tanggalUpdate: string;
}

// Seed Initial Data
let assessments: Assessment[] = [
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

let reports: IncidentReport[] = [
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

let counselings: Counseling[] = [
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

let monitoringCases: MonitoringCase[] = [
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

// Lazy Gemini Initialization Helper
let geminiClient: GoogleGenAI | null = null;
function getGemini(): GoogleGenAI | null {
  if (!geminiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== "MY_GEMINI_API_KEY" && key.trim() !== "") {
      try {
        geminiClient = new GoogleGenAI({
          apiKey: key,
          httpOptions: {
            headers: {
              "User-Agent": "aistudio-build",
            }
          }
        });
      } catch (err) {
        console.error("Gagal menginisialisasi GoogleGenAI:", err);
      }
    }
  }
  return geminiClient;
}

// --- API ROUTES ---

// 1. Auth Endpoint
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Username dan password diperlukan" });
  }

  const u = username.toLowerCase();
  
  if (u === "siswa") {
    return res.json({
      username: "siswa",
      nama: "Ahmad Rian",
      role: "siswa",
      kelas_nip: "XI-MIPA-1"
    });
  } else if (u === "guru") {
    return res.json({
      username: "guru",
      nama: "Ibu Sri Wahyuni, S.Pd.",
      role: "guru",
      kelas_nip: "19850312 201012 2 003"
    });
  } else {
    // Dynamic signup-like behavior for testing custom usernames
    const isGuru = u.includes("guru") || u.includes("bk");
    res.json({
      username: u,
      nama: username.charAt(0).toUpperCase() + username.slice(1),
      role: isGuru ? "guru" : "siswa",
      kelas_nip: isGuru ? "NIP Baru (Simulasi)" : "Kelas XI-MIPA-Sim"
    });
  }
});

// 2. Assessments Endpoint
app.get("/api/assessments", (req, res) => {
  res.json(assessments);
});

app.post("/api/assessments", (req, res) => {
  const { username, nama, kelas, score, level, answers, rekomendasi } = req.body;
  
  const newAssessment: Assessment = {
    id: `a-${Date.now()}`,
    username: username || "siswa",
    nama: nama || "Ahmad Rian",
    kelas: kelas || "XI-MIPA-1",
    score: score || 0,
    level: level || "Aman",
    answers: answers || {},
    tanggal: new Date().toISOString().split("T")[0],
    rekomendasi: rekomendasi || "Tidak memerlukan penanganan cepat."
  };

  assessments.unshift(newAssessment);
  res.status(210).json(newAssessment);
});

// 3. Cyberbullying Reports Endpoint
app.get("/api/reports", (req, res) => {
  res.json(reports);
});

app.post("/api/reports", (req, res) => {
  const { namaPelapor, username, kelas, tanggalKejadian, kronologi, pihakTerlibat, buktiName, buktiData } = req.body;
  
  const newReport: IncidentReport = {
    id: `r-${Date.now()}`,
    namaPelapor: namaPelapor || "Siswa Rahasia",
    username: username || "siswa",
    kelas: kelas || "XI-MIPA-1",
    tanggalKejadian: tanggalKejadian || new Date().toISOString().split("T")[0],
    kronologi: kronologi || "Kronologi belum didefinisikan",
    pihakTerlibat: pihakTerlibat || "Tidak dikenal",
    buktiName,
    buktiData,
    status: "Diterima",
    tanggalLapor: new Date().toISOString().split("T")[0]
  };

  reports.unshift(newReport);

  // Automatically create a draft in Monitoring Case
  const newMCase: MonitoringCase = {
    id: `m-case-${Date.now()}`,
    reportId: newReport.id,
    siswaNama: newReport.namaPelapor,
    siswaKelas: newReport.kelas,
    jenisKasus: "Laporan Baru: " + (newReport.kronologi.substring(0, 40) + "..."),
    statusPenanganan: "Identifikasi",
    catatanTindakan: ["Siswa mengajukan laporan via CyberCare.", "Menunggu verifikasi laporan oleh Guru BK."],
    perkembanganSiswa: "Laporan baru saja didaftarkan.",
    rencanaTindakLanjut: "Segera panggil siswa pelapor untuk mediasi awal dan validasi bukti siber.",
    tanggalUpdate: new Date().toISOString().split("T")[0]
  };
  monitoringCases.unshift(newMCase);

  res.status(210).json(newReport);
});

// 4. Cyber Counselings Endpoint
app.get("/api/counselings", (req, res) => {
  res.json(counselings);
});

app.post("/api/counselings", (req, res) => {
  const { username, siswaNama, siswaKelas, guruNama, tanggal, waktu, topik, metode } = req.body;

  const newCounseling: Counseling = {
    id: `c-${Date.now()}`,
    username: username || "siswa",
    siswaNama: siswaNama || "Ahmad Rian",
    siswaKelas: siswaKelas || "XI-MIPA-1",
    guruNama: guruNama || "Ibu Sri Wahyuni, S.Pd.",
    tanggal: tanggal || new Date().toISOString().split("T")[0],
    waktu: waktu || "09:00 - 10:00",
    topik: topik || "Konsultasi Umum",
    metode: metode || "Chat Online",
    status: "Menunggu",
    tanggalDibuat: new Date().toISOString().split("T")[0],
    chatHistory: [
      {
        id: `m-init`,
        sender: "ai",
        senderName: "Sistem",
        message: `Konseling dijadwalkan dengan metode ${metode}. Menunggu persetujuan Guru BK.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]
  };

  counselings.unshift(newCounseling);
  res.status(210).json(newCounseling);
});

// 5. Chat & AI Counselor Integration
app.post("/api/counselings/:id/chat", async (req, res) => {
  const { id } = req.params;
  const { sender, senderName, message } = req.body;

  const counseling = counselings.find(c => c.id === id);
  if (!counseling) {
    return res.status(404).json({ error: "Layanan konseling tidak ditemukan." });
  }

  const newMsg: ChatMessage = {
    id: `msg-${Date.now()}`,
    sender: sender || "siswa",
    senderName: senderName || "Pengguna",
    message: message || "",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  counseling.chatHistory.push(newMsg);

  // If the student sent the message, simulate BK Guru's responsive AI counseling
  if (sender === "siswa") {
    // Try sending to Gemini
    const gemini = getGemini();
    let aiResponse = "";

    if (gemini) {
      try {
        const systemInstruction = `Anda adalah "Ibu Sri Wahyuni, S.Pd.", seorang Guru Bimbingan dan Konseling (BK) sekolah yang sangat berempati, profesional, ramah, dan solutif.
        Tugas Anda adalah mendampingi siswa bernama "${counseling.siswaNama}" (Kelas: ${counseling.siswaKelas}) yang saat ini sedang melakukan cyber counseling mengenai topik: "${counseling.topik}".
        Gunakan bahasa Indonesia yang santun, hangat, mengayomi, membimbing, mendengarkan aktif secara suportif, dan tidak menghakimi. Berikan saran-saran praktis terkait keamanan siber, ketahanan mental, serta jaminan bahwa sekolah ada di sisinya.
        Jawablah dalam 2-3 paragraf singkat yang menenangkan.`;

        // Gather chat history context
        const contextMessages = counseling.chatHistory
          .filter(m => m.sender !== "ai")
          .map(m => `${m.senderName}: ${m.message}`)
          .join("\n");

        const prompt = `Riwayat Chat:\n${contextMessages}\n\nBerikan tanggapan yang empati dan membimbing sebagai konselor BK.`;

        const response = await gemini.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            systemInstruction
          }
        });

        aiResponse = response.text || "";
      } catch (err) {
        console.error("Generasi chat Gemini gagal:", err);
      }
    }

    // Fallback response if Gemini is not set up or fails
    if (!aiResponse) {
      const fallbacks = [
        `Halo ${counseling.siswaNama}, terima kasih telah menceritakan hal ini kepada Ibu. Ibu sangat memahami perasaan sedih dan tertekan yang kamu alami akibat perlakuan cyberbullying ini. Ibu pastikan bahwa kamu tidak sendirian menghadapi ini, dan pihak sekolah akan mendukungmu sepenuh hati. Tetap kuat ya. Apakah kamu bisa menceritakan kapan pertama kali tindakan ejekan siber tersebut terjadi?`,
        `Terima kasih telah berbagi cerita dengan Ibu. Ketahuilah bahwa tindakan intimidasi di media sosial itu sama sekali bukan kesalahanmu. Ibu menyarankan kamu untuk sementara waktu meminimalisir interaksi di platfom tersebut atau melakukan block agar suasana hatimu tenang terlebih dahulu. Ibu di sini siap mendengarkan keluh kesahmu lebih lanjut.`,
        `Ibu mengerti kecemasanmu. Segala rahasia dan cerita yang kamu bagikan di CyberCare ini aman bersama bimbingan konseling. Mari kita diskusikan langkah terbaik berikutnya untuk mengumpulkan bukti agar kita bisa panggil dan mediasi bersama guru BK serta pihak berwenang di sekolah.`
      ];
      aiResponse = fallbacks[Math.floor(Math.random() * fallbacks.length)];
    }

    const aiMsg: ChatMessage = {
      id: `msg-${Date.now() + 1}`,
      sender: "guru",
      senderName: counseling.guruNama,
      message: aiResponse,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    // Push after a brief delay simulation
    counseling.chatHistory.push(aiMsg);
  }

  res.json(counseling);
});

// Accept Counseling schedule
app.post("/api/counselings/:id/accept", (req, res) => {
  const { id } = req.params;
  const counseling = counselings.find(c => c.id === id);
  if (!counseling) {
    return res.status(404).json({ error: "Layanan tidak ditemukan" });
  }

  counseling.status = "Disetujui";
  counseling.chatHistory.push({
    id: `m-accept-${Date.now()}`,
    sender: "ai",
    senderName: "Sistem",
    message: "Jadwal konseling telah disetujui oleh Guru BK. Silakan memulai komunikasi.",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });
  res.json(counseling);
});

// Finish/End Counseling session
app.post("/api/counselings/:id/finish", (req, res) => {
  const { id } = req.params;
  const counseling = counselings.find(c => c.id === id);
  if (!counseling) {
    return res.status(404).json({ error: "Layanan tidak ditemukan" });
  }

  counseling.status = "Selesai";
  counseling.chatHistory.push({
    id: `m-finish-${Date.now()}`,
    sender: "ai",
    senderName: "Sistem",
    message: "Sesi bimbingan konseling hari ini telah sukses diselesaikan.",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });
  res.json(counseling);
});

// 6. Case Monitoring Endpoints
app.get("/api/monitoring", (req, res) => {
  res.json(monitoringCases);
});

app.post("/api/monitoring/update", (req, res) => {
  const { id, statusPenanganan, catatanTindakan, perkembanganSiswa, rencanaTindakLanjut } = req.body;
  const cIndex = monitoringCases.findIndex(c => c.id === id);
  if (cIndex === -1) {
    return res.status(404).json({ error: "Kasus monitoring tidak ditemukan" });
  }

  monitoringCases[cIndex] = {
    ...monitoringCases[cIndex],
    statusPenanganan: statusPenanganan || monitoringCases[cIndex].statusPenanganan,
    catatanTindakan: catatanTindakan || monitoringCases[cIndex].catatanTindakan,
    perkembanganSiswa: perkembanganSiswa || monitoringCases[cIndex].perkembanganSiswa,
    rencanaTindakLanjut: rencanaTindakLanjut || monitoringCases[cIndex].rencanaTindakLanjut,
    tanggalUpdate: new Date().toISOString().split("T")[0]
  };

  res.json(monitoringCases[cIndex]);
});

// POST to add dynamic tindakan to a case
app.post("/api/monitoring/:id/tindakan", (req, res) => {
  const { id } = req.params;
  const { tindakan } = req.body;
  const mCase = monitoringCases.find(c => c.id === id);
  if (!mCase) {
    return res.status(404).json({ error: "Kasus tidak ditemukan" });
  }

  if (tindakan) {
    mCase.catatanTindakan.push(tindakan);
  }
  mCase.tanggalUpdate = new Date().toISOString().split("T")[0];
  res.json(mCase);
});

// Generate dynamic educational tips using Gemini AI!
app.post("/api/ai/tips", async (req, res) => {
  const { topic } = req.body;
  const gemini = getGemini();

  if (gemini) {
    try {
      const response = await gemini.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Berikan 4 tips praktis, elegan, dan menenangkan untuk menangani cyberbullying bertema: "${topic || "Dasar Keamanan Digital"}". Format jawaban dalam bentuk poin-poin singkat berbahasa Indonesia yang memotivasi dan empati.`,
      });
      return res.json({ tips: response.text });
    } catch (err) {
      console.error("Gemini AI tip generation failed:", err);
    }
  }

  // Fallback tips
  const fallbackTips: Record<string, string> = {
    "etika": "1. Berpikir Sebelum Berbagi: Pastikan kalimat Anda tidak memicu salah paham.\n2. Kutip dengan Sopan: Selalu hargai karya dan tulisan orang lain di dunia maya.\n3. Jangan Menirukan Kebencian: Abaikan ujaran kebencian ketimbang melawannya dengan api kemarahan serupa.\n4. Sopan dalam Group Chat: Gunakan tata bahasa santun di grup kelas.",
    "keamanan": "1. Kunci Akun Media Sosial: Atur setelan privasi menjadi personal/dikunci.\n2. Sandi Ganda (2FA): Aktifkan otentikasi dua faktor di Instagram, WhatsApp, dan TikTok.\n3. Bijak Berteman: Jangan menyetujui permintaan pertemanan dari orang asing yang mencurigakan.\n4. Batasi Penyebaran Lokasi: Hindari menyematkan lokasi waktu-nyata demi keselamatan fisik.",
    "menghadapi": "1. Tangkap Layar (Screenshot): Simpan bukti digital secara lengkap dan tertata.\n2. Bloking Akun Pelaku: Hentikan akses pelaku siber untuk melukai ketenteraman emosi Anda.\n3. Ceritakan dan Laporkan: Gunakan forum CyberCare ini untuk bimbingan rahasia dengan Guru BK.\n4. Luangkan Waktu Offline: Segarkan pikiran Anda dengan berinteraksi bersama keluarga dan sahabat."
  };

  const key = (topic || "menghadapi").toLowerCase();
  res.json({ tips: fallbackTips[key] || fallbackTips["menghadapi"] });
});


// Express server entry and static asset handling with Vite for full-stack SPA fallback
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[CyberCare Backend] Server running on port ${PORT}`);
  });
}

startServer();
