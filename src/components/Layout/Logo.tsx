import { cn } from '../../lib/utils'

interface LogoProps {
  className?: string
  iconClassName?: string
  showText?: boolean
}

export default function Logo({ className, iconClassName, showText = true }: LogoProps) {
  return (
    <span className={cn('flex items-center gap-2.5', className)}>
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn('h-9 w-9 shrink-0', iconClassName)}
        aria-hidden
      >
        <rect width="32" height="32" rx="8" className="fill-brand-600" />
        <path
          d="M16 7c-3.5 0-6 2.2-6 5.5 0 2.2 1.2 3.8 3 4.7V22h6v-4.8c1.8-.9 3-2.5 3-4.7C22 9.2 19.5 7 16 7z"
          className="fill-white"
          fillOpacity="0.95"
        />
        <path
          d="M10 22h12"
          stroke="white"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
        <circle cx="11" cy="24.5" r="1.25" className="fill-brand-200" />
        <circle cx="21" cy="24.5" r="1.25" className="fill-brand-200" />
      </svg>
      {showText && (
        <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
          Klausul<span className="text-brand-600 dark:text-brand-400">Ku</span>
        </span>
      )}
    </span>
  )
}
