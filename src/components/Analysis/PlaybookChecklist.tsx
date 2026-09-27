import { CheckCircle2, Circle } from 'lucide-react'
import type { AnalysisResult } from '../../types'
import { checkPlaybookItem, getPlaybook } from '../../data/playbooks'
import { Card } from '../ui/Card'
import { cn } from '../../lib/utils'

interface PlaybookChecklistProps {
  analysis: AnalysisResult
}

export default function PlaybookChecklist({ analysis }: PlaybookChecklistProps) {
  const type = analysis.contractType?.type ?? 'lainnya'
  const playbook = getPlaybook(type)
  const clauseTexts = analysis.clauses.flatMap((c) => [
    c.title,
    c.originalText,
    c.explanation,
    ...c.flags,
  ])

  const checkedCount = playbook.items.filter((item) =>
    checkPlaybookItem(item, clauseTexts)
  ).length

  return (
    <Card className="animate-fade-up p-5" id="playbook-checklist">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Playbook {playbook.label}
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{playbook.description}</p>
        </div>
        {analysis.contractType && (
          <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-950 dark:text-brand-300">
            {analysis.contractType.label}
            {analysis.contractType.confidence >= 0.7 &&
              ` (${Math.round(analysis.contractType.confidence * 100)}%)`}
          </span>
        )}
      </div>

      <p className="mt-3 text-xs font-medium text-slate-600 dark:text-slate-400">
        {checkedCount}/{playbook.items.length} poin teridentifikasi di dokumen
      </p>

      <ul className="mt-4 space-y-2">
        {playbook.items.map((item) => {
          const found = checkPlaybookItem(item, clauseTexts)
          return (
            <li
              key={item.id}
              className={cn(
                'flex items-start gap-2.5 rounded-lg px-2 py-1.5 text-sm',
                found
                  ? 'text-emerald-800 dark:text-emerald-200'
                  : 'text-slate-600 dark:text-slate-400'
              )}
            >
              {found ? (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
              ) : (
                <Circle className="mt-0.5 h-4 w-4 shrink-0 text-slate-300 dark:text-slate-600" />
              )}
              <span>{item.label}</span>
            </li>
          )
        })}
      </ul>
    </Card>
  )
}
