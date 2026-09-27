import type {
  AnalysisResult,
  Clause,
  RecommendedAction,
  RiskLevel,
  Verdict,
  VerdictDecision,
} from '../types';

const RISK_ORDER: Record<RiskLevel, number> = {
  Tinggi: 0,
  Sedang: 1,
  Rendah: 2,
};

const HEAVY_PENALTY_FLAGS = ['heavy_penalty', 'penalti_besar', 'penalty'];

export function deriveVerdict(clauses: Clause[], language: 'id' | 'en' = 'id'): Verdict {
  const tinggi = clauses.filter((c) => c.riskScore === 'Tinggi').length;
  const sedang = clauses.filter((c) => c.riskScore === 'Sedang').length;
  const hasHeavyPenalty = clauses.some((c) =>
    c.flags.some((f) => HEAVY_PENALTY_FLAGS.some((p) => f.toLowerCase().includes(p)))
  );

  let decision: VerdictDecision = 'aman';
  if (tinggi >= 2 || hasHeavyPenalty) {
    decision = 'jangan_tandatangani';
  } else if (tinggi >= 1 || sedang >= 3) {
    decision = 'negosiasi';
  }

  const headlines: Record<VerdictDecision, { id: string; en: string }> = {
    aman: {
      id: 'Aman untuk ditinjau & ditandatangani',
      en: 'Safe to review and sign',
    },
    negosiasi: {
      id: 'Negosiasi dulu sebelum tanda tangan',
      en: 'Negotiate before signing',
    },
    jangan_tandatangani: {
      id: 'Jangan tanda tangan tanpa bantuan hukum',
      en: 'Do not sign without legal help',
    },
  };

  const reasoningParts =
    language === 'id'
      ? [
          tinggi > 0 ? `${tinggi} klausul risiko tinggi` : null,
          sedang > 0 ? `${sedang} klausul perlu perhatian` : null,
          hasHeavyPenalty ? 'terdapat klausul penalti berat' : null,
        ].filter(Boolean)
      : [
          tinggi > 0 ? `${tinggi} high-risk clause(s)` : null,
          sedang > 0 ? `${sedang} clause(s) need attention` : null,
          hasHeavyPenalty ? 'heavy penalty clause detected' : null,
        ].filter(Boolean);

  const reasoning =
    reasoningParts.length > 0
      ? reasoningParts.join(', ')
      : language === 'id'
        ? 'Tidak ada klausul berisiko tinggi yang teridentifikasi.'
        : 'No high-risk clauses identified.';

  return {
    decision,
    headline: headlines[decision][language],
    reasoning,
  };
}

export function deriveRecommendedActions(
  clauses: Clause[],
  language: 'id' | 'en' = 'id'
): RecommendedAction[] {
  const topRisks = getTopRiskClauses(clauses, 3);
  const actions: RecommendedAction[] = [];

  if (topRisks.length > 0) {
    actions.push({
      priority: 'urgent',
      title:
        language === 'id'
          ? 'Tinjau klausul berisiko tinggi'
          : 'Review high-risk clauses',
      description:
        language === 'id'
          ? `Perhatikan ${topRisks.map((c) => c.number).join(', ')} sebelum menandatangani.`
          : `Pay attention to ${topRisks.map((c) => c.number).join(', ')} before signing.`,
      relatedClause: topRisks[0]?.number,
    });
  }

  const verdict = deriveVerdict(clauses, language);
  if (verdict.decision !== 'aman') {
    actions.push({
      priority: 'penting',
      title: language === 'id' ? 'Siapkan poin negosiasi' : 'Prepare negotiation points',
      description:
        language === 'id'
          ? 'Gunakan generator pesan negosiasi untuk menyampaikan revisi ke lawan kontrak.'
          : 'Use the negotiation message generator to propose revisions.',
    });
  }

  actions.push({
    priority: 'opsional',
    title: language === 'id' ? 'Simpan laporan PDF' : 'Save PDF report',
    description:
      language === 'id'
        ? 'Export hasil analisis untuk dibagikan ke partner bisnis atau konsultan.'
        : 'Export analysis to share with business partners or advisors.',
  });

  return actions;
}

export function getTopRiskClauses(clauses: Clause[], limit = 3): Clause[] {
  return [...clauses]
    .sort((a, b) => RISK_ORDER[a.riskScore] - RISK_ORDER[b.riskScore])
    .slice(0, limit);
}

export function enrichAnalysisResult(
  partial: Partial<AnalysisResult> & Pick<AnalysisResult, 'documentId' | 'filename' | 'analyzedAt' | 'rawText'>,
  language: 'id' | 'en' = 'id'
): AnalysisResult {
  const clauses = partial.clauses ?? [];
  const overallRisk = (partial.overallRisk as RiskLevel) ?? 'Sedang';

  return {
    documentId: partial.documentId,
    filename: partial.filename,
    analyzedAt: partial.analyzedAt,
    clauses,
    summary: partial.summary ?? '',
    overallRisk,
    groundingSources: partial.groundingSources ?? [],
    rawText: partial.rawText,
    verdict: partial.verdict ?? deriveVerdict(clauses, language),
    recommendedActions:
      partial.recommendedActions ?? deriveRecommendedActions(clauses, language),
    contractType: partial.contractType,
    keyDates: partial.keyDates ?? [],
    umkmFriendliness: partial.umkmFriendliness,
  };
}
