import { EducationalArticle } from "./types";

export interface Question {
  id: string;
  text: string;
  options: {
    text: string;
    score: number;
  }[];
}

export const assessmentQuestions: Question[] = [
  {
    id: "q1",
    text: "Seberapa sering Anda menerima pesan kasar, kiriman bermakna ejekan, atau komentar negatif dari teman sekolah di media sosial Anda?",
    options: [
      { text: "Tidak Pernah", score: 0 },
      { text: "Jarang (1-2 kali sebulan)", score: 1 },
      { text: "Sering (Beberapa kali seminggu)", score: 2 },
      { text: "Sangat Sering (Hampir setiap hari)", score: 3 }
    ]
  },
  {
    id: "q2",
    text: "Pernahkah foto atau video Anda disebarkan tanpa izin oleh siswa lain disertai keterangan (caption) bernada makian, gurauan kasar, atau konten mempermalukan?",
    options: [
      { text: "Tidak Pernah", score: 0 },
      { text: "Pernah, sekali/dua kali saja", score: 1 },
      { text: "Cukup Sering", score: 2 },
      { text: "Sangat Berkelanjutan", score: 3 }
    ]
  },
  {
    id: "q3",
    text: "Pernahkah seseorang membuat akun tiruan (fake account) dengan menyamar menggunakan nama atau foto Anda untuk mengunggah hal-hal buruk demi merusak reputasi Anda?",
    options: [
      { text: "Tidak Pernah", score: 0 },
      { text: "Pernah, tapi sudah dihapus", score: 1 },
      { text: "Sedang Berlangsung Saat Ini", score: 3 }
    ]
  },
  {
    id: "q4",
    text: "Apakah Anda pernah dengan sengaja dikeluarkan, dikucilkan, atau dijadikan bahan sindiran (subtweet/gosip) di grup percakapan kelas atau komunitas sekolah?",
    options: [
      { text: "Tidak Pernah", score: 0 },
      { text: "Jarang", score: 1 },
      { text: "Sering", score: 2 },
      { text: "Sangat Sering & Terorganisir", score: 3 }
    ]
  },
  {
    id: "q5",
    text: "Apakah perlakuan atau pesan negatif yang Anda terima di ruang digital membuat Anda merasa sedih, cemas, minder, atau takut datang ke sekolah?",
    options: [
      { text: "Tidak Sama Sekali", score: 0 },
      { text: "Kadang-kadang merasa sedikit cemas", score: 1 },
      { text: "Cukup mengganggu aktivitas sehari-hari", score: 2 },
      { text: "Sangat tertekan hingga sulit tidur/konsentrasi", score: 3 }
    ]
  },
  {
    id: "q6",
    text: "Apakah tindakan teror/intimasi dunia maya yang Anda alami mempengaruhi tingkat fokus belajar atau menyebabkan penurunan nilai akademis Anda?",
    options: [
      { text: "Tidak Berpengaruh", score: 0 },
      { text: "Mulai terdistraksi sewaktu-waktu", score: 1 },
      { text: "Cukup menurunkan semangat belajar", score: 2 },
      { text: "Sangat parah sampai enggan belajar", score: 3 }
    ]
  },
  {
    id: "q7",
    text: "Apakah ada seseorang yang memeras Anda dengan mengancam akan menyebarkan foto pribadi, chat rahasia, atau aib Anda jika kemauan mereka tidak dituruti?",
    options: [
      { text: "Tidak Pernah", score: 0 },
      { text: "Pernah mengalami intimidasi ringan", score: 1 },
      { text: "Ya, ada ancaman pemerasan aktif", score: 3 }
    ]
  },
  {
    id: "q8",
    text: "Seberapa sering Anda menyembunyikan perasaan sedih akibat intimidasi internet ini dari orang tua atau guru BK karena takut disalahkan?",
    options: [
      { text: "Selalu Terbuka", score: 0 },
      { text: "Kadang merahasiakan jika masalah kecil", score: 1 },
      { text: "Sering ditutupi sendiri", score: 2 },
      { text: "Sangat tertutup karena takut diperparah", score: 3 }
    ]
  }
];

