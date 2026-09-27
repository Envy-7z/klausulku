import { ArrowRight, BookOpen, FileText, Scale } from 'lucide-react'
import { PLAYBOOKS } from '../data/playbooks'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'

interface TemplatesPageProps {
  onStartAnalysis: () => void
  onGoHome: () => void
}

export default function TemplatesPage({ onStartAnalysis, onGoHome }: TemplatesPageProps) {
  return (
    <div className="mesh-bg flex-1 py-10">
      <div className="container-app animate-fade-up">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100 dark:bg-brand-950">
            <BookOpen className="h-7 w-7 text-brand-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
            Template & Playbook Kontrak UMKM
          </h1>
          <p className="mt-3 text-slate-600 dark:text-slate-400">
            Panduan checklist untuk setiap jenis kontrak. Upload dokumen Anda untuk cek otomatis
            dengan AI.
          </p>
          <Button className="mt-6" onClick={onStartAnalysis}>
            <FileText className="h-4 w-4" />
            Analisis Kontrak Saya
          </Button>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PLAYBOOKS.map((playbook) => (
            <Card key={playbook.type} className="flex flex-col p-5">
              <div className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-brand-600" />
                <h2 className="font-semibold text-slate-900 dark:text-white">{playbook.label}</h2>
              </div>
              <p className="mt-2 flex-1 text-sm text-slate-600 dark:text-slate-400">
                {playbook.description}
              </p>
              <ul className="mt-4 space-y-1.5 border-t border-slate-100 pt-4 dark:border-slate-800">
                {playbook.items.slice(0, 4).map((item) => (
                  <li key={item.id} className="text-xs text-slate-500 dark:text-slate-400">
                    • {item.label}
                  </li>
                ))}
                {playbook.items.length > 4 && (
                  <li className="text-xs text-slate-400">+{playbook.items.length - 4} poin lainnya</li>
                )}
              </ul>
            </Card>
          ))}
        </div>

        <Card className="mx-auto mt-10 max-w-2xl p-6 text-center">
          <h3 className="font-semibold text-slate-900 dark:text-white">
            Punya kontrak untuk dicek?
          </h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Upload PDF atau foto — AI akan deteksi tipe kontrak dan cocokkan dengan playbook
            di atas.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Button onClick={onStartAnalysis}>
              Mulai Analisis
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="secondary" onClick={onGoHome}>
              Kembali
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
