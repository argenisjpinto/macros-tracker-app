import type { View } from '../../App'
import type { LoggedMealsByDate } from '../log/types'
import type { ProfileState } from '../profile/types'
import { BottomNav } from '../dashboard/BottomNav'
import {
  buildBmiPoints,
  buildBodyIndicatorAccent,
  buildBodyIndicatorAccentClass,
  buildComplianceDays,
  buildHistoryInsight,
  buildWaistAccentClass,
  buildWaistPoints,
  buildWaistToHeightPoints,
  buildWeightAccentClass,
  buildWeightPoints,
} from '../../utils/history'
import { ChartsSection } from './ChartsSection'
import { ComplianceSection } from './ComplianceSection'
import { HistoryHero } from './HistoryHero'
import { HistoryTopAppBar } from './HistoryTopAppBar'
import { InsightCard } from './InsightCard'
import type { AppNotification } from '../../utils/notifications'

type HistoryPageProps = {
  displayName: string | null
  isAuthAvailable: boolean
  isAuthLoading: boolean
  isAuthenticated: boolean
  loggedMealsByDate: LoggedMealsByDate
  notifications: AppNotification[]
  onNavigate: (view: View) => void
  onSignInGoogle: () => void
  onSignOut: () => void
  photoURL: string | null
  profile: ProfileState
  profilesByWeek: Record<string, ProfileState>
  view: View
}

export function HistoryPage({
  displayName,
  isAuthAvailable,
  isAuthLoading,
  isAuthenticated,
  loggedMealsByDate,
  notifications,
  onNavigate,
  onSignInGoogle,
  onSignOut,
  photoURL,
  profile,
  profilesByWeek,
  view,
}: HistoryPageProps) {
  const weightPoints = buildWeightPoints(profilesByWeek)
  const waistPoints = buildWaistPoints(profilesByWeek)
  const bmiPoints = buildBmiPoints(profilesByWeek)
  const waistToHeightPoints = buildWaistToHeightPoints(profilesByWeek)
  const complianceDays = buildComplianceDays(loggedMealsByDate, profilesByWeek, profile)
  const insight = buildHistoryInsight(loggedMealsByDate, profilesByWeek, profile)

  return (
    <>
      <HistoryTopAppBar
        displayName={displayName}
        isAuthAvailable={isAuthAvailable}
        isAuthLoading={isAuthLoading}
        isAuthenticated={isAuthenticated}
        notifications={notifications}
        onSignInGoogle={onSignInGoogle}
        onSignOut={onSignOut}
        photoURL={photoURL}
      />

      <main className="max-w-7xl mx-auto px-6 pt-8 space-y-10 pb-32">
        <HistoryHero />
        <ChartsSection
          bmiAccent={buildBodyIndicatorAccent(bmiPoints, 'bmi')}
          bmiAccentClass={buildBodyIndicatorAccentClass(bmiPoints, 'bmi')}
          bmiPoints={bmiPoints}
          waistPoints={waistPoints}
          waistToHeightAccent={buildBodyIndicatorAccent(waistToHeightPoints, 'waist-height')}
          waistToHeightAccentClass={buildBodyIndicatorAccentClass(
            waistToHeightPoints,
            'waist-height',
          )}
          waistToHeightPoints={waistToHeightPoints}
          weightAccentClass={buildWeightAccentClass(weightPoints, profile.goal)}
          weightPoints={weightPoints}
          waistAccentClass={buildWaistAccentClass(waistPoints)}
        />
        <ComplianceSection complianceDays={complianceDays} />
        <InsightCard body={insight.body} title={insight.title} />
      </main>

      <BottomNav onNavigate={onNavigate} variant="history" view={view} />
    </>
  )
}
