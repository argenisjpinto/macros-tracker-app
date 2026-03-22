import { AppTopBar } from '../shared/AppTopBar'
import type { AppNotification } from '../../utils/notifications'

type LogTopAppBarProps = {
  displayName: string | null
  isAuthAvailable: boolean
  isAuthLoading: boolean
  isAuthenticated: boolean
  notifications: AppNotification[]
  onSignInGoogle: () => void
  onSignOut: () => void
  photoURL: string | null
}

export function LogTopAppBar(props: LogTopAppBarProps) {
  return (
    <AppTopBar
      className="bg-[#f9f6f5] dark:bg-[#1a1a1a] docked full-width top-0 z-40 sticky"
      {...props}
    />
  )
}
