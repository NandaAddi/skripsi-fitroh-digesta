# Panduan Konteks Proyek, Arsitektur & Memori Sistem DIGESTA

> **PENTING UNTUK SEMUA AI ASSISTANT (Antigravity, Claude, Cursor, ChatGPT, dll.):**
> Dokumen ini adalah **sumber kebenaran tunggal (Single Source of Truth)** untuk proyek DIGESTA. Baca dan patuhi seluruh panduan, arsitektur, pola desain, serta aturan mutlak di bawah ini sebelum membuat atau memodifikasi kode apa pun. Jangan pernah mengambil asumsi di luar ketentuan yang ada di dokumen ini.

---

## 1. Identitas & Visi Proyek

- **Nama Aplikasi:** **DIGESTA** (*Digital Interactive Gastrointestinal Education System*)
- **Deskripsi:** Aplikasi web edukasi interaktif berbasis game (*educational gamified web app*) yang dirancang khusus untuk pembelajaran sistem pencernaan manusia secara visual, menyenangkan, dan kaya estetika.
- **Sasaran Pengguna:** Siswa sekolah, guru biologi/sains, dan pengguna umum.
- **Karakter & Maskot:**
  - Karakter lambung kartun ceria (*stomach mascot*).
  - Karakter guru animasi interaktif (*teacher character motion*).
- **Filosofi Tampilan:** Gaya visual kartun premium (*vibrant cartoon game theme*), tombol 3D tebal (*tactile push buttons*), rasio panggung terkunci 16:9, bebas teks kecil/membosankan, serta bebas emoji Unicode pada kartu dialog.

---

## 2. Arsitektur Teknis & Tech Stack

| Lapisan / Kategori | Teknologi / Pustaka | Keterangan & Ketentuan |
| :--- | :--- | :--- |
| **Framework Utama** | React 19 + TypeScript | Menggunakan Functional Components & Hooks modern. |
| **Build Tool & Bundler** | Vite (v8+) | Server pengembangan lokal cepat dengan Hot Module Replacement (HMR). |
| **Routing & URL** | React Router DOM (v7) | Setiap halaman **wajib memiliki URL unik** tersendiri (bukan SPA tab state biasa). |
| **Autentikasi & Database** | Supabase Auth + Context API | Menyimpan sesi pengguna dengan fallback otomatis ke *Guest Mode* via `localStorage`. |
| **Sistem Styling** | **Pure Vanilla CSS** | **DILARANG MENGGUNAKAN TAILWIND CSS**. Styling murni CSS modular per komponen dengan container queries. |
| **Tipografi** | Google Fonts (*Fredoka*, *Outfit*) | Font kartun game tebal dengan ukuran font besar & terbaca jelas (`clamp`). |
| **Efek Suara Audio** | Native Web Audio API | Sintesis prosedural langsung di browser (`pop`, `chime`, `soft`) tanpa dependensi berkas mp3 eksternal. |
| **Preloader Aset Game** | `AssetPreloader` + `assetManifest.ts` | Pemuatan awal paralel seluruh 32 aset WebP + Font sebelum panggung game dibuka. |
| **Linter & Code Quality** | Oxlint + TypeScript (`tsc -b`) | Wajib lolos verifikasi `0 error & 0 warning`. |

---

## 3. Pipeline Aset Gambar (Aturan Sangat Krusial)

```
DIGESTA/
├── assets/                  <-- [FOLDER SUMBER / MASTER MENTAH]
│   ├── start-screen/        <-- PNG mentah, After Effects render, dll.
│   ├── menu-materi-screen/
│   ├── teacher-motion/      <-- 226 frame PNG mentah (81.6 MB)
│   └── ...                  <-- JANGAN DIIMPOR LANGSUNG KE KODE REACT!
│
└── src/
    └── assets/              <-- [FOLDER BUNDLE APLIKASI WEB]
        ├── start-screen/    <-- Khusus berkas .webp teroptimasi
        ├── teacher-motion/  <-- Berkas Animated WebP terkompresi
        └── ...              <-- HANYA FOLDER INI YANG BOLEH DIIMPOR KE .TSX/.CSS!
```

