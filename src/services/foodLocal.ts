import type { FoodRecord, LoggedMealItem } from '../components/log/types'

export function searchFoods(query: string, foods: FoodRecord[]) {
  const normalized = normalizeText(query)

  if (!normalized) {
    return foods.slice(0, 8)
  }

  const queryTokens = normalized.split(' ').filter(Boolean)

  return foods
    .filter((food) => {
      const normalizedName = normalizeText(food.name)
      return queryTokens.every((token) => normalizedName.includes(token))
    })
    .sort((left, right) => scoreFoodMatch(right.name, normalized) - scoreFoodMatch(left.name, normalized))
    .slice(0, 8)
}

export function getInitialFoods(foods: FoodRecord[], loggedItems: LoggedMealItem[]) {
  const recentFoods = [...loggedItems]
    .reverse()
    .map((item) => foods.find((food) => food.name === item.name))
    .filter((food): food is FoodRecord => Boolean(food))
    .filter(
      (food, index, current) => current.findIndex((candidate) => candidate.id === food.id) === index,
    )
    .slice(0, 3)

  const initialFoods = foods.filter(
    (food) => !recentFoods.some((recentFood) => recentFood.id === food.id),
  )

  return [...recentFoods, ...initialFoods].slice(0, 3)
}

function scoreFoodMatch(name: string, normalizedQuery: string) {
  const normalizedName = normalizeText(name)
  const startsWithQuery = normalizedName.startsWith(normalizedQuery) ? 1000 : 0
  const exactWordMatches = normalizedQuery
    .split(' ')
    .filter(Boolean)
    .filter((token) => normalizedName.split(' ').some((word) => word.startsWith(token))).length

  return startsWithQuery + exactWordMatches * 10 - normalizedName.length / 1000
}

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}
