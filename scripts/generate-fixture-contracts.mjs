/**
 * Generates sample UMKM contract PDFs for KlausulKu testing.
 * Fictitious parties and addresses — not legal advice.
 *
 * Run: node scripts/generate-fixture-contracts.mjs
 */

import { jsPDF } from 'jspdf'
import { mkdirSync, existsSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_DIR = join(__dirname, '..', 'fixtures')

function writePdf(filename, title, sections) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const margin = 20
  const maxWidth = 170
  let y = 20

  const addBlock = (text, fontSize = 11, bold = false) => {
    doc.setFontSize(fontSize)
    doc.setFont('helvetica', bold ? 'bold' : 'normal')
    const lines = doc.splitTextToSize(text, maxWidth)
    for (const line of lines) {
      if (y > 275) {
        doc.addPage()
        y = 20
      }
      doc.text(line, margin, y)
      y += fontSize * 0.45 + 2
    }
    y += 4
  }

  addBlock(title, 14, true)
  addBlock(
    'DOKUMEN FIKSI UNTUK PENGUJIAN KLAUSULKU — Bukan kontrak hukum yang sah. Para pihak, alamat, dan angka adalah contoh belaka.',
    9
  )
  y += 2

  for (const section of sections) {
    if (section.heading) addBlock(section.heading, 12, true)
    if (section.body) addBlock(section.body, 10)
  }

  addBlock(
    '\n\nJakarta, 1 Januari 2026\n\nPIHAK PERTAMA: ____________________\nPIHAK KEDUA: ____________________\n\nMaterai Rp 10.000',
    10
  )

  const path = join(OUT_DIR, filename)
  doc.save(path)
  console.log('Written:', path)
}

