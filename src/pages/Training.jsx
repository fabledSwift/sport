// Entraînement : séance du jour, validation des séries, timer de repos,
// progression automatique et historique par exercice.
import { useMemo, useState } from 'react'
import { Check, History, ChevronUp, Info } from 'lucide-react'
import { useStore, load } from '../lib/store.js'
import { todayISO, addDays, mondayOf, fmtShort, JOURS_COURTS, fromISO } from '../lib/dates.js'
import {
  EXERCISES, SESSIONS, WEEK_SCHEDULE, WORK_DAYS, sessionForDate, getLevel, levelTarget, shouldLevelUp, unitLabel,
} from '../lib/program.js'
import { personalRecords, exerciseHistory, sessionVolume } from '../lib/metrics.js'
import { computeBadges, BADGES } from '../lib/badges.js'
import { DEFAULT_GOALS } from '../lib/config.js'
import { Card, SectionTitle, Stepper, Sheet, useToast } from '../components/ui.jsx'
import RestTimer from '../components/RestTimer.jsx'

export default function Training() {
  const today = todayISO()
  const [selectedDate, setSelectedDate] = useState(today)
  const [workouts, setWorkouts] = useStore('workouts', {})
  const [levels, setLevels] = useStore('levels', {})
  const [draft, setDraft] = useStore('sessionDraft', null)
  const [timer, setTimer] = useState(null)
  const [detail, setDetail] = useState(null) // exId pour la fiche
  const [recap, setRecap] = useState(null)
  const toast = useToast()

  const monday = mondayOf(today)
  const week = Array.from({ length: 7 }, (_, i) => addDays(monday, i))

  const sessionKey = sessionForDate(selectedDate)
  const session = SESSIONS[sessionKey]
  const existing = workouts[selectedDate]

  // Brouillon de séance en cours (persisté pour survivre à une fermeture)
  const active = draft && draft.date === selectedDate ? draft : null

  const startSession = () => {
    const exercises = {}
    for (const exId of session.exercises) {
      const lv = levelTarget(exId, getLevel(levels, exId))
      exercises[exId] = { sets: Array(lv.sets).fill(null) }
    }
    setDraft({ date: selectedDate, session: sessionKey, exercises, startedAt: Date.now() })
  }

  const logSet = (exId, setIdx, reps) => {
    setDraft((d) => {
      const sets = [...d.exercises[exId].sets]
      sets[setIdx] = reps
      return { ...d, exercises: { ...d.exercises, [exId]: { sets } } }
    })
  }

  const validateSet = (exId, setIdx, reps) => {
    logSet(exId, setIdx, reps)
    const ex = EXERCISES[exId]
    // Pas de repos après la toute dernière série de la séance
    setTimer({ total: ex.rest, exName: ex.name, key: Date.now() })
  }

  const finishSession = () => {
    if (!active) return
    const oldPRs = personalRecords(workouts)
    const oldBadges = computeBadges(badgeInputs())

    const saved = {}
    const levelUps = []
    const newLevels = { ...levels }
    for (const [exId, data] of Object.entries(active.exercises)) {
      const done = data.sets.filter((r) => r != null)
      if (!done.length) continue
      const lvIdx = getLevel(levels, exId)
      saved[exId] = { sets: data.sets.map((r) => r ?? 0), level: lvIdx }
      if (shouldLevelUp(exId, lvIdx, data.sets)) {
        newLevels[exId] = lvIdx + 1
        levelUps.push(exId)
      }
    }
    if (!Object.keys(saved).length) {
      toast('Valide au moins une série avant de terminer', '🤨')
      return
    }

    const workout = { session: active.session, exercises: saved, durationMin: Math.round((Date.now() - active.startedAt) / 60000) }
    const nextWorkouts = { ...workouts, [selectedDate]: workout }
    setWorkouts(nextWorkouts)
    setLevels(newLevels)
    setDraft(null)
    setTimer(null)

    // Records & badges gagnés
    const newPRs = personalRecords(nextWorkouts)
    const prGains = Object.entries(newPRs)
      .filter(([exId, pr]) => pr.date === selectedDate && pr.value > (oldPRs[exId]?.value ?? 0) && (oldPRs[exId]?.value ?? 0) > 0)
      .map(([exId, pr]) => ({ exId, value: pr.value }))
    const nowBadges = computeBadges(badgeInputs(nextWorkouts))
    const newBadges = [...nowBadges].filter((b) => !oldBadges.has(b))

    setRecap({ workout, levelUps, prGains, newBadges, volume: sessionVolume(workout) })
  }

  function badgeInputs(w = workouts) {
    return {
      workouts: w,
      weights: load('weights', []),
      dailies: load('dailies', {}),
      mealChecks: load('mealChecks', {}),
      photoCount: 0, // les badges photo sont recalculés sur la page Stats
      goals: load('goals', DEFAULT_GOALS),
    }
  }

  return (
    <div className="anim-fade-up">
      <header className="pt-6 pb-4">
        <h1 className="text-2xl font-black">Entraînement</h1>
        <p className="text-sm text-zinc-500 font-semibold">6 séances / semaine · barre & station de dips</p>
      </header>

      {/* Semaine */}
      <div className="flex gap-1.5 mb-4">
        {week.map((d) => {
          const key = sessionForDate(d)
          const done = !!workouts[d]
          const isToday = d === today
          const isSelected = d === selectedDate
          const missed = !done && d < today && key !== 'repos'
          return (
            <button
              key={d}
              onClick={() => setSelectedDate(d)}
              className={`press flex-1 rounded-xl py-2 flex flex-col items-center gap-0.5 border ${
                isSelected ? 'border-orange-500 bg-orange-500/10' : 'border-transparent bg-zinc-800/50'
              }`}
            >
              <span className={`text-[10px] font-black ${isToday ? 'text-orange-400' : 'text-zinc-500'}`}>
                {JOURS_COURTS[fromISO(d).getDay()]}
              </span>
              <span className="text-sm">
                {done ? '✅' : key === 'repos' ? '😴' : missed ? '▫️' : SESSIONS[key].emoji}
              </span>
            </button>
          )
        })}
      </div>

      {/* En-tête séance */}
      <Card className="bg-gradient-to-br from-[#1d1712] to-[#171412]">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{session.emoji}</span>
          <div className="flex-1">
            <p className="font-black text-lg">{session.name}</p>
            <p className="text-xs text-zinc-500 font-semibold">
              {session.subtitle}
              {selectedDate !== today && ` · ${fmtShort(selectedDate)}`}
            </p>
          </div>
          {existing && <span className="text-xs font-black text-emerald-400">Validée ✔ {existing.durationMin ? `· ${existing.durationMin} min` : ''}</span>}
        </div>
        {sessionKey === 'repos' && (
          <p className="text-sm text-zinc-400 mt-3 leading-relaxed">
            Mercredi off : boulot le matin, récup l'après-midi — c'est aujourd'hui que tes muscles se construisent.
            Marche tranquille, étirements, ou 20-30 min de natation cool dans la mer 🌊, et au moins 8 h de sommeil.
            Le streak ne casse pas le mercredi, et le meal prep reste le dimanche 🍚.
          </p>
        )}
        {sessionKey !== 'repos' && (
          <p className="text-xs text-zinc-500 mt-3">
            {WORK_DAYS.includes(fromISO(selectedDate).getDay())
              ? '🏖️ Jour de taff (fin à 14 h) : séance idéale vers 16-17 h — rentre, bois ton smoothie, souffle 1 h, puis GO.'
              : '🌞 Jour libre : grosse séance — le matin au frais c’est le top, et la mer t’attend après.'}
          </p>
        )}
      </Card>

      {selectedDate === today && <CardioCard />}

      {/* Corps de séance */}
      {sessionKey !== 'repos' && !existing && !active && (
        <button onClick={startSession} className="press mt-3 w-full rounded-2xl bg-orange-500 py-4 text-lg font-black text-zinc-950">
          Commencer la séance 🔥
        </button>
      )}

      {sessionKey !== 'repos' && !active && existing && <RecapList workout={existing} />}

      {active && (
        <>
          <div className="lg:grid lg:grid-cols-2 lg:gap-x-4 lg:items-start">
            {session.exercises.map((exId) => (
              <ExerciseCard
                key={exId}
                exId={exId}
                levelIdx={getLevel(levels, exId)}
                sets={active.exercises[exId].sets}
                onValidate={(setIdx, reps) => validateSet(exId, setIdx, reps)}
                onInfo={() => setDetail(exId)}
              />
            ))}
          </div>
          <button onClick={finishSession} className="press mt-4 w-full rounded-2xl bg-emerald-500 py-4 text-lg font-black text-zinc-950">
            Terminer la séance ✅
          </button>
          <button onClick={() => { setDraft(null); setTimer(null) }} className="press mt-2 mb-4 w-full rounded-2xl bg-zinc-800/60 py-3 text-sm font-bold text-zinc-500">
            Abandonner
          </button>
        </>
      )}

      {/* Aperçu des exercices quand la séance n'est pas commencée */}
      {sessionKey !== 'repos' && !active && !existing && (
        <>
          <SectionTitle>Au programme</SectionTitle>
          <div className="lg:grid lg:grid-cols-2 lg:gap-x-4 lg:items-start">
          {session.exercises.map((exId) => {
            const lvIdx = getLevel(levels, exId)
            const lv = levelTarget(exId, lvIdx)
            const ex = EXERCISES[exId]
            return (
              <Card key={exId} className="mb-2" onClick={() => setDetail(exId)}>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <p className="font-bold">{ex.name}</p>
                    <p className="text-xs text-zinc-500">{ex.muscles}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-orange-400 tabular-nums">
                      {lv.sets} × {lv.min}-{lv.max}
                      <span className="text-[10px] text-zinc-500"> {unitLabel(exId)}</span>
                    </p>
                    <p className="text-[10px] text-zinc-500 font-bold">Niv. {lvIdx + 1}/{ex.levels.length}</p>
                  </div>
                  <Info size={16} className="text-zinc-600" />
                </div>
                {lv.note && <p className="text-[11px] font-bold text-amber-300/90 mt-1.5">⚡ {lv.note}</p>}
              </Card>
            )
          })}
          </div>
        </>
      )}

      <ExerciseSheet exId={detail} levels={levels} workouts={workouts} onClose={() => setDetail(null)} />
      <RecapSheet recap={recap} onClose={() => setRecap(null)} />
      <RestTimer key={timer?.key} timer={timer} onClose={() => setTimer(null)} />
    </div>
  )
}

