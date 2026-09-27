import { MessageSquare } from 'lucide-react'
import type { Clause } from '../../types'
import { getTopRiskClauses } from '../../utils/analysisHelpers'
import RiskBadge from '../common/RiskBadge'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'

interface TopRisksPanelProps {
  clauses: Clause[]
  onAskAbout: (clause: Clause) => void
}

export default function TopRisksPanel({ clauses, onAskAbout }: TopRisksPanelProps) {
  const topRisks = getTopRiskClauses(clauses, 3).filter(
    (c) => c.riskScore === 'Tinggi' || c.riskScore === 'Sedang'
  )

  if (topRisks.length === 0) return null

  return (
    <div className="animate-fade-up space-y-3" id="top-risks-panel">
      <div>
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">
          Klausul Paling Berbahaya
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Fokuskan negosiasi pada pasal ini
        </p>
      </div>

      <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
        {topRisks.map((clause) => (
          <Card
            key={clause.number}
            className="flex flex-col border-slate-200/90 p-4 dark:border-slate-700"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <span className="text-xs font-semibold text-brand-600 dark:text-brand-400">
                  {clause.number}
                </span>
                <h4 className="font-semibold text-slate-900 dark:text-white">{clause.title}</h4>
              </div>
              <RiskBadge level={clause.riskScore} size="sm" />
            </div>

            {clause.plainImpact && (
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                <span className="font-medium">Dampak: </span>
                {clause.plainImpact}
              </p>
            )}

            {clause.negotiationTip && (
              <p className="mt-2 text-sm text-amber-800 dark:text-amber-200">
                <span className="font-medium">Saran negosiasi: </span>
                {clause.negotiationTip}
              </p>
            )}

            <Button
              variant="ghost"
              size="sm"
              className="mt-auto pt-3 h-8 w-full justify-start px-0 text-xs text-brand-600 hover:text-brand-700 dark:text-brand-400"
              onClick={() => onAskAbout(clause)}
            >
              <MessageSquare className="h-3.5 w-3.5" />
              Tanya AI tentang pasal ini
            </Button>
          </Card>
        ))}
      </div>
    </div>
  )
}
