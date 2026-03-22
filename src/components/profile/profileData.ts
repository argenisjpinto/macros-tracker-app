import type { ActivityLevel, Goal } from './types'

export const biometricFields = [
  { key: 'weightKg', label: 'Peso Actual', suffix: 'KG' },
  { key: 'heightCm', label: 'Estatura', suffix: 'CM' },
  { key: 'waistCm', label: 'Perímetro de Cintura', suffix: 'CM' },
] as const

export const goals: Array<{
  description: string
  icon: string
  key: Goal
  label: string
}> = [
  {
    key: 'muscle',
    label: 'Ganar Músculo',
    icon: 'fitness_center',
    description: 'Superávit moderado para favorecer hipertrofia.',
  },
  {
    key: 'fat-loss',
    label: 'Perder Grasa',
    icon: 'trending_down',
    description: 'Déficit calórico con énfasis en preservar masa magra.',
  },
  {
    key: 'maintenance',
    label: 'Mantenimiento',
    icon: 'balance',
    description: 'Mantener peso y cubrir requerimientos diarios.',
  },
] as const

export const activityLevels: Array<{
  description: string
  key: ActivityLevel
  label: string
}> = [
  {
    key: 'sedentary',
    label: 'Sedentario',
    description: 'Poco o nada de ejercicio planificado.',
  },
  {
    key: 'light',
    label: 'Ligero',
    description: 'Actividad suave de 1 a 3 días por semana.',
  },
  {
    key: 'moderate',
    label: 'Moderado',
    description: 'Entrenamiento regular de 3 a 5 días por semana.',
  },
  {
    key: 'very-active',
    label: 'Muy Activo',
    description: 'Entrenamiento intenso o trabajo físico frecuente.',
  },
] as const
