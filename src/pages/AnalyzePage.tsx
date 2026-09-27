import { lazy, Suspense, useEffect, useState } from 'react'
import {
  ArrowLeft,
  Download,
  ExternalLink,
  Loader2,
  MessageSquare,
  Plus,
  AlertTriangle,
} from 'lucide-react'
import type { AnalysisResult, Clause, DocumentStatus, SavedDocument } from '../types'
import {
  analyzeDocument,
  analyzeDocumentFromText,
  getDocumentSourceText,
} from '../services/gemini'
import { saveDocument } from '../services/db'
import { useAuth } from '../contexts/AuthContext'
import { enrichAnalysisResult } from '../utils/analysisHelpers'
import DocumentUpload from '../components/Upload/DocumentUpload'
import ClauseCard from '../components/Analysis/ClauseCard'
import RiskHeatmap from '../components/Analysis/RiskHeatmap'
import ChatPanel from '../components/Chat/ChatPanel'
import AnalysisOverview from '../components/Analysis/AnalysisOverview'
import ActionPlanCard from '../components/Analysis/ActionPlanCard'
import TopRisksPanel from '../components/Analysis/TopRisksPanel'
import GuidedActions from '../components/Analysis/GuidedActions'
import SectionHeader from '../components/Analysis/SectionHeader'
import PlaybookChecklist from '../components/Analysis/PlaybookChecklist'
import KeyDatesCard from '../components/Analysis/KeyDatesCard'
import UmkmScoreCard from '../components/Analysis/UmkmScoreCard'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { cn } from '../lib/utils'

const NegotiationGenerator = lazy(
  () => import('../components/Analysis/NegotiationGenerator')
)

interface AnalyzePageProps {
  onGoHome: () => void
  existingDoc?: SavedDocument | null
}

