# KlausulKu — Full Implementation Plan

> *"Pahami Kontrakmu dalam Hitungan Detik"*
> AI-powered legal document analyzer untuk UMKM Indonesia

---

## Phase 2 & 3: Auth, Persistence & Advanced AI 🚀

Fase ini akan menggabungkan pengembangan sistem akun (Firebase) dan kemampuan AI lanjutan (OCR & Grounding). Fokus utama: **User Management, History, dan Analisis Dokumen Skala Enterprise**.

### Features Phase 2 & 3

| # | Feature | Detail |
|---|---------|--------|
| 1 | **Firebase Auth** | Google sign-in untuk login UMKM |
| 2 | **Firestore Database** | Simpan dokumen dan chat history per user |
| 3 | **History Page** | Halaman untuk melihat dokumen yang pernah dianalisis |
| 4 | **Security Rules** | Memastikan user hanya bisa akses datanya sendiri |
| 5 | **Document AI (OCR)** | Fallback ke Document AI API jika gambar buram/scan jelek |
| 6 | **Google Search Grounding** | Integrasi Vertex AI Search API untuk RAG hukum real-time |
| 7 | **Bilingual Toggle** | Fitur ubah terjemahan analisis (ID ↔ EN) |
| 8 | **Export ke PDF** | Hasil analisis bisa didownload sebagai PDF (menggunakan jspdf/html2canvas) |
| 9 | **Template Kontrak** | Halaman berisi template dokumen kosong untuk diunduh UMKM |

> [!IMPORTANT]
> **User Review Required & Open Questions**
> Sebelum kita menulis kode untuk Fase 2 dan 3, saya butuh konfirmasi dan beberapa data dari Anda:
> 
> 1. **Firebase Config:** Apakah Anda ingin saya men-setup Firebase menggunakan project ID Anda (`483216655534`) melalui Firebase CLI, atau Anda sudah punya `firebaseConfig` object dari Firebase Console?
> 2. **GCP APIs:** Fitur OCR (Document AI) dan Grounding (Vertex AI) membutuhkan API yang diaktifkan di GCP Anda. Apakah Anda sudah mengaktifkan `Document AI API` dan `Vertex AI API` di project `483216655534`?
> 3. **Prioritas:** Karena ini fase yang cukup masif, apakah kita setuju untuk mengerjakan **Auth + Firestore (Phase 2) terlebih dahulu**, lalu langsung lanjut ke **Advanced AI (Phase 3)** dalam satu jalan?

### Tech Stack (Current)

| Layer | Technology |
|-------|-----------|
| Frontend | Vite 8 + React 19 + TypeScript |
| Styling | Tailwind CSS v4 + shadcn-style components (Button, Card, Badge) |
| Icons | lucide-react |
| Font | Plus Jakarta Sans |
| AI Engine | Gemini 2.5 Flash (`@google/genai`) |
| Auth & DB | Firebase Auth + Firestore |
| Hosting | **Google Cloud Run** (Docker + nginx, port 8080) |
| Theme | Light + Dark mode toggle |

### 🔑 Yang Dibutuhkan dari Kamu (Phase 1)

