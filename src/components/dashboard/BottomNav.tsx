import type { View } from '../../App'

type BottomNavProps = {
  onNavigate: (view: View) => void
  variant: 'dashboard' | 'log' | 'profile' | 'history'
  view: View
}

const navItems: Array<{ label: string; icon: string; target: View }> = [
  { label: 'Inicio', icon: 'dashboard', target: 'home' },
  { label: 'Registro', icon: 'add_circle', target: 'log' },
  { label: 'Perfil', icon: 'person', target: 'profile' },
  { label: 'Historial', icon: 'history', target: 'history' },
]

const navWrapperClass =
  'fixed bottom-0 left-0 w-full z-50 bg-white/80 dark:bg-[#1a1a1a]/80 backdrop-blur-lg border-t border-[#afacac]/20 shadow-[0_-10px_40px_rgba(47,46,46,0.04)]'

const innerWrapperByVariant = {
  dashboard: 'flex justify-around items-center px-2 sm:px-4 pb-5 pt-3',
  log: 'flex justify-around items-center px-2 sm:px-4 pb-5 pt-3',
  profile: 'flex justify-around items-center px-2 sm:px-4 pb-5 pt-3',
  history: 'flex justify-around items-center px-2 sm:px-4 pb-5 pt-3 max-w-2xl mx-auto',
} as const

export function BottomNav({ onNavigate, variant, view }: BottomNavProps) {
  return (
    <nav className={navWrapperClass}>
      <div className={innerWrapperByVariant[variant]}>
        {navItems.map((item) => (
          <button
            key={item.label}
            aria-pressed={item.target === view}
            className={
              item.target === view
                ? 'min-w-0 flex-1 flex flex-col items-center justify-center bg-[#d1fc00] dark:bg-[#516200] text-[#2f2e2e] dark:text-[#f9f6f5] rounded-xl px-2 sm:px-4 py-1 transition-all duration-300 active:scale-90'
                : 'min-w-0 flex-1 flex flex-col items-center justify-center text-[#afacac] dark:text-[#dfdcdc] px-2 sm:px-4 py-1 hover:text-[#516200] dark:hover:text-[#d4ff00] transition-all'
            }
            onClick={() => onNavigate(item.target)}
            type="button"
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="font-manrope text-[10px] sm:text-xs uppercase tracking-[0.08em] mt-1 text-center leading-tight">
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  )
}