### Aturan Konversi Aset:
1. **Pemisahan Sumber vs Bundle:**
   - Folder root `/assets/` adalah penyimpanan berkas master PNG resolusi tinggi.
   - Folder `/src/assets/` adalah berkas siap pakai untuk Vite bundler dalam format `.webp`.
   - **DILARANG KERAS** mengimpor gambar `.png` langsung dari root `/assets/` ke dalam komponen React.
2. **Standar Kompresi WebP:**
   - Gunakan pustaka Node.js `sharp` untuk konversi:
     ```javascript
     await sharp(inputPng)
       .webp({ quality: 88, effort: 6, alphaQuality: 90, lossless: false })
       .toFile(outputWebp);
     ```
3. **Standar Animasi Sequence (Contoh: `teacher-motion`):**
   - Karakter animasi guru berasal dari 226 frame PNG mentah (81.6 MB).
   - Telah dioptimasi dengan *smart bounding-box cropping* (memangkas area kosong transparan) menjadi **1 berkas Animated WebP tunggal** di `src/assets/teacher-motion/teacher-motion.webp` (672x708 HD, ~15.4 fps, loop: 0, ~8.68 MB).
   - Selalu gunakan native `<img>` untuk memutar animasi WebP agar mendapat akselerasi hardware GPU penuh tanpa beban loop JavaScript.

---

## 4. Sistem Desain & Kaidah Visual UI/UX

### A. Rasio Panggung 16:9 Terkunci (Stage Lock Formula)
Setiap layar di DIGESTA wajib menggunakan panggung terkunci 16:9 agar tata letak tidak berantakan pada berbagai ukuran monitor, laptop, maupun tablet:
```css
/* Container Viewport Layar Penuh */
.screen-viewport {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  width: 100dvw;
  height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0f172a;
  overflow: hidden;
  user-select: none;
}

/* Panggung Terkunci 16:9 */
.screen-stage {
  position: relative;
  aspect-ratio: 16 / 9;
  width: min(100vw, calc(100vh * 16 / 9));
  height: min(100vh, calc(100vw * 9 / 16));
  max-width: 100vw;
  max-height: 100vh;
  overflow: hidden;
  container-type: inline-size;
}
```

### B. Desain Tombol Game 3D (Tactile Game Push Buttons)
Tombol di DIGESTA tidak boleh flat atau berupa pill biasa. Wajib menggunakan gaya game 3D tebal dengan efek tekanan:
```css
.game-btn {
  border-radius: 999px;
  border: 4.5px solid #darkBorderColor;
  box-shadow: 0 5px 0 #shadowColor, 0 8px 18px rgba(0, 0, 0, 0.28);
  font-family: 'Fredoka', 'Outfit', sans-serif;
  font-weight: 900;
  cursor: pointer;
  transition: transform 0.12s ease, box-shadow 0.12s ease;
}

.game-btn:hover {
  transform: translateY(-2px);
  filter: brightness(1.06);
}

.game-btn:active {
  transform: translateY(3px);
  box-shadow: 0 1px 0 #shadowColor;
}
```

### C. Dialog Modal Bertema Game
- **Wadah Kartu:** Berbingkai tebal (`border: 4px solid #f59e0b` atau merah/biru sesuai konteks), sudut melengkung besar (`border-radius: clamp(24px, 2.5cqw, 36px)`), dan bayangan bawah 3D bertingkat.
- **Plat Judul:** Memiliki badge plat timbul game di atas judul (*KELUAR*, *PENGATURAN*).
- **DILARANG MENGGUNAKAN EMOJI UNICODE:** Dilarang menaruh emoji mentah (seperti 🚪, 🏠, ⚙️, 👤) di dalam judul modal atau teks tombol. Gunakan teks tegas atau ikon SVG murni.
- **Ukuran Teks Besar:** Judul minimal `clamp(24px, 2.3cqw, 32px)`, deskripsi minimal `clamp(15px, 1.35cqw, 18px)`, teks tombol minimal `clamp(16px, 1.4cqw, 20px)`.

---

## 5. Pemetaan Rute URL & Struktur Komponen

