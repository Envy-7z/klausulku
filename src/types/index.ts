export type RiskLevel = 'Rendah' | 'Sedang' | 'Tinggi';

export type VerdictDecision = 'aman' | 'negosiasi' | 'jangan_tandatangani';

export type ActionPriority = 'urgent' | 'penting' | 'opsional';

export type KeyDateType = 'deadline' | 'renewal' | 'payment' | 'term';

export type ContractTypeId = 'sewa' | 'mou' | 'franchise' | 'kerja' | 'lainnya';

export type NegotiationChannel = 'whatsapp' | 'email' | 'addendum';

export interface Clause {
  number: string;
  title: string;
  originalText: string;
  riskScore: RiskLevel;
  explanation: string;
  flags: string[];
  negotiationTip?: string;
  plainImpact?: string;
  suggestedRevision?: string;
}

export interface Verdict {
  decision: VerdictDecision;
  headline: string;
  reasoning: string;
}

export interface RecommendedAction {
  priority: ActionPriority;
  title: string;
  description: string;
  relatedClause?: string;
}

export interface KeyDate {
  label: string;
  type: KeyDateType;
  rawText: string;
  isoDate?: string;
}

export interface ContractType {
  type: ContractTypeId;
  label: string;
  confidence: number;
}

export interface UmkmFriendliness {
  score: number;
  verdict: string;
  comparison: string;
}

export interface AnalysisResult {
  documentId: string;
  filename: string;
  analyzedAt: string;
  clauses: Clause[];
  summary: string;
  overallRisk: RiskLevel;
  groundingSources: string[];
  rawText: string;
  verdict?: Verdict;
  recommendedActions?: RecommendedAction[];
  contractType?: ContractType;
  keyDates?: KeyDate[];
  umkmFriendliness?: UmkmFriendliness;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface SavedDocument extends AnalysisResult {
  userId: string;
  chatHistory: ChatMessage[];
}

export type DocumentStatus = 'idle' | 'uploading' | 'analyzing' | 'complete' | 'error';

export interface DocumentState {
  status: DocumentStatus;
  file: File | null;
  analysis: AnalysisResult | null;
  error: string | null;
}
