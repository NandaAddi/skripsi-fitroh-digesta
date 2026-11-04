# Responsive Game Stage Scaling & Mobile Orientation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mengunci seluruh panggung DIGESTA pada kanvas master 1920x1080 dengan sistem CSS Transform Scale otomatis dan overlay interaktif "Putar Ponsel ke Lanskap" agar seluruh antarmuka 100% konsisten, proporsional, dan tidak pernah ter-zoom di berbagai ukuran laptop (13", 14", 15.6") maupun smartphone.

**Architecture:** Implementasi hook global `useGameScale` yang menghitung rasio skala `Math.min(viewportWidth / 1920, viewportHeight / 1080)` dan menetapkan `--game-scale` pada panggung virtual 1920x1080 di semua halaman. Mengintegrasikan komponen `OrientationOverlay` bertema kartun game 3D yang aktif saat perangkat dibuka dalam posisi portrait, serta membungkus panggung dengan latar gelap premium `#0f172a` dan bayangan 3D.

**Tech Stack:** React 19, TypeScript, Pure Vanilla CSS (Container Queries, Transform Scale, Keyframe Animation), Web Audio API, Vite.

**Spec:** Berdasarkan hasil wawancara /grill-me dan kaidah arsitektur AGENTS.md / GEMINI.md.

---

### File Structure Map
- **Create:** `src/hooks/useGameScale.ts` (Hook pengelola skala 1920x1080, resize listener, dan deteksi orientasi)
- **Create:** `src/components/OrientationOverlay/OrientationOverlay.tsx` (Overlay kartun game petunjuk putar ponsel)
- **Create:** `src/components/OrientationOverlay/OrientationOverlay.css` (Gaya 3D game & animasi rotasi ponsel)
- **Modify:** `src/index.css` (CSS variable `--game-scale`, reset layout, dan kelas dasar stage)
- **Modify:** `src/App.tsx` (Injeksi hook `useGameScale` dan komponen `OrientationOverlay`)
- **Modify:** CSS komponen panggung (menghubungkan panggung `.xyz-stage` ke formula 1920x1080 transform-scale)

---

### Task 1: Membuat Custom Hook `useGameScale`

- [x] **Step 1.1**: Buat file `src/hooks/useGameScale.ts`.
- [x] **Step 1.2**: Implementasikan kalkulasi skala presisi:
  ```ts
  const BASE_WIDTH = 1920;
  const BASE_HEIGHT = 1080;
  const scale = Math.min(windowWidth / BASE_WIDTH, windowHeight / BASE_HEIGHT);
  ```
- [x] **Step 1.3**: Tambahkan event listener untuk `resize`, `orientationchange`, dan `visualViewport.resize` dengan debouncing pasif / requestAnimationFrame agar performa 60 FPS mulus.
- [x] **Step 1.4**: Ekspor state `{ scale, isPortrait, windowWidth, windowHeight }` dan set CSS variable `--game-scale` pada `document.documentElement`.
- [x] **Step 1.5**: Jalankan `npm run lint` untuk memastikan TypeScript dan Oxlint bersih.

---

### Task 2: Membuat Komponen `OrientationOverlay` (Kartun Game 3D)

- [x] **Step 2.1**: Buat file `src/components/OrientationOverlay/OrientationOverlay.tsx`.
- [x] **Step 2.2**: Rancang elemen visual:
  - Maskot kartun / ikon HP game SVG 3D tebal berputar 90 derajat.
  - Badge plat game timbul: "PUTAR PONSEL".
  - Teks instruksi ramah dengan font Google Fonts `Fredoka` & `Outfit`.
  - Animasi rotasi ponsel berulang yang halus (`@keyframes rotatePhoneAnimation`).
- [x] **Step 2.3**: Buat file `src/components/OrientationOverlay/OrientationOverlay.css` dengan gaya Pure Vanilla CSS, border 3D tebal, dan backdrop semi-transparan `#0f172a`.
- [x] **Step 2.4**: Pasang kondisi tampil: hanya muncul saat `isPortrait === true` dan otomatis hilang seketika saat ponsel diputar ke horizontal (landscape).
- [x] **Step 2.5**: Verifikasi `npm run lint`.

---

### Task 3: Penerapan Formula Master 1920x1080 pada Seluruh Stage

- [x] **Step 3.1**: Buka `src/index.css` dan tambahkan kelas terpusat `.game-stage-scaled`:
  ```css
  :root {
    --game-scale: 1;
  }

  .game-stage-base {
    position: relative;
    width: 1920px;
    height: 1080px;
    min-width: 1920px;
    min-height: 1080px;
    max-width: 1920px;
    max-height: 1080px;
    transform: scale(var(--game-scale, 1));
    transform-origin: center center;
    flex-shrink: 0;
    overflow: hidden;
    box-shadow: 0 16px 50px rgba(0, 0, 0, 0.5), 0 0 40px rgba(15, 23, 42, 0.6);
    container-type: inline-size;
  }
  ```
- [x] **Step 3.2**: Perbarui kelas `-stage` pada seluruh berkas CSS komponen (atau hubungkan ke selektor bersama) sehingga ukuran dasar kanvas terkunci 1920x1080:
  - `StartScreen.css`, `LoginScreen.css`, `MenuScreen.css`
  - `MenuPengantarScreen.css`, `MenuMateriScreen.css`, `MenuMateriProsesScreen.css`
  - `MenuMateriOrganScreen.css`, `MenuMateriOrganIsiScreen.css`, `MenuMateriGangguanScreen.css`
  - `Menu3DScreen.css`, `MenuKuisScreen.css`, `NotFoundScreen.css`, `AssetPreloader.css`
- [x] **Step 3.3**: Pastikan seluruh container viewport (`.xyz-viewport`) memiliki latar belakang `#0f172a` dengan `display: flex; align-items: center; justify-content: center; overflow: hidden;`.

---

### Task 4: Integrasi di `App.tsx` & Penyempurnaan Global

- [x] **Step 4.1**: Impor `useGameScale` dan `OrientationOverlay` ke `src/App.tsx`.
- [x] **Step 4.2**: Pasang `OrientationOverlay` di level teratas sebelum rute halaman.
- [x] **Step 4.3**: Pastikan `<main>` dan `#root` fleksibel di tengah layar tanpa overflow scrollbar.

---

### Task 5: Pengujian & Verifikasi Kualitas Kode

- [x] **Step 5.1**: Jalankan `npm run lint` dan pastikan `0 warnings and 0 errors`.
- [x] **Step 5.2**: Jalankan `npm run build` (`tsc -b && vite build`) dan pastikan berhasil 100%.
- [x] **Step 5.3**: Verifikasi simulasi berbagai resolusi:
  - Laptop 13" / 14" dengan Windows Scaling 150% (1280 x 600 viewport)
  - Laptop 15.6" / 16" Rasio 16:10 (1920 x 1200 / 1280 x 800)
  - Smartphone Portrait (390 x 844) -> Banner Putar Layar muncul
  - Smartphone Landscape (844 x 390) -> Seluruh game tampil proporsional tanpa zoom berlebih
