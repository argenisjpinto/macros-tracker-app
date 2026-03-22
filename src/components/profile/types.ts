export type BiologicalSex = 'male' | 'female'
export type Goal = 'muscle' | 'fat-loss' | 'maintenance'
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'very-active'

export type ProfileState = {
  activityLevel: ActivityLevel
  birthDate: string
  goal: Goal
  heightCm: number
  sex: BiologicalSex
  waistCm: number
  weightKg: number
}

export type NutritionPlan = {
  calories: number
  carbs: number
  cholesterolTargetMg: number
  fat: number
  fiber: number
  hydrationLiters: number
  maintenanceCalories: number
  protein: number
  restingEnergy: number
  saturatedFatTargetGrams: number
  sugarTargetGrams: number
}
