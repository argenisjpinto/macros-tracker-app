import { formatWeekLabel, inputWeekToWeekKey, weekKeyToInputValue } from '../../utils/date'

type ProfileWeekSectionProps = {
  onWeekChange: (weekKey: string) => void
  selectedWeek: string
}

export function ProfileWeekSection({
  onWeekChange,
  selectedWeek,
}: ProfileWeekSectionProps) {
  return (
    <section className="bg-surface-container-low rounded-2xl p-6 space-y-4">
      <div>
        <p className="font-label label-md uppercase tracking-wider text-on-surface-variant">
          Carga semanal
        </p>
        <h3 className="font-headline text-2xl font-bold text-on-background mt-2">
          Semana del {formatWeekLabel(selectedWeek)}
        </h3>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <input
          className="px-4 py-3 bg-surface-container-lowest border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-on-surface"
          onChange={(event) => onWeekChange(inputWeekToWeekKey(event.target.value))}
          type="week"
          value={weekKeyToInputValue(selectedWeek)}
        />
        <span className="text-sm text-on-surface-variant">
          Puedes actualizar peso, cintura y otras medidas para cada semana.
        </span>
      </div>
    </section>
  )
}
