import type { MealKey } from '../log/types'

export const macroTargets = {
  calories: 2200,
  protein: 160,
  carbs: 290,
  fat: 65,
  fiber: 35,
} as const

export const mealDashboardConfig: Array<{
  descriptionFallback: string
  icon: string
  key: MealKey
  title: string
}> = [
  {
    key: 'desayuno',
    title: 'Desayuno',
    descriptionFallback: 'Sin alimentos registrados',
    icon: 'coffee',
  },
  {
    key: 'pre-entreno',
    title: 'Pre Entreno',
    descriptionFallback: 'Sin alimentos registrados',
    icon: 'bolt',
  },
  {
    key: 'almuerzo',
    title: 'Almuerzo',
    descriptionFallback: 'Sin alimentos registrados',
    icon: 'restaurant',
  },
  {
    key: 'merienda',
    title: 'Merienda',
    descriptionFallback: 'Sin alimentos registrados',
    icon: 'cookie',
  },
  {
    key: 'cena',
    title: 'Cena',
    descriptionFallback: 'Sin alimentos registrados',
    icon: 'dinner_dining',
  },
]
