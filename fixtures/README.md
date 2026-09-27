# Sample contracts for KlausulKu testing

These PDFs are **fictitious** documents for local QA and demo. They are not valid legal contracts.

## Files

| File | Type | What to test |
|------|------|----------------|
| `contoh-kontrak-sewa-ruko-umkm.pdf` | Sewa ruko (2 tahun) | Verdict, penalti 5%/hari, auto-renewal 25%, deposit, pemutusan sepihak |
| `contoh-mou-kerjasama-umkm.pdf` | MOU marketplace | Eksklusivitas, komisi 35%, IP, data pelanggan |

## Regenerate PDFs

```bash
node scripts/generate-fixture-contracts.mjs
```

## Typical UMKM contract types (reference)

Based on common Indonesian SME practice:

1. **Sewa ruko/kios** — objek sewa, jangka waktu, deposit, PBB/utilitas, penalti telat bayar, perpanjangan otomatis
2. **MOU kerjasama** — ruang lingkup, eksklusivitas, komisi, IP, pengakhiran
3. **Franchise** — royalty, wilayah, standar operasi
4. **Kontrak kerja (outsourcing)** — gaji, jam kerja, PHK

KlausulKu playbooks in `src/data/playbooks.ts` mirror these categories.

## Suggested test flow

1. Upload `contoh-kontrak-sewa-ruko-umkm.pdf`
2. Expect contract type **sewa**, verdict likely **negosiasi** or **jangan tandatangani**
3. Open **Generator Pesan Negosiasi** → WhatsApp
4. Export PDF report
5. Repeat with MOU file for **mou** playbook