| # | Item | Detail | Kapan |
|---|------|--------|-------|
| 1 | **Gemini API Key** | Gratis di [aistudio.google.com](https://aistudio.google.com) | Sebelum implement Phase 2 (core AI) |
| 2 | **Google Cloud Project ID** | Untuk Cloud Run deploy. Bisa pakai existing atau bikin baru di [console.cloud.google.com](https://console.cloud.google.com) | Sebelum deploy |
| 3 | **`gcloud` CLI authenticated** | `gcloud auth login` + `gcloud config set project PROJECT_ID` | Sebelum deploy |
| 4 | **Sample PDF kontrak** | 1-2 contoh kontrak sewa/kerja sama untuk testing (bisa dummy) | Untuk testing |

---

## Phase 2: Auth + Persistence (Next) 🔐

Setelah MVP jalan, tambah user management dan simpan history.

### Features Phase 2

| # | Feature | Detail |
|---|---------|--------|
| 1 | **Firebase Auth** | Google sign-in, proteksi route |
| 2 | **Firestore Database** | Simpan hasil analisis per user |
| 3 | **History Dokumen** | Daftar dokumen yang pernah dianalisis, bisa dibuka lagi |
| 4 | **Chat History Persist** | Simpan percakapan chat per dokumen |
| 5 | **Firestore Security Rules** | Hanya user pemilik bisa akses dokumennya |
| 6 | **Secret Manager** | API keys & credentials disimpan aman di GCP Secret Manager |

### 🔑 Yang Dibutuhkan dari Kamu (Phase 2)

| # | Item | Detail |
|---|------|--------|
| 1 | **Firebase Project** | Bisa bikin baru atau pakai existing — perlu Auth + Firestore enabled |
| 2 | **Firebase config** | `firebaseConfig` object (apiKey, authDomain, projectId, etc.) |
| 3 | **GCP Secret Manager access** | Enable Secret Manager API di project |

---

## Phase 3: Advanced AI + UX (Future) 🧠

Tingkatkan kemampuan AI dan tambah fitur UX premium.

### Features Phase 3

| # | Feature | Detail |
|---|---------|--------|
| 1 | **Google Document AI (OCR)** | Enterprise-grade OCR untuk dokumen scan berkualitas rendah |
| 2 | **Grounding with Google Search API** | Real-time fetch regulasi terbaru via Vertex AI GoogleSearchRetrieval |
| 3 | **Knowledge Base Hukum** | Offline database peraturan Indonesia (salinan JDIH, OJK) sebagai RAG source |
| 4 | **Confidence Score** | Setiap insight AI ditampilkan dengan % confidence |
| 5 | **Explainability** | Tampilkan teks asli dokumen yang jadi dasar analisis (highlight source) |
| 6 | **Export ke PDF** | Download hasil analisis sebagai laporan PDF branded |
| 7 | **Text-to-Speech** | Audio ringkasan pasal — UMKM bisa dengarkan sambil kerja |
| 8 | **Bilingual Toggle** | Switch bahasa Indonesia ↔ Inggris |
| 9 | **Dark/Light Mode Toggle** | User pilih tema |
| 10 | **Deteksi Tanda Tangan & Stempel** | Computer Vision untuk identifikasi visual di dokumen |
| 11 | **Template Kontrak** | Library template kontrak umum UMKM (sewa, kerja sama, jual beli) |

### 🔑 Yang Dibutuhkan dari Kamu (Phase 3)

| # | Item | Detail |
|---|------|--------|
| 1 | **Document AI API enabled** | Enable di GCP console + billing aktif |
| 2 | **Vertex AI access** | Untuk Google Search grounding & RAG Engine |
| 3 | **Database regulasi** | Kumpulan peraturan dari JDIH/OJK (bisa scrape atau manual) |
| 4 | **Cloud Storage bucket** | Untuk simpan PDF asli dan knowledge base |

---

## Phase 4: Production & Governance (Long-term) 🏢

Full production-ready dengan keamanan, monitoring, dan compliance.

### Features Phase 4

| # | Feature | Detail |
|---|---------|--------|
| 1 | **Agent Orchestration** | Multi-agent paralel via Gemini 3.1 Pro — satu agent OCR, satu agent analisis, satu agent grounding |
| 2 | **Human-in-the-Loop (HITL)** | Checkpoint manusia untuk kontrak bernilai tinggi — AI flag, manusia confirm |
| 3 | **Audit Trail** | Log semua query + response AI, simpan ke Cloud Audit Logs |
| 4 | **UU PDP Compliance** | Privacy notice, consent management, data purge policy, enkripsi |
| 5 | **Monitoring & Alerting** | Cloud Monitoring (Stackdriver) — error tracking, latency, uptime |
| 6 | **Feature Flags** | Toggle fitur on/off tanpa redeploy (Firebase Remote Config) |
| 7 | **Rollback Mechanism** | Versioned deployments, satu klik rollback di Cloud Run |
| 8 | **Rate Limiting** | Batasi request per user untuk kontrol biaya API |
| 9 | **Auto-scaling Optimization** | `minInstances` untuk cold-start, `maxInstances` untuk cost cap |
| 10 | **Custom Domain** | `klausulku.id` atau `klausulku.com` |
| 11 | **PWA (Progressive Web App)** | Install di HP tanpa app store |
| 12 | **Webhook Notifikasi** | Kirim hasil analisis via WhatsApp/email |

### 🔑 Yang Dibutuhkan dari Kamu (Phase 4)

| # | Item | Detail |
|---|------|--------|
| 1 | **Domain** | Beli domain `klausulku.id` / `.com` |
| 2 | **Billing account GCP** | Untuk auto-scaling, monitoring, agent orchestration |
| 3 | **Legal review** | Review kebijakan privasi & terms of service untuk UU PDP |
| 4 | **Gemini 3.1 Pro access** | Untuk agent orchestration (mungkin perlu Vertex AI billing) |
| 5 | **WhatsApp Business API** | Jika mau notifikasi via WA |

---

## Architecture Overview

### MVP Architecture (Phase 1)
```
User Browser
    ↓
Cloud Run (React SPA + lightweight server)
    ↓
Gemini 2.5 Flash API (Google AI Studio)
    ↓
Response → render di browser
```

### Full Architecture (Phase 3-4)
```
┌─────────────────────────────────────────────────────────┐
│ User Browser                                             │
│  React SPA (Vite + TypeScript)                           │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌────────────────────┴────────────────────────────────────┐
│ Cloud Run (containerized)                                │
│  ├─ Static frontend serving                              │
│  ├─ API routes (analyze, chat)                           │
│  └─ Auth middleware (Firebase)                           │
└────┬──────────┬──────────┬──────────┬───────────────────┘
     ↓          ↓          ↓          ↓
  Gemini    Firestore   Firebase   Secret
  2.5 Flash  (NoSQL)    Auth       Manager
     ↓
  Google Search
  Grounding (Vertex AI)
     ↓
  Document AI
  (OCR enterprise)
```

---

## Proposed Changes (Phase 2 & 3)

### Firebase & Auth Layer
Membangun sistem authentication dan database.
#### [NEW] `src/config/firebase.ts` (Inisialisasi app, auth, dan firestore)
#### [NEW] `src/contexts/AuthContext.tsx` (Global state untuk user session)
#### [NEW] `src/services/db.ts` (CRUD operasi untuk Firestore - save analysis & chat)
#### [MODIFY] `src/App.tsx` (Wrap dengan AuthProvider, proteksi route)
#### [NEW] `firebase.json` & `firestore.rules` (Security rules)

---

### UI & UX Updates
Halaman baru dan update UI yang sudah ada.
#### [NEW] `src/pages/DashboardPage.tsx` (Halaman history dokumen milik user)
#### [NEW] `src/pages/TemplatesPage.tsx` (Library template kontrak)
#### [MODIFY] `src/components/Layout/Header.tsx` (Tambah tombol Login dengan Google / Avatar user)
#### [MODIFY] `src/pages/AnalyzePage.tsx` (Tambah tombol Export PDF, Bilingual toggle)

---

### Advanced AI Services
Mengubah service AI untuk mendukung OCR dan Grounding.
#### [NEW] `src/services/documentAi.ts` (Koneksi ke GCP Document AI API REST endpoint)
#### [MODIFY] `src/services/gemini.ts` (Update payload config untuk mengaktifkan Google Search Grounding jika memungkinkan, atau via REST API Vertex AI)
#### [NEW] `src/utils/pdfExport.ts` (Logika generator PDF dari hasil analisis)

## Design Direction (Current — Phase 5)

| Element | Value |
|---------|-------|
| Background | Light `#f8fafc` / Dark `#020617` (mesh gradient) |
| Cards | White/slate-900 with subtle border + shadow |
| Accent | Indigo brand `#4f46e5` (brand-600) |
| Risk Rendah | Emerald `#059669` |
| Risk Sedang | Amber `#d97706` |
| Risk Tinggi | Red `#dc2626` |
| Chat User | Brand indigo `#4f46e5` |
| Chat AI | Slate-100 / slate-800 |
| Text Primary | Slate-900 / white |
| Text Secondary | Slate-600 / slate-400 |
| Font | Plus Jakarta Sans (heading 600-800, body 400-500) |
| Components | Tailwind utility + shadcn-style primitives |
| Layout | Mobile-first responsive, xl 2-column hero |

---

## Verification Plan (Phase 2 & 3)

### Firebase Verification
- [ ] Firebase Auth bisa login pakai Google account.
- [ ] Firestore berhasil menyimpan dokumen baru saat user selesai analisis.
- [ ] Dashboard page berhasil meload history dokumen user.
- [ ] Security rules mencegah akses dokumen user lain.

### Advanced AI Verification
- [ ] Ekspor ke PDF berjalan lancar dan styling terjaga.
- [ ] Bilingual toggle mengubah bahasa analisis menjadi Inggris/Indonesia.
- [ ] Pengecekan integrasi Document AI / Vertex AI (membutuhkan API key / Service Account yang dikonfigurasi).

---

## Phase 4: UI Redesign (Clean & Modern) & Firebase Fix

Fase ini bertujuan untuk merombak antarmuka agar lebih "clean" (bersih, minimalis, profesional) layaknya aplikasi SaaS modern, serta memperbaiki sistem Firebase Login yang belum berjalan.

### Features Phase 4

| # | Feature | Detail |
|---|---------|--------|
| 1 | **SaaS Light Theme** | Ubah dari Dark/Glassmorphism menjadi Light/Minimalist UI (latar putih/abu muda, border halus, bayangan lembut). |
| 2 | **Card-based Layout** | Layout analisis dan klausul dibuat lebih lega (banyak whitespace) untuk mengurangi *cognitive load*. |
| 3 | **Typography Refinement** | Hierarki teks yang lebih rapi dengan warna teks abu-abu gelap (Slate/Zinc) untuk keterbacaan tinggi. |
| 4 | **Firebase Fix** | Konfigurasi Web App Firebase yang valid agar autentikasi Google Sign-In benar-benar berfungsi. |

> [!IMPORTANT]
> **User Review Required & Open Questions**
> Sebelum saya mengubah desain dan memperbaiki login, ada hal krusial terkait Firebase:
> 
> Saat saya mencoba mengakses project Firebase Anda, sistem meminta login otorisasi. Untuk memperbaiki login di aplikasi ini, kita butuh konfigurasi *Web App* Firebase dari project `483216655534`.
> 
> **Pilih salah satu cara berikut agar saya bisa memperbaikinya:**
> - **Opsi 1 (Manual):** Buka [Firebase Console](https://console.firebase.google.com/), masuk ke Project Settings > General > Your Apps, lalu **copy-paste** isi dari `firebaseConfig` (berisi apiKey, authDomain, dll) ke chat ini.
> - **Opsi 2 (Otomatis via CLI):** Tolong jalankan perintah ini di terminal komputer Anda: `npx firebase-tools login`. Setelah Anda login, beri tahu saya, lalu saya akan menarik konfigurasinya secara otomatis.
> 
> Apakah Anda setuju dengan arah desain "Clean Minimalist Light Theme" (seperti Notion/Linear) dan cara mana yang Anda pilih untuk Firebase?

## Summary: Semua Feature dari Reports

> Checklist ini memastikan semua feature dari kedua deep-research report tercatat.

| Feature (dari Report) | Phase | Status |
|----------------------|-------|--------|
| Upload PDF/foto | 1 | ✅ Done |
| OCR teks extraction | 1 | ✅ Gemini native |
| Analisis klausul + risk scoring | 1 | ✅ Done |
| Risk heatmap visualisasi | 1 | ✅ Done |
| Ringkasan bahasa sederhana | 1 | ✅ Done |
| Grounding referensi regulasi | 1 | ⚠️ Basic (AI-generated links) |
| Chat kontekstual | 1 | ✅ Done |
| Cloud Run deployment | 1 | ✅ Dockerfile ready, pending live deploy |
| Responsive mobile | 1 | ✅ Done |
| Firebase Auth (Google sign-in) | 2 | ✅ Wired, pending end-to-end verify |
| Firestore (simpan history) | 2 | ✅ Done |
| Security Rules | 2 | ✅ Done |
| Secret Manager | 2 | 📋 Pending |
| Dashboard history | 2 | ✅ Done |
| Chat history persist | 2 | ✅ Done |
| Verdict AI (aman/negosiasi/jangan tandatangani) | 6 | ✅ Done |
| Action Plan (recommended next steps) | 6 | ✅ Done |
| Top risks + negotiation tips | 6 | ✅ Done |
| Negotiation draft generator (WA/email/addendum) | 6 | ✅ Done |
| UMKM-friendliness score | 6 | ✅ Done |
| Contract-type playbook checklist | 6 | ✅ Done |
| Key dates + .ics calendar export | 6 | ✅ Done |
| Guided chat actions | 6 | ✅ Done |
| Template & Playbook page | 6 | ✅ Done |
| Clause suggested revision (side-by-side) | 6 | ✅ Done |
| Export PDF | 3 | ✅ Done (rebranded indigo) |
| Bilingual (ID/EN) | 3 | ✅ Done (re-analisis on toggle) |
| Dark/Light mode toggle | 3 | ✅ Done |
| UI Tailwind + shadcn-style | 5 | ✅ Done |
| #JuaraVibeCoding landing sections | 5 | ✅ Done (Masalah, Teknologi) |
| Document AI (enterprise OCR) | 3 | 📋 Stub only |
| Google Search Grounding (Vertex AI) | 3 | 📋 Pending |
| Knowledge base hukum (RAG) | 3 | 📋 Pending |
| Confidence score | 3 | 📋 Pending |
| Explainability (highlight source) | 3 | 📋 Partial (expand clause text) |
| Text-to-speech | 3 | 📋 Pending |
| Template kontrak | 3 | ✅ Done (TemplatesPage + playbooks) |
| Agent orchestration (multi-agent) | 4 | 📋 Long-term |
| Human-in-the-loop (HITL) | 4 | 📋 Long-term |
| Audit trail | 4 | 📋 Long-term |
| UU PDP compliance | 4 | 📋 Long-term |
| Monitoring & alerting | 4 | 📋 Long-term |
| Feature flags | 4 | 📋 Long-term |
| Auto-scaling optimization | 4 | 📋 Long-term |
| Custom domain | 4 | 📋 Long-term |
| PWA | 4 | 📋 Long-term |
| Webhook notifikasi (WA/email) | 4 | 📋 Long-term |
