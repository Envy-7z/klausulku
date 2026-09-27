import { CalendarPlus, Clock } from 'lucide-react'
import type { KeyDate } from '../../types'
import { downloadIcsFile, downloadAllKeyDates } from '../../utils/icsExport'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'

interface KeyDatesCardProps {
  keyDates: KeyDate[]
  documentTitle: string
}

const typeLabels: Record<KeyDate['type'], string> = {
  deadline: 'Deadline',
  renewal: 'Perpanjangan',
  payment: 'Pembayaran',
  term: 'Jangka Waktu',
}

export default function KeyDatesCard({ keyDates, documentTitle }: KeyDatesCardProps) {
  const withIso = keyDates.filter((d) => d.isoDate)

  if (keyDates.length === 0) return null

  return (
    <Card className="animate-fade-up p-5" id="key-dates-card">
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-brand-600" />
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Tanggal Penting</h3>
      </div>

      <ul className="mt-4 space-y-3">
        {keyDates.map((date, i) => (
          <li
            key={`${date.label}-${i}`}
            className="flex flex-wrap items-start justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50/80 p-3 dark:border-slate-700 dark:bg-slate-900/50"
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium text-slate-900 dark:text-white">{date.label}</span>
                <span className="rounded-md bg-slate-200 px-2 py-0.5 text-[10px] font-semibold uppercase text-slate-600 dark:bg-slate-700 dark:text-slate-400">
                  {typeLabels[date.type]}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{date.rawText}</p>
              {date.isoDate && (
                <p className="mt-1 text-xs font-medium text-brand-600 dark:text-brand-400">
                  {new Date(date.isoDate).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              )}
            </div>
            {date.isoDate && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 shrink-0 text-xs"
                onClick={() => downloadIcsFile(date, documentTitle)}
              >
                <CalendarPlus className="h-3.5 w-3.5" />
                Kalender
              </Button>
            )}
          </li>
        ))}
      </ul>

      {withIso.length > 1 && (
        <Button
          variant="secondary"
          size="sm"
          className="mt-4 w-full"
          onClick={() => downloadAllKeyDates(withIso, documentTitle)}
        >
          <CalendarPlus className="h-4 w-4" />
          Unduh Semua ke Kalender (.ics)
        </Button>
      )}
    </Card>
  )
}
