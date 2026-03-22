import { mealDashboardConfig } from './dashboardData'
import { MealRow } from './MealRow'
import type { LoggedMealItem } from '../log/types'

type MealSummarySectionProps = {
  items: LoggedMealItem[]
  onAddExtra: () => void
  targetCalories: number
}

export function MealSummarySection({
  items,
  onAddExtra,
  targetCalories,
}: MealSummarySectionProps) {
  const hasTargetCalories = targetCalories > 0
  const meals = mealDashboardConfig.map((meal) => {
    const mealItems = items.filter((item) => item.meal === meal.key)
    const calories = mealItems.reduce((sum, item) => sum + item.calories, 0)
    const description =
      mealItems.length > 0
        ? mealItems.map((item) => item.name).join(', ')
        : meal.descriptionFallback
    const dailyShare = hasTargetCalories
      ? `${Math.round((calories / targetCalories) * 100)}% diario`
      : 'Sin objetivo'

    return {
      title: meal.title,
      description,
      calories: `${calories} kcal`,
      dailyShare,
      icon: meal.icon,
    }
  })

  const extraItems = items.filter((item) => item.meal === 'extra')
  const extraCalories = extraItems.reduce((sum, item) => sum + item.calories, 0)
  const extraMeal =
    extraItems.length > 0
      ? {
          title: 'Extra',
          description: extraItems.map((item) => item.name).join(', '),
          calories: `${extraCalories} kcal`,
          dailyShare: hasTargetCalories
            ? `${Math.round((extraCalories / targetCalories) * 100)}% diario`
            : 'Sin objetivo',
          icon: 'add',
        }
      : null

  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-headline headline-sm font-bold text-on-background">Registro de comidas</h2>
        <button className="font-label label-md text-primary font-bold uppercase tracking-widest hover:underline">
          Ver todo
        </button>
      </div>

      <div className="bg-surface-container rounded-2xl p-2 space-y-2">
        {meals.map((meal) => (
          <MealRow key={meal.title} {...meal} />
        ))}

        {extraMeal ? <MealRow {...extraMeal} /> : null}

        <button
          className="bg-surface-container-lowest rounded-xl p-4 border-2 border-dashed border-outline-variant flex items-center justify-center text-outline hover:text-primary hover:border-primary transition-colors cursor-pointer w-full"
          onClick={onAddExtra}
          type="button"
        >
          <span className="material-symbols-outlined mr-2">add</span>
          <span className="font-label label-md uppercase font-bold tracking-widest">Añadir</span>
        </button>
      </div>
    </section>
  )
}
