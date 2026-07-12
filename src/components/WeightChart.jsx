// Graphique de poids : pesées, moyenne mobile 7 j, ligne d'objectif.
import {
  ComposedChart, Line, Area, XAxis, YAxis, Tooltip, ReferenceLine, ResponsiveContainer, CartesianGrid,
} from 'recharts'
import { withMovingAverage } from '../lib/metrics.js'
import { addDays, diffDays, fmtDayMonth } from '../lib/dates.js'

export default function WeightChart({ weights, goals, compact = false }) {
  const series = withMovingAverage(weights)
  const byDate = Object.fromEntries(series.map((w) => [w.date, w]))

  const totalDays = diffDays(goals.startDate, goals.endDate)
  const data = []
  for (let i = 0; i <= totalDays; i++) {
    const date = addDays(goals.startDate, i)
    const target = goals.startWeight + ((goals.goalWeight - goals.startWeight) * i) / totalDays
    data.push({
      date,
      target: Math.round(target * 100) / 100,
      kg: byDate[date]?.kg ?? null,
      ma: byDate[date]?.ma ?? null,
    })
  }

  const kgVals = series.map((w) => w.kg)
  const yMin = Math.floor(Math.min(goals.startWeight, ...kgVals) - 1)
  const yMax = Math.ceil(Math.max(goals.goalWeight, ...kgVals) + 1)

  return (
    <ResponsiveContainer width="100%" height={compact ? 120 : 260}>
      <ComposedChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: compact ? -32 : -20 }}>
        <defs>
          <linearGradient id="maFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ff8a1e" stopOpacity={0.28} />
            <stop offset="100%" stopColor="#ff8a1e" stopOpacity={0} />
          </linearGradient>
        </defs>
        {!compact && <CartesianGrid stroke="#221e1a" vertical={false} />}
        <XAxis
          dataKey="date"
          tickFormatter={fmtDayMonth}
          tick={{ fill: '#78716c', fontSize: 10 }}
          axisLine={{ stroke: '#2b2622' }}
          tickLine={false}
          interval="preserveStartEnd"
          minTickGap={40}
          hide={compact}
        />
        <YAxis
          domain={[yMin, yMax]}
          tick={{ fill: '#78716c', fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          width={compact ? 36 : 40}
          hide={compact}
        />
        {!compact && (
          <Tooltip
            contentStyle={{
              background: '#1f1b18', border: '1px solid #2b2622', borderRadius: 12, fontSize: 12,
            }}
            labelFormatter={fmtDayMonth}
            formatter={(value, name) => [
              `${Number(value).toFixed(1)} kg`,
              { kg: 'Pesée', ma: 'Moyenne 7 j', target: 'Objectif' }[name] || name,
            ]}
          />
        )}
        <ReferenceLine y={goals.goalWeight} stroke="#34d399" strokeDasharray="2 6" strokeOpacity={0.5} />
        <Line type="monotone" dataKey="target" stroke="#34d399" strokeWidth={1.5} strokeDasharray="5 5" dot={false} strokeOpacity={0.55} />
        <Line
          type="monotone" dataKey="kg" stroke="#a8a29e" strokeWidth={1} strokeOpacity={0.5}
          dot={{ r: compact ? 1.5 : 2.5, fill: '#e7e5e4', strokeWidth: 0 }} connectNulls
        />
        <Area type="monotone" dataKey="ma" stroke="none" fill="url(#maFill)" connectNulls baseValue="dataMin" tooltipType="none" legendType="none" />
        <Line type="monotone" dataKey="ma" stroke="#ff8a1e" strokeWidth={2.5} dot={false} connectNulls />
      </ComposedChart>
    </ResponsiveContainer>
  )
}
