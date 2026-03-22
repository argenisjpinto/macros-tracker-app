import { useEffect, useMemo, useState } from 'react'
import foodsDatabase from '../../data/foods.json'
import type { View } from '../../App'
import { BottomNav } from '../dashboard/BottomNav'
import { DailySummaryCard } from './DailySummaryCard'
import { LogDateSection } from './LogDateSection'
import { LogTopAppBar } from './LogTopAppBar'
import { MealsTimeline } from './MealsTimeline'
import { formatAmount } from './quantity'
import { SearchSection } from './SearchSection'
import type { FoodRecord, LoggedMealItem, MealKey } from './types'
import { getInitialFoods, searchFoods } from '../../services/foodLocal'
import type { AppNotification } from '../../utils/notifications'

type LogPageProps = {
  calorieTarget: number
  cholesterolTargetMg: number
  displayName: string | null
  isAuthAvailable: boolean
  isAuthLoading: boolean
  isAuthenticated: boolean
  loggedItems: LoggedMealItem[]
  notifications: AppNotification[]
  onDateChange: (dateKey: string) => void
  onLoggedItemsChange: (updater: (current: LoggedMealItem[]) => LoggedMealItem[]) => void
  onNavigate: (view: View) => void
  onSignInGoogle: () => void
  onSignOut: () => void
  photoURL: string | null
  saturatedFatTargetGrams: number
  selectedDate: string
  sugarTargetGrams: number
  todayDate: string
  waterTargetMl: number
  view: View
}