export const educationalArticles: EducationalArticle[] = [
  {
    id: "art-1",
    title: "Pengertian Pelanggaran Cyberbullying di Sekolah",
    category: "Pencegahan",
    readTime: "3 Menit Membaca",
    icon: "ShieldAlert",
    content: "Cyberbullying adalah perilaku intimidasi, pelecehan, atau ejekan berulang yang dilakukan secara sengaja menggunakan teknologi digital seperti media sosial, aplikasi chatting, atau platform video game. Berbeda dengan perundungan konvensional, cyberbullying dapat terjadi selama 24 jam penuh tanpa kenal batas tempat, masuk langsung ke ruang paling pribadi korban. Cedera psikis yang timbul sering kali mendalam karena jejak digital yang ditinggalkan sangat sulit dihapus sepenuhnya."
  },
  {
    id: "art-2",
    title: "Bentuk Nyata Cyberbullying Menyerang Siswa",
    category: "Pencegahan",
    readTime: "4 Menit Membaca",
    icon: "AlertTriangle",
    content: "Bentuk cyberbullying meliputi:\n\n1. **Harassment (Pelecehan siber):** Mengirim pesan bernada ancaman atau hinaan secara terus menerus.\n2. **Exclusion (Pengucilan siber):** Sengaja mengeluarkan seseorang dari grup chat pertemanan atau grup kelas untuk mengisolasi mereka.\n3. **Denigration (Pencemaran nama baik):** Mengunggah rumor palsu atau membagikan foto korban yang direkayasa negatif agar dicemooh banyak orang.\n4. **Cyberstalking (Penguntitan siber):** Mengikuti dan memantau secara terobsesi aktivitas online korban untuk meneror mentalnya."
  },
  {
    id: "art-3",
    title: "Kiat Hebat Bermedia Sosial yang Sehat dan Beradab",
    category: "Etika",
    readTime: "5 Menit Membaca",
    icon: "BookOpen",
    content: "Membangun internet sehat dimulai dari etika personal:\n\n* **Berpikir Sebelum Memposting (T.H.I.N.K):** Apakah tulisan kita True (Benar), Helpful (Membantu), Inspiring (Menginspirasi), Necessary (Penting), atau Kind (Sopan)?\n* **Hormati Privasi Orang Lain:** Jangan asal membagikan tangkapan layar chat pribadi atau rahasia orang lain tanpa izin.\n* **Stop Penyebaran Kebencian:** Kebiasaan beropini kasar (hate speech) atau menyukai unggahan ejekan memelihara iklim digital yang toksik.\n* **Hargai Perbedaan Pendapat:** Ingatlah bahwa di balik setiap akun layar terdapat manusia seutuhnya yang memiliki hati nurani."
  },
  {
    id: "art-4",
    title: "Panduan Praktis Pengamanan Akun dan Sandi Rahasia",
    category: "Keamanan Digital",
    readTime: "4 Menit Membaca",
    icon: "Lock",
    content: "Langkah dasar melindungi data pribadi kita di jagat maya:\n\n1. **Buat Sandi yang Unik:** Hindari sandi gampang ditebak seperti tanggal lahir atau nama lengkap. Gunakan gabungan simbol, angka, serta huruf kapital.\n2. **Nyalakan Two-Factor Authentication (2FA):** Memberikan proteksi ekstra di media sosial seperti WhatsApp, Instagram, dan Discord.\n3. **Atur Pengaturan Privasi:** Ubah profil menjadi 'Private' dan batasi kolom komentar hanya untuk teman dekat tepercaya.\n4. **Hindari File Sharing Mencurigakan:** Hati-hati ketika mengetuk tautan aneh (phishing) yang menjanjikan hadiah gratis."
  },
  {
    id: "art-5",
    title: "Tips Jitu & Tindakan Terbaik Menghadapi Cyberbullying",
    category: "Penanganan",
    readTime: "3 Menit Membaca",
    icon: "CheckCircle",
    content: "Jika Anda atau rekan Anda menjadi sasaran cyberbullying, lakukan langkah terstruktur ini:\n\n* **Jangan Membalas:** Membalas amarah dengan hinaan balik hanya memperbesar konflik yang diinginkan pelaku.\n* **Simpan Bukti (Screenshot):** Simpan semua tangkapan layar, kronologi waktu, dan tautan sebagai berkas bukti tidak terbantahkan.\n* **Blokir Kontak Pelaku:** Tutup rapat saluran intimidasi lewat tombol block.\n* **Gunakan Konseling CyberCare:** Jangan dipendam sendiri, ceritakan secara nyaman langsung ke Guru BK sekolah yang siap membantu menyelesaikan perkara secara rahasia dan aman."
  }
];