function ExerciseCard({ exId, levelIdx, sets, onValidate, onInfo }) {
  const ex = EXERCISES[exId]
  const lv = levelTarget(exId, levelIdx)
  const [values, setValues] = useState(() => sets.map((s) => s ?? lv.max))
  const doneCount = sets.filter((s) => s != null).length
  const allMax = doneCount >= lv.sets && sets.every((s) => s == null || s >= lv.max)

  return (
    <Card className="mt-3">
      <div className="flex items-center gap-2 mb-1">
        <button className="flex-1 text-left press" onClick={onInfo}>
          <p className="font-bold">{ex.name}</p>
          <p className="text-xs text-zinc-500">{ex.muscles} · Niv. {levelIdx + 1}/{ex.levels.length}</p>
        </button>
        <p className="font-black text-orange-400 tabular-nums text-sm">
          {lv.sets} × {lv.min}-{lv.max} <span className="text-[10px] text-zinc-500">{unitLabel(exId)}</span>
        </p>
      </div>
      {lv.note && <p className="text-[11px] font-bold text-amber-300/90 mb-1">⚡ {lv.note}</p>}
      <p className="text-[11px] text-zinc-500 mb-3">{ex.tip}</p>

      <div className="flex flex-col gap-2">
        {Array.from({ length: lv.sets }, (_, i) => {
          const validated = sets[i] != null
          return (
            <div key={i} className={`flex items-center gap-3 rounded-xl px-3 py-2 ${validated ? 'bg-emerald-500/10' : 'bg-zinc-800/50'}`}>
              <span className="text-xs font-black text-zinc-500 w-12">Série {i + 1}</span>
              <div className="flex-1 flex justify-center">
                <Stepper
                  value={validated ? sets[i] : values[i]}
                  onChange={(v, d) => {
                    if (validated) onValidate(i, v)
                    else setValues((vals) => vals.map((x, j) => (j === i ? Math.max(0, x + d) : x)))
                  }}
                  min={0} max={ex.type === 'secs' ? 300 : 100}
                  suffix={ex.type === 'secs' ? 's' : ''}
                />
              </div>
              <button
                onClick={() => !validated && onValidate(i, values[i])}
                className={`press w-10 h-10 rounded-xl flex items-center justify-center ${
                  validated ? 'bg-emerald-500 text-zinc-950' : 'bg-zinc-700 text-zinc-400'
                }`}
                aria-label={`Valider la série ${i + 1}`}
              >
                <Check size={18} strokeWidth={3} />
              </button>
            </div>
          )
        })}
      </div>
      {allMax && (
        <p className="text-xs font-black text-emerald-400 mt-2 flex items-center gap-1 anim-pop">
          <ChevronUp size={14} /> Toutes les séries au max — niveau suivant débloqué à la fin de la séance !
        </p>
      )}
    </Card>
  )
}

