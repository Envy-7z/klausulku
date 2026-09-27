import { useEffect, useState } from 'react'
import { AlertCircle, FileText, Loader2, Plus } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { getDocumentsByUser } from '../services/db'
import type { SavedDocument } from '../types'
import RiskBadge from '../components/common/RiskBadge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'

interface DashboardPageProps {
  onGoHome: () => void
  onOpenDocument: (doc: SavedDocument) => void
  onStartAnalysis: () => void
}

export default function DashboardPage({
  onGoHome,
  onOpenDocument,
  onStartAnalysis,
}: DashboardPageProps) {
  const { user } = useAuth()
  const [documents, setDocuments] = useState<SavedDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    if (!user) return

    let cancelled = false

    getDocumentsByUser(user.uid)
      .then((docs) => {
        if (cancelled) return
        setDocuments(docs)
        setLoadError('')
      })
      .catch((err: unknown) => {
        if (cancelled) return
        console.error('Gagal memuat dokumen', err)
        const code = (err as { code?: string })?.code
        setLoadError(
          code === 'failed-precondition'
            ? 'Indeks Firestore belum di-deploy. Jalankan: firebase deploy --only firestore:indexes'
            : code === 'permission-denied'
              ? 'Akses ditolak. Deploy ulang Firestore rules lalu login ulang.'
              : 'Gagal memuat riwayat analisis. Coba refresh halaman.'
        )
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [user])

  if (!user) {
    return (
      <div className="container-app flex flex-1 flex-col items-center justify-center py-20 text-center">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
          Silakan login terlebih dahulu untuk melihat dashboard.
        </h2>
        <Button className="mt-6" onClick={onGoHome}>
          Kembali ke Home
        </Button>
      </div>
    )
  }

  return (
    <div className="mesh-bg flex-1 py-10">
      <div className="container-app animate-fade-up">
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">Dashboard Saya</h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">Riwayat analisis kontrak Anda</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center gap-3 py-20 text-slate-500">
            <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
            <p>Memuat dokumen...</p>
          </div>
        ) : loadError ? (
          <Card className="mx-auto max-w-md p-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/50">
              <AlertCircle className="h-7 w-7 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Gagal Memuat</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{loadError}</p>
            <Button className="mt-6" onClick={() => window.location.reload()}>
              Coba Lagi
            </Button>
          </Card>
        ) : documents.length === 0 ? (
          <Card className="mx-auto max-w-md p-10 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50">
              <FileText className="h-7 w-7 text-brand-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Belum ada dokumen</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Anda belum pernah melakukan analisis kontrak. Silakan coba analisis dokumen pertama
              Anda.
            </p>
            <Button className="mt-6" onClick={onStartAnalysis}>
              <Plus className="h-4 w-4" />
              Mulai Analisis
            </Button>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {documents.map((doc) => (
              <Card
                key={doc.documentId}
                className="cursor-pointer p-5 transition-all hover:-translate-y-1 hover:border-brand-200 hover:shadow-md hover:shadow-brand-100/50"
                onClick={() => onOpenDocument(doc)}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-slate-500">
                    {new Date(doc.analyzedAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                  <RiskBadge level={doc.overallRisk} size="sm" />
                </div>
                <h3 className="mt-3 line-clamp-2 font-semibold text-slate-900 dark:text-white">{doc.filename}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">{doc.summary}</p>
                <p className="mt-4 text-xs font-medium text-slate-400">
                  {doc.clauses.length} klausul
                </p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
