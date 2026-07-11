// Dashboard : vue d'ensemble de la transfo.
import { useEffect, useMemo, useState } from 'react'
import { Flame, Droplets, Moon, UtensilsCrossed, ChevronRight, Camera, Scale } from 'lucide-react'
import { useStore } from '../lib/store.js'
import { DEFAULT_GOALS, PROFIL } from '../lib/config.js'
import { todayISO, fmtLong, diffDays } from '../lib/dates.js'
import {
  latestWeight, computeStreak, paceStatus, weeklyPace, projectedWeight, fmtSigned,
} from '../lib/metrics.js'
import { SESSIONS, sessionForDate } from '../lib/program.js'
import { mealsForDate, MEALS, dayTotals } from '../lib/nutrition.js'
import { getAllPhotos } from '../lib/photos.js'
import { Card, ProgressBar, Ring, useToast } from '../components/ui.jsx'
import WeightChart from '../components/WeightChart.jsx'

export default function Dashboard({ navigate }) {
  const today = todayISO()
  const [goals] = useStore('goals', DEFAULT_GOALS)
  const [weights, setWeights] = useStore('weights', [])
  const [workouts] = useStore('workouts', {})
  const [dailies, setDailies] = useStore('dailies', {})
  const [mealChecks] = useStore('mealChecks', {})
  const [mealSwaps] = useStore('mealSwaps', {})
  const [photosToday, setPhotosToday] = useState(null)
  const [kgInput, setKgInput] = useState('')
  const toast = useToast()

  useEffect(() => {
    getAllPhotos().then((all) => setPhotosToday(all.filter((p) => p.date === today).length))
  }, [today])

  const last = latestWeight(weights)
  const current = last?.kg ?? goals.startWeight
  const gained = current - goals.startWeight
  const toGain = goals.goalWeight - goals.startWeight
  const daysLeft = Math.max(0, diffDays(today, goals.endDate))
  const streak = computeStreak(workouts)
  const pace = weeklyPace(weights)
  const status = paceStatus(pace)
  const projection = projectedWeight(weights, goals.endDate)

  const sessionKey = sessionForDate(today)
  const session = SESSIONS[sessionKey]
  const sessionDone = !!workouts[today]

  const todayMealIds = mealsForDate(today, mealSwaps)
  const checks = mealChecks[today] || {}
  const kcalDone = todayMealIds.reduce((sum, id, i) => sum + (checks[`${i}`] ? MEALS[id].kcal : 0), 0)
  const totals = dayTotals(todayMealIds)

  const water = dailies[today]?.water || 0
  const sleep = dailies[today]?.sleep

  const weighedToday = weights.some((w) => w.date === today)

  const addWater = () => {
    setDailies((d) => ({ ...d, [today]: { ...d[today], water: (d[today]?.water || 0) + 1 } }))
  }

  const saveWeight = () => {
    const kg = parseFloat(kgInput.replace(',', '.'))
    if (!kg || kg < 40 || kg > 150) return
    setWeights((w) => [...w.filter((x) => x.date !== today), { date: today, kg }])
    setKgInput('')
    toast(`${kg.toFixed(1)} kg enregistré`, '⚖️')
  }

  return (
    <div className="anim-fade-up">
      <header className="pt-6 pb-4">
        <p className="text-sm text-zinc-500 font-semibold">{fmtLong(today)}</p>
        <h1 className="text-2xl font-black">Salut {PROFIL.prenom} 👋</h1>
      </header>

      {/* Hero poids */}
      <Card className="bg-gradient-to-br from-[#1d1712] to-[#171412]">
        <div className="flex items-end justify-between mb-1">
          <div>
            <p className="text-xs uppercase tracking-widest text-zinc-500 font-bold mb-1">Poids actuel</p>
            <p className="text-4xl font-black tabular-nums">
              {current.toFixed(1)}
              <span className="text-lg text-zinc-500 font-bold"> kg</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-zinc-500 font-semibold">
              Objectif <span className="text-emerald-400 font-black">{goals.goalWeight} kg</span>
            </p>
            <p className="text-xs text-zinc-500 font-semibold mt-1">
              <span className="text-orange-400 font-black">J-{daysLeft}</span> · mi-sept.
            </p>
          </div>
        </div>
        <ProgressBar value={Math.max(0, gained)} max={toGain} className="mt-3" color="linear-gradient(90deg, #ff8a1e, #34d399)" />
        <div className="flex justify-between mt-2 text-xs font-bold">
          <span className={gained >= 0 ? 'text-emerald-400' : 'text-red-400'}>{fmtSigned(gained)} kg</span>
          <span className="text-zinc-500">{Math.max(0, toGain - gained).toFixed(1)} kg restants</span>
        </div>
        {weights.length > 1 && (
          <div className="mt-3 -mx-1">
            <WeightChart weights={weights} goals={goals} compact />
          </div>
        )}
        {projection != null && (
          <p className="text-xs text-zinc-500 mt-2">
            À ce rythme : <b className="text-zinc-300">{projection.toFixed(1)} kg</b> le 15 septembre
          </p>
        )}
      </Card>

      {/* Alerte rythme */}
      {status.tone === 'warn' && (
        <Card className="mt-3 border-amber-500/30 bg-amber-500/5">
          <p className="text-sm font-semibold text-amber-300">⚠️ {status.label}</p>
        </Card>
      )}

      {/* Pesée du jour */}
      {!weighedToday && (
        <Card className="mt-3">
          <div className="flex items-center gap-3">
            <Scale className="text-orange-400 shrink-0" size={22} />
            <div className="flex-1">
              <p className="text-sm font-bold">Pesée du matin</p>
              <p className="text-xs text-zinc-500">À jeun, après les toilettes — même heure chaque jour</p>
            </div>
            <input
              type="text" inputMode="decimal" placeholder={current.toFixed(1)}
              value={kgInput} onChange={(e) => setKgInput(e.target.value)}
              className="w-20 rounded-xl bg-zinc-800 px-3 py-2.5 text-center font-bold outline-none focus:ring-2 ring-orange-500"
            />
            <button onClick={saveWeight} className="press rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-black text-zinc-950">
              OK
            </button>
          </div>
        </Card>
      )}

      {/* Rappel photo */}
      {photosToday === 0 && (
        <Card className="mt-3 border-orange-500/25" onClick={() => navigate('suivi', 'photos')}>
          <div className="flex items-center gap-3">
            <Camera className="text-orange-400" size={22} />
            <div className="flex-1">
              <p className="text-sm font-bold">📸 Photo du jour à prendre !</p>
              <p className="text-xs text-zinc-500">Même endroit, même lumière, même pose</p>
            </div>
            <ChevronRight size={18} className="text-zinc-600" />
          </div>
        </Card>
      )}

      {/* Stats rapides */}
      <div className="grid grid-cols-2 gap-3 mt-3">
        <Card onClick={() => navigate('training')}>
          <div className="flex items-center gap-3">
            <Ring value={streak} max={Math.max(streak, 7)} size={52} stroke={5} color="var(--color-accent)">
              <Flame size={18} className="text-orange-400" />
            </Ring>
            <div>
              <p className="text-2xl font-black tabular-nums">{streak}</p>
              <p className="text-[11px] text-zinc-500 font-bold">jours de streak</p>
            </div>
          </div>
        </Card>
        <Card onClick={() => navigate('nutrition')}>
          <div className="flex items-center gap-3">
            <Ring value={kcalDone} max={goals.kcalTarget} size={52} stroke={5} color="var(--color-good)">
              <UtensilsCrossed size={16} className="text-emerald-400" />
            </Ring>
            <div>
              <p className="text-2xl font-black tabular-nums">{Math.round((kcalDone / goals.kcalTarget) * 100)}<span className="text-sm">%</span></p>
              <p className="text-[11px] text-zinc-500 font-bold">{kcalDone} / {goals.kcalTarget} kcal</p>
            </div>
          </div>
        </Card>
        <Card onClick={addWater}>
          <div className="flex items-center gap-3">
            <Ring value={water} max={goals.waterTarget} size={52} stroke={5} color="#38bdf8">
              <Droplets size={16} className="text-sky-400" />
            </Ring>
            <div>
              <p className="text-2xl font-black tabular-nums">{water}<span className="text-sm text-zinc-500">/{goals.waterTarget}</span></p>
              <p className="text-[11px] text-zinc-500 font-bold">verres · touche = +1</p>
            </div>
          </div>
        </Card>
        <Card onClick={() => navigate('suivi', 'hydro')}>
          <div className="flex items-center gap-3">
            <Ring value={sleep || 0} max={goals.sleepTarget} size={52} stroke={5} color="#a78bfa">
              <Moon size={16} className="text-violet-400" />
            </Ring>
            <div>
              <p className="text-2xl font-black tabular-nums">{sleep != null ? `${sleep}h` : '—'}</p>
              <p className="text-[11px] text-zinc-500 font-bold">sommeil cette nuit</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Séance du jour */}
      <Card className="mt-3" onClick={() => navigate('training')}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/15 flex items-center justify-center text-2xl">
            {session.emoji}
          </div>
          <div className="flex-1">
            <p className="text-xs uppercase tracking-widest text-zinc-500 font-bold">
              {sessionDone ? 'Séance validée ✔' : 'Prochaine séance'}
            </p>
            <p className="font-extrabold">
              {session.name}
              <span className="text-zinc-500 font-semibold"> · {session.subtitle}</span>
            </p>
            {session.exercises.length > 0 && (
              <p className="text-xs text-zinc-500 mt-0.5">{session.exercises.length} exercices</p>
            )}
          </div>
          {!sessionDone && sessionKey !== 'repos' && (
            <span className="press rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-black text-zinc-950">GO</span>
          )}
        </div>
      </Card>

      {/* Repas du jour (aperçu) */}
      <Card className="mt-3" onClick={() => navigate('nutrition')}>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs uppercase tracking-widest text-zinc-500 font-bold">Repas du jour</p>
          <p className="text-xs font-bold text-zinc-400">≈ {totals.kcal} kcal · {totals.prot} g prot.</p>
        </div>
        <div className="flex gap-2">
          {todayMealIds.map((id, i) => (
            <div
              key={i}
              className={`flex-1 rounded-xl py-2 text-center text-lg ${checks[`${i}`] ? 'bg-emerald-500/15' : 'bg-zinc-800/60'}`}
              title={MEALS[id].name}
            >
              {checks[`${i}`] ? '✅' : MEALS[id].emoji}
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
