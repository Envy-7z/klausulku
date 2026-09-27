import type {
  AnalysisResult,
  ChatMessage,
  ContractType,
  KeyDate,
  NegotiationChannel,
  RecommendedAction,
  RiskLevel,
  UmkmFriendliness,
  Verdict,
} from '../types';
import { enrichAnalysisResult } from '../utils/analysisHelpers';
import { withGeminiRetry } from '../utils/geminiClient';

const JSON_SCHEMA = `{
  "clauses": [
    {
      "number": "Pasal 1",
      "title": "Judul singkat klausul",
      "originalText": "Teks asli dari dokumen",
      "riskScore": "Rendah|Sedang|Tinggi",
      "explanation": "Penjelasan dalam bahasa sederhana untuk UMKM",
      "flags": ["flag1", "flag2"],
      "negotiationTip": "Saran singkat cara negosiasi klausul ini",
      "plainImpact": "Dampak konkret jika klausul ini diterima apa adanya",
      "suggestedRevision": "Usulan redaksi alternatif yang lebih adil untuk UMKM"
    }
  ],
  "summary": "Ringkasan keseluruhan dokumen dalam 2-3 kalimat bahasa sederhana",
  "overallRisk": "Rendah|Sedang|Tinggi",
  "groundingSources": ["Referensi regulasi relevan"],
  "verdict": {
    "decision": "aman|negosiasi|jangan_tandatangani",
    "headline": "Keputusan singkat untuk UMKM",
    "reasoning": "Alasan keputusan dalam 1-2 kalimat"
  },
  "recommendedActions": [
    {
      "priority": "urgent|penting|opsional",
      "title": "Judul langkah",
      "description": "Deskripsi langkah konkret",
      "relatedClause": "Pasal X (opsional)"
    }
  ],
  "contractType": {
    "type": "sewa|mou|franchise|kerja|lainnya",
    "label": "Label tipe kontrak",
    "confidence": 0.85
  },
  "keyDates": [
    {
      "label": "Tenggat pembayaran",
      "type": "deadline|renewal|payment|term",
      "rawText": "Teks asli dari dokumen",
      "isoDate": "2026-06-01"
    }
  ],
  "umkmFriendliness": {
    "score": 65,
    "verdict": "Cukup memberatkan UMKM",
    "comparison": "Penalti 2x lebih ketat dari rata-rata kontrak sewa UMKM"
  }
}`;

const getAnalysisPrompt = (lang: 'id' | 'en') => {
  if (lang === 'en') {
    return `You are an experienced Indonesian legal expert for SME business contracts.

Tasks:
1. Analyze every clause with risk score (Rendah/Sedang/Tinggi), explanation, flags
2. For each clause add: negotiationTip, plainImpact, suggestedRevision
3. Provide verdict (aman/negosiasi/jangan_tandatangani) with headline and reasoning
4. Provide 3-5 recommendedActions (urgent/penting/opsional) — concrete next steps for the SME owner
5. Detect contractType (sewa/mou/franchise/kerja/lainnya)
6. Extract keyDates with isoDate when possible (YYYY-MM-DD)
7. Score umkmFriendliness 0-100 vs typical Indonesian SME contracts
8. List groundingSources (Indonesian regulations)

Verdict rules:
- jangan_tandatangani: 2+ Tinggi clauses OR heavy_penalty flag
- negosiasi: 1+ Tinggi OR 3+ Sedang
- aman: otherwise

IMPORTANT: Answer ONLY with valid JSON.

JSON Output Format:
${JSON_SCHEMA}`;
  }

  return `Anda adalah ahli hukum Indonesia berpengalaman untuk kontrak bisnis UMKM.

Tugas:
1. Analisis setiap klausul dengan risk score (Rendah/Sedang/Tinggi), penjelasan, flags
2. Untuk setiap klausul tambahkan: negotiationTip, plainImpact, suggestedRevision
3. Berikan verdict (aman/negosiasi/jangan_tandatangani) dengan headline dan reasoning
4. Berikan 3-5 recommendedActions (urgent/penting/opsional) — langkah konkret untuk pemilik UMKM
5. Deteksi contractType (sewa/mou/franchise/kerja/lainnya)
6. Ekstrak keyDates dengan isoDate jika memungkinkan (YYYY-MM-DD)
7. Skor umkmFriendliness 0-100 dibanding kontrak UMKM tipikal Indonesia
8. Daftar groundingSources (regulasi Indonesia)

Aturan verdict:
- jangan_tandatangani: 2+ klausul Tinggi ATAU flag penalti_besar/heavy_penalty
- negosiasi: 1+ Tinggi ATAU 3+ Sedang
- aman: selainnya

PENTING: Jawab HANYA dengan JSON valid.

Format output JSON:
${JSON_SCHEMA}`;
};

