type InsightCardProps = {
  body: string
  title: string
}

export function InsightCard({ body, title }: InsightCardProps) {
  return (
    <section className="bg-primary text-on-primary p-8 rounded-2xl relative overflow-hidden">
      <div className="relative z-10 space-y-4">
        <span className="font-label label-md uppercase tracking-widest text-on-primary/60">
          Insight de la app
        </span>
        <h4 className="font-headline text-2xl font-bold max-w-md">{title}</h4>
        <p className="font-body text-on-primary/80 max-w-sm">{body}</p>
      </div>
      <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-primary-container rounded-full opacity-20 blur-3xl"></div>
    </section>
  )
}