const sewaRuko = [
  {
    heading: 'PERJANJIAN SEWA MENYEWA RUKO',
    body: `Nomor: SEWA/UMKM/2026/001

PIHAK PERTAMA (Pemilik):
Nama: PT Graha Niaga Sejahtera
Alamat: Jl. Gatot Subroto Kav. 42, Jakarta Selatan
Diwakili oleh: Bapak Hendra Wijaya, Direktur

PIHAK KEDUA (Penyewa / UMKM):
Nama: CV Berkah Kuliner Nusantara
Alamat: Jl. Melati No. 8, Jakarta Timur
Diwakili oleh: Ibu Siti Rahmawati, Pemilik`,
  },
  {
    heading: 'Pasal 1 — Objek Sewa',
    body: `PIHAK PERTAMA menyewakan kepada PIHAK KEDUA satu unit ruko seluas kurang lebih 24 (dua puluh empat) meter persegi, berlokasi di Jl. Raya Condet No. 115, Blok B2, Jakarta Timur, untuk digunakan sebagai warung makan / usaha kuliner UMKM.

Ruko diserahkan dalam kondisi kosong. PIHAK KEDUA bertanggung jawab atas perizinan usaha, termasuk Sertifikat Laik Hygiene (SLH) dan izin gangguan jika diperlukan.`,
  },
  {
    heading: 'Pasal 2 — Jangka Waktu dan Perpanjangan Otomatis',
    body: `Masa sewa berlaku 2 (dua) tahun terhitung sejak 1 Februari 2026 sampai 31 Januari 2028.

Apabila PIHAK KEDUA tidak memberikan pemberitahuan tertulis pengakhiran sewa paling lambat 90 (sembilan puluh) hari sebelum berakhirnya masa sewa, maka perjanjian dianggap diperpanjang otomatis untuk jangka waktu 1 (satu) tahun dengan kenaikan harga sewa sebesar 25% (dua puluh lima persen) dari harga tahun terakhir, tanpa memerlukan persetujuan tertulis PIHAK KEDUA.`,
  },
  {
    heading: 'Pasal 3 — Harga Sewa dan Pembayaran',
    body: `Harga sewa tahun pertama sebesar Rp 48.000.000 (empat puluh delapan juta rupiah) per tahun, dibayar lunas di muka pada saat penandatanganan.

Harga sewa tahun kedua sebesar Rp 54.000.000 (lima puluh empat juta rupiah), dibayar lunas paling lambat 30 hari sebelum dimulainya tahun sewa kedua.

Semua pembayaran dilakukan ke rekening Bank BCA No. 1234567890 atas nama PT Graha Niaga Sejahtera.`,
  },
  {
    heading: 'Pasal 4 — Uang Jaminan (Deposit)',
    body: `PIHAK KEDUA wajib menyerahkan uang jaminan sebesar Rp 12.000.000 (dua belas juta rupiah) pada saat penandatanganan.

Uang jaminan dapat digunakan PIHAK PERTAMA untuk menutup tunggakan sewa, denda, biaya perbaikan, atau biaya pengosongan tanpa pemberitahuan terlebih dahulu.

Sisa uang jaminan (jika ada) dikembalikan paling lambat 60 hari setelah masa sewa berakhir, setelah dikurangi seluruh klaim PIHAK PERTAMA, termasuk biaya pengecatan ulang dan penggantian kunci.`,
  },
  {
    heading: 'Pasal 5 — Denda dan Wanprestasi',
    body: `Apabila PIHAK KEDUA terlambat membayar sewa, dikenakan denda keterlambatan sebesar 5% (lima persen) dari nilai tunggakan per hari kalender, dihitung sejak hari pertama keterlambatan, tanpa batas maksimum.

PIHAK PERTAMA berhak memutuskan listrik dan air atas nama PIHAK KEDUA apabila tunggakan mencapai 7 (tujuh) hari.

Denda langsung dipotong dari uang jaminan dan/atau ditagihkan secara terpisah.`,
  },
  {
    heading: 'Pasal 6 — Pemutusan Perjanjian Sepihak',
    body: `PIHAK PERTAMA berhak mengakhiri perjanjian secara sepihak dengan pemberitahuan 7 (tujuh) hari kalender apabila:
a) PIHAK KEDUA menunggak sewa lebih dari 14 hari;
b) PIHAK KEDUA melakukan perubahan usaha tanpa izin tertulis;
c) PIHAK KEDUA mengalihkan atau menyubkan ruko.

Dalam hal pemutusan oleh PIHAK PERTAMA berdasarkan huruf a atau b, uang jaminan dan sisa sewa yang telah dibayar tidak dikembalikan.

Apabila PIHAK KEDUA mengakhiri sewa sebelum jangka waktu berakhir, PIHAK KEDUA wajib membayar penalti sebesar 100% (seratus persen) dari total sisa nilai sewa hingga akhir masa.`,
  },
  {
    heading: 'Pasal 7 — Pemeliharaan dan Biaya',
    body: `PIHAK KEDUA menanggung seluruh biaya listrik, air, internet, PBB, dan retribusi daerah.

PIHAK KEDUA wajib melakukan perbaikan struktural minor tanpa mengurangi fungsi bangunan; kerusakan akibat bencana alam menjadi tanggung jawab PIHAK PERTAMA hanya jika asuransi pemilik menanggung.

Renovasi interior (partisi, kitchen set, exhaust) wajib mendapat persetujuan tertulis dan menjadi milik PIHAK PERTAMA setelah sewa berakhir tanpa kompensasi.`,
  },
  {
    heading: 'Pasal 8 — Larangan dan Eksonerasi',
    body: `PIHAK KEDUA dilarang menyewakan kembali, menggadaikan, atau menggunakan ruko untuk kegiatan di luar kuliner tanpa izin.

PIHAK PERTAMA tidak bertanggung jawab atas gangguan usaha akibat renovasi di unit sebelah, kebisingan lingkungan, atau penutupan jalan oleh pemerintah.

PIHAK KEDUA melepaskan hak menuntut PIHAK PERTAMA atas kerugian tidak langsung (lost profit) akibat hal-hal tersebut.`,
  },
  {
    heading: 'Pasal 9 — Force Majeure',
    body: `Keadaan kahar meliputi bencana alam, epidemi, kebijakan pemerintah, dan huru-hara. Pihak yang terdampak wajib memberitahu dalam 14 hari.

Selama force majeure, kewajiban sewa tidak ditangguhkan kecuali disepakati tertulis oleh PIHAK PERTAMA.`,
  },
  {
    heading: 'Pasal 10 — Penyelesaian Sengketa',
    body: `Sengketa diselesaikan musyawarah 30 hari. Jika gagal, para pihak sepakat domisili hukum di Pengadilan Negeri Jakarta Selatan.

Perjanjian ini tunduk pada hukum Republik Indonesia.`,
  },
]

