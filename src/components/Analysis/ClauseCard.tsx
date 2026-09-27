import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import type { Clause } from '../../types'
import RiskBadge from '../common/RiskBadge'
import { Card } from '../ui/Card'
import { cn } from '../../lib/utils'

interface ClauseCardProps {
  clause: Clause
  index: number
}

const riskBorder: Record<string, string> = {
  rendah: 'border-l-emerald-500',
  sedang: 'border-l-amber-500',
  tinggi: 'border-l-red-500',
}

export default function ClauseCard({ clause, index }: ClauseCardProps) {
  const [expanded, setExpanded] = useState(false)
  const borderClass = riskBorder[clause.riskScore.toLowerCase()] ?? 'border-l-slate-300'

  return (
    <Card
      className={cn(
        'animate-fade-up overflow-hidden border-l-4 transition-shadow hover:shadow-md',
        borderClass
      )}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <button
        type="button"
        className="flex w-full items-start justify-between gap-4 p-5 text-left"
        onClick={() => setExpanded(!expanded)}
        id={`clause-${index}`}
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {clause.number}
            </span>
            {clause.flags.slice(0, 2).map((f, i) => (
              <span
                key={i}
                className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
              >
                {f.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
          <h3 className="mt-2 font-semibold text-slate-900 dark:text-white">{clause.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{clause.explanation}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <RiskBadge level={clause.riskScore} />
          <ChevronDown
            className={cn(
              'h-5 w-5 text-slate-400 transition-transform',
              expanded && 'rotate-180'
            )}
          />
        </div>
      </button>

      {expanded && (
        <div className="animate-fade-up border-t border-slate-100 bg-slate-50/80 px-5 py-4 dark:border-slate-800 dark:bg-slate-900/50">
          <div className={cn('grid gap-4', clause.suggestedRevision && 'md:grid-cols-2')}>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Teks Asli
              </p>
              <blockquote className="rounded-lg border border-slate-200 bg-white p-4 text-sm italic leading-relaxed text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300">
                {clause.originalText}
              </blockquote>
            </div>
            {clause.suggestedRevision && (
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-400">
                  Usulan Revisi (Lebih Adil untuk UMKM)
                </p>
                <blockquote className="rounded-lg border border-brand-200 bg-brand-50/50 p-4 text-sm leading-relaxed text-slate-800 dark:border-brand-800 dark:bg-brand-950/30 dark:text-slate-200">
                  {clause.suggestedRevision}
                </blockquote>
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  )
}
