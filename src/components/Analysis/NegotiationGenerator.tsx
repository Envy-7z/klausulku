import { ClipboardCopy, Loader2, Mail, MessageCircle, FileEdit, X } from 'lucide-react'
import { useState } from 'react'
import type { AnalysisResult, NegotiationChannel } from '../../types'
import { generateNegotiationDraft } from '../../services/gemini'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { cn } from '../../lib/utils'

interface NegotiationGeneratorProps {
  analysis: AnalysisResult
  language: 'id' | 'en'
  open: boolean
  onClose: () => void
}

const CHANNELS: { id: NegotiationChannel; label: string; icon: typeof Mail }[] = [
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
  { id: 'email', label: 'Email', icon: Mail },
  { id: 'addendum', label: 'Addendum', icon: FileEdit },
]

export default function NegotiationGenerator({
  analysis,
  language,
  open,
  onClose,
}: NegotiationGeneratorProps) {
  const [channel, setChannel] = useState<NegotiationChannel>('whatsapp')
  const [draft, setDraft] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  const generate = async (ch: NegotiationChannel) => {
    setChannel(ch)
    setLoading(true)
    setError('')
    setDraft('')
    try {
      const text = await generateNegotiationDraft(analysis, ch, language)
      setDraft(text)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal membuat draft.')
    } finally {
      setLoading(false)
    }
  }

  const copy = async () => {
    if (!draft) return
    await navigator.clipboard.writeText(draft)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!open) return null

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-[90] bg-black/50"
        onClick={onClose}
        aria-label="Tutup"
      />
      <Card className="fixed left-1/2 top-1/2 z-[95] flex max-h-[85vh] w-[min(560px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <h3 className="font-semibold text-slate-900 dark:text-white">Generator Pesan Negosiasi</h3>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Tutup">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex gap-1 border-b border-slate-100 p-2 dark:border-slate-800">
          {CHANNELS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              className={cn(
                'flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-xs font-medium transition-colors sm:text-sm',
                channel === id
                  ? 'bg-brand-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
              )}
              onClick={() => generate(id)}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          {!draft && !loading && !error && (
            <div className="text-center py-8">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Pilih format pesan untuk generate draft negosiasi otomatis.
              </p>
              <Button className="mt-4" onClick={() => generate('whatsapp')}>
                Generate WhatsApp
              </Button>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center gap-3 py-12 text-slate-500">
              <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
              <p className="text-sm">Menyusun draft negosiasi...</p>
            </div>
          )}

          {error && (
            <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300">
              {error}
            </p>
          )}

          {draft && !loading && (
            <pre className="whitespace-pre-wrap rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
              {draft}
            </pre>
          )}
        </div>

        {draft && (
          <div className="border-t border-slate-200 p-4 dark:border-slate-800">
            <Button className="w-full" variant="secondary" onClick={copy}>
              <ClipboardCopy className="h-4 w-4" />
              {copied ? 'Tersalin!' : 'Salin ke Clipboard'}
            </Button>
          </div>
        )}
      </Card>
    </>
  )
}
