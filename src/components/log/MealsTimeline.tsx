import { mealDefinitions } from './logData'
import { TimelineMealCard } from './TimelineMealCard'
import type { LoggedMealItem, MealKey } from './types'

type MealsTimelineProps = {
  items: LoggedMealItem[]
  onDeleteItem: (itemId: string) => void
  onSelectItem: (itemId: string) => void
  onSelectMeal: (meal: MealKey, mealLabel?: string) => void
  selectedLoggedItemId: string | null
  selectedExtraLabel: string | null
  selectedMeal: MealKey
}

export function MealsTimeline({
  items,
  onDeleteItem,
  onSelectItem,
  onSelectMeal,
  selectedLoggedItemId,
  selectedExtraLabel,
  selectedMeal,
}: MealsTimelineProps) {
  const baseMeals = mealDefinitions.filter((meal) => meal.key !== 'extra').map((meal) => {
    const mealItems = items.filter((item) => item.meal === meal.key)
    const calories = mealItems.reduce((sum, item) => sum + item.calories, 0)

    return {
      ...meal,
      calories: `${calories} kcal`,
      items: mealItems,
    }
  })

  const extraMeals = Array.from(
    items
      .filter((item) => item.meal === 'extra')
      .reduce((map, item) => {
        const label = item.mealLabel ?? item.name
        const grouped = map.get(label) ?? []
        grouped.push(item)
        map.set(label, grouped)
        return map
      }, new Map<string, LoggedMealItem[]>()),
  ).map(([label, mealItems]) => {
    const calories = mealItems.reduce((sum, item) => sum + item.calories, 0)

    return {
      key: 'extra' as const,
      label,
      icon: 'more_horiz',
      dimmed: false,
      calories: `${calories} kcal`,
      items: mealItems,
    }
  })

  const meals = [...baseMeals, ...extraMeals]

  return (
    <section className="space-y-6">
      {meals.map((meal) =>
        meal.items.length > 0 ? (
          <TimelineMealCard
            calories={meal.calories}
            dimmed={Boolean(meal.dimmed)}
            icon={meal.icon}
            isSelected={
              selectedMeal === meal.key &&
              (meal.key !== 'extra' || selectedExtraLabel === meal.label)
            }
            items={meal.items}
            key={`${meal.key}-${meal.label}`}
            onDeleteItem={onDeleteItem}
            onSelectItem={onSelectItem}
            onSelect={() => onSelectMeal(meal.key, meal.key === 'extra' ? meal.label : undefined)}
            selectedItemId={selectedLoggedItemId}
            title={meal.label}
          />
        ) : (
          <button
            className={
              selectedMeal === meal.key
                ? 'flex flex-col items-center justify-center p-8 bg-surface-container-low border-2 border-dashed border-primary rounded-2xl hover:bg-surface-container transition-all group w-full'
                : 'flex flex-col items-center justify-center p-8 bg-surface-container-low border-2 border-dashed border-outline-variant/30 rounded-2xl hover:bg-surface-container transition-all group w-full'
            }
            key={meal.key}
            onClick={() => onSelectMeal(meal.key)}
            type="button"
          >
            <span className="material-symbols-outlined text-3xl text-outline mb-2 group-hover:text-primary">
              {meal.icon}
            </span>
            <span className="font-label label-md uppercase font-bold text-outline">{meal.label}</span>
          </button>
        ),
      )}
    </section>
  )
}
