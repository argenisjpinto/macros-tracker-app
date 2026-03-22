import {
  buildChartDots,
  buildChartPath,
  buildChartScaleMarks,
  buildMetricAccent,
  buildMetricValue,
  type MetricPoint,
} from '../../utils/history'
import { MetricChartCard } from './MetricChartCard'

type ChartsSectionProps = {
  bmiAccent: string
  bmiAccentClass: string
  bmiPoints: MetricPoint[]
  waistPoints: MetricPoint[]
  waistToHeightAccent: string
  waistToHeightAccentClass: string
  waistToHeightPoints: MetricPoint[]
  weightAccentClass: string
  weightPoints: MetricPoint[]
  waistAccentClass: string
}

export function ChartsSection({
  bmiAccent,
  bmiAccentClass,
  bmiPoints,
  waistPoints,
  waistToHeightAccent,
  waistToHeightAccentClass,
  waistToHeightPoints,
  weightAccentClass,
  weightPoints,
  waistAccentClass,
}: ChartsSectionProps) {
  const weightPath = buildChartPath(weightPoints)
  const waistPath = buildChartPath(waistPoints)
  const bmiPath = buildChartPath(bmiPoints)
  const waistToHeightPath = buildChartPath(waistToHeightPoints)
  const weightDots = buildChartDots(weightPoints)
  const waistDots = buildChartDots(waistPoints)
  const bmiDots = buildChartDots(bmiPoints)
  const waistToHeightDots = buildChartDots(waistToHeightPoints)
  const weightScale = buildChartScaleMarks(weightPoints)
  const waistScale = buildChartScaleMarks(waistPoints)
  const bmiScale = buildChartScaleMarks(bmiPoints)
  const waistToHeightScale = buildChartScaleMarks(waistToHeightPoints, 'waist-height')

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <MetricChartCard
        accentCopy={buildMetricAccent(weightPoints, 'kg')}
        accentClassName={weightAccentClass}
        helper="Últimas semanas"
        label="Evolución del peso"
        scale="weight"
        scaleMarks={weightScale}
        tickLabels={weightPoints.map((point) => point.label)}
        unit="kg"
        value={buildMetricValue(weightPoints)}
        chart={
          <svg className="w-full h-full" viewBox="0 0 400 100">
            <defs>
              <linearGradient id="historyWeightGradient" x1="0%" x2="100%" y1="0%" y2="0%">
                <stop offset="0%" stopColor="#516200" stopOpacity="1"></stop>
                <stop offset="100%" stopColor="#d1fc00" stopOpacity="1"></stop>
              </linearGradient>
            </defs>
            <path
              d={weightPath}
              fill="none"
              stroke="url(#historyWeightGradient)"
              strokeLinecap="round"
              strokeWidth="4"
            ></path>
            <line stroke="#dfdcdc" strokeDasharray="4" x1="0" x2="400" y1="20" y2="20"></line>
            <line stroke="#dfdcdc" strokeDasharray="4" x1="0" x2="400" y1="50" y2="50"></line>
            <line stroke="#dfdcdc" strokeDasharray="4" x1="0" x2="400" y1="80" y2="80"></line>
            {weightDots.map((dot) => (
              <g key={`weight-${dot.label}`}>
                <title>{`${dot.label}: ${dot.value.toLocaleString('es-AR')} kg`}</title>
                <circle
                  cx={dot.x}
                  cy={dot.y}
                  fill="#d1fc00"
                  r="4.5"
                  stroke="#516200"
                  strokeWidth="2"
                ></circle>
              </g>
            ))}
          </svg>
        }
      />

      <MetricChartCard
        accentCopy={buildMetricAccent(waistPoints, 'cm')}
        accentClassName={waistAccentClass}
        helper="Últimas semanas"
        label="Perímetro de cintura"
        scale="waist"
        scaleMarks={waistScale}
        tickLabels={waistPoints.map((point) => point.label)}
        unit="cm"
        value={buildMetricValue(waistPoints)}
        chart={
          <svg className="w-full h-full" viewBox="0 0 400 100">
            <path
              d={waistPath}
              fill="none"
              stroke="#516200"
              strokeDasharray="8 4"
              strokeLinecap="round"
              strokeWidth="4"
            ></path>
            <line stroke="#dfdcdc" strokeDasharray="4" x1="0" x2="400" y1="20" y2="20"></line>
            <line stroke="#dfdcdc" strokeDasharray="4" x1="0" x2="400" y1="50" y2="50"></line>
            <line stroke="#dfdcdc" strokeDasharray="4" x1="0" x2="400" y1="80" y2="80"></line>
            {waistDots.map((dot) => (
              <g key={`waist-${dot.label}`}>
                <title>{`${dot.label}: ${dot.value.toLocaleString('es-AR')} cm`}</title>
                <circle
                  cx={dot.x}
                  cy={dot.y}
                  fill="#516200"
                  r="4.5"
                  stroke="#f7f7f6"
                  strokeWidth="2"
                ></circle>
              </g>
            ))}
          </svg>
        }
      />

      <MetricChartCard
        accentCopy={bmiAccent}
        accentClassName={bmiAccentClass}
        helper="Índice de masa corporal"
        label="IMC"
        scale="bmi"
        scaleMarks={bmiScale}
        tickLabels={bmiPoints.map((point) => point.label)}
        unit=""
        value={buildMetricValue(bmiPoints)}
        chart={
          <svg className="w-full h-full" viewBox="0 0 400 100">
            <defs>
              <linearGradient id="historyBmiGradient" x1="0%" x2="100%" y1="0%" y2="0%">
                <stop offset="0%" stopColor="#7a7f00" stopOpacity="1"></stop>
                <stop offset="100%" stopColor="#c1ff72" stopOpacity="1"></stop>
              </linearGradient>
            </defs>
            <path
              d={bmiPath}
              fill="none"
              stroke="url(#historyBmiGradient)"
              strokeLinecap="round"
              strokeWidth="4"
            ></path>
            <line stroke="#dfdcdc" strokeDasharray="4" x1="0" x2="400" y1="20" y2="20"></line>
            <line stroke="#dfdcdc" strokeDasharray="4" x1="0" x2="400" y1="50" y2="50"></line>
            <line stroke="#dfdcdc" strokeDasharray="4" x1="0" x2="400" y1="80" y2="80"></line>
            {bmiDots.map((dot) => (
              <g key={`bmi-${dot.label}`}>
                <title>{`${dot.label}: ${dot.value.toLocaleString('es-AR')}`}</title>
                <circle
                  cx={dot.x}
                  cy={dot.y}
                  fill="#c1ff72"
                  r="4.5"
                  stroke="#7a7f00"
                  strokeWidth="2"
                ></circle>
              </g>
            ))}
          </svg>
        }
      />

      <MetricChartCard
        accentCopy={waistToHeightAccent}
        accentClassName={waistToHeightAccentClass}
        helper="Relación cintura-estatura"
        label="ICE (< 0.5 OK)"
        scale="waist-height"
        scaleMarks={waistToHeightScale}
        tickLabels={waistToHeightPoints.map((point) => point.label)}
        unit=""
        value={buildMetricValue(waistToHeightPoints)}
        chart={
          <svg className="w-full h-full" viewBox="0 0 400 100">
            <path
              d={waistToHeightPath}
              fill="none"
              stroke="#7a7f00"
              strokeLinecap="round"
              strokeWidth="4"
            ></path>
            <line stroke="#dfdcdc" strokeDasharray="4" x1="0" x2="400" y1="20" y2="20"></line>
            <line stroke="#afacac" strokeOpacity="0.35" strokeWidth="1.5" x1="0" x2="400" y1="50" y2="50"></line>
            <line stroke="#dfdcdc" strokeDasharray="4" x1="0" x2="400" y1="80" y2="80"></line>
            {waistToHeightDots.map((dot) => (
              <g key={`waist-height-${dot.label}`}>
                <title>{`${dot.label}: ${dot.value.toLocaleString('es-AR')}`}</title>
                <circle
                  cx={dot.x}
                  cy={dot.y}
                  fill="#7a7f00"
                  r="4.5"
                  stroke="#f7f7f6"
                  strokeWidth="2"
                ></circle>
              </g>
            ))}
          </svg>
        }
      />
    </div>
  )
}
