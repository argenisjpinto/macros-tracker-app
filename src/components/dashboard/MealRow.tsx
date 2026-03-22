type MealRowProps = {
  calories: string
  dailyShare: string
  description: string
  icon: string
  title: string
}

export function MealRow({
  calories,
  dailyShare,
  description,
  icon,
  title,
}: MealRowProps) {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-4 flex items-center justify-between group transition-all duration-300 hover:scale-[1.01]">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        <div>
          <h3 className="font-headline font-bold text-on-background">{title}</h3>
          <p className="text-sm text-outline">{description}</p>
        </div>
      </div>

      <div className="text-right">
        <span className="font-headline font-bold text-on-background">{calories}</span>
        <p className="text-[10px] font-label uppercase tracking-tighter text-outline">{dailyShare}</p>
      </div>
    </div>
  )
}