interface ParsedAnalysis {
  clauses?: AnalysisResult['clauses'];
  summary?: string;
  overallRisk?: string;
  groundingSources?: string[];
  verdict?: Verdict;
  recommendedActions?: RecommendedAction[];
  contractType?: ContractType;
  keyDates?: KeyDate[];
  umkmFriendliness?: UmkmFriendliness;
}

function parseAnalysisJson(rawText: string): ParsedAnalysis {
  const jsonMatch = rawText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Gagal memproses respons AI. Coba lagi.');
  }

  try {
    return JSON.parse(jsonMatch[0]) as ParsedAnalysis;
  } catch {
    throw new Error('Respons AI tidak valid. Silakan coba analisis ulang.');
  }
}

function buildResult(
  parsed: ParsedAnalysis,
  meta: { documentId: string; filename: string; analyzedAt: string; rawText: string },
  language: 'id' | 'en'
): AnalysisResult {
  return enrichAnalysisResult(
    {
      ...meta,
      clauses: parsed.clauses ?? [],
      summary: parsed.summary ?? '',
      overallRisk: (parsed.overallRisk as RiskLevel) ?? 'Sedang',
      groundingSources: parsed.groundingSources ?? [],
      verdict: parsed.verdict,
      recommendedActions: parsed.recommendedActions,
      contractType: parsed.contractType,
      keyDates: parsed.keyDates,
      umkmFriendliness: parsed.umkmFriendliness,
    },
    language
  );
}

export async function analyzeDocument(
  file: File,
  onProgress?: (msg: string) => void,
  language: 'id' | 'en' = 'id',
  existingDocumentId?: string
): Promise<AnalysisResult> {
  onProgress?.(language === 'id' ? 'Membaca dokumen...' : 'Reading document...');

  const base64 = await fileToBase64(file);
  const mimeType = file.type || 'application/pdf';

  onProgress?.(language === 'id' ? 'Menganalisis klausul dengan AI...' : 'Analyzing clauses with AI...');

  const model = 'gemini-2.5-flash';

  const response = await withGeminiRetry(
    (ai) =>
      ai.models.generateContent({
        model,
        contents: [
          {
            role: 'user',
            parts: [
              { inlineData: { mimeType, data: base64 } },
              {
                text:
                  language === 'id'
                    ? 'Analisis dokumen hukum ini secara menyeluruh. Berikan verdict, action plan, dan saran negosiasi untuk UMKM. Output JSON sesuai instruksi.'
                    : 'Analyze this legal document thoroughly. Provide verdict, action plan, and negotiation advice for SMEs. Output JSON as instructed.',
              },
            ],
          },
        ],
        config: {
          systemInstruction: getAnalysisPrompt(language),
          temperature: 0.1,
        },
      }),
    language
  );

  onProgress?.(language === 'id' ? 'Memproses hasil analisis...' : 'Processing results...');

  const rawText = response.text ?? '';
  const parsed = parseAnalysisJson(rawText);

  return buildResult(
    parsed,
    {
      documentId: existingDocumentId ?? crypto.randomUUID(),
      filename: file.name,
      analyzedAt: new Date().toISOString(),
      rawText,
    },
    language
  );
}

export async function analyzeDocumentFromText(
  sourceText: string,
  filename: string,
  onProgress?: (msg: string) => void,
  language: 'id' | 'en' = 'id',
  existingDocumentId?: string
): Promise<AnalysisResult> {
  onProgress?.(
    language === 'id' ? 'Menerjemahkan ulang analisis...' : 'Re-analyzing document...'
  );

  const model = 'gemini-2.5-flash';

  const response = await withGeminiRetry(
    (ai) =>
      ai.models.generateContent({
        model,
        contents: [
          {
            role: 'user',
            parts: [
              {
                text:
                  language === 'id'
                    ? `Berikut teks dokumen hukum:\n\n${sourceText}\n\nAnalisis lengkap dengan verdict dan action plan untuk UMKM. Output JSON sesuai instruksi.`
                    : `Legal document text:\n\n${sourceText}\n\nFull analysis with verdict and action plan for SMEs. Output JSON as instructed.`,
              },
            ],
          },
        ],
        config: {
          systemInstruction: getAnalysisPrompt(language),
          temperature: 0.1,
        },
      }),
    language
  );

  onProgress?.(language === 'id' ? 'Memproses hasil analisis...' : 'Processing results...');

  const rawText = response.text ?? '';
  const parsed = parseAnalysisJson(rawText);

  return buildResult(
    parsed,
    {
      documentId: existingDocumentId ?? crypto.randomUUID(),
      filename,
      analyzedAt: new Date().toISOString(),
      rawText,
    },
    language
  );
}

