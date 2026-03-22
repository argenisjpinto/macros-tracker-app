import type { Theme, View } from '../../App'
import { BottomNav } from '../dashboard/BottomNav'
import { ProfileFormSection } from './ProfileFormSection'
import { ProfileHero } from './ProfileHero'
import { ProfilePlanSection } from './ProfilePlanSection'
import { ProfileTopAppBar } from './ProfileTopAppBar'
import { ProfileWeekSection } from './ProfileWeekSection'
import { ThemeSwitch } from './ThemeSwitch'
import type { NutritionPlan, ProfileState } from './types'
import type { AppNotification } from '../../utils/notifications'

type ProfilePageProps = {
  age: number
  displayName: string | null
  isAuthAvailable: boolean
  isAuthLoading: boolean
  isAuthenticated: boolean
  notifications: AppNotification[]
  nutritionPlan: NutritionPlan
  onNavigate: (view: View) => void
  onSignInGoogle: () => void
  onSignOut: () => void
  onThemeChange: (theme: Theme) => void
  onWeekChange: (weekKey: string) => void
  photoURL: string | null
  profile: ProfileState
  selectedWeek: string
  setProfile: (updater: (current: ProfileState) => ProfileState) => void
  theme: Theme
  view: View
}

export function ProfilePage({
  age,
  displayName,
  isAuthAvailable,
  isAuthLoading,
  isAuthenticated,
  notifications,
  nutritionPlan,
  onNavigate,
  onSignInGoogle,
  onSignOut,
  onThemeChange,
  onWeekChange,
  photoURL,
  profile,
  selectedWeek,
  setProfile,
  theme,
  view,
}: ProfilePageProps) {
  return (
    <>
      <ProfileTopAppBar
        displayName={displayName}
        isAuthAvailable={isAuthAvailable}
        isAuthLoading={isAuthLoading}
        isAuthenticated={isAuthenticated}
        notifications={notifications}
        onSignInGoogle={onSignInGoogle}
        onSignOut={onSignOut}
        photoURL={photoURL}
      />

      <main className="max-w-7xl mx-auto px-6 pt-8 space-y-12 pb-32">
        <ThemeSwitch onThemeChange={onThemeChange} theme={theme} />
        <ProfileHero />
        <ProfileWeekSection onWeekChange={onWeekChange} selectedWeek={selectedWeek} />
        <ProfileFormSection age={age} profile={profile} setProfile={setProfile} />
        <ProfilePlanSection nutritionPlan={nutritionPlan} profile={profile} />
      </main>

      <BottomNav onNavigate={onNavigate} variant="profile" view={view} />
    </>
  )
}
