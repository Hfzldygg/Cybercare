export interface User {
  username: string;
  nama: string;
  role: "siswa" | "guru";
  kelas_nip: string;
}

export interface Assessment {
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

export interface IncidentReport {
  id: string;
  namaPelapor: string;
  username: string;
  kelas: string;
  tanggalKejadian: string;
  kronologi: string;
  pihakTerlibat: string;
  buktiName?: string;
  buktiData?: string;
  status: "Diterima" | "Dalam Proses" | "Selesai";
  tanggalLapor: string;
}

export interface ChatMessage {
  id: string;
  sender: "siswa" | "guru" | "ai";
  senderName: string;
  message: string;
  timestamp: string;
}

export interface Counseling {
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

export interface MonitoringCase {
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

export interface EducationalArticle {
  id: string;
  title: string;
  category: "Pencegahan" | "Etika" | "Keamanan Digital" | "Penanganan";
  content: string;
  readTime: string;
  icon: string;
}
