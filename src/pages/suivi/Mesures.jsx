// Mensurations hebdo : bras, poitrine, épaules, taille — là où la transfo se voit en premier.
import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { Trash2 } from 'lucide-react'
import { useStore } from '../../lib/store.js'
import { todayISO, fmtShort, fmtDayMonth } from '../../lib/dates.js'
import { fmtSigned } from '../../lib/metrics.js'
import { Card, SectionTitle, useToast } from '../../components/ui.jsx'

const METRICS = [
  { id: 'biceps', name: 'Biceps', emoji: '💪', hint: 'bras plié, au plus fort' },
  { id: 'poitrine', name: 'Poitrine', emoji: '🫁', hint: 'sous les aisselles, cage gonflée normale' },
  { id: 'epaules', name: 'Épaules', emoji: '🔝', hint: 'tour complet au plus large' },
  { id: 'taille', name: 'Taille', emoji: '📏', hint: 'au nombril, relâché' },
]

export default function Mesures() {
  const today = todayISO()
  const [measures, setMeasures] = useStore('measures', {})
  const [inputs, setInputs] = useState({})
  const [chartMetric, setChartMetric] = useState('biceps')
  const toast = useToast()

  const dates = Object.keys(measures).sort()
  const last = dates.length ? measures[dates[dates.length - 1]] : {}
  const first = dates.length ? measures[dates[0]] : {}

  const save = () => {
    const entry = { ...measures[today] }
    let any = false
    for (const m of METRICS) {
      const v = parseFloat((inputs[m.id] || '').replace(',', '.'))
      if (v && v > 10 && v < 250) {
        entry[m.id] = v
        any = true
      }
    }
    if (!any) {
      toast('Entre au moins une mesure (en cm)', '🤨')
      return
    }
    setMeasures((ms) => ({ ...ms, [today]: entry }))
    setInputs({})
    toast('Mensurations enregistrées', '📏')
  }

  const removeDate = (date) =>
    setMeasures((ms) => {
      const next = { ...ms }
      delete next[date]
      return next
    })

  const chartData = dates
    .filter((d) => measures[d][chartMetric] != null)
    .map((d) => ({ date: d, val: measures[d][chartMetric] }))

  const metricInfo = METRICS.find((m) => m.id === chartMetric)

  return (
    <div>
      {/* Saisie */}
      <Card>
        <p className="text-sm font-bold mb-1">Mensurations du jour</p>
        <p className="text-xs text-zinc-500 mb-3">
          Chaque dimanche matin, à froid, mètre ruban bien horizontal — toujours au même endroit.
        </p>
        <div className="grid grid-cols-2 gap-2">
          {METRICS.map((m) => (
            <div key={m.id} className="flex items-center gap-2 rounded-xl bg-zinc-800/50 px-3 py-2">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black">{m.emoji} {m.name}</p>
                <p className="text-[10px] text-zinc-600 truncate">{m.hint}</p>
              </div>
              <input
                type="text" inputMode="decimal"
                placeholder={last[m.id] ? `${last[m.id]}` : 'cm'}
                value={inputs[m.id] || ''}
                onChange={(e) => setInputs((v) => ({ ...v, [m.id]: e.target.value }))}
                className="w-14 shrink-0 rounded-lg bg-zinc-900 px-2 py-2 text-center font-bold text-sm outline-none focus:ring-2 ring-orange-500 tabular-nums"
              />
            </div>
          ))}
        </div>
        <button onClick={save} className="press mt-3 w-full rounded-xl bg-orange-500 py-3 font-black text-zinc-950">
          Enregistrer
        </button>
      </Card>

      {/* Progression par mesure */}
      {dates.length > 0 && (
        <>
          <SectionTitle>Progression</SectionTitle>
          <div className="seg mb-3">
            {METRICS.map((m) => (
              <button key={m.id} onClick={() => setChartMetric(m.id)} className={`press seg-btn ${chartMetric === m.id ? 'active' : ''}`}>
                {m.name}
              </button>
            ))}
          </div>
          <Card>
            {first[chartMetric] != null && last[chartMetric] != null && (
              <p className="text-sm font-black mb-2">
                {metricInfo.emoji} {metricInfo.name} :{' '}
                <span className="font-display text-2xl">{last[chartMetric]} cm</span>{' '}
                <span className={last[chartMetric] - first[chartMetric] >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                  ({fmtSigned(last[chartMetric] - first[chartMetric])} cm depuis le début)
                </span>
              </p>
            )}
            {chartData.length >= 2 ? (
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: -24 }}>
                  <CartesianGrid stroke="#221e1a" vertical={false} />
                  <XAxis dataKey="date" tickFormatter={fmtDayMonth} tick={{ fill: '#78716c', fontSize: 10 }} axisLine={{ stroke: '#2b2622' }} tickLine={false} />
                  <YAxis domain={['dataMin - 1', 'dataMax + 1']} tick={{ fill: '#78716c', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: '#1f1b18', border: '1px solid #2b2622', borderRadius: 12, fontSize: 12 }}
                    labelFormatter={fmtDayMonth}
                    formatter={(v) => [`${v} cm`, metricInfo.name]}
                  />
                  <Line type="monotone" dataKey="val" stroke="#ff8a1e" strokeWidth={2.5} dot={{ r: 3, fill: '#ff8a1e' }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-zinc-500 py-6 text-center">Encore une mesure et le graphique apparaît 📈</p>
            )}
          </Card>
        </>
      )}

      {/* Historique */}
      {dates.length > 0 && (
        <>
          <SectionTitle>Historique</SectionTitle>
          <Card className="p-0 divide-y divide-zinc-800/70">
            {[...dates].reverse().map((d) => (
              <div key={d} className="flex items-center px-4 py-3 gap-2">
                <span className="flex-1 text-sm font-semibold text-zinc-300">{fmtShort(d)}</span>
                {METRICS.map((m) =>
                  measures[d][m.id] != null ? (
                    <span key={m.id} className="text-xs font-bold text-zinc-400 tabular-nums">
                      {m.emoji} {measures[d][m.id]}
                    </span>
                  ) : null,
                )}
                <button className="press p-1.5 text-zinc-600" onClick={() => removeDate(d)} aria-label="Supprimer">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </Card>
        </>
      )}

      {dates.length === 0 && (
        <Card className="mt-3 border-orange-500/20">
          <p className="text-xs text-zinc-400 leading-relaxed">
            💡 <b>Pourquoi mesurer ?</b> Le tour de bras et d'épaules bouge souvent <b>avant</b> la balance.
            +1 cm de bras en un mois, c'est énorme — et c'est le genre de victoire qu'on ne voit pas sans mètre ruban.
          </p>
        </Card>
      )}
    </div>
  )
}