// Cardio optionnel — la recherche : 2-3 séances cool de 20-40 min / sem (≤ ~120 min)
// n'interfèrent pas avec la prise de muscle SI on compense les calories brûlées.
const CARDIO_TYPES = [
  { id: 'natation', name: 'Natation', emoji: '🏊' },
  { id: 'course', name: 'Course', emoji: '🏃' },
  { id: 'marche', name: 'Marche / autre', emoji: '🚶' },
]

function CardioCard() {
  const today = todayISO()
  const [dailies, setDailies] = useStore('dailies', {})
  const [type, setType] = useState('natation')
  const [min, setMin] = useState(20)

  const cardio = dailies[today]?.cardio
  const monday = mondayOf(today)
  const weekMin = Array.from({ length: 7 }, (_, i) => addDays(monday, i))
    .reduce((s, d) => s + (dailies[d]?.cardio?.min || 0), 0)

  const save = () =>
    setDailies((d) => ({ ...d, [today]: { ...d[today], cardio: { type, min } } }))
  const remove = () =>
    setDailies((d) => ({ ...d, [today]: { ...d[today], cardio: undefined } }))

  return (
    <Card className="mt-3">
      {cardio ? (
        <>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{CARDIO_TYPES.find((t) => t.id === cardio.type)?.emoji || '🏃'}</span>
            <div className="flex-1">
              <p className="text-sm font-bold">
                Cardio du jour : {CARDIO_TYPES.find((t) => t.id === cardio.type)?.name || cardio.type} · {cardio.min} min
              </p>
              <p className="text-xs text-zinc-500">{weekMin} min cette semaine (zone sans interférence : ≤ 120 min)</p>
            </div>
            <button onClick={remove} className="press p-2 rounded-xl bg-zinc-800 text-xs font-black text-zinc-500">✕</button>
          </div>
          {cardio.min >= 30 && (
            <p className="text-xs font-semibold text-amber-300/90 mt-2">
              ⚡ Tu as brûlé ~{Math.round(cardio.min * 9)} kcal — compense avec une collation en plus (ex : smoothie),
              sinon ta prise ralentit.
            </p>
          )}
        </>
      ) : (
        <>
          <p className="text-sm font-bold mb-0.5">🌊 Cardio du jour (optionnel)</p>
          <p className="text-xs text-zinc-500 mb-3">
            Natation cool à volonté après le boulot — de préférence à 3 h+ de la séance, et muscu d'abord.
            {weekMin > 0 && ` Déjà ${weekMin} min cette semaine.`}
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            {CARDIO_TYPES.map((t) => (
              <button
                key={t.id}
                onClick={() => setType(t.id)}
                className={`press rounded-xl px-3 py-2 text-xs font-black ${type === t.id ? 'bg-sky-500/20 text-sky-300' : 'bg-zinc-800 text-zinc-400'}`}
              >
                {t.emoji} {t.name}
              </button>
            ))}
            <div className="flex-1" />
            <Stepper value={min} onChange={(v) => setMin(Math.max(5, v))} min={5} max={120} step={5} suffix="m" />
            <button onClick={save} className="press rounded-xl bg-sky-500 px-4 py-2.5 text-xs font-black text-zinc-950">
              OK
            </button>
          </div>
          {weekMin > 120 && (
            <p className="text-xs font-semibold text-amber-300/90 mt-2">
              ⚠️ {weekMin} min de cardio cette semaine — au-delà de ~120 min, ça peut freiner la prise de muscle.
              Garde les séances tranquilles et mange plus.
            </p>
          )}
        </>
      )}
    </Card>
  )
}

