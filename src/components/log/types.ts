export type FoodUnit = 'g' | 'ml' | 'unidad' | 'rebanada'

export type FoodRecord = {
  id: string
  name: string
  category: string
  servingBase: number
  servingWeightGrams?: number
  unit: FoodUnit
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
  sugar?: number
  cholesterol?: number
  saturatedFat?: number
  water?: number
}

export type MealKey =
  | 'desayuno'
  | 'pre-entreno'
  | 'almuerzo'
  | 'merienda'
  | 'cena'
  | 'extra'

export type LoggedMealItem = {
  amount?: number
  id: string
  calories: number
  cholesterol?: number
  detail: string
  fat: number
  fiber: number
  grams: number
  meal: MealKey
  mealLabel?: string
  name: string
  protein: number
  carbs: number
  saturatedFat?: number
  sugar?: number
  unit?: FoodUnit
  water?: number
}

export type LoggedMealsByDate = Record<string, LoggedMealItem[]>