export function getDocumentSourceText(analysis: AnalysisResult): string {
  if (analysis.clauses.length > 0) {
    return analysis.clauses
      .map((c) => `${c.number}: ${c.title}\n${c.originalText}`)
      .join('\n\n');
  }
  return analysis.rawText;
}

export async function generateNegotiationDraft(
  analysis: AnalysisResult,
  channel: NegotiationChannel,
  language: 'id' | 'en' = 'id'
): Promise<string> {
  const model = 'gemini-2.5-flash';
  const highRisk = analysis.clauses.filter((c) => c.riskScore === 'Tinggi' || c.riskScore === 'Sedang');

  const channelGuide =
    channel === 'whatsapp'
      ? language === 'id'
        ? 'Format pesan WhatsApp singkat, ramah, profesional, max 300 kata.'
        : 'Short friendly WhatsApp message, professional, max 300 words.'
      : channel === 'email'
        ? language === 'id'
          ? 'Format email formal dengan subject line, salam, isi, penutup.'
          : 'Formal email with subject line, greeting, body, closing.'
        : language === 'id'
          ? 'Format addendum/perubahan kontrak dengan pasal-pasal yang perlu direvisi.'
          : 'Contract addendum format listing clauses to revise.';

  const prompt =
    language === 'id'
      ? `Buat draft ${channel} untuk negosiasi kontrak "${analysis.filename}".

Ringkasan: ${analysis.summary}
Verdict: ${analysis.verdict?.headline ?? analysis.overallRisk}

Klausul yang perlu dinegosiasi:
${highRisk.map((c) => `- ${c.number}: ${c.title} — ${c.negotiationTip ?? c.explanation}`).join('\n')}

${channelGuide}

Tulis draft siap kirim. Jangan gunakan markdown.`
      : `Create a ${channel} draft to negotiate contract "${analysis.filename}".

Summary: ${analysis.summary}
Verdict: ${analysis.verdict?.headline ?? analysis.overallRisk}

Clauses to negotiate:
${highRisk.map((c) => `- ${c.number}: ${c.title} — ${c.negotiationTip ?? c.explanation}`).join('\n')}

${channelGuide}

Write ready-to-send draft. No markdown.`;

  const response = await withGeminiRetry(
    (ai) =>
      ai.models.generateContent({
        model,
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: { temperature: 0.4 },
      }),
    language
  );

  return response.text?.trim() ?? '';
}

// ─── Chat ─────────────────────────────────────────────────────────────────────

export async function sendChatMessage(
  userMessage: string,
  analysis: AnalysisResult,
  history: ChatMessage[],
  language: 'id' | 'en' = 'id'
): Promise<string> {
  const model = 'gemini-2.5-flash';

  const systemInstruction =
    language === 'id'
      ? `Anda adalah ahli hukum Indonesia yang ramah dan membantu UMKM.

Dokumen: ${analysis.filename}
Verdict: ${analysis.verdict?.headline ?? 'Belum ada'}
Ringkasan: ${analysis.summary}

Klausul:
${analysis.clauses.map((c) => `[${c.number}] ${c.title} — ${c.riskScore}: ${c.explanation}`).join('\n')}

Jawab praktis, actionable, bahasa sederhana.`
      : `You are a friendly Indonesian legal expert helping SMEs.

Document: ${analysis.filename}
Verdict: ${analysis.verdict?.headline ?? 'N/A'}
Summary: ${analysis.summary}

Clauses:
${analysis.clauses.map((c) => `[${c.number}] ${c.title} — ${c.riskScore}: ${c.explanation}`).join('\n')}

Reply practically, actionable, simple language.`;

  const geminiHistory = history.map((msg) => ({
    role: msg.role === 'user' ? ('user' as const) : ('model' as const),
    parts: [{ text: msg.content }],
  }));

  return withGeminiRetry(async (ai) => {
    const chat = ai.chats.create({
      model,
      config: { systemInstruction, temperature: 0.3 },
      history: geminiHistory,
    });

    const response = await chat.sendMessage({ message: userMessage });
    return (
      response.text ??
      (language === 'id'
        ? 'Maaf, saya tidak bisa menjawab saat ini. Coba lagi.'
        : 'Sorry, I cannot answer right now. Please try again.')
    );
  }, language);
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
