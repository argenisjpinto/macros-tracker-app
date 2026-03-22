import type { LoggedMealsByDate } from '../components/log/types'
import type { Goal, ProfileState } from '../components/profile/types'
import { formatDateLabel, getWeekKey } from './date'
import { calculateNutritionPlan } from './nutrition'

export type MetricPoint = {
  label: string
  value: number
}

export type ChartScaleMark = {
  label: string
  yPercent: number
}

export type ComplianceDay = {
  barClass: string
  date: string
  day: string
  description: string
  highlighted: boolean
  percent: string
  title: string
}

export type HistoryInsight = {
  body: string
  title: string
}

type MacroSnapshot = {
  calories: number
  carbs: number
  fat: number
  fiber: number
  protein: number
}

export function buildWeightPoints(profilesByWeek: Record<string, ProfileState>) {
  return buildMetricPoints(profilesByWeek, (profile) => profile.weightKg)
}

export function buildWaistPoints(profilesByWeek: Record<string, ProfileState>) {
  return buildMetricPoints(profilesByWeek, (profile) => profile.waistCm)
}

export function buildBmiPoints(profilesByWeek: Record<string, ProfileState>) {
  return buildMetricPoints(profilesByWeek, (profile) =>
    roundToOne(profile.weightKg / (profile.heightCm / 100) ** 2),
  )
}

export function buildWaistToHeightPoints(profilesByWeek: Record<string, ProfileState>) {
  return buildMetricPoints(profilesByWeek, (profile) =>
    roundToTwo(profile.waistCm / profile.heightCm),
  )
}