export default function AnalyzePage({ onGoHome, existingDoc }: AnalyzePageProps) {
  const { user } = useAuth()
  const [status, setStatus] = useState<DocumentStatus>(existingDoc ? 'complete' : 'idle')
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(() =>
    existingDoc ? enrichAnalysisResult(existingDoc, 'id') : null
  )
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [error, setError] = useState('')
  const [progressMsg, setProgressMsg] = useState('')
  const [chatOpen, setChatOpen] = useState(false)
  const [chatSeed, setChatSeed] = useState<string | null>(null)
  const [negotiationOpen, setNegotiationOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [language, setLanguage] = useState<'id' | 'en'>('id')
  const [isReanalyzing, setIsReanalyzing] = useState(false)
  const [exportError, setExportError] = useState('')
  const [reanalyzeError, setReanalyzeError] = useState('')

  // Safety net: remove html2pdf overlays if export fails and leaves ghost layer
  useEffect(() => {
    return () => {
      void import('../utils/pdfExport').then(({ cleanupPdfArtifacts }) => cleanupPdfArtifacts())
    }
  }, [])

  useEffect(() => {
    if (!exportError) return
    void import('../utils/pdfExport').then(({ cleanupPdfArtifacts }) => cleanupPdfArtifacts())
  }, [exportError])

  const reset = () => {
    setStatus('idle')
    setAnalysis(null)
    setUploadedFile(null)
    setError('')
    setExportError('')
    setChatOpen(false)
    setChatSeed(null)
    setNegotiationOpen(false)
    setIsReanalyzing(false)
  }

  const openChatWithSeed = (prompt: string) => {
    setChatSeed(prompt)
    setChatOpen(true)
  }

  const handleAskAboutClause = (clause: Clause) => {
    openChatWithSeed(
      language === 'id'
        ? `Jelaskan ${clause.number} (${clause.title}) — mengapa risikonya ${clause.riskScore}? Apa saran negosiasinya?`
        : `Explain ${clause.number} (${clause.title}) — why is it ${clause.riskScore} risk? Negotiation advice?`
    )
  }

  const [saveWarning, setSaveWarning] = useState('')

  const persistAnalysis = async (result: AnalysisResult) => {
    if (!user) return
    setSaveWarning('')
    try {
      await saveDocument(user.uid, result)
    } catch (err) {
      const msg = err instanceof Error ? err.message : ''
      console.error('Gagal menyimpan ke Firestore', err)
      setSaveWarning(
        msg.includes('permission') || msg.includes('insufficient')
          ? 'Analisis berhasil, tapi gagal disimpan ke Dashboard. Deploy ulang Firestore rules (lihat DEPLOY.md) lalu coba login ulang.'
          : 'Analisis berhasil, tapi gagal disimpan ke riwayat. Coba lagi nanti.'
      )
    }
  }

  const handleFile = async (file: File) => {
    setStatus('analyzing')
    setError('')
    setSaveWarning('')
    setAnalysis(null)
    setChatOpen(false)
    setUploadedFile(file)
    try {
      const result = await analyzeDocument(file, setProgressMsg, language)
      setAnalysis(result)
      setStatus('complete')
      await persistAnalysis(result)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan. Coba lagi.'
      setError(msg)
      setStatus('error')
    }
  }

  const runReanalysis = async (lang: 'id' | 'en', current: AnalysisResult) => {
    setIsReanalyzing(true)
    setError('')
    setReanalyzeError('')
    setChatOpen(false)
    setProgressMsg(
      lang === 'id' ? 'Menerjemahkan ulang analisis...' : 'Re-analyzing in English...'
    )

    try {
      let result: AnalysisResult

      if (uploadedFile) {
        result = await analyzeDocument(
          uploadedFile,
          setProgressMsg,
          lang,
          current.documentId
        )
      } else {
        const sourceText = getDocumentSourceText(current)
        if (!sourceText.trim()) {
          throw new Error(
            lang === 'id'
              ? 'Teks dokumen tidak tersedia untuk dianalisis ulang.'
              : 'Document text unavailable for re-analysis.'
          )
        }
        result = await analyzeDocumentFromText(
          sourceText,
          current.filename,
          setProgressMsg,
          lang,
          current.documentId
        )
      }

      setAnalysis(result)
      setLanguage(lang)
      setStatus('complete')
      await persistAnalysis(result)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan. Coba lagi.'
      setReanalyzeError(msg)
    } finally {
      setIsReanalyzing(false)
      setProgressMsg('')
    }
  }

  const handleLanguageChange = async (lang: 'id' | 'en') => {
    if (lang === language || isReanalyzing) return

    if (status === 'complete' && analysis) {
      await runReanalysis(lang, analysis)
      return
    }

    setLanguage(lang)
  }

  const handleExport = async () => {
    if (!analysis) return
    setIsExporting(true)
    setExportError('')
    try {
      const { generatePdfReport } = await import('../utils/pdfExport')
      await generatePdfReport(analysis)
    } catch (e) {
      console.error(e)
      setExportError(
        e instanceof Error ? e.message : 'Gagal mengekspor PDF. Coba lagi.'
      )
    } finally {
      const { cleanupPdfArtifacts } = await import('../utils/pdfExport')
      cleanupPdfArtifacts()
      setIsExporting(false)
    }
  }

  const langToggle = (
    <div
      className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-0.5 dark:border-slate-700 dark:bg-slate-900"
      title={
        status === 'complete'
          ? 'Ubah bahasa — AI akan analisis ulang (~30 detik)'
          : 'Bahasa analisis'
      }
    >
      {(['id', 'en'] as const).map((lang) => (
        <button
          key={lang}
          type="button"
          className={cn(
            'rounded-md px-3 py-1.5 text-xs font-semibold uppercase transition-colors disabled:opacity-50',
            language === lang
              ? 'bg-brand-600 text-white'
              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
          )}
          onClick={() => void handleLanguageChange(lang)}
          disabled={isReanalyzing || status === 'analyzing'}
        >
          {lang}
        </button>
      ))}
      {isReanalyzing && <Loader2 className="h-3.5 w-3.5 animate-spin text-brand-600" />}
    </div>
  )

  return (
    <div className="mesh-bg flex min-h-0 flex-1 flex-col lg:flex-row lg:items-start">
      <div className="min-w-0 flex-1 py-8">
        <div className="container-app">
          {/* Header */}
          <div className="animate-fade-up mb-8 flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={onGoHome} id="back-btn">
                <ArrowLeft className="h-4 w-4" />
                Kembali
              </Button>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                {status === 'complete' ? 'Hasil Analisis' : 'Analisis Kontrak'}
              </h1>
            </div>

            {(status === 'idle' || status === 'analyzing') && (
              <div className="flex flex-wrap items-center gap-2 sm:justify-end">{langToggle}</div>
            )}

            {status === 'complete' && analysis && (
              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant={chatOpen ? 'default' : 'secondary'}
                    size="sm"
                    onClick={() => setChatOpen(!chatOpen)}
                    id="chat-toggle-btn"
                    disabled={isReanalyzing}
                  >
                    <MessageSquare className="h-4 w-4" />
                    {chatOpen ? 'Tutup Chat' : 'Tanya AI'}
                  </Button>
                  {langToggle}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleExport}
                    disabled={isExporting || isReanalyzing}
                  >
                    {isExporting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4" />
                    )}
                    Export PDF
                  </Button>
                  {!existingDoc && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={reset}
                      id="new-analysis-btn"
                      disabled={isReanalyzing}
                    >
                      <Plus className="h-4 w-4" />
                      Baru
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>

          {isReanalyzing && (
            <div className="mb-6 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-900 dark:border-brand-800 dark:bg-brand-950/40 dark:text-brand-100">
              <p className="flex items-center gap-2 font-medium">
                <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
                {progressMsg || 'Menganalisis ulang...'}
              </p>
              <p className="mt-1 text-xs opacity-80">
                Bahasa analisis akan berubah setelah selesai (~30 detik). Jangan tutup halaman.
              </p>
            </div>
          )}

          {reanalyzeError && status === 'complete' && (
            <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100">
              Gagal ubah bahasa: {reanalyzeError}
            </div>
          )}

          {/* Upload */}
          {(status === 'idle' || status === 'analyzing') && (
            <div className="mx-auto max-w-2xl animate-fade-up">
              <p className="mb-6 text-center text-slate-600 dark:text-slate-400">
                Upload kontrak sewa, perjanjian kerja sama, atau dokumen hukum lainnya.
                AI akan menganalisis setiap klausul dan memberikan risk assessment.
              </p>
              <DocumentUpload onFileSelected={handleFile} isLoading={status === 'analyzing'} />
              {status === 'analyzing' && progressMsg && (
                <p className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <Loader2 className="h-4 w-4 animate-spin text-brand-600" />
                  {progressMsg}
                </p>
              )}
            </div>
          )}

          {/* Error */}
          {status === 'error' && (
            <Card className="mx-auto max-w-md animate-fade-up p-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/50">
                <AlertTriangle className="h-7 w-7 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Analisis Gagal</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{error}</p>
              <Button className="mt-6" onClick={reset} id="retry-btn">
                Coba Lagi
              </Button>
            </Card>
          )}

          {/* Results */}
          {status === 'complete' && analysis && (
            <div
              className={cn(
                'space-y-6 animate-fade-up',
                isReanalyzing && 'pointer-events-none opacity-60'
              )}
            >
              {saveWarning && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100">
                  {saveWarning}
                </div>
              )}

              {exportError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
                  {exportError}
                </div>
              )}

              <AnalysisOverview analysis={analysis} />

              {!chatOpen && (
                <GuidedActions
                  onAction={openChatWithSeed}
                  onNegotiate={() => setNegotiationOpen(true)}
                  disabled={isReanalyzing}
                />
              )}

              <div className="grid gap-8 xl:grid-cols-12">
                <div className="space-y-8 xl:col-span-8">
                  {analysis.recommendedActions && analysis.recommendedActions.length > 0 && (
                    <ActionPlanCard
                      actions={analysis.recommendedActions}
                      verdictDecision={analysis.verdict?.decision}
                    />
                  )}

                  <TopRisksPanel clauses={analysis.clauses} onAskAbout={handleAskAboutClause} />
                </div>

                <aside className="space-y-4 xl:col-span-4 xl:col-start-9 xl:row-span-2 xl:row-start-1 xl:sticky xl:top-24 xl:self-start">
                  <RiskHeatmap analysis={analysis} />

                  {analysis.umkmFriendliness && (
                    <UmkmScoreCard umkmFriendliness={analysis.umkmFriendliness} />
                  )}

                  <PlaybookChecklist analysis={analysis} />

                  {analysis.keyDates && analysis.keyDates.length > 0 && (
                    <KeyDatesCard
                      keyDates={analysis.keyDates}
                      documentTitle={analysis.filename}
                    />
                  )}

                  {analysis.groundingSources.length > 0 && (
                    <Card className="animate-fade-up p-5">
                      <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
                        Referensi Regulasi
                      </h3>
                      <ul className="space-y-2">
                        {analysis.groundingSources.map((src, i) => (
                          <li key={i}>
                            <a
                              href={src.startsWith('http') ? src : '#'}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-start gap-2 text-sm text-brand-600 hover:text-brand-700 hover:underline dark:text-brand-400 dark:hover:text-brand-300"
                            >
                              <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                              <span className="break-all">{src}</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </Card>
                  )}
                </aside>

                <section
                  className="section-anchor space-y-4 xl:col-span-8"
                  id="clause-analysis"
                >
                  <SectionHeader
                    title="Analisis Klausul"
                    subtitle="Buka setiap pasal untuk penjelasan lengkap"
                    badge={`${analysis.clauses.length} klausul`}
                  />
                  <div className="space-y-3">
                    {analysis.clauses.map((clause, i) => (
                      <ClauseCard
                        key={`${analysis.documentId}-${i}`}
                        clause={clause}
                        index={i}
                      />
                    ))}
                  </div>
                </section>
              </div>
            </div>
          )}
        </div>
      </div>

      {chatOpen && analysis && (
        <ChatPanel
          key={`${analysis.documentId}-${language}-${chatSeed ?? 'default'}`}
          analysis={analysis}
          isOpen={chatOpen}
          onClose={() => {
            setChatOpen(false)
            setChatSeed(null)
          }}
          language={language}
          initialMessages={existingDoc?.chatHistory}
          userId={user?.uid}
          seedPrompt={chatSeed}
          onSeedConsumed={() => setChatSeed(null)}
        />
      )}

      {analysis && (
        <Suspense fallback={null}>
          <NegotiationGenerator
            analysis={analysis}
            language={language}
            open={negotiationOpen}
            onClose={() => setNegotiationOpen(false)}
          />
        </Suspense>
      )}
    </div>
  )
}
