# Pre-Deploy Checklist — KlausulKu

Langkah manual sebelum dan sesudah deploy ke Cloud Run.

## 1. Firestore rules & indexes

```bash
firebase login
firebase use klausulku
firebase deploy --only firestore:rules,firestore:indexes
```

Dashboard membutuhkan composite index `userId + analyzedAt`.

## 2. Firebase Authorized Domains

Firebase Console → **Authentication** → **Settings** → **Authorized domains**

Tambahkan:

- `localhost` (sudah default)
- URL Cloud Run production, contoh: `klausulku-xxxxx.asia-southeast2.run.app`

Tanpa ini, Google Sign-In gagal dengan `auth/unauthorized-domain`.

## 3. Restrict Gemini API Key

Google AI Studio atau GCP Console → **Credentials** → API key yang dipakai app

**Application restrictions**

- HTTP referrers (web sites)
- `https://<cloud-run-host>/*`
- `http://localhost:*` (development)

**API restrictions**

- Restrict key → **Generative Language API** only

Key Gemini ada di bundle JS (`VITE_GEMINI_API_KEY`). Restriction wajib untuk production.

## 4. Build & deploy Cloud Run

### Opsi A — Google Cloud Shell (tanpa Docker lokal) **← recommended**

1. Zip project `klausulku/` atau push ke Git repo
2. Buka [Google Cloud Shell](https://console.cloud.google.com/cloudshell?project=klausulku)
3. Upload / clone project, lalu:

```bash
cd klausulku
export VITE_GEMINI_API_KEY="your-key-here"
chmod +x scripts/deploy-cloud-run.sh
./scripts/deploy-cloud-run.sh
```

4. Copy URL output, contoh: `https://klausulku-xxxxx.asia-southeast2.run.app`

### Opsi B — Docker lokal + gcloud

```bash
export VITE_GEMINI_API_KEY="your-key-here"

docker build \
  --build-arg VITE_GEMINI_API_KEY=$VITE_GEMINI_API_KEY \
  --build-arg VITE_GCP_PROJECT_ID=483216655534 \
  -t gcr.io/klausulku/klausulku .

docker push gcr.io/klausulku/klausulku

gcloud run deploy klausulku \
  --image gcr.io/klausulku/klausulku \
  --platform managed \
  --region asia-southeast2 \
  --allow-unauthenticated \
  --port 8080
```

### Opsi C — Firebase Hosting saja (TIDAK memenuhi syarat JVC)

`https://klausulku.web.app` sudah live, tapi **bukan Cloud Run**. Untuk submission #JuaraVibeCoding wajib URL Cloud Run atau publish dari AI Studio.

Build gagal jika `VITE_GEMINI_API_KEY` kosong (validasi di `vite.config.ts`).

## 5. Post-deploy smoke test

- [ ] Landing page load
- [ ] Upload PDF → analisis selesai
- [ ] Chat AI merespons
- [ ] Export PDF
- [ ] Google Sign-In
- [ ] Dashboard menampilkan riwayat
- [ ] Buka dokumen lama → chat history masih ada
- [ ] Toggle dark mode di mobile

## 6. Keamanan

- Jangan commit `.env` (sudah di `.gitignore`)
- Rotasi API key jika pernah ter-expose
- Firestore rules: user hanya akses dokumen milik sendiri (`firestore.rules`)

## 7. #JuaraVibeCoding submission

- [ ] Live URL Cloud Run
- [ ] Video demo 2–3 menit di LinkedIn + `#JuaraVibeCoding`
- [ ] Submit formulir resmi
