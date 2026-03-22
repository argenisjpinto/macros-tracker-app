import type { Theme } from '../../App'

type ThemeSwitchProps = {
  onThemeChange: (theme: Theme) => void
  theme: Theme
}

export function ThemeSwitch({ onThemeChange, theme }: ThemeSwitchProps) {
  return (
    <section className="flex justify-end">
      <div className="bg-surface-container rounded-2xl p-1 inline-flex gap-1">
        <button
          className={
            theme === 'light'
              ? 'px-4 py-2 rounded-xl bg-surface-container-lowest text-on-surface font-label text-sm font-bold'
              : 'px-4 py-2 rounded-xl text-on-surface-variant font-label text-sm font-bold'
          }
          onClick={() => onThemeChange('light')}
          type="button"
        >
          Claro
        </button>
        <button
          className={
            theme === 'dark'
              ? 'px-4 py-2 rounded-xl bg-surface-container-lowest text-on-surface font-label text-sm font-bold'
              : 'px-4 py-2 rounded-xl text-on-surface-variant font-label text-sm font-bold'
          }
          onClick={() => onThemeChange('dark')}
          type="button"
        >
          Oscuro
        </button>
      </div>
    </section>
  )
}
