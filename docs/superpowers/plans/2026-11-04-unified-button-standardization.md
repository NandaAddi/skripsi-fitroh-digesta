# Standarisasi Komprehensif Ukuran & Tata Letak Tombol DIGESTA

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Menyeragamkan seluruh tombol kontrol sudut (Settings, Home, Back, Exit, Prev, Next) menjadi 1 ukuran baku presisi 7.0% (~134px) dengan margin sudut seragam, serta tombol utilitas (suara & fullscreen) menjadi 4.2% (~80px) di seluruh halaman DIGESTA agar tampilan antarmuka 100% konsisten, rapi, dan bebas dari lompatan ukuran saat navigasi.

**Architecture:** Menerapkan sistem token CSS terpusat untuk tombol kontrol di `src/index.css` atau selektor komponen panggung. Memperbarui seluruh komponen layar (MenuScreen, MenuPengantarScreen, MenuMateriScreen, MenuMateriGangguanScreen, MenuMateriOrganScreen, MenuMateriOrganIsiScreen, MenuMateriProsesScreen, Menu3DScreen, MenuKuisScreen) agar mengacu pada standar geometri baku 7.0% dan 4.2%.

**Tech Stack:** React 19, TypeScript, Pure Vanilla CSS, Web Audio API, Vite.

**Spec:** Berdasarkan hasil wawancara /grill-me dan panduan AGENTS.md / GEMINI.md.

---

### File Structure Map & Target Perubahan
- **Modify:** `src/index.css` (Definisi token CSS global `.game-ctrl-btn` dan `.game-util-btn`)
- **Modify:** `src/components/MenuScreen/MenuScreen.css` (Settings & Exit diselaraskan ke 7.0%)
- **Modify:** `src/components/MenuPengantarScreen/MenuPengantarScreen.css` (Settings, Home, Prev, Next diselaraskan ke 7.0%)
- **Modify:** `src/components/MenuMateriScreen/MenuMateriScreen.tsx` & `.css` (Ganti tombol pill teks menjadi tombol bundar kartun 7.0% dan utilitas 4.2%)
- **Modify:** `src/components/MenuMateriGangguanScreen/MenuMateriGangguanScreen.css` (Settings, Home, Next ke 7.0%)
- **Modify:** `src/components/MenuKuisScreen/MenuKuisScreen.css` (Home ke 7.0%, Prev/Next ke 7.0%)
- **Modify:** `src/components/MenuMateriProsesScreen/MenuMateriProsesScreen.css` (Corner btn ke 7.0%, next ke 7.0%, utilitas ke 4.2%)
- **Modify:** `src/components/MenuMateriOrganIsiScreen/MenuMateriOrganIsiScreen.css` (Corner btn ke 7.0%, next ke 7.0%, utilitas ke 4.2%)
- **Modify:** `src/components/MenuMateriOrganScreen/MenuMateriOrganScreen.css` (Corner btn ke 7.0%, utilitas ke 4.2%)
- **Modify:** `src/components/Menu3DScreen/Menu3DScreen.css` (Corner btn ke 7.0%, utilitas ke 4.2%)

---

### Task 1: Standarisasi Global CSS Tokens untuk Tombol

- [x] **Step 1.1**: Tambahkan kelas global terpusat di `src/index.css`:
  ```css
  /* Standar Baku Tombol Kontrol Sudut 7.0% (~134px pada kanvas 1920x1080) */
  .game-corner-btn-base {
    width: 7.0% !important;
    aspect-ratio: 1 !important;
  }

  /* Standar Baku Tombol Utilitas 4.2% (~80px pada kanvas 1920x1080) */
  .game-util-btn-base {
    width: 4.2% !important;
    aspect-ratio: 1 !important;
  }
  ```
- [x] **Step 1.2**: Verifikasi `npm run lint`.

---

### Task 2: Standardisasi MenuScreen & MenuPengantarScreen

- [x] **Step 2.1**: Update `MenuScreen.css`:
  - `.menuscreen-round-btn`: `width: 7.0%; aspect-ratio: 1;`
  - `.menuscreen-btn-settings`: `top: 3.2%; left: 2.5%;`
  - `.menuscreen-btn-exit`: `top: 3.2%; right: 2.5%;`
