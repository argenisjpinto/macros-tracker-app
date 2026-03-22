import type { LoggedMealItem } from '../log/types'

type HeroSectionProps = {
  items: LoggedMealItem[]
  targetCalories: number
}

export function HeroSection({ items, targetCalories }: HeroSectionProps) {
  const consumedCalories = items.reduce((sum, item) => sum + item.calories, 0)
  const hasTarget = targetCalories > 0
  const calorieBalance = targetCalories - consumedCalories
  const isOverTarget = calorieBalance < 0
  const displayedCalories = Math.abs(calorieBalance)
  const percent = hasTarget
    ? Math.min(Math.round((consumedCalories / targetCalories) * 100), 100)
    : 0

  return (
    <section className="mb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="font-label label-md uppercase tracking-wider text-outline mb-1">
            {isOverTarget ? 'Alerta calórica' : 'Restante diario'}
          </p>
          <div className="flex items-baseline gap-2">
            <span
              className={
                isOverTarget
                  ? 'font-headline text-[4rem] leading-none font-black tracking-tighter text-error'
                  : 'font-headline text-[4rem] leading-none font-black tracking-tighter text-on-background'
              }
            >
              {displayedCalories.toLocaleString('es-AR')}
            </span>
            <span
              className={
                isOverTarget
                  ? 'font-headline text-2xl font-bold text-error'
                  : 'font-headline text-2xl font-bold text-primary'
              }
            >
              kcal
            </span>
          </div>
          <p className={isOverTarget ? 'text-sm text-error mt-2 font-semibold' : 'text-sm text-outline mt-2'}>
            {!hasTarget
              ? 'Completa tu perfil para calcular tu objetivo diario.'
              : isOverTarget
                ? `Te pasaste ${displayedCalories.toLocaleString('es-AR')} kcal de tus requerimientos.`
                : 'Todavía puedes consumir esta cantidad dentro de tu objetivo.'}
          </p>
        </div>

        <div className="flex gap-4 items-center">
          <div className="h-1 w-32 bg-surface-container-highest rounded-full overflow-hidden">
            <div
              className={
                isOverTarget
                  ? 'h-full bg-gradient-to-r from-error to-error-container rounded-full'
                  : 'h-full bg-gradient-to-r from-primary to-primary-container rounded-full'
              }
              style={{ width: `${percent}%` }}
            ></div>
          </div>
          <span className={isOverTarget ? 'font-label label-md font-bold text-error' : 'font-label label-md font-bold text-on-surface'}>
            {isOverTarget
              ? hasTarget
                ? `+${Math.round((consumedCalories / targetCalories) * 100) - 100}% excedido`
                : 'Sin objetivo'
              : `${percent}% del objetivo`}
          </span>
        </div>
      </div>
    </section>
  )
}
