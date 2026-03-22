export function ProfileHero() {
  return (
    <section className="relative overflow-hidden rounded-3xl p-8 bg-surface-container-lowest">
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 kinetic-gradient opacity-10 rounded-full blur-3xl"></div>
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <span className="font-label label-md uppercase tracking-wider text-primary">
            Biometría &amp; Metas
          </span>
          <h2 className="font-headline text-4xl md:text-5xl font-black tracking-tighter text-on-background">
            Diseña tu <br />
            Rendimiento.
          </h2>
        </div>
        <div className="hidden md:block">
          <p className="text-on-surface-variant max-w-xs text-sm leading-relaxed">
            Ajustamos tus macronutrientes basándonos en tu composición corporal única y
            objetivos de estilo de vida.
          </p>
        </div>
      </div>
    </section>
  )
}
