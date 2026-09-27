import type { UmkmFriendliness } from '../../types'
import { Card } from '../ui/Card'
import { cn } from '../../lib/utils'

interface UmkmScoreCardProps {
  umkmFriendliness: UmkmFriendliness
}

function scoreColor(score: number) {
  if (score >= 70) return 'text-emerald-600 dark:text-emerald-400'
  if (score >= 40) return 'text-amber-600 dark:text-amber-400'
  return 'text-red-600 dark:text-red-400'
}

function barColor(score: number) {
  if (score >= 70) return 'bg-emerald-500'
  if (score >= 40) return 'bg-amber-500'
  return 'bg-red-500'
}

export default function UmkmScoreCard({ umkmFriendliness }: UmkmScoreCardProps) {
  const { score, verdict, comparison } = umkmFriendliness

  return (
    <Card className="animate-fade-up p-5" id="umkm-score-card">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
        Skor UMKM-Friendliness
      </h3>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
        Seberapa adil kontrak ini untuk pelaku UMKM
      </p>

      <div className="mt-4 flex items-end gap-3">
        <span className={cn('text-4xl font-extrabold tabular-nums', scoreColor(score))}>
          {Math.round(score)}
        </span>
        <span className="mb-1 text-sm text-slate-500">/ 100</span>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div
          className={cn('h-full rounded-full transition-all', barColor(score))}
          style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
        />
      </div>

      <p className="mt-3 text-sm font-medium text-slate-800 dark:text-slate-200">{verdict}</p>
      <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
        {comparison}
      </p>
    </Card>
  )
}
