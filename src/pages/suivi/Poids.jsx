// Suivi du poids : saisie, graphique MM7, rythme, projection, historique.
import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { useStore } from '../../lib/store.js'
import { DEFAULT_GOALS } from '../../lib/config.js'
import { todayISO, fmtLong, fmtShort } from '../../lib/dates.js'
import {
  sortedWeights, latestWeight, weeklyPace, paceStatus, projectedWeight, fmtSigned, withMovingAverage,
} from '../../lib/metrics.js'
import { Card, SectionTitle, useToast } from '../../components/ui.jsx'
import WeightChart from '../../components/WeightChart.jsx'

export default function Poids() {
  const today = todayISO()
  const [goals] = useStore('goals', DEFAULT_GOALS)
  const [weights, setWeights] = useStore('weights', [])
  const [kgInput, setKgInput] = useState('')
  const toast = useToast()

  const last = latestWeight(weights)
  const pace = weeklyPace(weights)
  const status = paceStatus(pace)
  const projection = projectedWeight(weights, goals.endDate)
  const sorted = sortedWeights(weights)
  const ma = withMovingAverage(weights)
  const weighedToday = weights.some((w) => w.date === today)

  const save = () => {
    const kg = parseFloat(kgInput.replace(',', '.'))
    if (!kg || kg < 40 || kg > 150) {
      toast('Entre un poids valide (ex : 77.4)', '🤨')
      return
    }
    setWeights((w) => [...w.filter((x) => x.date !== today), { date: today, kg }])
    setKgInput('')
    toast(`${kg.toFixed(1)} kg enregistré`, '⚖️')
  }

  const remove = (date) => setWeights((w) => w.filter((x) => x.date !== date))

  const toneColor = { good: 'text-emerald-400', warn: 'text-amber-300', muted: 'text-zinc-500' }[status.tone]

  return (
    <div>
      <div className="lg:grid lg:grid-cols-2 lg:gap-4 lg:items-stretch">
      {/* Saisie */}
      <Card>
        <p className="text-sm font-bold mb-1">{weighedToday ? 'Corriger la pesée du jour' : 'Pesée du jour'}</p>
        <p className="text-xs text-zinc-500 mb-3">{fmtLong(today)} — à jeun pour être fiable</p>
        <div className="flex gap-2">
          <input
            type="text" inputMode="decimal"
            placeholder={last ? last.kg.toFixed(1) : '77.0'}
            value={kgInput} onChange={(e) => setKgInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && save()}
            className="flex-1 min-w-0 rounded-xl bg-zinc-800 px-4 py-3 text-xl font-black text-center outline-none focus:ring-2 ring-orange-500 tabular-nums"
          />
          <button onClick={save} className="press shrink-0 rounded-xl bg-orange-500 px-5 font-black text-zinc-950">
            Enregistrer
          </button>
        </div>
      </Card>

      {/* Rythme & projection */}
      <div className="grid grid-cols-2 gap-3 mt-3 lg:mt-0">
        <Card>
          <p className="text-[11px] uppercase tracking-widest text-zinc-500 font-bold mb-1">Rythme</p>
          <p className={`font-display text-3xl leading-none tabular-nums ${toneColor}`}>
            {pace != null ? `${fmtSigned(pace, 2)}` : '—'}
            <span className="text-sm text-zinc-500"> kg/sem</span>
          </p>
          <p className="text-[11px] text-zinc-500 mt-1">cible : +0,3 à +0,8</p>
        </Card>
        <Card>
          <p className="text-[11px] uppercase tracking-widest text-zinc-500 font-bold mb-1">Projection 15 sept.</p>
          <p className="font-display text-3xl leading-none tabular-nums">
            {projection != null ? projection.toFixed(1) : '—'}
            <span className="text-sm text-zinc-500"> kg</span>
          </p>
          <p className="text-[11px] text-zinc-500 mt-1">objectif : {goals.goalWeight} kg</p>
        </Card>
      </div>

      {/* Alerte / statut */}
      <Card className={`mt-3 lg:col-span-2 lg:mt-0 ${status.tone === 'warn' ? 'border-amber-500/30 bg-amber-500/5' : ''}`}>
        <p className={`text-sm font-semibold ${toneColor}`}>
          {status.tone === 'good' ? '✅ ' : status.tone === 'warn' ? '⚠️ ' : '📊 '}
          {status.label}
        </p>
      </Card>
      </div>

      {/* Graphique */}
      <SectionTitle>Progression</SectionTitle>
      <Card className="pb-2">
        {weights.length >= 2 ? (
          <>
            <WeightChart weights={weights} goals={goals} />
            <div className="flex gap-4 justify-center pb-1 text-[11px] font-bold text-zinc-500">
              <span><span className="inline-block w-3 h-0.5 bg-orange-400 align-middle mr-1" />Moyenne 7 j</span>
              <span><span className="inline-block w-3 h-0.5 bg-zinc-400 align-middle mr-1" />Pesées</span>
              <span><span className="inline-block w-3 h-0.5 bg-emerald-400 align-middle mr-1" />Objectif</span>
            </div>
          </>
        ) : (
          <p className="text-sm text-zinc-500 py-8 text-center">
            Encore {2 - weights.length} pesée{weights.length === 1 ? '' : 's'} et ton graphique apparaît ici 📈
          </p>
        )}
      </Card>

      {/* Historique */}
      {sorted.length > 0 && (
        <>
          <SectionTitle>Historique</SectionTitle>
          <Card className="divide-y divide-zinc-800/70 p-0">
            {[...ma].reverse().slice(0, 30).map((w) => (
              <div key={w.date} className="flex items-center px-4 py-3">
                <span className="flex-1 text-sm font-semibold text-zinc-300">{fmtShort(w.date)}</span>
                <span className="text-xs text-zinc-500 mr-4 tabular-nums">moy. {w.ma.toFixed(1)}</span>
                <span className="font-black tabular-nums mr-3">{w.kg.toFixed(1)} kg</span>
                <button className="press p-1.5 text-zinc-600" onClick={() => remove(w.date)} aria-label="Supprimer">
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </Card>
        </>
      )}
    </div>
  )
}