export function buildComplianceDays(
  loggedMealsByDate: LoggedMealsByDate,
  profilesByWeek: Record<string, ProfileState>,
  fallbackProfile: ProfileState,
) {
  return Object.entries(loggedMealsByDate)
    .sort(([left], [right]) => right.localeCompare(left))
    .slice(0, 7)
    .map(([dateKey, items], index): ComplianceDay => {
      const profile = profilesByWeek[getWeekKey(new Date(`${dateKey}T12:00:00`))] ?? fallbackProfile
      const targets = calculateNutritionPlan(profile, dateKey)
      const consumed = items.reduce(
        (acc, item) => {
          acc.calories += item.calories
          acc.protein += item.protein
          acc.carbs += item.carbs
          acc.fat += item.fat
          acc.fiber += item.fiber
          return acc
        },
        { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
      )

      const percentValue = Math.round(
        average([
          complianceScore(consumed.calories, targets.calories),
          complianceScore(consumed.protein, targets.protein),
          complianceScore(consumed.carbs, targets.carbs),
          complianceScore(consumed.fat, targets.fat),
          complianceScore(consumed.fiber, targets.fiber),
        ]),
      )

      return {
        barClass:
          percentValue >= 90
            ? `kinetic-gradient w-[${percentValue}%]`
            : percentValue >= 75
              ? `bg-tertiary w-[${percentValue}%]`
              : `bg-error w-[${percentValue}%]`,
        date: new Date(`${dateKey}T12:00:00`).getDate().toString(),
        day: formatShortWeekday(dateKey),
        description: buildComplianceDescription(consumed, targets),
        highlighted: index === 0,
        percent: `${percentValue}%`,
        title: capitalize(formatDateLabel(dateKey)),
      }
    })
}

export function buildHistoryInsight(
  loggedMealsByDate: LoggedMealsByDate,
  profilesByWeek: Record<string, ProfileState>,
  fallbackProfile: ProfileState,
) {
  const weightPoints = buildWeightPoints(profilesByWeek)
  const complianceDays = buildComplianceDays(loggedMealsByDate, profilesByWeek, fallbackProfile)
  const firstWeight = weightPoints[0]?.value ?? fallbackProfile.weightKg
  const lastWeight = weightPoints.at(-1)?.value ?? fallbackProfile.weightKg
  const weightDelta = roundToOne(lastWeight - firstWeight)
  const adherence = Math.round(
    average(complianceDays.map((day) => Number(day.percent.replace('%', '')))),
  )

  const weightCopy =
    weightDelta === 0
      ? 'Tu peso se mantiene estable.'
      : weightDelta < 0
        ? `Tu peso bajó ${Math.abs(weightDelta).toLocaleString('es-AR')} kg.`
        : `Tu peso subió ${Math.abs(weightDelta).toLocaleString('es-AR')} kg.`

  return {
    title: `${weightCopy} Tu adherencia reciente es de ${adherence}% al plan.`,
    body:
      adherence >= 85
        ? 'Hay una muy buena consistencia entre tus registros del log y tus objetivos semanales del perfil.'
        : 'Todavía hay margen para mejorar la consistencia entre lo registrado en el log y tus objetivos semanales.',
  } satisfies HistoryInsight
}

export function buildMetricAccent(points: MetricPoint[], unit: string) {
  const firstValue = points[0]?.value ?? 0
  const lastValue = points.at(-1)?.value ?? 0
  const delta = roundToOne(lastValue - firstValue)
  const prefix = delta > 0 ? '+' : ''
  return `${prefix}${delta.toLocaleString('es-AR')} ${unit}`
}

export function buildMetricValue(points: MetricPoint[]) {
  return `${(points.at(-1)?.value ?? 0).toLocaleString('es-AR')}`
}

export function buildBodyIndicatorAccent(points: MetricPoint[], kind: 'bmi' | 'waist-height') {
  const current = points.at(-1)?.value ?? 0

  if (kind === 'bmi') {
    if (current < 18.5) {
      return 'Bajo peso'
    }

    if (current < 25) {
      return 'Rango saludable'
    }

    if (current < 30) {
      return 'Sobrepeso'
    }

    return 'Obesidad'
  }

  if (current < 0.5) {
    return 'Riesgo bajo'
  }

  if (current < 0.6) {
    return 'Riesgo moderado'
  }

  return 'Riesgo alto'
}

export function buildBodyIndicatorAccentClass(
  points: MetricPoint[],
  kind: 'bmi' | 'waist-height',
) {
  const current = points.at(-1)?.value ?? 0

  if (kind === 'bmi') {
    if (current >= 18.5 && current < 25) {
      return 'text-emerald-600'
    }

    if (current < 18.5 || current < 30) {
      return 'text-amber-600'
    }

    return 'text-rose-600'
  }

  if (current < 0.5) {
    return 'text-emerald-600'
  }

  if (current < 0.6) {
    return 'text-amber-600'
  }

  return 'text-rose-600'
}

export function buildWeightAccentClass(points: MetricPoint[], goal: Goal) {
  const delta = (points.at(-1)?.value ?? 0) - (points[0]?.value ?? 0)
  const absoluteDelta = Math.abs(delta)

  if (goal === 'maintenance') {
    if (absoluteDelta <= 0.3) {
      return 'text-emerald-600'
    }

    if (absoluteDelta <= 1) {
      return 'text-amber-600'
    }

    return 'text-rose-600'
  }

  if (goal === 'fat-loss') {
    if (delta < -0.2) {
      return 'text-emerald-600'
    }

    if (delta <= 0.2) {
      return 'text-amber-600'
    }

    return 'text-rose-600'
  }

  if (delta > 0.2) {
    return 'text-emerald-600'
  }

  if (delta >= -0.2) {
    return 'text-amber-600'
  }

  return 'text-rose-600'
}

export function buildWaistAccentClass(points: MetricPoint[]) {
  const delta = (points.at(-1)?.value ?? 0) - (points[0]?.value ?? 0)

  if (delta < -1) {
    return 'text-emerald-600'
  }

  if (delta <= 1) {
    return 'text-amber-600'
  }

  return 'text-rose-600'
}

export function buildChartPath(points: MetricPoint[]) {
  if (points.length === 0) {
    return ''
  }

  const values = points.map((point) => point.value)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1

  return points
    .map((point, index) => {
      const x = points.length === 1 ? 200 : (400 / (points.length - 1)) * index
      const y = 80 - ((point.value - min) / range) * 60
      return `${index === 0 ? 'M' : 'L'}${x},${y}`
    })
    .join(' ')
}

export function buildChartDots(points: MetricPoint[]) {
  if (points.length === 0) {
    return []
  }

  const values = points.map((point) => point.value)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1

  return points.map((point, index) => ({
    label: point.label,
    value: point.value,
    x: points.length === 1 ? 200 : (400 / (points.length - 1)) * index,
    y: 80 - ((point.value - min) / range) * 60,
  }))
}

export function buildChartScaleMarks(
  points: MetricPoint[],
  kind: 'default' | 'waist-height' = 'default',
) {
  if (points.length === 0) {
    return buildScaleMarks([0, 0, 0], kind === 'waist-height' ? 2 : 1)
  }

  const values = points.map((point) => point.value)
  const min = Math.min(...values)
  const max = Math.max(...values)
  if (kind === 'waist-height') {
    const reference = 0.5
    const range = Math.max(Math.abs(max - reference), Math.abs(reference - min), 0.03)
    const top = reference + range
    const bottom = Math.max(0, reference - range)

    return buildScaleMarks([top, reference, bottom], 2)
  }

  if (Math.abs(max - min) < 0.001) {
    const spread = Math.max(Math.abs(max) * 0.02, 1)
    return buildScaleMarks([max + spread, max, Math.max(0, max - spread)], 1)
  }

  const middle = min + (max - min) / 2
  return buildScaleMarks([max, middle, min], 1)
}

function buildMetricPoints(
  profilesByWeek: Record<string, ProfileState>,
  selector: (profile: ProfileState) => number,
) {
  return Object.entries(profilesByWeek)
    .sort(([left], [right]) => left.localeCompare(right))
    .slice(-4)
    .map(([, profile], index, all): MetricPoint => ({
      label: index === all.length - 1 ? 'Hoy' : `Sem ${index + 1}`,
      value: selector(profile),
    }))
}

function buildComplianceDescription(
  consumed: MacroSnapshot,
  targets: MacroSnapshot,
) {
  const calorieDelta = consumed.calories - targets.calories
  const proteinDelta = consumed.protein - targets.protein

  if (calorieDelta > 150) {
    return 'Exceso moderado de calorías'
  }

  if (calorieDelta < -150) {
    return 'Quedaste por debajo de calorías'
  }

  if (proteinDelta >= 0) {
    return 'Excelente balance de proteínas'
  }

  return 'Cumplimiento casi total'
}

function complianceScore(consumed: number, target: number) {
  if (target <= 0) {
    return 100
  }

  const differenceRatio = Math.abs(consumed - target) / target
  return Math.max(0, 100 - differenceRatio * 100)
}

function formatShortWeekday(dateKey: string) {
  const weekday = new Intl.DateTimeFormat('es-AR', {
    weekday: 'short',
  }).format(new Date(`${dateKey}T12:00:00`))

  return weekday.replace('.', '')
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function average(values: number[]) {
  if (values.length === 0) {
    return 0
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length
}

function roundToOne(value: number) {
  return Math.round(value * 10) / 10
}

function roundToTwo(value: number) {
  return Math.round(value * 100) / 100
}

function buildScaleMarks(values: number[], decimals: number): ChartScaleMark[] {
  return values.map((value, index) => ({
    label: formatScaleWithDecimals(value, decimals),
    yPercent: index === 0 ? 20 : index === 1 ? 50 : 80,
  }))
}

function formatScaleWithDecimals(value: number, decimals: number) {
  if (decimals === 0 || Number.isInteger(value)) {
    return value.toString()
  }

  return value.toFixed(decimals).replace(/\.?0+$/, '')
}
