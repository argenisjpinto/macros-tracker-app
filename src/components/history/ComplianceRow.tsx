type ComplianceRowProps = {
  barClass: string
  date: string
  day: string
  description: string
  highlighted: boolean
  percent: string
  title: string
}

export function ComplianceRow({
  barClass,
  date,
  day,
  description,
  highlighted,
  percent,
  title,
}: ComplianceRowProps) {
  return (
    <div className="flex items-center justify-between p-6 bg-surface-container-lowest">
      <div className="flex items-center gap-4">
        <div
          className={
            highlighted
              ? 'w-12 h-12 rounded-xl kinetic-gradient flex flex-col items-center justify-center text-on-primary'
              : 'w-12 h-12 rounded-xl bg-surface-container-highest flex flex-col items-center justify-center text-on-surface'
          }
        >
          <span className="font-label text-[10px] leading-none uppercase">{day}</span>
          <span className="font-headline text-lg font-bold">{date}</span>
        </div>
        <div>
          <p className="font-headline font-bold text-on-surface">{title}</p>
          <p className="font-body text-sm text-secondary">{description}</p>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <span
          className={
            highlighted
              ? 'font-headline text-2xl font-black text-primary'
              : percent === '82%'
                ? 'font-headline text-2xl font-black text-tertiary'
                : 'font-headline text-2xl font-black text-primary'
          }
        >
          {percent}
        </span>
        <div className="w-24 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${barClass}`}></div>
        </div>
      </div>
    </div>
  )
}
