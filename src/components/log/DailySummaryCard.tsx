import { summaryMacroConfig } from './logData'
import type { LoggedMealItem } from './types'

type DailySummaryCardProps = {
  cholesterolTargetMg?: number
  goalCalories?: number
  items: LoggedMealItem[]
  saturatedFatTargetGrams?: number
  sugarTargetGrams?: number
  waterTargetMl?: number
}

export function DailySummaryCard({
  cholesterolTargetMg = 300,
  goalCalories = 2200,
  items,
  saturatedFatTargetGrams = Math.round((goalCalories * 0.1) / 9),
  sugarTargetGrams = Math.round((goalCalories * 0.1) / 4),
  waterTargetMl = 0,
}: DailySummaryCardProps) {
  const totals = items.reduce(
    (acc, item) => {
      acc.calories += item.calories
      acc.protein += item.protein
      acc.carbs += item.carbs
      acc.fat += item.fat
      acc.sugar += item.sugar ?? 0
      acc.saturatedFat += item.saturatedFat ?? 0
      acc.cholesterol += item.cholesterol ?? 0
      acc.water += item.water ?? 0
      return acc
    },
    {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      sugar: 0,
      saturatedFat: 0,
      cholesterol: 0,
      water: 0,
    },
  )

  const healthIndicators = [
    {
      label: 'Azúcar',
      value: `${Math.round(totals.sugar)}g`,
      sublabel: `Perfil + OMS: ${sugarTargetGrams}g`,
      clipPath: buildIndicatorClipPath(totals.sugar, sugarTargetGrams),
    },
    {
      label: 'Grasas Saturadas',
      value: `${Math.round(totals.saturatedFat)}g`,
      sublabel: `OMS: máx ${saturatedFatTargetGrams}g`,
      clipPath: buildIndicatorClipPath(totals.saturatedFat, saturatedFatTargetGrams),
    },
    {
      label: 'Colesterol',
      value: `${Math.round(totals.cholesterol)}mg`,
      sublabel: `Perfil: ${cholesterolTargetMg}mg`,
      clipPath: buildIndicatorClipPath(totals.cholesterol, cholesterolTargetMg),
    },
    {
      label: 'Agua',
      value: `${Math.round(totals.water)}ml`,
      sublabel: `Meta: ${Math.round(waterTargetMl)}ml`,
      clipPath: buildIndicatorClipPath(totals.water, waterTargetMl),
    },
  ]

  return (
    <section className="relative overflow-hidden bg-primary rounded-3xl p-8 text-on-primary">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container opacity-20 rounded-full -mr-20 -mt-20 blur-3xl"></div>
      <div className="relative z-10 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <p className="font-label label-md uppercase tracking-widest opacity-80">Total Calorías</p>
            <h2 className="font-headline text-6xl font-black">{totals.calories}</h2>
            <p className="text-sm opacity-70">Objetivo: {goalCalories.toLocaleString('es-AR')} kcal</p>
          </div>

          <div className="flex gap-8">
            {summaryMacroConfig.map((macro) => (
              <div className="text-center" key={macro.label}>
                <div className="w-16 h-16 rounded-full border-4 border-on-primary/20 flex items-center justify-center relative">
                  <div
                    className="absolute inset-0 border-4 border-on-primary rounded-full"
                    style={{ clipPath: macro.clipPath }}
                  ></div>
                  <span className="font-bold text-sm">{Math.round(totals[macro.key])}g</span>
                </div>
                <p className="font-label label-md mt-2 uppercase">{macro.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="h-px bg-on-primary/15"></div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {healthIndicators.map((indicator) => (
            <div className="text-center" key={indicator.label}>
              <div className="w-16 h-16 mx-auto rounded-full border-4 border-on-primary/20 flex items-center justify-center relative">
                <div
                  className="absolute inset-0 border-4 border-on-primary rounded-full"
                  style={{ clipPath: indicator.clipPath }}
                ></div>
                <span className="font-bold text-xs leading-tight">{indicator.value}</span>
              </div>
              <p className="font-label label-md mt-2 uppercase">{indicator.label}</p>
              <p className="text-xs opacity-70 mt-1">{indicator.sublabel}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function buildIndicatorClipPath(current: number, target: number) {
  if (target <= 0) {
    return 'polygon(0 0, 100% 0, 100% 0, 0 0)'
  }

  const progress = Math.min(Math.max(current / target, 0), 1)
  const height = Math.round(progress * 100)
  return `polygon(0 0, 100% 0, 100% ${height}%, 0 ${height}%)`
}
