import { AlertCircle } from 'lucide-react'
import type { RecommendedAction, VerdictDecision } from '../../types'
import { Card } from '../ui/Card'
import { cn } from '../../lib/utils'

interface ActionPlanCardProps {
  actions: RecommendedAction[]
  verdictDecision?: VerdictDecision
}

const PRIORITY_ORDER = { urgent: 0, penting: 1, opsional: 2 } as const

const priorityStyles = {
  urgent: 'border-l-red-500 bg-red-50/50 dark:bg-red-950/20',
  penting: 'border-l-amber-500 bg-amber-50/30 dark:bg-amber-950/20',
  opsional: 'border-l-slate-300 bg-slate-50/50 dark:bg-slate-900/30',
}

const priorityLabels = {
  urgent: 'Segera',
  penting: 'Penting',
  opsional: 'Opsional',
}

export default function ActionPlanCard({ actions, verdictDecision }: ActionPlanCardProps) {
  const sorted = [...actions].sort(
    (a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
  )

  return (
    <Card className="animate-fade-up p-5" id="action-plan-card">
      <h3 className="text-base font-semibold text-slate-900 dark:text-white">Langkah Selanjutnya</h3>
      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
        Prioritas sebelum menandatangani
      </p>

      <ol className="mt-4 space-y-2.5">
        {sorted.map((action, i) => (
          <li
            key={`${action.title}-${i}`}
            className={cn(
              'flex gap-3 rounded-lg border-l-4 p-3',
              priorityStyles[action.priority]
            )}
          >
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-[10px] font-bold text-slate-700 shadow-sm dark:bg-slate-800 dark:text-slate-200">
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  {action.title}
                </span>
                <span className="rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                  {priorityLabels[action.priority]}
                </span>
                {action.relatedClause && (
                  <span className="rounded-md bg-brand-100 px-2 py-0.5 text-xs font-medium text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                    {action.relatedClause}
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                {action.description}
              </p>
            </div>
          </li>
        ))}
      </ol>

      {verdictDecision === 'jangan_tandatangani' && (
        <div className="mt-4 flex gap-3 rounded-lg border border-red-200 bg-red-50/80 p-3 dark:border-red-900 dark:bg-red-950/30">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />
          <div className="text-sm">
            <p className="font-semibold text-red-900 dark:text-red-100">Butuh bantuan hukum?</p>
            <p className="mt-1 text-red-800/90 dark:text-red-200/80">
              Pertimbangkan konsultasi dengan LBH, Posbakum, atau notaris sebelum menandatangani.
              KlausulKu memberikan informasi, bukan nasihat hukum resmi.
            </p>
            <div className="mt-2 flex flex-wrap gap-3 text-xs font-medium">
              <a
                href="https://lbh.or.id"
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-700 underline hover:text-red-900 dark:text-red-300"
              >
                LBH Indonesia
              </a>
              <a
                href="https://www.kemenkumham.go.id"
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-700 underline hover:text-red-900 dark:text-red-300"
              >
                Kemenkumham
              </a>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
