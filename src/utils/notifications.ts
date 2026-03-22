import type { LoggedMealsByDate } from '../components/log/types'
import type { Goal, ProfileState } from '../components/profile/types'
import { getDateKey, getWeekKey } from './date'

export type AppNotification = {
  id: string
  message: string
  severity: 'success' | 'warning' | 'error'
  title: string
}

export function buildNotifications(
  loggedMealsByDate: LoggedMealsByDate,
  profilesByWeek: Record<string, ProfileState>,
  fallbackProfile: ProfileState,
  now: Date,
) {
  const notifications: AppNotification[] = []
  const todayKey = getDateKey(now)
  const currentWeekKey = getWeekKey(now)

  const latestWeekKey = Object.keys(profilesByWeek).sort().at(-1)
  if (latestWeekKey) {
    const daysWithoutProfileUpdate = diffDays(latestWeekKey, todayKey)

    if (daysWithoutProfileUpdate >= 7) {
      notifications.push({
        id: 'weight-stale',
        severity: 'warning',
        title: 'Actualiza tu peso',
        message: `Llevas ${daysWithoutProfileUpdate} días sin actualizar el peso semanal.`,
      })
      notifications.push({
        id: 'waist-stale',
        severity: 'warning',
        title: 'Actualiza tu cintura',
        message: `Llevas ${daysWithoutProfileUpdate} días sin actualizar el perímetro de cintura.`,
      })
    }
  }

  const latestMealDate = Object.entries(loggedMealsByDate)
    .filter(([, items]) => items.length > 0)
    .map(([dateKey]) => dateKey)
    .sort()
    .at(-1)

  if (latestMealDate) {
    const hoursWithoutLog = diffHours(latestMealDate, todayKey)
    if (hoursWithoutLog >= 24) {
      notifications.push({
        id: 'food-log-stale',
        severity: 'warning',
        title: 'Registro de comidas pendiente',
        message: `Llevas ${Math.floor(hoursWithoutLog)} horas sin registrar ninguna comida.`,
      })
    }
  } else {
    notifications.push({
      id: 'food-log-empty',
      severity: 'warning',
      title: 'Todavía no hay comidas registradas',
      message: 'Empieza tu registro diario para que podamos seguir tu progreso.',
    })
  }

  const weeklyNotifications = buildWeeklyProgressNotifications(
    profilesByWeek,
    fallbackProfile,
    currentWeekKey,
  )

  return [...notifications, ...weeklyNotifications]
}

function buildWeeklyProgressNotifications(
  profilesByWeek: Record<string, ProfileState>,
  fallbackProfile: ProfileState,
  currentWeekKey: string,
) {
  const entries = Object.entries(profilesByWeek).sort(([left], [right]) => left.localeCompare(right))
  if (entries.length < 2) {
    return []
  }

  const [, previousProfile] = entries.at(-2) ?? [currentWeekKey, fallbackProfile]
  const [latestWeekKey, latestProfile] = entries.at(-1) ?? [currentWeekKey, fallbackProfile]

  if (latestWeekKey !== currentWeekKey) {
    return []
  }

  const notifications: AppNotification[] = []

  pushProgressNotification(
    notifications,
    'progress-weight',
    'Peso',
    compareWeight(previousProfile.weightKg, latestProfile.weightKg, latestProfile.goal),
    `${previousProfile.weightKg.toLocaleString('es-AR')} kg -> ${latestProfile.weightKg.toLocaleString('es-AR')} kg`,
  )

  pushProgressNotification(
    notifications,
    'progress-waist',
    'Perímetro de cintura',
    compareLowerIsBetter(previousProfile.waistCm, latestProfile.waistCm),
    `${previousProfile.waistCm.toLocaleString('es-AR')} cm -> ${latestProfile.waistCm.toLocaleString('es-AR')} cm`,
  )

  const previousBmi = roundToOne(previousProfile.weightKg / (previousProfile.heightCm / 100) ** 2)
  const latestBmi = roundToOne(latestProfile.weightKg / (latestProfile.heightCm / 100) ** 2)
  pushProgressNotification(
    notifications,
    'progress-bmi',
    'IMC',
    compareBmi(previousBmi, latestBmi),
    `${previousBmi.toLocaleString('es-AR')} -> ${latestBmi.toLocaleString('es-AR')}`,
  )

  const previousIce = roundToTwo(previousProfile.waistCm / previousProfile.heightCm)
  const latestIce = roundToTwo(latestProfile.waistCm / latestProfile.heightCm)
  pushProgressNotification(
    notifications,
    'progress-ice',
    'ICE',
    compareLowerIsBetter(previousIce, latestIce),
    `${previousIce.toLocaleString('es-AR')} -> ${latestIce.toLocaleString('es-AR')}`,
  )

  return notifications
}

function pushProgressNotification(
  notifications: AppNotification[],
  id: string,
  metric: string,
  direction: 'improved' | 'worsened' | 'stable',
  message: string,
) {
  if (direction === 'stable') {
    return
  }

  notifications.push({
    id,
    severity: direction === 'improved' ? 'success' : 'error',
    title: `${metric} ${direction === 'improved' ? 'mejoró' : 'empeoró'} esta semana`,
    message,
  })
}

function compareWeight(previous: number, current: number, goal: Goal) {
  const delta = roundToOne(current - previous)

  if (goal === 'fat-loss') {
    if (delta < -0.2) {
      return 'improved'
    }
    if (delta > 0.2) {
      return 'worsened'
    }
    return 'stable'
  }

  if (goal === 'muscle') {
    if (delta > 0.2) {
      return 'improved'
    }
    if (delta < -0.2) {
      return 'worsened'
    }
    return 'stable'
  }

  if (Math.abs(delta) <= 0.3) {
    return 'stable'
  }

  return 'worsened'
}

function compareLowerIsBetter(previous: number, current: number) {
  const delta = roundToTwo(current - previous)
  if (delta < 0) {
    return 'improved'
  }
  if (delta > 0) {
    return 'worsened'
  }
  return 'stable'
}

function compareBmi(previous: number, current: number) {
  const previousDistance = Math.abs(previous - 22)
  const currentDistance = Math.abs(current - 22)

  if (currentDistance < previousDistance) {
    return 'improved'
  }
  if (currentDistance > previousDistance) {
    return 'worsened'
  }
  return 'stable'
}

function diffDays(fromDateKey: string, toDateKey: string) {
  const from = new Date(`${fromDateKey}T12:00:00`)
  const to = new Date(`${toDateKey}T12:00:00`)
  return Math.floor((to.getTime() - from.getTime()) / 86400000)
}

function diffHours(fromDateKey: string, toDateKey: string) {
  const from = new Date(`${fromDateKey}T12:00:00`)
  const to = new Date(`${toDateKey}T12:00:00`)
  return (to.getTime() - from.getTime()) / 3600000
}

function roundToOne(value: number) {
  return Math.round(value * 10) / 10
}

function roundToTwo(value: number) {
  return Math.round(value * 100) / 100
}
