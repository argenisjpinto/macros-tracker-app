import { formatDateLabel, shiftDateKey } from '../../utils/date'

type LogDateSectionProps = {
  onDateChange: (dateKey: string) => void
  selectedDate: string
  todayDate: string
}

export function LogDateSection({
  onDateChange,
  selectedDate,
  todayDate,
}: LogDateSectionProps) {
  return (
    <section className="bg-surface-container-lowest rounded-xl p-6 shadow-[0_20px_40px_rgba(47,46,46,0.04)]">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="font-label label-md uppercase tracking-wider text-outline mb-2">
            Dia del registro
          </p>
          <h2 className="font-headline text-2xl font-bold text-on-background capitalize">
            {formatDateLabel(selectedDate)}
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3 md:justify-end">
          <button
            className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-surface-container text-on-surface font-bold border border-outline-variant/20 hover:border-primary/40 hover:text-primary transition-colors"
            onClick={() => onDateChange(shiftDateKey(selectedDate, -1))}
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            Ayer
          </button>
          <input
            className="px-4 py-3 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-on-surface"
            onChange={(event) => onDateChange(event.target.value)}
            type="date"
            value={selectedDate}
          />
          <button
            className={
              selectedDate === todayDate
                ? 'px-4 py-3 rounded-xl bg-primary text-on-primary font-bold opacity-60'
                : 'px-4 py-3 rounded-xl bg-primary text-on-primary font-bold'
            }
            disabled={selectedDate === todayDate}
            onClick={() => onDateChange(todayDate)}
            type="button"
          >
            Hoy
          </button>
          <button
            className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-surface-container text-on-surface font-bold border border-outline-variant/20 hover:border-primary/40 hover:text-primary transition-colors"
            onClick={() => onDateChange(shiftDateKey(selectedDate, 1))}
            type="button"
          >
            Mañana
            <span className="material-symbols-outlined text-[20px]">chevron_right</span>
          </button>
        </div>
      </div>
    </section>
  )
}