const mouKerjasama = [
  {
    heading: 'MEMORANDUM OF UNDERSTANDING (MOU)',
    body: `Kerjasama Pemasaran Produk UMKM

Nomor: MOU/BRK/2026/07

PIHAK PERTAMA: PT Sinar Digital Nusantara (platform marketplace)
PIHAK KEDUA: UD Keripik Bu Nuri (produsen UMKM, Kab. Bogor)`,
  },
  {
    heading: 'Pasal 1 — Ruang Lingkup',
    body: `PIHAK KEDUA menyerahkan produk keripik dan camilan untuk dijual melalui platform PIHAK PERTAMA dengan skema consignment (titip jual).

PIHAK PERTAMA berhak menentukan harga jual eceran final tanpa persetujuan tertulis PIHAK KEDUA, dengan komisi platform 35% dari harga jual.`,
  },
  {
    heading: 'Pasal 2 — Jangka Waktu dan Eksklusivitas',
    body: `MOU berlaku 3 tahun sejak 15 Maret 2026.

Selama masa MOU, PIHAK KEDUA dilarang bekerja sama dengan marketplace pesaing atau menjual produk serupa melalui channel online lain tanpa izin PIHAK PERTAMA.`,
  },
  {
    heading: 'Pasal 3 — Kewajiban Finansial',
    body: `PIHAK KEDUA wajib membayar biaya onboarding sebesar Rp 5.000.000 (lima juta rupiah) tidak refundable.

Settlement penjualan dilakukan 45 hari setelah transaksi selesai, setelah dikurangi komisi, biaya promosi, dan chargeback.

PIHAK PERTAMA dapat menahan seluruh saldo apabila terdapat komplain pelanggan yang belum diselesaikan.`,
  },
  {
    heading: 'Pasal 4 — Hak Kekayaan Intelektual',
    body: `Foto produk, deskripsi, dan merek dagang yang dibuat PIHAK PERTAMA untuk promosi menjadi milik PIHAK PERTAMA sepenuhnya.

Nama "Keripik Bu Nuri" dapat digunakan PIHAK PERTAMA untuk sub-brand koleksi tanpa royalti tambahan.`,
  },
  {
    heading: 'Pasal 5 — Pengakhiran',
    body: `PIHAK PERTAMA dapat mengakhiri MOU kapan saja dengan pemberitahuan 3 hari.

PIHAK KEDUA hanya dapat mengakhiri setelah 1 tahun dengan pemberitahuan 90 hari dan penalti Rp 15.000.000.

Stok tersisa menjadi tanggung jawab PIHAK KEDUA untuk ditarik dalam 7 hari setelah pengakhiran.`,
  },
  {
    heading: 'Pasal 6 — Kerahasiaan dan Data',
    body: `PIHAK KEDUA memberikan hak kepada PIHAK PERTAMA untuk menggunakan data penjualan, harga pokok, dan kontak pelanggan untuk keperluan analitik dan remarketing tanpa batas waktu setelah MOU berakhir.`,
  },
]

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true })

writePdf(
  'contoh-kontrak-sewa-ruko-umkm.pdf',
  'PERJANJIAN SEWA RUKO — UMKM (Contoh Testing)',
  sewaRuko
)
writePdf(
  'contoh-mou-kerjasama-umkm.pdf',
  'MOU KERJASAMA PEMASARAN — UMKM (Contoh Testing)',
  mouKerjasama
)

console.log('\nUpload salah satu file di KlausulKu untuk testing analisis.')
