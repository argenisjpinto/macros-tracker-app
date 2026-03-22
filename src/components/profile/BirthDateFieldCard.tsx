type BirthDateFieldCardProps = {
  age: number
  birthDate: string
  onChange: (value: string) => void
}

export function BirthDateFieldCard({
  age,
  birthDate,
  onChange,
}: BirthDateFieldCardProps) {
  return (
    <div className="bg-surface-container-low p-6 rounded-2xl space-y-4">
      <label className="font-label label-md uppercase tracking-wider text-on-surface-variant">
        Edad
      </label>
      <div className="flex items-end gap-2">
        <div className="text-5xl font-headline font-bold text-on-background">
          {birthDate ? age : '--'}
        </div>
        <span className="font-label label-md mb-2 text-on-surface-variant">AÑOS</span>
      </div>
      <label className="block">
        <span className="font-label label-md uppercase tracking-wider text-on-surface-variant mb-3 block">
          Fecha de nacimiento
        </span>
        <input
          className="w-full px-4 py-4 bg-surface-container-lowest border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-on-surface"
          onChange={(event) => onChange(event.target.value)}
          type="date"
          value={birthDate}
        />
      </label>
    </div>
  )
}
