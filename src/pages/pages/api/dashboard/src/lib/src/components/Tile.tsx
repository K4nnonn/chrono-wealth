impoimport React from 'react'

export function FanChart({ data, color }: { data?: any; color?: string }) {
  // Placeholder for fan chart using Recharts AreaChart
  return <div>FanChart placeholder</div>
}
rt clsx from 'classnames'

export function Tile({ label, value, variant = 'neutral' }:{
  label: string; value: React.ReactNode; variant?: 'neutral'|'good'|'bad'
}) {
  return (
    <div className={clsx(
      'rounded-2xl p-4 shadow-sm text-center',
      variant === 'good' && 'bg-mint/10 text-mint',
      variant === 'bad'  && 'bg-rose/10 text-rose',
      variant === 'neutral' && 'bg-white text-navy'
    )}>
      <div className="text-xs uppercase tracking-wide">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  )
}
