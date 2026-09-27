import type { ContractTypeId } from '../types'

export interface PlaybookItem {
  id: string
  label: string
  keywords: string[]
}

export interface Playbook {
  type: ContractTypeId
  label: string
  description: string
  items: PlaybookItem[]
}

export const PLAYBOOKS: Playbook[] = [
  {
    type: 'sewa',
    label: 'Kontrak Sewa',
    description: 'Checklist untuk kontrak sewa ruko, kios, atau tempat usaha.',
    items: [
      { id: 'deposit', label: 'Deposit/uang jaminan jelas & refundable', keywords: ['deposit', 'jaminan', 'uang muka'] },
      { id: 'maintenance', label: 'Biaya maintenance & perbaikan', keywords: ['maintenance', 'perbaikan', 'renovasi'] },
      { id: 'notice', label: 'Notice period sebelum renew/terminate', keywords: ['notice', 'pemberitahuan', 'pengakhiran'] },
      { id: 'penalty', label: 'Penalti keterlambatan wajar', keywords: ['penalti', 'denda', 'keterlambatan'] },
      { id: 'sublet', label: 'Hak subsewa/pindah usaha', keywords: ['subsewa', 'pindah', 'alih'] },
    ],
  },
  {
    type: 'mou',
    label: 'MOU / Perjanjian Kerjasama',
    description: 'Checklist untuk memorandum of understanding atau kerjasama bisnis.',
    items: [
      { id: 'scope', label: 'Ruang lingkup kerjasama jelas', keywords: ['lingkup', 'scope', 'ruang'] },
      { id: 'ip', label: 'Kepemilikan IP & hasil kerja', keywords: ['hak cipta', 'ip', 'kekayaan intelektual'] },
      { id: 'termination', label: 'Klausul pengakhiran & exit', keywords: ['pengakhiran', 'terminate', 'berakhir'] },
      { id: 'confidential', label: 'Kerahasiaan informasi', keywords: ['rahasia', 'confidential', 'kerahasiaan'] },
      { id: 'dispute', label: 'Penyelesaian sengketa', keywords: ['sengketa', 'arbitrase', 'mediasi'] },
    ],
  },
  {
    type: 'franchise',
    label: 'Franchise',
    description: 'Checklist untuk perjanjian franchise atau kemitraan brand.',
    items: [
      { id: 'royalty', label: 'Royalty & biaya franchise transparan', keywords: ['royalty', 'franchise', 'fee'] },
      { id: 'territory', label: 'Wilayah eksklusif', keywords: ['wilayah', 'territory', 'eksklusif'] },
      { id: 'brand', label: 'Penggunaan merek & standar operasi', keywords: ['merek', 'brand', 'standar'] },
      { id: 'supply', label: 'Kewajiban supply chain', keywords: ['supply', 'bahan', 'pemasok'] },
      { id: 'renewal', label: 'Syarat perpanjangan franchise', keywords: ['perpanjangan', 'renewal', 'perpanjang'] },
    ],
  },
  {
    type: 'kerja',
    label: 'Kontrak Kerja',
    description: 'Checklist untuk perjanjian kerja atau outsourcing tenaga kerja.',
    items: [
      { id: 'compensation', label: 'Gaji, tunjangan, & benefit', keywords: ['gaji', 'upah', 'tunjangan'] },
      { id: 'hours', label: 'Jam kerja & lembur', keywords: ['jam kerja', 'lembur', 'overtime'] },
      { id: 'termination', label: 'PHK & pesangon', keywords: ['phk', 'pesangon', 'pemutusan'] },
      { id: 'noncompete', label: 'Non-compete & non-disclosure', keywords: ['non-compete', 'larangan', 'compete'] },
      { id: 'probation', label: 'Masa percobaan', keywords: ['probation', 'percobaan', 'masa uji'] },
    ],
  },
  {
    type: 'lainnya',
    label: 'Kontrak Umum',
    description: 'Checklist umum untuk kontrak bisnis lainnya.',
    items: [
      { id: 'parties', label: 'Identitas pihak & otoritas penandatangan', keywords: ['pihak', 'identitas', 'penandatangan'] },
      { id: 'payment', label: 'Syarat pembayaran', keywords: ['pembayaran', 'payment', 'tagihan'] },
      { id: 'liability', label: 'Batas tanggung jawab', keywords: ['tanggung jawab', 'liability', 'ganti rugi'] },
      { id: 'force', label: 'Force majeure', keywords: ['force majeure', 'keadaan kahar'] },
      { id: 'law', label: 'Hukum yang berlaku', keywords: ['hukum', 'yurisdiksi', 'indonesia'] },
    ],
  },
]

export function getPlaybook(type: ContractTypeId): Playbook {
  return PLAYBOOKS.find((p) => p.type === type) ?? PLAYBOOKS[PLAYBOOKS.length - 1]
}

export function checkPlaybookItem(
  item: PlaybookItem,
  clauseTexts: string[]
): boolean {
  const combined = clauseTexts.join(' ').toLowerCase()
  return item.keywords.some((kw) => combined.includes(kw.toLowerCase()))
}
