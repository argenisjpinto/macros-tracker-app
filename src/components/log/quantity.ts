import type { FoodUnit } from './types'

export function formatAmount(amount: number, unit: FoodUnit) {
  const roundedAmount = shouldUseInteger(unit)
    ? Math.round(amount)
    : Number.isInteger(amount)
      ? amount.toString()
      : amount.toFixed(1)

  return `${roundedAmount}${getUnitSuffix(unit, amount)}`
}

export function getUnitLabel(unit: FoodUnit, amount: number, uppercase = false) {
  const label = getUnitWord(unit, amount)
  return uppercase ? label.toUpperCase() : label
}

export function getAmountStep(unit: FoodUnit) {
  return shouldUseInteger(unit) ? 1 : 50
}

export function getAmountMin(unit: FoodUnit) {
  return shouldUseInteger(unit) ? 1 : 0
}

function getUnitSuffix(unit: FoodUnit, amount: number) {
  if (unit === 'g' || unit === 'ml') {
    return unit
  }

  return ` ${getUnitWord(unit, amount)}`
}

function getUnitWord(unit: FoodUnit, amount: number) {
  if (unit === 'rebanada') {
    return Math.abs(amount) === 1 ? 'rebanada' : 'rebanadas'
  }

  if (unit === 'unidad') {
    return Math.abs(amount) === 1 ? 'unidad' : 'unidades'
  }

  return unit === 'ml' ? 'mililitros' : 'gramos'
}

function shouldUseInteger(unit: FoodUnit) {
  return unit === 'unidad' || unit === 'rebanada'
}