Seluruh rute telah dikonfigurasi menggunakan React Router DOM v7 di [`src/App.tsx`](file:///d:/DIGIESTA/src/App.tsx):

| Rute URL | Komponen Halaman | Status Proteksi | Fungsi & Deskripsi |
| :--- | :--- | :--- | :--- |
| `/` | `StartScreen` | Publik | Halaman awal pembuka dengan logo DIGESTA, tombol START berdenyut, dan animasi karakter guru HD. |
| `/login` | `LoginScreen` | Publik | Layar masuk/daftar siswa dengan Supabase Auth atau Masuk sebagai Tamu (*Guest*). |
| `/menu` | `MenuScreen` | Terproteksi | Menu utama navigasi (Materi, Simulasi, 3D Organ, Kuis, Petunjuk, Pengaturan). |
| `/menu/pengantar` | `MenuPengantarScreen` | Terproteksi | 3 slide materi pengantar interaktif dengan tombol navigasi panah kiri/kanan. |
| `/menu/materi` | `MenuMateriScreen` | Terproteksi | Pilihan 3 topik materi utama (Proses Pencernaan, Organ Pencernaan, Gangguan). |
| `/menu/materi/gangguan` | `MenuMateriGangguanScreen`| Terproteksi | Layar papan tulis ruang kelas dengan 5 tab vertikal (Maag, Gastritis, Diare, Sembelit, Apendisitis). |
| `/pengantar` | *Redirect Alias* | Publik | Otomatis dialihkan (*redirect*) ke `/menu/pengantar`. |
| `/materi` | *Redirect Alias* | Publik | Otomatis dialihkan (*redirect*) ke `/menu/materi`. |
| `/gangguan` | *Redirect Alias* | Publik | Otomatis dialihkan (*redirect*) ke `/menu/materi/gangguan`. |
| `*` | `NotFoundScreen` | Publik | Halaman 404 game-themed jika rute tidak ditemukan. |

---

## 6. Autentikasi & Penyimpanan State (`AuthContext`)

- Layanan autentikasi berada di [`src/context/AuthContext.tsx`](file:///d:/DIGIESTA/src/context/AuthContext.tsx) dan [`src/services/authService.ts`](file:///d:/DIGIESTA/src/services/authService.ts).
- Mendukung dua mode:
  1. **Supabase Auth:** Autentikasi email & kata sandi dengan backend Supabase (`VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`).
  2. **Guest Mode Fallback:** Pengguna dapat masuk langsung sebagai "Tamu / Siswa Tamu DIGESTA" yang disimpan di `localStorage` tanpa memerlukan internet/koneksi Supabase.
- Setiap rute privat wajib dibungkus dengan komponen [`<ProtectedRoute>`](file:///d:/DIGIESTA/src/components/ProtectedRoute.tsx).

---

## 7. Pantangan Keras & SOP AI (Non-Negotiable Rules)

1. **JANGAN MEMBUAT HALAMAN MOCKUP SEMBARANGAN:**
   - Dilarang membuat halaman dummy, mockup, atau popup preview modal yang tidak diminta oleh pengguna. Jika sebuah menu belum siap, jangan buatkan mockup halaman palsu kecuali diinstruksikan eksplisit.
2. **JANGAN MERUSAK KOMENTAR DOKUMENTASI:**
   - Pertahankan seluruh komentar kode dan docstring yang sudah ada di setiap berkas.
3. **WAJIB MENGGUNAKAN WEBP DI FOLDER `src/assets/`:**
   - Setiap aset visual baru wajib dikonversi ke format `.webp` terlebih dahulu menggunakan pustaka `sharp` sebelum diimpor ke dalam komponen.
4. **JANGAN MENAMBAHKAN TAILWIND CSS:**
   - Proyek ini secara arsitektur menggunakan murni Vanilla CSS modern yang modular.
5. **JANGAN MENYIMPAN TEKS KECIL PADA MODAL / KARTU:**
   - Selalu gunakan font bertema game (*Fredoka/Outfit*) dengan ukuran yang besar dan mudah dibaca oleh siswa.
6. **VERIFIKASI WAJIB SEBELUM SELESAI:**
   - Setiap kali selesai memodifikasi kode, AI **wajib** menjalankan perintah berikut untuk memastikan tidak ada *breaking changes*:
     ```bash
     npm run build   # Memverifikasi kompilasi TypeScript (tsc -b) & Vite build
     npm run lint    # Memverifikasi Oxlint linter (0 errors, 0 warnings)
     ```
