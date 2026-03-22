import type { ChartScaleMark } from '../../utils/history'

type MetricChartCardProps = {
  accentCopy: string
  accentClassName?: string
  chart: React.ReactNode
  helper: string
  label: string
  scale: string
  scaleMarks?: ChartScaleMark[]
  tickLabels: string[]
  unit: string
  value: string
}

export function MetricChartCard({
  accentCopy,
  accentClassName = 'text-primary',
  chart,
  helper,
  label,
  scale,
  scaleMarks = [],
  tickLabels,
  unit,
  value,
}: MetricChartCardProps) {
  return (
    <div className="bg-surface-container-lowest p-8 rounded-xl space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <span className="font-label label-md uppercase tracking-wider text-outline">{label}</span>
          <div className="flex items-baseline gap-2">
            <span className="font-headline text-4xl font-bold">{value}</span>
            <span className="font-body text-lg text-secondary">{unit}</span>
          </div>
        </div>
        <div className="text-right">
          <span className={`${accentClassName} font-bold`}>{accentCopy}</span>
          <p className="text-xs text-outline">{helper}</p>
        </div>
      </div>

      <div className="h-48 w-full flex items-end gap-3">
        {scaleMarks.length > 0 ? (
          <div className="relative h-full w-12 text-[11px] font-label text-outline uppercase tracking-wide">
            {scaleMarks.map((mark) => (
              <span
                className="absolute left-0 -translate-y-1/2"
                key={`${scale}-${mark.label}-${mark.yPercent}`}
                style={{ top: `${mark.yPercent}%` }}
              >
                {mark.label}
              </span>
            ))}
          </div>
        ) : null}
        <div className="flex-1 h-full">{chart}</div>
      </div>

      <div className="flex justify-between px-2 text-xs font-label text-outline uppercase tracking-widest">
        {tickLabels.map((tick) => (
          <span key={`${scale}-${tick}`}>{tick}</span>
        ))}
      </div>
    </div>
  )
}