- [x] **Step 2.2**: Update `MenuPengantarScreen.css`:
  - `.pengantar-btn-setting`: `top: 3.2%; left: 2.5%; width: 7.0%; aspect-ratio: 1;`
  - `.pengantar-btn-home`: `top: 3.2%; right: 2.5%; width: 7.0%; aspect-ratio: 1;`
  - `.pengantar-btn-left`: `bottom: 4.5%; left: 2.5%; width: 7.0%; aspect-ratio: 1;`
  - `.pengantar-btn-right`: `bottom: 4.5%; right: 2.5%; width: 7.0%; aspect-ratio: 1;`
- [x] **Step 2.3**: Verifikasi `npm run lint`.

---

### Task 3: Transformasi MenuMateriScreen (Ganti Pill ke Bundar Kartun)

- [x] **Step 3.1**: Impor aset gambar tombol bundar kartun di `MenuMateriScreen.tsx`:
  - `import btnBack from '../../assets/menu-materi-proses-pencernaan/button-back-menu-materi.webp';`
- [x] **Step 3.2**: Ganti struktur tombol kembali di `MenuMateriScreen.tsx` menjadi tombol bundar kartun 3D yang seragam dengan layar lain.
- [x] **Step 3.3**: Update `MenuMateriScreen.css`:
  - Tombol kembali: `top: 3.2%; left: 2.5%; width: 7.0%; aspect-ratio: 1;`
  - Tombol utilitas suara & fullscreen: `width: 4.2%; height: 4.2%;` berdesain kaca kartun 3D.
  - User badge diselaraskan dengan proporsi yang pas di samping tombol utilitas.
- [x] **Step 3.4**: Verifikasi `npm run lint`.

---

### Task 4: Standarisasi Layar Materi (Gangguan, Proses, Organ, 3D Organ)

- [x] **Step 4.1**: Update `MenuMateriGangguanScreen.css`:
  - `.gangguan-btn-setting`: `top: 3.2%; left: 2.5%; width: 7.0%;`
  - `.gangguan-btn-home`: `top: 3.2%; right: 2.5%; width: 7.0%;`
  - `.gangguan-btn-right`: `bottom: 4.5%; right: 2.5%; width: 7.0%;`
- [x] **Step 4.2**: Update `MenuMateriProsesScreen.css`:
  - Topbar margin: `top: 3.2%; left: 2.5%; right: 2.5%;`
  - `.proses-corner-btn`: `width: 7.0%;`
  - `.proses-btn-next`: `width: 7.0%;`
  - `.proses-util-btn`: `width: 4.2%; aspect-ratio: 1;`
- [x] **Step 4.3**: Update `MenuMateriOrganScreen.css` & `MenuMateriOrganIsiScreen.css`:
  - Corner buttons: `width: 7.0%;`
  - `.organ-isi-btn-next`: `width: 7.0%;`
  - Util buttons: `width: 4.2%;`
- [x] **Step 4.4**: Update `Menu3DScreen.css`:
  - Corner buttons: `width: 7.0%;`
  - Util buttons: `width: 4.2%;`
- [x] **Step 4.5**: Verifikasi `npm run lint`.

---

### Task 5: Standarisasi MenuKuisScreen

- [x] **Step 5.1**: Update `MenuKuisScreen.css`:
  - `.kuis-btn-home`: `top: 3.2%; left: 2.5%; width: 7.0%;`
  - `.kuis-btn-prev`: `bottom: 4.5%; left: 2.5%; width: 7.0%;`
  - `.kuis-btn-next`: `bottom: 4.5%; right: 2.5%; width: 7.0%;`
- [x] **Step 5.2**: Verifikasi `npm run lint`.

---

### Task 6: Verifikasi Mutlak & Pengujian Bebas Lompatan Ukuran

- [x] **Step 6.1**: Jalankan `npm run lint` dan pastikan `0 warnings and 0 errors`.
- [x] **Step 6.2**: Jalankan `npm run build` (`tsc -b && vite build`) dan pastikan berhasil 100%.
- [x] **Step 6.3**: Verifikasi bahwa transisi antar halaman (Start $\rightarrow$ Menu $\rightarrow$ Pengantar $\rightarrow$ Materi $\rightarrow$ Organ $\rightarrow$ Kuis) memiliki tombol sudut pada koordinat dan ukuran yang 100% konsisten.
