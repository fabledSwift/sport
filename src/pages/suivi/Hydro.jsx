// Hydratation & sommeil — trackers simples pour un plagiste au soleil.
import { Droplets, Moon } from 'lucide-react'
import { useStore } from '../../lib/store.js'
import { DEFAULT_GOALS } from '../../lib/config.js'
import { todayISO, addDays, JOURS_COURTS, fromISO } from '../../lib/dates.js'
import { Card, SectionTitle, Ring } from '../../components/ui.jsx'

export default function Hydro() {
  const today = todayISO()
  const [goals] = useStore('goals', DEFAULT_GOALS)
  const [dailies, setDailies] = useStore('dailies', {})

  const water = dailies[today]?.water || 0
  const sleep = dailies[today]?.sleep ?? 0

  // Mises à jour fonctionnelles : robustes même en tapotant très vite
  const addWater = (n) =>
    setDailies((d) => ({ ...d, [today]: { ...d[today], water: Math.max(0, (d[today]?.water || 0) + n) } }))
  const addSleep = (n) =>
    setDailies((d) => ({
      ...d,
      [today]: { ...d[today], sleep: Math.min(14, Math.max(0, +(((d[today]?.sleep ?? 0) + n).toFixed(1)))) },
    }))

  const last7 = Array.from({ length: 7 }, (_, i) => addDays(today, -(6 - i)))

  return (
    <div>
      <div className="lg:grid lg:grid-cols-2 lg:gap-4 lg:items-stretch">
      {/* Eau */}
      <Card>
        <div className="flex items-center gap-4">
          <Ring value={water} max={goals.waterTarget} size={84} stroke={8} color="#38bdf8">
            <div className="text-center">
              <Droplets size={16} className="text-sky-400 mx-auto" />
              <span className="text-sm font-black tabular-nums">{(water * 0.25).toFixed(2).replace('.', ',')} L</span>
            </div>
          </Ring>
          <div className="flex-1">
            <p className="font-extrabold">Hydratation</p>
            <p className="text-xs text-zinc-500 mb-2">
              {water} / {goals.waterTarget} verres de 25 cl — objectif 3 L, t'es au soleil toute la journée !
            </p>
            <div className="flex gap-2">
              <button
                className="press flex-1 rounded-xl bg-sky-500/15 text-sky-300 py-2.5 font-black text-sm"
                onClick={() => addWater(1)}
              >
                + 1 verre
              </button>
              <button
                className="press flex-1 rounded-xl bg-sky-500/15 text-sky-300 py-2.5 font-black text-sm"
                onClick={() => addWater(2)}
              >
                + 50 cl
              </button>
              <button
                className="press w-11 rounded-xl bg-zinc-800 text-zinc-400 font-black"
                onClick={() => addWater(-1)}
              >
                −
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Sommeil */}
      <Card className="mt-3 lg:mt-0">
        <div className="flex items-center gap-4">
          <Ring value={sleep} max={goals.sleepTarget} size={84} stroke={8} color="#a78bfa">
            <div className="text-center">
              <Moon size={16} className="text-violet-400 mx-auto" />
              <span className="text-sm font-black tabular-nums">{sleep}h</span>
            </div>
          </Ring>
          <div className="flex-1">
            <p className="font-extrabold">Sommeil</p>
            <p className="text-xs text-zinc-500 mb-2">
              Cette nuit — objectif {goals.sleepTarget} h. C'est la nuit que le muscle se construit.
            </p>
            <div className="flex items-center gap-1">
              <button className="press w-9 h-9 rounded-xl bg-zinc-800 text-lg font-bold text-zinc-300" onClick={() => addSleep(-0.5)}>−</button>
              <div className="w-14 text-center font-bold tabular-nums">{sleep}<span className="text-xs text-zinc-500 ml-0.5">h</span></div>
              <button className="press w-9 h-9 rounded-xl bg-zinc-800 text-lg font-bold text-zinc-300" onClick={() => addSleep(0.5)}>+</button>
            </div>
          </div>
        </div>
      </Card>

      </div>

      {/* Historique 7 jours */}
      <SectionTitle>7 derniers jours</SectionTitle>
      <Card>
        <p className="text-[11px] uppercase tracking-widest text-zinc-500 font-bold mb-2">💧 Eau (verres)</p>
        <div className="flex items-end gap-1.5 h-20 mb-1">
          {last7.map((d) => {
            const v = dailies[d]?.water || 0
            const pct = Math.min(100, (v / goals.waterTarget) * 100)
            return (
              <div key={d} className="flex-1 flex flex-col items-center justify-end h-full gap-1">
                <span className="text-[10px] font-bold text-zinc-500 tabular-nums">{v || ''}</span>
                <div
                  className={`w-full rounded-md transition-all ${v >= goals.waterTarget ? 'bg-sky-400' : 'bg-sky-400/30'}`}
                  style={{ height: `${Math.max(4, pct * 0.7)}%` }}
                />
              </div>
            )
          })}
        </div>
        <div className="flex gap-1.5">
          {last7.map((d) => (
            <span key={d} className="flex-1 text-center text-[10px] font-bold text-zinc-600">
              {JOURS_COURTS[fromISO(d).getDay()]}
            </span>
          ))}
        </div>

        <p className="text-[11px] uppercase tracking-widest text-zinc-500 font-bold mb-2 mt-5">😴 Sommeil (heures)</p>
        <div className="flex items-end gap-1.5 h-20 mb-1">
          {last7.map((d) => {
            const v = dailies[d]?.sleep || 0
            const pct = Math.min(100, (v / 10) * 100)
            return (
              <div key={d} className="flex-1 flex flex-col items-center justify-end h-full gap-1">
                <span className="text-[10px] font-bold text-zinc-500 tabular-nums">{v || ''}</span>
                <div
                  className={`w-full rounded-md transition-all ${v >= goals.sleepTarget ? 'bg-violet-400' : 'bg-violet-400/30'}`}
                  style={{ height: `${Math.max(4, pct * 0.7)}%` }}
                />
              </div>
            )
          })}
        </div>
        <div className="flex gap-1.5">
          {last7.map((d) => (
            <span key={d} className="flex-1 text-center text-[10px] font-bold text-zinc-600">
              {JOURS_COURTS[fromISO(d).getDay()]}
            </span>
          ))}
        </div>
      </Card>

      <Card className="mt-3 border-sky-500/20 bg-sky-500/5">
        <p className="text-xs text-sky-200/90 leading-relaxed">
          ☀️ <b>Conseil plagiste :</b> emporte une gourde de 1 L et vide-la 3 fois dans la journée.
          Coche ici à chaque remplissage — déshydraté, tu perds de la force et de l'appétit, les deux ennemis de ta prise de masse.
        </p>
      </Card>
    </div>
  )
}
