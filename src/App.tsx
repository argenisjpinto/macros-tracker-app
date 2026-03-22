import './App.css'
import { useEffect, useMemo, useState } from 'react'
import { onAuthStateChanged, type User } from 'firebase/auth'
import { BottomNav } from './components/dashboard/BottomNav'
import { CreateExtraModal } from './components/dashboard/CreateExtraModal'
import { FloatingActionButton } from './components/dashboard/FloatingActionButton'
import { HeroSection } from './components/dashboard/HeroSection'
import { HistoryPage } from './components/history/HistoryPage'
import { LogPage } from './components/log/LogPage'
import { MacroGrid } from './components/dashboard/MacroGrid'
import { MealSummarySection } from './components/dashboard/MealSummarySection'
import { ProfilePage } from './components/profile/ProfilePage'
import { TopAppBar } from './components/dashboard/TopAppBar'
import type { LoggedMealItem, LoggedMealsByDate } from './components/log/types'
import type { ProfileState } from './components/profile/types'
import { auth, isFirebaseConfigured } from './config/firebase'
import { signInWithGoogle, signOutFromGoogle } from './services/auth'
import { loadUserAppState, saveUserAppState } from './services/firestore'
import {
  calculateAgeFromBirthDate,
  getDateKey,
  getWeekKey,
} from './utils/date'
import { buildNotifications } from './utils/notifications'
import { calculateNutritionPlan } from './utils/nutrition'

export type View = 'home' | 'log' | 'profile' | 'history'
export type Theme = 'light' | 'dark'

function buildDefaultProfilesByWeek(currentWeekKey: string): Record<string, ProfileState> {
  return {
    [currentWeekKey]: {
      activityLevel: 'sedentary',
      birthDate: '',
      goal: 'maintenance',
      heightCm: 0,
      sex: 'male',
      waistCm: 0,
      weightKg: 0,
    },
  }
}

