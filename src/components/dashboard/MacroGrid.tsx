import { MacroCard } from './MacroCard'
import type { LoggedMealItem } from '../log/types'
import type { NutritionPlan } from '../profile/types'

type MacroGridProps = {
  items: LoggedMealItem[]
  targets: NutritionPlan
}

export function MacroGrid({ items, targets }: MacroGridProps) {
  const totals = items.reduce(
    (acc, item) => {
      acc.protein += item.protein
      acc.carbs += item.carbs
      acc.fat += item.fat
      acc.fiber += item.fiber
      acc.sugar += item.sugar ?? 0
      acc.cholesterol += item.cholesterol ?? 0
      return acc
    },
    { protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, cholesterol: 0 },
  )

  const macroCards = [
    {
      label: 'Proteína',
      value: `${Math.round(totals.protein)}g / ${targets.protein}g`,
      percent: formatPercent(totals.protein, targets.protein),
      strokeClass: 'text-primary',
      dashOffset: buildDashOffset(totals.protein, targets.protein),
    },
    {
      label: 'Carbohidratos',
      value: `${Math.round(totals.carbs)}g / ${targets.carbs}g`,
      percent: formatPercent(totals.carbs, targets.carbs),
      strokeClass: 'text-tertiary-fixed-dim',
      dashOffset: buildDashOffset(totals.carbs, targets.carbs),
    },
    {
      label: 'Grasas',
      value: `${Math.round(totals.fat)}g / ${targets.fat}g`,
      percent: formatPercent(totals.fat, targets.fat),
      strokeClass: 'text-error-container',
      dashOffset: buildDashOffset(totals.fat, targets.fat),
    },
    {
      label: 'Fibra',
      value: `${Math.round(totals.fiber)}g / ${targets.fiber}g`,
      percent: formatPercent(totals.fiber, targets.fiber),
      strokeClass: 'text-outline',
      dashOffset: buildDashOffset(totals.fiber, targets.fiber),
    },
    {
      label: 'Azúcar',
      value: `${Math.round(totals.sugar)}g / ${targets.sugarTargetGrams}g`,
      percent: formatPercent(totals.sugar, targets.sugarTargetGrams),
      strokeClass: 'text-amber-600',
      dashOffset: buildDashOffset(totals.sugar, targets.sugarTargetGrams),
    },
    {
      label: 'Colesterol',
      value: `${Math.round(totals.cholesterol)}mg / ${targets.cholesterolTargetMg}mg`,
      percent: formatPercent(totals.cholesterol, targets.cholesterolTargetMg),
      strokeClass: 'text-rose-500',
      dashOffset: buildDashOffset(totals.cholesterol, targets.cholesterolTargetMg),
    },
  ]

  return (
    <section className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
      {macroCards.map((card) => (
        <MacroCard key={card.label} {...card} />
      ))}
    </section>
  )
}

function formatPercent(total: number, target: number) {
  if (target <= 0) {
    return '0%'
  }

  return `${Math.min(Math.round((total / target) * 100), 100)}%`
}

function buildDashOffset(total: number, target: number) {
  if (target <= 0) {
    return '213.6'
  }

  return `${213.6 - Math.min(total / target, 1) * 213.6}`
}
