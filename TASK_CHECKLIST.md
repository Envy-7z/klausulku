# Task Checklist — KlausulKu

## Phase 4: UI Redesign (Clean SaaS Light Theme)
- [x] Ubah tema dari dark/gold glassmorphism ke light minimalist
- [x] Card-based layout dengan border halus dan shadow lembut
- [x] Update Header, LandingPage, AnalyzePage, DashboardPage
- [x] Firebase config via CLI ke `src/config/firebase.ts`

## Phase 5: Tailwind + shadcn-style Redesign
- [x] Migrasi ke Tailwind CSS v4 + `@tailwindcss/vite`
- [x] shadcn-style primitives: Button, Card, Badge + `cn()` helper
- [x] lucide-react icons (ganti emoji)
- [x] Plus Jakarta Sans font
- [x] Dark mode toggle (ThemeContext + localStorage)
- [x] Nav scroll: Masalah, Fitur, Cara Kerja, Teknologi
- [x] Section #JuaraVibeCoding (Masalah + Teknologi di landing)
- [x] Hero 2-column layout di xl screens
- [x] Chat sidebar desktop + overlay mobile
- [x] Hapus semua per-file `*.css` komponen (kecuali `index.css`)

## Phase 5b: UI Polish (P0-P1)
- [x] Toggle bahasa ID/EN fungsional (re-analisis dengan loading)
- [x] PDF export rebranding (indigo + Plus Jakarta Sans)
- [x] Chat mobile backdrop + tap-to-close
- [x] Dark mode lengkap di Card primitives + RiskHeatmap
- [x] Toolbar Analyze responsif di mobile
- [x] Logo brand (scale icon)

## Phase 6: Action Layer (Contract Advisor for UMKM)
- [x] Enriched Gemini JSON: verdict, recommendedActions, contractType, keyDates, umkmFriendliness
- [x] VerdictBanner (aman / negosiasi / jangan tandatangani)
- [x] ActionPlanCard + legal-aid escalation
- [x] TopRisksPanel + guided chat seeding
- [x] NegotiationGenerator (WA / email / addendum)
- [x] PlaybookChecklist + TemplatesPage
- [x] KeyDatesCard + icsExport
- [x] UmkmScoreCard
- [x] ClauseCard side-by-side suggestedRevision
- [x] PDF export extended with verdict/action plan/dates/score
- [x] Landing page updated (Verdict, Action Plan, Ambil Tindakan)

## Firebase
- [x] Tarik konfigurasi Web App menggunakan Firebase CLI
- [x] Update `src/config/firebase.ts` dengan konfigurasi asli
- [x] Firestore security rules + indexes
- [ ] Verifikasi tombol login Google berfungsi tanpa error (authorized domains)

## Feature Status (from IMPLEMENTATION_PLAN)
- [x] Upload + analisis klausul + risk heatmap + chat
- [x] Export PDF
- [x] Bilingual ID/EN (re-analisis)
- [x] Dark/light mode
- [x] Dashboard history (Firestore)
- [x] Chat history persist ke Firestore
- [x] TemplatesPage (template kontrak UMKM)
- [ ] Document AI OCR (stub only)
- [ ] Vertex AI grounding (real RAG)

## #JuaraVibeCoding Submission
- [ ] Deploy live ke Cloud Run (Live URL)
- [ ] Video demo 2-3 menit di LinkedIn (public)
- [ ] Tag `#JuaraVibeCoding` di post LinkedIn
- [ ] Submit formulir penyelesaian resmi

## Verification
- [x] `npm run build` pass
- [x] `npm run lint` pass (0 errors)
- [ ] Browser smoke test: upload → analisis → chat → export PDF
- [ ] Browser smoke test: toggle dark mode + mobile layout
