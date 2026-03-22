import { getAmountMin, getAmountStep, getUnitLabel } from './quantity'
import type { FoodRecord, MealKey } from './types'

type MealOption = {
  key: MealKey
  label: string
}

type SearchSectionProps = {
  amount: number
  foods: FoodRecord[]
  mealOptions: MealOption[]
  onAdd: () => void
  onAmountChange: (value: number) => void
  onSearchChange: (value: string) => void
  onSelectFood: (food: FoodRecord) => void
  onSelectMeal: (meal: MealKey, mealLabel?: string) => void
  search: string
  selectedFood: FoodRecord | null
  selectedExtraLabel?: string | null
  selectedMeal: MealKey
}

const defaultMealOptions: MealOption[] = [
  { key: 'desayuno', label: 'Desayuno' },
  { key: 'pre-entreno', label: 'Pre Entreno' },
  { key: 'almuerzo', label: 'Almuerzo' },
  { key: 'merienda', label: 'Merienda' },
  { key: 'cena', label: 'Cena' },
]

export function SearchSection({
  amount,
  foods,
  mealOptions = defaultMealOptions,
  onAdd,
  onAmountChange,
  onSearchChange,
  onSelectFood,
  onSelectMeal,
  search,
  selectedFood,
  selectedExtraLabel = null,
  selectedMeal,
}: SearchSectionProps) {
  const hasSearch = search.trim().length > 0
  const unitLabel = selectedFood ? getUnitLabel(selectedFood.unit, amount, true) : 'GRAMOS'
  const amountStep = selectedFood ? getAmountStep(selectedFood.unit) : 50
  const amountMin = selectedFood ? getAmountMin(selectedFood.unit) : 0
  const visibleFoods =
    !hasSearch && selectedFood && !foods.some((food) => food.id === selectedFood.id)
      ? [selectedFood, ...foods].slice(0, 3)
      : foods

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 bg-surface-container-lowest rounded-xl p-6 shadow-[0_20px_40px_rgba(47,46,46,0.04)]">
        <label className="font-label label-md uppercase tracking-wider text-outline mb-4 block">
          Buscador de alimentos
        </label>
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant">
            search
          </span>
          <input
            className="w-full pl-12 pr-4 py-4 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all font-body text-on-surface"
            placeholder="¿Qué comiste hoy?"
            type="text"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
          />

          {hasSearch ? (
            <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-20 rounded-2xl border border-outline-variant/20 bg-surface-container-lowest shadow-[0_20px_40px_rgba(47,46,46,0.08)] overflow-hidden">
              {foods.length > 0 ? (
                <div className="max-h-72 overflow-y-auto p-2">
                  {foods.map((food) => (
                    <button
                      className={
                        selectedFood?.id === food.id
                          ? 'w-full rounded-xl px-4 py-3 text-left bg-primary-container text-on-primary-container transition-colors'
                          : 'w-full rounded-xl px-4 py-3 text-left text-on-surface hover:bg-surface-container transition-colors'
                      }
                      key={food.id}
                      onClick={() => onSelectFood(food)}
                      type="button"
                    >
                      <span className="font-medium">{food.name}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-4 text-sm text-outline">No encontramos alimentos para esa búsqueda.</div>
              )}
            </div>
          ) : null}
        </div>

        <div className="mt-6">
          <p className="font-label label-md uppercase tracking-wider text-outline mb-3">
            Alimentos
          </p>
          <div className="flex flex-wrap gap-2">
            {!hasSearch ? visibleFoods.map((food) => (
              <button
                className={
                  selectedFood?.id === food.id
                    ? 'px-4 py-2 bg-primary-container rounded-full text-on-primary-container label-md font-medium cursor-pointer transition-colors'
                    : 'px-4 py-2 bg-surface-container rounded-full text-on-surface-variant label-md font-medium cursor-pointer hover:bg-primary-container hover:text-on-primary-container transition-colors'
                }
                key={food.id}
                onClick={() => onSelectFood(food)}
                type="button"
              >
                {food.name}
              </button>
            )) : (
              <p className="text-sm text-outline">Selecciona una sugerencia del buscador.</p>
            )}
          </div>
        </div>

        <div className="my-6 h-px bg-surface-container-highest"></div>

        <div>
          <p className="font-label label-md uppercase tracking-wider text-outline mb-3">
            Comida del día
          </p>
          <div className="flex flex-wrap gap-2">
            {mealOptions.map((meal) => (
              <button
                className={
                  selectedMeal === meal.key &&
                  (meal.key !== 'extra' || selectedExtraLabel === meal.label)
                    ? 'px-4 py-2 bg-primary text-on-primary rounded-full label-md font-medium transition-colors'
                    : 'px-4 py-2 bg-surface-container rounded-full text-on-surface-variant label-md font-medium hover:bg-primary-container hover:text-on-primary-container transition-colors'
                }
                key={`${meal.key}-${meal.label}`}
                onClick={() => onSelectMeal(meal.key, meal.key === 'extra' ? meal.label : undefined)}
                type="button"
              >
                {meal.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl p-6 shadow-[0_20px_40px_rgba(47,46,46,0.04)] flex flex-col justify-between">
        <div>
          <label className="font-label label-md uppercase tracking-wider text-outline mb-4 block">
            Cantidad
          </label>
          <div className="flex items-end gap-2">
            <input
              className="text-5xl font-headline font-bold text-primary bg-transparent border-none p-0 w-32 focus:ring-0"
              min={amountMin}
              step={amountStep}
              type="number"
              value={amount}
              onChange={(event) => onAmountChange(Number(event.target.value))}
            />
            <span className="text-xl font-headline font-bold text-outline-variant mb-2">
              {unitLabel}
            </span>
          </div>
        </div>
        <button
          className="w-full bg-primary text-on-primary py-4 rounded-xl font-bold text-lg hover:opacity-90 active:scale-95 transition-all mt-6"
          onClick={onAdd}
          type="button"
        >
          Añadir Registro
        </button>
      </div>
    </section>
  )
}
