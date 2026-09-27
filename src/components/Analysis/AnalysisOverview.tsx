import { CheckCircle2, AlertTriangle, FileText, XCircle } from 'lucide-react'
import type { AnalysisResult, VerdictDecision } from '../../types'
import RiskBadge from '../common/RiskBadge'
import { Card } from '../ui/Card'
import { cn } from '../../lib/utils'

interface AnalysisOverviewProps {
  analysis: AnalysisResult
}

const verdictStyles: Record<
  VerdictDecision,
  {
    accent: string
    iconBg: string
    iconColor: string
    headline: string
    reasoning: string
    Icon: typeof CheckCircle2
  }
> = {
  aman: {
    accent: 'border-l-emerald-500',
    iconBg: 'bg-emerald-100 dark:bg-emerald-950',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    headline: 'text-emerald-900 dark:text-emerald-100',
    reasoning: 'text-emerald-800/90 dark:text-emerald-200/90',
    Icon: CheckCircle2,
  },
  negosiasi: {
    accent: 'border-l-amber-500',
    iconBg: 'bg-amber-100 dark:bg-amber-950',
    iconColor: 'text-amber-600 dark:text-amber-400',
    headline: 'text-amber-900 dark:text-amber-100',
    reasoning: 'text-amber-800/90 dark:text-amber-200/90',
    Icon: AlertTriangle,
  },
  jangan_tandatangani: {
    accent: 'border-l-red-500',
    iconBg: 'bg-red-100 dark:bg-red-950',
    iconColor: 'text-red-600 dark:text-red-400',
    headline: 'text-red-900 dark:text-red-100',
    reasoning: 'text-red-800/90 dark:text-red-200/90',
    Icon: XCircle,
  },
}

function scoreTone(score: number) {
  if (score >= 70) return 'text-emerald-600 dark:text-emerald-400'
  if (score >= 40) return 'text-amber-600 dark:text-amber-400'
  return 'text-red-600 dark:text-red-400'
}

export default function AnalysisOverview({ analysis }: AnalysisOverviewProps) {
  const { clauses, verdict, umkmFriendliness, contractType } = analysis
  const rendah = clauses.filter((c) => c.riskScore === 'Rendah').length
  const sedang = clauses.filter((c) => c.riskScore === 'Sedang').length
  const tinggi = clauses.filter((c) => c.riskScore === 'Tinggi').length
  const total = clauses.length || 1
  const pRendah = Math.round((rendah / total) * 100)
  const pSedang = Math.round((sedang / total) * 100)
  const pTinggi = Math.round((tinggi / total) * 100)

  const decision = verdict?.decision ?? 'negosiasi'
  const style = verdictStyles[decision]
  const VerdictIcon = style.Icon

  return (
    <Card
      className={cn(
        'animate-fade-up overflow-hidden border-l-4 shadow-sm',
        style.accent
      )}
      id="analysis-overview"
    >
      <div className="p-5 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          {verdict && (
            <div className="flex min-w-0 flex-1 gap-4">
              <div
                className={cn(
                  'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl',
                  style.iconBg,
                  style.iconColor
                )}
              >
                <VerdictIcon className="h-6 w-6" strokeWidth={2.25} />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  Keputusan AI
                </p>
                <h2
                  className={cn(
                    'mt-1 text-balance text-lg font-bold leading-snug sm:text-xl',
                    style.headline
                  )}
                >
                  {verdict.headline}
                </h2>
                <p className={cn('mt-2 text-sm leading-relaxed', style.reasoning)}>
                  {verdict.reasoning}
                </p>
              </div>
            </div>
          )}

          <div className="shrink-0 lg:max-w-xs lg:text-right">
            <div className="flex flex-wrap items-center gap-2 lg:justify-end">
              <FileText className="h-4 w-4 text-slate-400" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {analysis.filename}
              </span>
            </div>
            <div className="mt-2 flex flex-wrap gap-2 lg:justify-end">
              <RiskBadge level={analysis.overallRisk} />
              {contractType && (
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {contractType.label}
                </span>
              )}
            </div>
          </div>
        </div>

        <p className="mt-5 border-t border-slate-100 pt-5 text-sm leading-relaxed text-slate-600 dark:border-slate-800 dark:text-slate-400">
          {analysis.summary}
        </p>
      </div>

      <div className="grid grid-cols-2 divide-x divide-y divide-slate-100 border-t border-slate-100 bg-slate-50/80 dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900/40 sm:grid-cols-4 sm:divide-y-0">
        <MetricCell label="Total klausul" value={String(clauses.length)} />
        <MetricCell
          label="Risiko tinggi"
          value={String(tinggi)}
          valueClass={tinggi > 0 ? 'text-red-600 dark:text-red-400' : undefined}
        />
        {umkmFriendliness ? (
          <MetricCell
            label="Skor UMKM"
            value={`${Math.round(umkmFriendliness.score)}/100`}
            valueClass={scoreTone(umkmFriendliness.score)}
            hint={umkmFriendliness.verdict}
          />
        ) : (
          <MetricCell label="Risiko sedang" value={String(sedang)} />
        )}
        <div className="col-span-2 p-4 sm:col-span-1">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Distribusi risiko
          </p>
          <div className="mt-2 flex h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
            {pRendah > 0 && (
              <div className="bg-emerald-500" style={{ width: `${pRendah}%` }} />
            )}
            {pSedang > 0 && (
              <div className="bg-amber-500" style={{ width: `${pSedang}%` }} />
            )}
            {pTinggi > 0 && <div className="bg-red-500" style={{ width: `${pTinggi}%` }} />}
          </div>
          <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
            {pRendah}% aman · {pSedang}% hati-hati · {pTinggi}% bahaya
          </p>
        </div>
      </div>
    </Card>
  )
}

function MetricCell({
  label,
  value,
  valueClass,
  hint,
}: {
  label: string
  value: string
  valueClass?: string
  hint?: string
}) {
  return (
    <div className="p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p
        className={cn(
          'mt-1 text-2xl font-bold tabular-nums text-slate-900 dark:text-white',
          valueClass
        )}
      >
        {value}
      </p>
      {hint && (
        <p className="mt-1 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">{hint}</p>
      )}
    </div>
  )
}
