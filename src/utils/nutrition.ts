import type { ActivityLevel, Goal, NutritionPlan, ProfileState } from '../components/profile/types'
import { calculateAgeFromBirthDate } from './date'

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  'very-active': 1.725,
}

const GOAL_CALORIE_ADJUSTMENT: Record<Goal, number> = {
  muscle: 250,
  'fat-loss': -500,
  maintenance: 0,
}

const GOAL_MACRO_SPLIT: Record<Goal, { carbs: number; fat: number; protein: number }> = {
  muscle: { protein: 0.25, fat: 0.25, carbs: 0.5 },
  'fat-loss': { protein: 0.25, fat: 0.3, carbs: 0.45 },
  maintenance: { protein: 0.2, fat: 0.3, carbs: 0.5 },
}

const BASE_HYDRATION_LITERS = {
  male: 3.7,
  female: 2.7,
} as const

const ACTIVITY_HYDRATION_BONUS: Record<ActivityLevel, number> = {
  sedentary: 0,
  light: 0.35,
  moderate: 0.7,
  'very-active': 1.2,
}

export function calculateNutritionPlan(profile: ProfileState, referenceDate: string): NutritionPlan {
  if (!isProfileReady(profile)) {
    return {
      calories: 0,
      carbs: 0,
      cholesterolTargetMg: 0,
      fat: 0,
      fiber: 0,
      hydrationLiters: 0,
      maintenanceCalories: 0,
      protein: 0,
      restingEnergy: 0,
      saturatedFatTargetGrams: 0,
      sugarTargetGrams: 0,
    }
  }

  const age = calculateAgeFromBirthDate(profile.birthDate, referenceDate)
  const bmi = profile.weightKg / (profile.heightCm / 100) ** 2
  const waistToHeightRatio = profile.waistCm / profile.heightCm
  const restingEnergy =
    profile.sex === 'male'
      ? 10 * profile.weightKg + 6.25 * profile.heightCm - 5 * age + 5
      : 10 * profile.weightKg + 6.25 * profile.heightCm - 5 * age - 161

  const maintenanceCalories = Math.round(restingEnergy * ACTIVITY_MULTIPLIERS[profile.activityLevel])
  const calories = Math.max(maintenanceCalories + GOAL_CALORIE_ADJUSTMENT[profile.goal], 1200)
  const split = GOAL_MACRO_SPLIT[profile.goal]

  const protein = Math.max(
    Math.round((calories * split.protein) / 4),
    Math.round(profile.weightKg * 0.8),
  )
  const fat = Math.round((calories * split.fat) / 9)
  const carbs = Math.max(Math.round((calories * split.carbs) / 4), 130)
  const fiber = Math.round((calories / 1000) * 14)
  const hydrationLiters = roundToOne(
    BASE_HYDRATION_LITERS[profile.sex] + ACTIVITY_HYDRATION_BONUS[profile.activityLevel],
  )
  const riskScore = calculateMetabolicRiskScore({
    activityLevel: profile.activityLevel,
    age,
    bmi,
    sex: profile.sex,
    waistToHeightRatio,
  })
  const sugarTargetGrams = calculateSugarTargetGrams(calories, riskScore)
  const saturatedFatTargetGrams = Math.round((calories * 0.1) / 9)
  const cholesterolTargetMg = calculateCholesterolTargetMg(riskScore)

  return {
    calories,
    carbs,
    cholesterolTargetMg,
    fat,
    fiber,
    hydrationLiters,
    maintenanceCalories,
    protein,
    restingEnergy: Math.round(restingEnergy),
    saturatedFatTargetGrams,
    sugarTargetGrams,
  }
}

function calculateMetabolicRiskScore({
  activityLevel,
  age,
  bmi,
  sex,
  waistToHeightRatio,
}: {
  activityLevel: ActivityLevel
  age: number
  bmi: number
  sex: ProfileState['sex']
  waistToHeightRatio: number
}) {
  let score = 0

  if (activityLevel === 'sedentary') {
    score += 2
  } else if (activityLevel === 'light') {
    score += 1
  }

  if ((sex === 'male' && age >= 45) || (sex === 'female' && age >= 55)) {
    score += 1
  }

  if (bmi >= 30) {
    score += 2
  } else if (bmi >= 25) {
    score += 1
  }

  if (waistToHeightRatio >= 0.6) {
    score += 2
  } else if (waistToHeightRatio >= 0.5) {
    score += 1
  }

  return score
}

function calculateSugarTargetGrams(calories: number, riskScore: number) {
  const whoMax = (calories * 0.1) / 4
  const whoIdeal = (calories * 0.05) / 4

  if (riskScore >= 4) {
    return Math.round(whoIdeal)
  }

  if (riskScore >= 2) {
    return Math.round((whoMax + whoIdeal) / 2)
  }

  return Math.round(whoMax)
}

function calculateCholesterolTargetMg(riskScore: number) {
  if (riskScore >= 4) {
    return 200
  }

  if (riskScore >= 2) {
    return 250
  }

  return 300
}

function roundToOne(value: number) {
  return Math.round(value * 10) / 10
}

function isProfileReady(profile: ProfileState) {
  return Boolean(
    profile.birthDate &&
      profile.heightCm > 0 &&
      profile.weightKg > 0 &&
      profile.waistCm > 0,
  )
}