function RecapList({ workout }) {
  return (
    <>
      <SectionTitle>Séance réalisée</SectionTitle>
      <div className="lg:grid lg:grid-cols-2 lg:gap-x-4">
        {Object.entries(workout.exercises).map(([exId, data]) => (
          <Card key={exId} className="mb-2">
            <div className="flex items-center justify-between">
              <p className="font-bold text-sm">{EXERCISES[exId]?.name || exId}</p>
              <p className="font-black tabular-nums text-sm text-zinc-300">{data.sets.join(' · ')}</p>
            </div>
          </Card>
        ))}
      </div>
    </>
  )
}

function ExerciseSheet({ exId, levels, workouts, onClose }) {
  const ex = exId ? EXERCISES[exId] : null
  const history = useMemo(() => (exId ? exerciseHistory(workouts, exId).slice(0, 8) : []), [exId, workouts])
  if (!ex) return null
  const current = getLevel(levels, exId)

  return (
    <Sheet open={!!exId} onClose={onClose} title={ex.name}>
      <p className="text-sm text-zinc-400 mb-1">{ex.muscles}</p>
      <p className="text-sm text-zinc-300 mb-4">💡 {ex.tip}</p>

      <p className="text-xs uppercase tracking-widest text-zinc-500 font-bold mb-2">Échelle de progression</p>
      <div className="flex flex-col gap-1.5 mb-5">
        {ex.levels.map((lv, i) => (
          <div
            key={i}
            className={`rounded-xl px-3 py-2 flex items-center gap-3 text-sm ${
              i === current ? 'bg-orange-500/15 border border-orange-500/40' : i < current ? 'bg-emerald-500/5 text-zinc-500' : 'bg-zinc-800/50 text-zinc-500'
            }`}
          >
            <span className="font-black w-6">{i < current ? '✅' : i === current ? '👉' : `${i + 1}`}</span>
            <span className="font-bold tabular-nums">{lv.sets} × {lv.min}-{lv.max}</span>
            {lv.note && <span className="text-xs flex-1">{lv.note}</span>}
          </div>
        ))}
      </div>

      {history.length > 0 && (
        <>
          <p className="text-xs uppercase tracking-widest text-zinc-500 font-bold mb-2 flex items-center gap-1">
            <History size={13} /> Historique
          </p>
          <div className="flex flex-col gap-1.5">
            {history.map((h) => (
              <div key={h.date} className="flex items-center justify-between rounded-xl bg-zinc-800/50 px-3 py-2 text-sm">
                <span className="text-zinc-400 font-semibold">{fmtShort(h.date)}</span>
                <span className="font-black tabular-nums">{h.sets.join(' · ')}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </Sheet>
  )
}

function RecapSheet({ recap, onClose }) {
  if (!recap) return null
  return (
    <Sheet open={!!recap} onClose={onClose} title="Séance terminée 💪">
      <div className="text-center py-2">
        <p className="text-5xl mb-2">🎉</p>
        <p className="font-black text-xl">{recap.volume} reps au total</p>
        {recap.workout.durationMin > 0 && (
          <p className="text-sm text-zinc-500 font-semibold">{recap.workout.durationMin} minutes d'effort</p>
        )}
      </div>

      {recap.levelUps.length > 0 && (
        <div className="mt-3 rounded-2xl bg-orange-500/10 border border-orange-500/30 p-4">
          <p className="font-black text-orange-300 text-sm mb-1">⬆️ Progression automatique !</p>
          {recap.levelUps.map((exId) => (
            <p key={exId} className="text-sm text-zinc-300">
              <b>{EXERCISES[exId].name}</b> passe au niveau supérieur — nouvelles cibles à la prochaine séance.
            </p>
          ))}
        </div>
      )}

      {recap.prGains.length > 0 && (
        <div className="mt-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-4">
          <p className="font-black text-emerald-300 text-sm mb-1">🏆 Nouveau record !</p>
          {recap.prGains.map(({ exId, value }) => (
            <p key={exId} className="text-sm text-zinc-300"><b>{EXERCISES[exId].name}</b> : {value} reps</p>
          ))}
        </div>
      )}

      {recap.newBadges.length > 0 && (
        <div className="mt-3 rounded-2xl bg-violet-500/10 border border-violet-500/30 p-4">
          <p className="font-black text-violet-300 text-sm mb-1">🎖️ Badge débloqué !</p>
          {recap.newBadges.map((id) => {
            const b = BADGES.find((x) => x.id === id)
            return b ? <p key={id} className="text-sm text-zinc-300">{b.emoji} <b>{b.name}</b> — {b.desc}</p> : null
          })}
        </div>
      )}

      <button onClick={onClose} className="press mt-5 w-full rounded-2xl bg-orange-500 py-3.5 font-black text-zinc-950">
        Bien joué !
      </button>
    </Sheet>
  )
}
