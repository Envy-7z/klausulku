import { jsPDF } from 'jspdf';
import type { AnalysisResult } from '../types';

const MARGIN = 16;
const PAGE_H = 297;
const LINE = 5;

/** Legacy no-op — kept for callers that clean up old html2pdf artifacts. */
export function cleanupPdfArtifacts() {
  document.querySelectorAll('[data-klausulku-pdf-export]').forEach((el) => el.remove());
  document.querySelectorAll('.html2canvas-container').forEach((el) => el.remove());
}

export async function generatePdfReport(analysis: AnalysisResult): Promise<void> {
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
  const pageW = doc.internal.pageSize.getWidth();
  const maxW = pageW - MARGIN * 2;
  let y = MARGIN;

  const ensureSpace = (needed: number) => {
    if (y + needed > PAGE_H - MARGIN) {
      doc.addPage();
      y = MARGIN;
    }
  };

  const writeLines = (
    text: string,
    opts: { size?: number; bold?: boolean; gap?: number; indent?: number } = {}
  ) => {
    const size = opts.size ?? 10;
    const gap = opts.gap ?? 2;
    const indent = opts.indent ?? 0;
    doc.setFontSize(size);
    doc.setFont('helvetica', opts.bold ? 'bold' : 'normal');
    doc.setTextColor(30, 41, 59);
    const lines = doc.splitTextToSize(text, maxW - indent) as string[];
    ensureSpace(lines.length * LINE + gap);
    doc.text(lines, MARGIN + indent, y);
    y += lines.length * LINE + gap;
  };

  const writeHeading = (text: string, size = 13) => {
    ensureSpace(12);
    writeLines(text, { size, bold: true, gap: 3 });
  };

  const writeRule = () => {
    ensureSpace(4);
    doc.setDrawColor(226, 232, 240);
    doc.line(MARGIN, y, pageW - MARGIN, y);
    y += 5;
  };

  // Title
  doc.setTextColor(79, 70, 229);
  writeLines('KlausulKu', { size: 22, bold: true, gap: 1 });
  doc.setTextColor(30, 41, 59);
  writeLines('Laporan Analisis Kontrak', { size: 14, bold: true, gap: 2 });
  writeLines(`Dokumen: ${analysis.filename}`, { size: 9, gap: 1 });
  writeLines(
    `Tanggal: ${new Date(analysis.analyzedAt).toLocaleDateString('id-ID')}`,
    { size: 9, gap: 1 }
  );
  if (analysis.contractType) {
    writeLines(`Tipe: ${analysis.contractType.label}`, { size: 9, gap: 2 });
  }
  writeRule();

  writeHeading('Ringkasan Eksekutif', 12);
  writeLines(analysis.summary);
  writeLines(`Risiko Keseluruhan: ${analysis.overallRisk}`, { bold: true, gap: 4 });

  if (analysis.verdict) {
    writeHeading('Keputusan AI', 12);
    writeLines(analysis.verdict.headline, { bold: true });
    writeLines(analysis.verdict.reasoning, { gap: 4 });
  }

  if (analysis.recommendedActions?.length) {
    writeHeading('Langkah Selanjutnya', 12);
    analysis.recommendedActions.forEach((action, i) => {
      writeLines(`${i + 1}. ${action.title}`, { bold: true, gap: 1 });
      writeLines(action.description, { size: 9, indent: 4, gap: 2 });
    });
  }

  if (analysis.umkmFriendliness) {
    writeHeading('Skor UMKM-Friendliness', 12);
    writeLines(
      `${Math.round(analysis.umkmFriendliness.score)}/100 — ${analysis.umkmFriendliness.verdict}`,
      { bold: true }
    );
    writeLines(analysis.umkmFriendliness.comparison, { size: 9, gap: 4 });
  }

  if (analysis.keyDates?.length) {
    writeHeading('Tanggal Penting', 12);
    analysis.keyDates.forEach((d) => {
      writeLines(
        `• ${d.label} (${d.type})${d.isoDate ? ` — ${d.isoDate}` : ''}: ${d.rawText}`,
        { size: 9, gap: 2 }
      );
    });
    y += 2;
  }

  writeHeading('Rincian Klausul', 12);
  analysis.clauses.forEach((clause) => {
    ensureSpace(20);
    writeLines(`${clause.number}: ${clause.title} [${clause.riskScore}]`, {
      bold: true,
      gap: 1,
    });
    writeLines(clause.explanation, { size: 9, gap: 1 });
    if (clause.negotiationTip) {
      writeLines(`Saran negosiasi: ${clause.negotiationTip}`, { size: 9, gap: 1 });
    }
    writeLines(`Teks asli: ${clause.originalText}`, { size: 8, gap: 3 });
  });

  if (analysis.groundingSources.length > 0) {
    writeHeading('Referensi Regulasi', 12);
    analysis.groundingSources.forEach((src) => {
      writeLines(`• ${src}`, { size: 9, gap: 1 });
    });
  }

  ensureSpace(10);
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text(
    'Dibuat dengan KlausulKu · Powered by Gemini AI · Bukan nasihat hukum resmi',
    MARGIN,
    PAGE_H - 10
  );

  doc.save(`Analisis_${analysis.filename.replace(/\.[^/.]+$/, '')}.pdf`);
}
