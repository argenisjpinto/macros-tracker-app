import { useEffect, useMemo, useState } from 'react'
import type { AppNotification } from '../../utils/notifications'

type AppTopBarProps = {
  className: string
  displayName: string | null
  isAuthAvailable: boolean
  isAuthLoading: boolean
  isAuthenticated: boolean
  notifications: AppNotification[]
  onSignInGoogle: () => void
  onSignOut: () => void
  photoURL: string | null
}

export function AppTopBar({
  className,
  displayName,
  isAuthAvailable,
  isAuthLoading,
  isAuthenticated,
  notifications,
  onSignInGoogle,
  onSignOut,
  photoURL,
}: AppTopBarProps) {
  const firstName = displayName?.split(' ')[0] ?? 'Protagonista'
  const initial = firstName.charAt(0).toUpperCase() || 'U'
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [hasAvatarError, setHasAvatarError] = useState(false)
  const visibleCount = notifications.length > 9 ? '9+' : `${notifications.length}`
  const canShowAvatar = Boolean(photoURL) && !hasAvatarError
  useEffect(() => {
    setHasAvatarError(false)
  }, [photoURL])

  const notificationButtonClasses = useMemo(
    () =>
      notifications.length > 0
        ? 'w-10 h-10 relative flex items-center justify-center rounded-full bg-[#f3f8cf] dark:bg-[#2f3810] hover:bg-[#e6f0a8] dark:hover:bg-[#384413] transition-all duration-200 active:scale-95'
        : 'w-10 h-10 relative flex items-center justify-center rounded-full hover:bg-[#eae7e7]/50 dark:hover:bg-[#2f2e2e]/50 transition-all duration-200 active:scale-95',
    [notifications.length],
  )

  return (
    <header className={className}>
      <div className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto gap-4">
        {isAuthenticated ? (
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container-highest flex items-center justify-center text-on-surface font-bold">
              {canShowAvatar ? (
                <img
                  alt={displayName ?? 'Usuario'}
                  className="w-full h-full object-cover"
                  onError={() => setHasAvatarError(true)}
                  referrerPolicy="no-referrer"
                  src={photoURL ?? undefined}
                />
              ) : (
                <span>{initial}</span>
              )}
            </div>
            <h1 className="font-lexend headline-sm font-bold tracking-tight text-[#516200] dark:text-[#d4ff00] truncate">
              {`Hola, ${firstName}`}
            </h1>
          </div>
        ) : (
          <button
            className="inline-flex items-center gap-3 rounded-full bg-surface-container-highest px-4 py-2 text-on-surface font-bold transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-60"
            disabled={isAuthLoading || !isAuthAvailable}
            onClick={onSignInGoogle}
            type="button"
            title={
              isAuthAvailable
                ? 'Iniciar sesión con Google'
                : 'Configura Firebase en .env para habilitar Google Login'
            }
          >
            <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="w-5 h-5">
                <path
                  d="M21.8 12.23c0-.73-.06-1.43-.18-2.09H12v3.96h5.5a4.7 4.7 0 0 1-2.04 3.08v2.56h3.3c1.93-1.78 3.04-4.41 3.04-7.51Z"
                  fill="#4285F4"
                />
                <path
                  d="M12 22c2.76 0 5.08-.91 6.77-2.46l-3.3-2.56c-.91.61-2.08.98-3.47.98-2.66 0-4.92-1.8-5.73-4.22H2.86v2.64A10.22 10.22 0 0 0 12 22Z"
                  fill="#34A853"
                />
                <path
                  d="M6.27 13.74A6.14 6.14 0 0 1 5.95 12c0-.6.11-1.18.32-1.74V7.62H2.86a10.22 10.22 0 0 0 0 8.76l3.41-2.64Z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 6.04c1.5 0 2.84.52 3.9 1.53l2.92-2.92C17.07 2.99 14.75 2 12 2 7.86 2 4.29 4.38 2.86 7.62l3.41 2.64c.81-2.42 3.07-4.22 5.73-4.22Z"
                  fill="#EA4335"
                />
              </svg>
            </span>
            <span>
              {isAuthLoading
                ? 'Conectando...'
                : isAuthAvailable
                  ? 'Continuar con Google'
                  : 'Google no configurado'}
            </span>
          </button>
        )}

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <button
              className="px-4 py-2 rounded-full bg-surface-container text-on-surface font-bold hover:bg-surface-container-highest transition-colors"
              onClick={onSignOut}
              type="button"
            >
              Salir
            </button>
          ) : null}

          <div className="relative">
            <button
              aria-expanded={isNotificationsOpen}
              aria-label="Abrir notificaciones"
              className={notificationButtonClasses}
              onClick={() => setIsNotificationsOpen((current) => !current)}
              type="button"
            >
              <span className="material-symbols-outlined text-[#2f2e2e] dark:text-[#afacac]">
                notifications
              </span>
              {notifications.length > 0 ? (
                <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-[#c62828] text-white text-[10px] font-bold flex items-center justify-center">
                  {visibleCount}
                </span>
              ) : null}
            </button>

            {isNotificationsOpen ? (
              <div className="absolute right-0 top-14 w-[min(24rem,calc(100vw-3rem))] rounded-3xl bg-surface-container-lowest shadow-[0_20px_40px_rgba(47,46,46,0.16)] border border-outline-variant/15 p-4 space-y-3 z-50">
                <div className="flex items-center justify-between gap-4 px-2">
                  <div>
                    <p className="font-label label-md uppercase tracking-wider text-outline">
                      Notificaciones
                    </p>
                    <p className="text-sm text-outline">
                      {notifications.length > 0
                        ? `${notifications.length} aviso${notifications.length === 1 ? '' : 's'} activo${notifications.length === 1 ? '' : 's'}`
                        : 'No hay avisos por ahora'}
                    </p>
                  </div>
                  <button
                    className="w-9 h-9 rounded-full bg-surface-container text-outline hover:text-on-surface transition-colors"
                    onClick={() => setIsNotificationsOpen(false)}
                    type="button"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>

                {notifications.length > 0 ? (
                  <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                    {notifications.map((notification) => (
                      <article
                        className={`rounded-2xl p-4 border ${
                          notification.severity === 'success'
                            ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200/70 dark:border-emerald-700/40'
                            : notification.severity === 'error'
                              ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-200/70 dark:border-rose-700/40'
                              : 'bg-amber-50 dark:bg-amber-950/30 border-amber-200/70 dark:border-amber-700/40'
                        }`}
                        key={notification.id}
                      >
                        <p
                          className={`font-bold ${
                            notification.severity === 'success'
                              ? 'text-emerald-700 dark:text-emerald-300'
                              : notification.severity === 'error'
                                ? 'text-rose-700 dark:text-rose-300'
                                : 'text-amber-700 dark:text-amber-300'
                          }`}
                        >
                          {notification.title}
                        </p>
                        <p className="text-sm text-on-surface mt-1">{notification.message}</p>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl bg-surface-container p-4 text-sm text-outline">
                    Todo está al día. Aquí te avisaremos si falta registrar comidas, actualizar medidas o si algún indicador cambia.
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  )
}