function App() {
  const todayDate = getDateKey(new Date())
  const currentWeekKey = getWeekKey(new Date())
  const defaultProfilesByWeek = useMemo(
    () => buildDefaultProfilesByWeek(currentWeekKey),
    [currentWeekKey],
  )
  const [view, setView] = useState<View>('home')
  const [theme, setTheme] = useState<Theme>('light')
  const [user, setUser] = useState<User | null>(null)
  const [isAuthLoading, setIsAuthLoading] = useState(isFirebaseConfigured)
  const [isUserDataReady, setIsUserDataReady] = useState(false)
  const [selectedLogDate, setSelectedLogDate] = useState(todayDate)
  const [loggedMealsByDate, setLoggedMealsByDate] = useState<LoggedMealsByDate>({})
  const [isExtraModalOpen, setIsExtraModalOpen] = useState(false)
  const [extraName, setExtraName] = useState('')
  const [selectedProfileWeek, setSelectedProfileWeek] = useState(currentWeekKey)
  const [profilesByWeek, setProfilesByWeek] =
    useState<Record<string, ProfileState>>(defaultProfilesByWeek)

  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
  }, [theme])

  useEffect(() => {
    if (!auth) {
      setIsAuthLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser)
      setIsAuthLoading(false)
    })

    return unsubscribe
  }, [])

  useEffect(() => {
    let isCancelled = false

    async function hydrateUserData() {
      if (!user) {
        setLoggedMealsByDate({})
        setProfilesByWeek(defaultProfilesByWeek)
        setSelectedLogDate(todayDate)
        setSelectedProfileWeek(currentWeekKey)
        setTheme('light')
        setIsUserDataReady(true)
        return
      }

      setIsUserDataReady(false)
      const persistedData = await loadUserAppState(user.uid)

      if (isCancelled) {
        return
      }

      setLoggedMealsByDate(
        persistedData?.loggedMealsByDate && Object.keys(persistedData.loggedMealsByDate).length > 0
          ? persistedData.loggedMealsByDate
          : {},
      )
      setProfilesByWeek(
        persistedData?.profilesByWeek && Object.keys(persistedData.profilesByWeek).length > 0
          ? persistedData.profilesByWeek
          : defaultProfilesByWeek,
      )
      setSelectedLogDate(todayDate)
      setSelectedProfileWeek(currentWeekKey)
      setTheme(persistedData?.theme ?? 'light')
      setIsUserDataReady(true)
    }

    void hydrateUserData()

    return () => {
      isCancelled = true
    }
  }, [currentWeekKey, defaultProfilesByWeek, todayDate, user])

  useEffect(() => {
    if (!user || !isUserDataReady) {
      return
    }

    void saveUserAppState(user.uid, {
      loggedMealsByDate,
      profilesByWeek,
      theme,
    })
  }, [isUserDataReady, loggedMealsByDate, profilesByWeek, theme, user])

  const profile = profilesByWeek[selectedProfileWeek] ?? profilesByWeek[currentWeekKey]
  const age = calculateAgeFromBirthDate(profile.birthDate, selectedProfileWeek)
  const nutritionPlan = calculateNutritionPlan(profile, selectedProfileWeek)
  const todayItems = loggedMealsByDate[todayDate] ?? []
  const selectedLogItems = loggedMealsByDate[selectedLogDate] ?? []
  const notifications = useMemo(
    () => buildNotifications(loggedMealsByDate, profilesByWeek, profile, new Date()),
    [loggedMealsByDate, profilesByWeek, profile],
  )

  const displayName = user?.displayName ?? null
  const photoURL = user?.photoURL ?? null
  const isAuthenticated = Boolean(user)

  const handleSignInGoogle = async () => {
    try {
      setIsAuthLoading(true)
      await signInWithGoogle()
    } catch (error) {
      console.error('No se pudo iniciar sesión con Google', error)
      setIsAuthLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      setIsAuthLoading(true)
      await signOutFromGoogle()
    } catch (error) {
      console.error('No se pudo cerrar sesión', error)
      setIsAuthLoading(false)
    }
  }

  const updateSelectedLogItems = (
    updater: (current: LoggedMealItem[]) => LoggedMealItem[],
  ) => {
    setLoggedMealsByDate((current) => ({
      ...current,
      [selectedLogDate]: updater(current[selectedLogDate] ?? []),
    }))
  }

  const updateSelectedProfile = (
    updater: (current: ProfileState) => ProfileState,
  ) => {
    setProfilesByWeek((current) => ({
      ...current,
      [selectedProfileWeek]: updater(current[selectedProfileWeek] ?? profile),
    }))
  }

  const changeSelectedProfileWeek = (weekKey: string) => {
    setProfilesByWeek((current) => {
      if (current[weekKey]) {
        return current
      }

      return {
        ...current,
        [weekKey]: { ...profile },
      }
    })
    setSelectedProfileWeek(weekKey)
  }

  const createExtraItem = () => {
    const trimmedName = extraName.trim()
    if (!trimmedName) {
      return
    }

    setLoggedMealsByDate((current) => ({
      ...current,
      [todayDate]: [
        ...(current[todayDate] ?? []),
        {
          id: `extra-${Date.now()}`,
          meal: 'extra',
          mealLabel: trimmedName,
          name: trimmedName,
          grams: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
          fiber: 0,
          calories: 0,
          detail: 'Extra personalizado - Pendiente de completar',
        },
      ],
    }))
    setExtraName('')
    setIsExtraModalOpen(false)
  }

  return (
    <div className="bg-background font-body text-on-background antialiased selection:bg-primary-container selection:text-on-primary-container">
      {view === 'home' ? (
        <>
          <TopAppBar
            displayName={displayName}
            isAuthAvailable={isFirebaseConfigured}
            isAuthLoading={isAuthLoading}
            isAuthenticated={isAuthenticated}
            notifications={notifications}
            onSignInGoogle={handleSignInGoogle}
            onSignOut={handleSignOut}
            photoURL={photoURL}
          />

          <main className="pt-24 pb-32 px-6 max-w-7xl mx-auto">
            <HeroSection items={todayItems} targetCalories={nutritionPlan.calories} />
            <MacroGrid items={todayItems} targets={nutritionPlan} />
            <MealSummarySection
              items={todayItems}
              onAddExtra={() => setIsExtraModalOpen(true)}
              targetCalories={nutritionPlan.calories}
            />
          </main>

          <FloatingActionButton onClick={() => setIsExtraModalOpen(true)} />
          <BottomNav view={view} onNavigate={setView} variant="dashboard" />
        </>
      ) : view === 'log' ? (
        <LogPage
          calorieTarget={nutritionPlan.calories}
          cholesterolTargetMg={nutritionPlan.cholesterolTargetMg}
          displayName={displayName}
          isAuthAvailable={isFirebaseConfigured}
          isAuthLoading={isAuthLoading}
          isAuthenticated={isAuthenticated}
          loggedItems={selectedLogItems}
          notifications={notifications}
          onDateChange={setSelectedLogDate}
          onLoggedItemsChange={updateSelectedLogItems}
          onNavigate={setView}
          onSignInGoogle={handleSignInGoogle}
          onSignOut={handleSignOut}
          photoURL={photoURL}
          saturatedFatTargetGrams={nutritionPlan.saturatedFatTargetGrams}
          selectedDate={selectedLogDate}
          sugarTargetGrams={nutritionPlan.sugarTargetGrams}
          todayDate={todayDate}
          waterTargetMl={nutritionPlan.hydrationLiters * 1000}
          view={view}
        />
      ) : view === 'profile' ? (
        <ProfilePage
          age={age}
          displayName={displayName}
          isAuthAvailable={isFirebaseConfigured}
          isAuthLoading={isAuthLoading}
          isAuthenticated={isAuthenticated}
          notifications={notifications}
          nutritionPlan={nutritionPlan}
          onNavigate={setView}
          onSignInGoogle={handleSignInGoogle}
          onSignOut={handleSignOut}
          onThemeChange={setTheme}
          onWeekChange={changeSelectedProfileWeek}
          photoURL={photoURL}
          profile={profile}
          selectedWeek={selectedProfileWeek}
          setProfile={updateSelectedProfile}
          theme={theme}
          view={view}
        />
      ) : (
        <HistoryPage
          displayName={displayName}
          isAuthAvailable={isFirebaseConfigured}
          isAuthLoading={isAuthLoading}
          isAuthenticated={isAuthenticated}
          loggedMealsByDate={loggedMealsByDate}
          notifications={notifications}
          onNavigate={setView}
          onSignInGoogle={handleSignInGoogle}
          onSignOut={handleSignOut}
          photoURL={photoURL}
          profile={profile}
          profilesByWeek={profilesByWeek}
          view={view}
        />
      )}

      {isExtraModalOpen ? (
        <CreateExtraModal
          name={extraName}
          onChangeName={setExtraName}
          onClose={() => {
            setExtraName('')
            setIsExtraModalOpen(false)
          }}
          onCreate={createExtraItem}
        />
      ) : null}
    </div>
  )
}

export default App
