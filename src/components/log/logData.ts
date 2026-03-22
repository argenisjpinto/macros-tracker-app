import type { LoggedMealItem, MealKey } from './types'

export const summaryMacroConfig = [
  { label: 'Proteína', clipPath: 'polygon(0 0, 100% 0, 100% 70%, 0 70%)', key: 'protein' },
  { label: 'Carbs', clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)', key: 'carbs' },
  { label: 'Grasas', clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0 85%)', key: 'fat' },
] as const

export const mealDefinitions: Array<{
  key: MealKey
  label: string
  icon: string
  dimmed?: boolean
}> = [
  { key: 'desayuno', label: 'Desayuno', icon: 'wb_sunny' },
  { key: 'pre-entreno', label: 'Pre Entreno', icon: 'bolt', dimmed: true },
  { key: 'almuerzo', label: 'Almuerzo', icon: 'restaurant' },
  { key: 'merienda', label: 'Merienda', icon: 'coffee' },
  { key: 'cena', label: 'Cena', icon: 'dark_mode' },
  { key: 'extra', label: 'Extra', icon: 'more_horiz' },
] as const

export const initialMealItems: LoggedMealItem[] = [
  {
    id: 'desayuno-omelette',
    meal: 'desayuno',
    name: 'Omelette de Claras',
    grams: 200,
    protein: 32,
    carbs: 4,
    fat: 2,
    fiber: 0,
    calories: 185,
    detail: '200g - P: 32g C: 4g F: 2g',
  },
  {
    id: 'desayuno-avena',
    meal: 'desayuno',
    name: 'Avena con Frutos Rojos',
    grams: 150,
    protein: 8,
    carbs: 45,
    fat: 6,
    fiber: 5,
    calories: 235,
    detail: '150g - P: 8g C: 45g F: 6g',
  },
  {
    id: 'pre-banana',
    meal: 'pre-entreno',
    name: 'Banana',
    grams: 120,
    protein: 1,
    carbs: 27,
    fat: 0,
    fiber: 3,
    calories: 120,
    detail: '120g - P: 1g C: 27g F: 0g',
  },
  {
    id: 'almuerzo-pollo',
    meal: 'almuerzo',
    name: 'Pollo a la Plancha',
    grams: 200,
    protein: 46,
    carbs: 0,
    fat: 5,
    fiber: 0,
    calories: 310,
    detail: '200g - P: 46g C: 0g F: 5g',
  },
  {
    id: 'almuerzo-arroz',
    meal: 'almuerzo',
    name: 'Arroz con Vegetales',
    grams: 150,
    protein: 5,
    carbs: 40,
    fat: 2,
    fiber: 3,
    calories: 240,
    detail: '150g - P: 5g C: 40g F: 2g',
  },
  {
    id: 'almuerzo-aceite',
    meal: 'almuerzo',
    name: 'Aceite de Oliva',
    grams: 10,
    protein: 0,
    carbs: 0,
    fat: 10,
    fiber: 0,
    calories: 100,
    detail: '10g - P: 0g C: 0g F: 10g',
  },
]