export function LogPage({
  calorieTarget,
  cholesterolTargetMg,
  displayName,
  isAuthAvailable,
  isAuthLoading,
  isAuthenticated,
  loggedItems,
  notifications,
  onDateChange,
  onLoggedItemsChange,
  onNavigate,
  onSignInGoogle,
  onSignOut,
  photoURL,
  saturatedFatTargetGrams,
  selectedDate,
  sugarTargetGrams,
  todayDate,
  waterTargetMl,
  view,
}: LogPageProps) {
  const foods = foodsDatabase as FoodRecord[]
  const [search, setSearch] = useState('')
  const [selectedMeal, setSelectedMeal] = useState<MealKey>('almuerzo')
  const [selectedExtraLabel, setSelectedExtraLabel] = useState<string | null>(null)
  const [amount, setAmount] = useState(foods[0]?.servingBase ?? 100)
  const [selectedFood, setSelectedFood] = useState<FoodRecord | null>(foods[0] ?? null)
  const [selectedLoggedItemId, setSelectedLoggedItemId] = useState<string | null>(null)

  useEffect(() => {
    setSelectedLoggedItemId(null)
  }, [selectedDate])

  useEffect(() => {
    if (selectedMeal !== 'extra') {
      setSelectedExtraLabel(null)
    }
  }, [selectedMeal])

  useEffect(() => {
    if (!selectedFood) {
      return
    }

    setAmount(selectedFood.servingBase)
  }, [selectedFood?.id])

  const filteredFoods = useMemo(() => {
    if (!search.trim()) {
      return getInitialFoods(foods, loggedItems)
    }

    return searchFoods(search, foods)
  }, [foods, loggedItems, search])

  useEffect(() => {
    if (filteredFoods.length === 0) {
      setSelectedFood(null)
      return
    }

    setSelectedFood((current) => {
      if (current && (!search.trim() || filteredFoods.some((food) => food.id === current.id))) {
        return current
      }

      return filteredFoods[0]
    })
  }, [filteredFoods, search])

  const extraMealOptions = useMemo(() => {
    const labels = new Set<string>()

    loggedItems.forEach((item) => {
      if (item.meal !== 'extra') {
        return
      }

      const label = item.mealLabel ?? item.name
      if (label) {
        labels.add(label)
      }
    })

    return Array.from(labels).map((label) => ({
      key: 'extra' as const,
      label,
    }))
  }, [loggedItems])

  const mealOptions = useMemo(
    () => [
      { key: 'desayuno' as const, label: 'Desayuno' },
      { key: 'pre-entreno' as const, label: 'Pre Entreno' },
      { key: 'almuerzo' as const, label: 'Almuerzo' },
      { key: 'merienda' as const, label: 'Merienda' },
      { key: 'cena' as const, label: 'Cena' },
      ...extraMealOptions,
    ],
    [extraMealOptions],
  )

  const addSelectedFood = () => {
    if (!selectedFood || !amount || amount <= 0) {
      return
    }

    const ratio = amount / selectedFood.servingBase
    const protein = roundToOne(selectedFood.protein * ratio)
    const carbs = roundToOne(selectedFood.carbs * ratio)
    const fat = roundToOne(selectedFood.fat * ratio)
    const fiber = roundToOne(selectedFood.fiber * ratio)
    const sugar = roundToOne((selectedFood.sugar ?? 0) * ratio)
    const cholesterol = roundToOne((selectedFood.cholesterol ?? 0) * ratio)
    const saturatedFat = roundToOne((selectedFood.saturatedFat ?? 0) * ratio)
    const water = roundToOne((selectedFood.water ?? 0) * ratio)
    const calories = Math.round(selectedFood.calories * ratio)
    const gramsEquivalent = roundToOne(
      (selectedFood.servingWeightGrams ?? selectedFood.servingBase) * ratio,
    )

    const nextItem: LoggedMealItem = {
      amount,
      id: `${selectedFood.id}-${selectedMeal}-${Date.now()}`,
      meal: selectedMeal,
      mealLabel: selectedMeal === 'extra' ? selectedExtraLabel ?? 'Extra' : undefined,
      name: selectedFood.name,
      grams: gramsEquivalent,
      protein,
      carbs,
      fat,
      fiber,
      sugar,
      cholesterol,
      saturatedFat,
      water,
      calories,
      detail: `${formatAmount(amount, selectedFood.unit)} • P: ${protein}g C: ${carbs}g F: ${fat}g`,
      unit: selectedFood.unit,
    }

    onLoggedItemsChange((current) => [...current, nextItem])
    setSelectedLoggedItemId(nextItem.id)
    setSearch('')
  }

  const removeLoggedItem = (itemId: string) => {
    onLoggedItemsChange((current) => current.filter((item) => item.id !== itemId))
    setSelectedLoggedItemId((current) => (current === itemId ? null : current))
  }

  return (
    <>
      <LogTopAppBar
        displayName={displayName}
        isAuthAvailable={isAuthAvailable}
        isAuthLoading={isAuthLoading}
        isAuthenticated={isAuthenticated}
        notifications={notifications}
        onSignInGoogle={onSignInGoogle}
        onSignOut={onSignOut}
        photoURL={photoURL}
      />

      <main className="max-w-7xl mx-auto px-6 pt-4 space-y-8 pb-32">
        <LogDateSection
          onDateChange={onDateChange}
          selectedDate={selectedDate}
          todayDate={todayDate}
        />
        <SearchSection
          amount={amount}
          foods={filteredFoods}
          mealOptions={mealOptions}
          onAdd={addSelectedFood}
          onAmountChange={setAmount}
          onSearchChange={setSearch}
          onSelectFood={(food) => {
            setSelectedFood(food)
            setSearch('')
          }}
          onSelectMeal={(meal, mealLabel) => {
            setSelectedMeal(meal)
            setSelectedExtraLabel(meal === 'extra' ? mealLabel ?? null : null)
          }}
          search={search}
          selectedFood={selectedFood}
          selectedExtraLabel={selectedExtraLabel}
          selectedMeal={selectedMeal}
        />
        <DailySummaryCard
          cholesterolTargetMg={cholesterolTargetMg}
          goalCalories={calorieTarget}
          items={loggedItems}
          saturatedFatTargetGrams={saturatedFatTargetGrams}
          sugarTargetGrams={sugarTargetGrams}
          waterTargetMl={waterTargetMl}
        />
        <MealsTimeline
          items={loggedItems}
          onDeleteItem={removeLoggedItem}
          onSelectItem={setSelectedLoggedItemId}
          onSelectMeal={(meal, mealLabel) => {
            setSelectedMeal(meal)
            setSelectedExtraLabel(meal === 'extra' ? mealLabel ?? null : null)
          }}
          selectedLoggedItemId={selectedLoggedItemId}
          selectedExtraLabel={selectedExtraLabel}
          selectedMeal={selectedMeal}
        />
      </main>

      <BottomNav onNavigate={onNavigate} variant="log" view={view} />
    </>
  )
}

function roundToOne(value: number) {
  return Math.round(value * 10) / 10
}
