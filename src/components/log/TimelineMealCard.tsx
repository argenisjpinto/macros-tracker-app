import type { LoggedMealItem } from './types'

type TimelineMealCardProps = {
  calories: string
  dimmed: boolean
  icon: string
  isSelected?: boolean
  items: readonly LoggedMealItem[]
  onDeleteItem: (itemId: string) => void
  onSelectItem: (itemId: string) => void
  onSelect?: () => void
  selectedItemId: string | null
  title: string
}

export function TimelineMealCard({
  calories,
  dimmed: _dimmed,
  icon,
  isSelected = false,
  items,
  onDeleteItem,
  onSelectItem,
  onSelect,
  selectedItemId,
  title,
}: TimelineMealCardProps) {
  return (
    <div className="space-y-4">
      <button
        className={
          isSelected
            ? 'flex justify-between items-center px-2 w-full text-left rounded-xl ring-2 ring-primary/30'
            : 'flex justify-between items-center px-2 w-full text-left'
        }
        onClick={onSelect}
        type="button"
      >
        <h3 className="font-headline headline-sm font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">{icon}</span>
          {title}
        </h3>
        <span className="font-label label-md text-outline">{calories}</span>
      </button>
      <div
        className={
          items.length === 1
            ? 'bg-surface-container rounded-2xl p-4'
            : 'bg-surface-container rounded-2xl p-4 space-y-3'
        }
      >
        {items.map((item) => (
          <div
            className={
              selectedItemId === item.id
                ? 'flex items-center justify-between bg-surface-container-lowest p-4 rounded-xl border-l-4 border-primary w-full text-left'
                : 'flex items-center justify-between bg-surface-container-lowest p-4 rounded-xl w-full text-left'
            }
            key={item.id}
            onClick={() => onSelectItem(item.id)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                onSelectItem(item.id)
              }
            }}
            role="button"
            tabIndex={0}
          >
            <div className="flex flex-col">
              <span className="font-bold">{item.name}</span>
              <span className="text-sm text-outline">{item.detail}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-headline font-bold text-primary">{item.calories} kcal</span>
              {selectedItemId === item.id ? (
                <>
                  <span
                    aria-hidden="true"
                    className="w-px self-stretch bg-outline-variant/40"
                  ></span>
                  <button
                    aria-label={`Eliminar ${item.name}`}
                    className="w-9 h-9 rounded-full bg-surface-container text-outline hover:text-error hover:bg-surface-container-high transition-colors"
                    onClick={(event) => {
                      event.stopPropagation()
                      onDeleteItem(item.id)
                    }}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
