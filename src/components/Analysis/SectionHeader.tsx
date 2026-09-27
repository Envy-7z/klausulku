interface SectionHeaderProps {
  title: string
  subtitle?: string
  badge?: string
}

export default function SectionHeader({ title, subtitle, badge }: SectionHeaderProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 border-t border-slate-200 pt-8 dark:border-slate-800">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h2>
        {subtitle && (
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
        )}
      </div>
      {badge && (
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
          {badge}
        </span>
      )}
    </div>
  )
}
