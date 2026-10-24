# DIGESTA (Digital Interactive Gastrointestinal Education System)

Aplikasi web edukasi interaktif berbasis game (*educational gamified web app*) yang dirancang khusus untuk pembelajaran sistem pencernaan manusia secara visual, menyenangkan, dan kaya estetika.

---

## 📌 Panduan Konteks AI & Dokumentasi Utama
Bagi AI Assistant (Antigravity, Cursor, Copilot, ChatGPT, Claude) atau pengembang yang melanjutkan proyek ini, silakan baca dokumentasi memori lengkap di:
- 📖 [AGENTS.md](file:///d:/DIGIESTA/AGENTS.md) / [GEMINI.md](file:///d:/DIGIESTA/GEMINI.md) — *Single Source of Truth* untuk arsitektur, standar konversi aset WebP, sistem desain rasio 16:9, rute, dan aturan SOP.

---

## 🛠️ Tech Stack
- **Framework:** React 19 + TypeScript
- **Bundler:** Vite
- **Routing:** React Router DOM (v7)
- **Styling:** Pure Vanilla CSS (No Tailwind)
- **Database & Auth:** Supabase + Guest Mode Fallback
- **Linter & Typecheck:** Oxlint + TypeScript (`tsc -b`)
- **Audio:** Native Web Audio API Synthesizer

---

## 🚀 Menjalankan Proyek

```bash
# Menjalankan dev server lokal
npm run dev

# Memeriksa linter (wajib 0 error, 0 warning)
npm run lint

# Membangun bundle produksi & verifikasi type check
npm run build
```

