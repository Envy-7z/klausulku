import type { AnalysisResult, RiskLevel } from '../../types'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import RiskBadge from '../common/RiskBadge'
import { cn } from '../../lib/utils'

interface RiskHeatmapProps {
  analysis: AnalysisResult
}

export default function RiskHeatmap({ analysis }: RiskHeatmapProps) {
  const { clauses } = analysis
  const rendah = clauses.filter((c) => c.riskScore === 'Rendah').length
  const sedang = clauses.filter((c) => c.riskScore === 'Sedang').length
  const tinggi = clauses.filter((c) => c.riskScore === 'Tinggi').length
  const total = clauses.length || 1

  const pRendah = Math.round((rendah / total) * 100)
  const pSedang = Math.round((sedang / total) * 100)
  const pTinggi = Math.round((tinggi / total) * 100)

  const legend = [
    { label: 'Aman', count: rendah, pct: pRendah, color: 'bg-emerald-500', dot: 'bg-emerald-500' },
    { label: 'Hati-hati', count: sedang, pct: pSedang, color: 'bg-amber-500', dot: 'bg-amber-500' },
    { label: 'Bahaya', count: tinggi, pct: pTinggi, color: 'bg-red-500', dot: 'bg-red-500' },
  ]

  return (
    <Card className="animate-fade-up">
      <CardHeader className="flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle>Risk Heatmap</CardTitle>
          <p className="text-sm text-slate-500 dark:text-slate-400">{total} klausul dianalisis</p>
        </div>
        <RiskBadge level={analysis.overallRisk} />
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Stacked bar */}
        <div className="flex h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          {pRendah > 0 && (
            <div
              className="bg-emerald-500 transition-all"
              style={{ width: `${pRendah}%` }}
              title={`${rendah} klausul aman`}
            />
          )}
          {pSedang > 0 && (
            <div
              className="bg-amber-500 transition-all"
              style={{ width: `${pSedang}%` }}
              title={`${sedang} klausul hati-hati`}
            />
          )}
          {pTinggi > 0 && (
            <div
              className="bg-red-500 transition-all"
              style={{ width: `${pTinggi}%` }}
              title={`${tinggi} klausul bahaya`}
            />
          )}
        </div>

        {/* Legend */}
        <div className="space-y-2">
          {legend.map((item) => (
            <div key={item.label} className="flex items-center gap-3 text-sm">
              <span className={cn('h-2.5 w-2.5 shrink-0 rounded-full', item.dot)} />
              <span className="flex-1 text-slate-600 dark:text-slate-400">{item.label}</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">{item.count}</span>
              <span className="w-10 text-right text-slate-400 dark:text-slate-500">{item.pct}%</span>
            </div>
          ))}
        </div>

        {/* Clause dots grid */}
        <div className="flex flex-wrap gap-1.5">
          {clauses.map((c, i) => (
            <div
              key={i}
              className={cn(
                'h-3 w-3 rounded-sm transition-transform hover:scale-125',
                dotColor(c.riskScore)
              )}
              title={`${c.number}: ${c.riskScore}`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function dotColor(level: RiskLevel) {
  if (level === 'Rendah') return 'bg-emerald-500'
  if (level === 'Sedang') return 'bg-amber-500'
  return 'bg-red-500'
}
