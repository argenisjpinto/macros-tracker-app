import type { ComplianceDay } from '../../utils/history'
import { ComplianceRow } from './ComplianceRow'

type ComplianceSectionProps = {
  complianceDays: ComplianceDay[]
}

export function ComplianceSection({ complianceDays }: ComplianceSectionProps) {
  return (
    <section className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-headline headline-sm font-bold text-on-surface">
          Cumplimiento de Macros
        </h3>
        <button className="text-primary font-bold flex items-center gap-1 hover:underline">
          <span className="material-symbols-outlined text-sm">calendar_month</span>
          Ver últimos registros
        </button>
      </div>
      <div className="bg-surface-container rounded-xl overflow-hidden">
        {complianceDays.map((day, index) => (
          <div key={`${day.day}-${day.date}`}>
            <ComplianceRow {...day} />
            {index < complianceDays.length - 1 ? <div className="h-4 bg-surface-container"></div> : null}
          </div>
        ))}
      </div>
    </section>
  )
}
