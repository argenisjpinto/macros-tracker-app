import type { NutritionPlan, ProfileState } from './types'

type ProfilePlanSectionProps = {
  nutritionPlan: NutritionPlan
  profile: ProfileState
}

export function ProfilePlanSection({
  nutritionPlan,
  profile,
}: ProfilePlanSectionProps) {
  const isProfileReady = Boolean(
    profile.birthDate && profile.heightCm > 0 && profile.weightKg > 0 && profile.waistCm > 0,
  )
  const planStats = [
    {
      label: 'Proteína',
      value: nutritionPlan.protein,
      suffix: 'G',
      barClass: 'kinetic-gradient',
      cardClass: 'border-primary',
      width: '70%',
    },
    {
      label: 'Grasas',
      value: nutritionPlan.fat,
      suffix: 'G',
      barClass: 'bg-tertiary',
      cardClass: 'border-tertiary',
      width: '55%',
    },
    {
      label: 'Carbohidratos',
      value: nutritionPlan.carbs,
      suffix: 'G',
      barClass: 'bg-secondary',
      cardClass: 'border-secondary md:col-start-3',
      width: '82%',
    },
    {
      label: 'Hidratación',
      value: nutritionPlan.hydrationLiters.toFixed(1),
      suffix: 'L',
      barClass: 'bg-blue-400',
      cardClass: 'border-blue-500/30',
      width: '64%',
    },
  ]

  const goalLabel =
    profile.goal === 'muscle'
      ? 'superávit moderado'
      : profile.goal === 'fat-loss'
        ? 'déficit moderado'
        : 'mantenimiento'

  return (
    <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-surface-container-highest"></div>
        <h3 className="font-headline text-2xl font-bold text-on-background">Tu Plan Nutricional</h3>
        <div className="h-px flex-1 bg-surface-container-highest"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-2 bg-on-background p-8 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-surface-bright text-6xl">
              local_fire_department
            </span>
          </div>
          <div className="relative z-10">
            <span className="font-label label-md text-surface-variant uppercase tracking-widest">
              Gasto energético diario
            </span>
            <div className="flex items-baseline gap-2 mt-4">
              <h4 className="font-headline text-6xl font-black text-primary-container">
                {isProfileReady ? nutritionPlan.calories.toLocaleString('es-AR') : '--'}
              </h4>
              <span className="font-headline text-xl text-surface-bright">KCAL</span>
            </div>
            <p className="text-surface-variant mt-4 text-sm font-light">
              {isProfileReady
                ? `Mantenimiento estimado: ${nutritionPlan.maintenanceCalories.toLocaleString('es-AR')} kcal. Plan ajustado para ${goalLabel}.`
                : 'Completa fecha de nacimiento, peso, estatura y cintura para calcular tu plan.'}
            </p>
            <p className="text-surface-variant mt-2 text-sm font-light">
              {isProfileReady
                ? `Metabolismo basal estimado: ${nutritionPlan.restingEnergy.toLocaleString('es-AR')} kcal.`
                : 'Los indicadores nutricionales aparecerán aquí cuando completes tu perfil.'}
            </p>
          </div>
        </div>

        {planStats.map((stat) => (
          <div
            className={`bg-surface-container-lowest p-6 rounded-3xl border-t-4 ${stat.cardClass}`}
            key={stat.label}
          >
            <span className="font-label label-md text-on-surface-variant uppercase tracking-widest">
              {stat.label}
            </span>
            <div className="mt-4">
              <span className="font-headline text-4xl font-bold text-on-background">
                {isProfileReady ? stat.value : '--'}
              </span>
              <span className="font-label text-sm text-on-surface-variant ml-1">{stat.suffix}</span>
            </div>
            <div className="w-full h-1.5 bg-surface-container rounded-full mt-4">
              <div
                className={`h-full rounded-full ${stat.barClass}`}
                style={{ width: isProfileReady ? stat.width : '0%' }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-surface-container-low p-6 rounded-2xl text-sm text-on-surface-variant space-y-2">
        <p>
          Los valores se recalculan en tiempo real según sexo biológico, edad, peso, estatura,
          actividad y objetivo.
        </p>
        <p>
          La cintura se conserva como referencia antropométrica, aunque este cálculo base se apoya
          principalmente en peso, altura, edad y nivel de actividad.
        </p>
      </div>
    </section>
  )
}
