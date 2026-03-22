type MacroCardProps = {
  dashOffset: string
  label: string
  percent: string
  strokeClass: string
  value: string
}

export function MacroCard({
  dashOffset,
  label,
  percent,
  strokeClass,
  value,
}: MacroCardProps) {
  return (
    <div className="bg-surface-container-lowest p-5 rounded-xl flex flex-col items-center justify-center text-center">
      <div className="relative w-20 h-20 mb-3 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90">
          <circle
            className="text-surface-container"
            cx="40"
            cy="40"
            fill="transparent"
            r="34"
            stroke="currentColor"
            strokeWidth="8"
          ></circle>
          <circle
            className={strokeClass}
            cx="40"
            cy="40"
            fill="transparent"
            r="34"
            stroke="currentColor"
            strokeDasharray="213.6"
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            strokeWidth="8"
          ></circle>
        </svg>
        <span className="absolute font-headline font-bold text-sm">{percent}</span>
      </div>
      <span className="font-label label-md uppercase tracking-widest text-outline">{label}</span>
      <span className="font-headline font-bold text-on-background">{value}</span>
    </div>
  )
}
