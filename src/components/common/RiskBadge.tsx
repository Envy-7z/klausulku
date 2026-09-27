import type { RiskLevel } from '../../types'
import { AlertTriangle, Circle, TrendingUp } from 'lucide-react'
import { Badge } from '../ui/Badge'
import { cn } from '../../lib/utils'

interface RiskBadgeProps {
  level: RiskLevel
  size?: 'sm' | 'md'
}

const config: Record<RiskLevel, { variant: 'success' | 'warning' | 'danger'; icon: typeof Circle }> = {
  Rendah: { variant: 'success', icon: Circle },
  Sedang: { variant: 'warning', icon: TrendingUp },
  Tinggi: { variant: 'danger', icon: AlertTriangle },
}

export default function RiskBadge({ level, size = 'md' }: RiskBadgeProps) {
  const { variant, icon: Icon } = config[level]

  return (
    <Badge
      variant={variant}
      className={cn(size === 'sm' && 'px-2 py-0 text-[10px]')}
    >
      <Icon className={cn('fill-current', size === 'sm' ? 'h-2.5 w-2.5' : 'h-3 w-3')} />
      {level}
    </Badge>
  )
}
