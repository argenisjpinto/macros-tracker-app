import { AppTopBar } from '../shared/AppTopBar'
import type { AppNotification } from '../../utils/notifications'

type TopAppBarProps = {
  displayName: string | null
  isAuthAvailable: boolean
  isAuthLoading: boolean
  isAuthenticated: boolean
  notifications: AppNotification[]
  onSignInGoogle: () => void
  onSignOut: () => void
  photoURL: string | null
}

export function TopAppBar(props: TopAppBarProps) {
  return (
    <AppTopBar
      className="bg-[#f9f6f5] dark:bg-[#1a1a1a] fixed top-0 left-0 right-0 z-50"
      {...props}
    />
  )
}
