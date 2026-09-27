import {
  HelpCircle,
  PenLine,
  Scale,
  ShieldAlert,
  Sparkles,
} from 'lucide-react'
import { Button } from '../ui/Button'

interface GuidedActionsProps {
  onAction: (prompt: string) => void
  onNegotiate: () => void
  disabled?: boolean
}

const ACTIONS = [
  {
    icon: ShieldAlert,
    label: 'Risiko terbesar',
    prompt: 'Apa risiko terbesar di kontrak ini? Jelaskan dampaknya untuk UMKM saya.',
  },
  {
    icon: Scale,
    label: 'Boleh tanda tangan?',
    prompt: 'Berdasarkan analisis, apakah saya boleh menandatangani kontrak ini? Berikan alasan jelas.',
  },
  {
    icon: Sparkles,
    label: 'Poin negosiasi',
    prompt: 'Buatkan 5 poin negosiasi konkret yang bisa saya sampaikan ke lawan kontrak.',
  },
  {
    icon: HelpCircle,
    label: 'Pasal merugikan',
    prompt: 'Jelaskan klausul yang paling merugikan saya dan bagaimana cara negosiasinya.',
  },
]

export default function GuidedActions({ onAction, onNegotiate, disabled }: GuidedActionsProps) {
  return (
    <div
      className="animate-fade-up rounded-xl border border-brand-200/80 bg-white p-4 shadow-sm dark:border-brand-900/60 dark:bg-slate-900"
      id="guided-actions"
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="shrink-0">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">Apa langkahmu?</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Pilih pertanyaan cepat — AI memandu langkah selanjutnya
          </p>
        </div>

        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2 lg:justify-end">
          {ACTIONS.map(({ icon: Icon, label, prompt }) => (
            <Button
              key={label}
              variant="secondary"
              size="sm"
              className="h-8 gap-1.5 rounded-full px-3 text-xs"
              onClick={() => onAction(prompt)}
              disabled={disabled}
            >
              <Icon className="h-3.5 w-3.5 shrink-0 text-brand-600 dark:text-brand-400" />
              {label}
            </Button>
          ))}
          <Button
            size="sm"
            className="h-8 gap-1.5 rounded-full px-4 text-xs"
            onClick={onNegotiate}
            disabled={disabled}
          >
            <PenLine className="h-3.5 w-3.5" />
            Generate WA/Email
          </Button>
        </div>
      </div>
    </div>
  )
}
