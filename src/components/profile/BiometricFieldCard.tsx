type BiometricFieldCardProps = {
  label: string
  onChange: (value: number) => void
  suffix: string
  value: number
}

export function BiometricFieldCard({
  label,
  onChange,
  suffix,
  value,
}: BiometricFieldCardProps) {
  return (
    <div className="bg-surface-container-low p-6 rounded-2xl space-y-4">
      <label className="font-label label-md uppercase tracking-wider text-on-surface-variant">
        {label}
      </label>
      <div className="flex items-end gap-2">
        <input
          className="bg-transparent border-none p-0 text-5xl font-headline font-bold focus:ring-0 w-full placeholder:text-outline-variant"
          inputMode="decimal"
          min="0"
          onChange={(event) => onChange(Number(event.target.value) || 0)}
          placeholder="--"
          type="number"
          value={value > 0 ? value : ''}
        />
        <span className="font-label label-md mb-2 text-on-surface-variant">{suffix}</span>
      </div>
    </div>
  )
}
