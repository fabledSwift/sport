// Calculs : moyenne mobile, rythme de prise, projection, streak, records.
import { todayISO, addDays, diffDays, fromISO } from './dates.js'
import { PACE_MIN, PACE_MAX } from './config.js'
import { EXERCISES, REST_DAY } from './program.js'

// weights: [{date, kg}] — trié par date croissante
export function sortedWeights(weights) {
  return [...weights].sort((a, b) => (a.date < b.date ? -1 : 1))
}

export function latestWeight(weights) {
  const s = sortedWeights(weights)
  return s.length ? s[s.length - 1] : null
}

// Moyenne mobile 7 j : pour chaque point, moyenne des pesées des 7 derniers jours
export function withMovingAverage(weights) {
  const s = sortedWeights(weights)
  return s.map((w) => {
    const window = s.filter((x) => diffDays(x.date, w.date) >= 0 && diffDays(x.date, w.date) < 7)
    const ma = window.reduce((sum, x) => sum + x.kg, 0) / window.length
    return { ...w, ma: Math.round(ma * 100) / 100 }
  })
}

// Rythme actuel en kg/semaine, basé sur la moyenne mobile (fenêtre ~14 j)
export function weeklyPace(weights) {
  const s = withMovingAverage(weights)
  if (s.length < 4) return null
  const last = s[s.length - 1]
  const ref = [...s].reverse().find((x) => diffDays(x.date, last.date) >= 10 && diffDays(x.date, last.date) <= 21)
    || s[0]
  const days = diffDays(ref.date, last.date)
  if (days < 6) return null
  return ((last.ma - ref.ma) / days) * 7
}

export function paceStatus(pace) {
  if (pace == null) return { code: 'none', label: 'Encore quelques pesées pour calculer ton rythme', tone: 'muted' }
  const v = Math.round(pace * 100) / 100
  if (v < PACE_MIN)
    return {
      code: 'slow', tone: 'warn',
      label: `Prise trop lente (${fmtSigned(v)} kg/sem, cible +0,3 à +0,8). Ajoute ~200-300 kcal/j : une banane + beurre de cacahuète en plus.`,
    }
  if (v > PACE_MAX)
    return {
      code: 'fast', tone: 'warn',
      label: `Prise rapide (${fmtSigned(v)} kg/sem, cible +0,3 à +0,8) — au-delà c’est surtout du gras. Réduis d’~200 kcal/j (smoothie plus léger).`,
    }
  return { code: 'ok', tone: 'good', label: `${fmtSigned(v)} kg/sem — rythme parfait, continue !` }
}

export function fmtSigned(n, digits = 1) {
  const v = n.toFixed(digits)
  return n > 0 ? `+${v}` : v
}

// Projection linéaire à la date de fin, au rythme actuel
export function projectedWeight(weights, endDate) {
  const pace = weeklyPace(weights)
  const last = latestWeight(weights)
  if (pace == null || !last) return null
  const days = diffDays(last.date, endDate)
  if (days <= 0) return last.kg
  return last.kg + (pace / 7) * days
}

// Streak : jours consécutifs validés (séance faite, ou jour de repos qui compte)
export function computeStreak(workouts) {
  let streak = 0
  let day = todayISO()
  // Aujourd'hui ne casse pas le streak s'il n'est pas encore validé
  const todayDone = !!workouts[day] || fromISO(day).getDay() === REST_DAY
  if (!todayDone) day = addDays(day, -1)
  for (let i = 0; i < 1000; i++) {
    const isRest = fromISO(day).getDay() === REST_DAY
    if (workouts[day] || isRest) {
      streak++
      day = addDays(day, -1)
    } else break
  }
  // Le streak n'a de sens que s'il contient au moins une vraie séance
  return Object.keys(workouts).length ? streak : 0
}

// Records perso : meilleure série par exercice + historique
export function personalRecords(workouts) {
  const prs = {}
  for (const [date, w] of Object.entries(workouts)) {
    for (const [exId, data] of Object.entries(w.exercises || {})) {
      const best = Math.max(...(data.sets || [0]).map((r) => r || 0))
      if (!prs[exId] || best > prs[exId].value) prs[exId] = { value: best, date }
    }
  }
  return prs
}

export function exerciseHistory(workouts, exId) {
  return Object.entries(workouts)
    .filter(([, w]) => w.exercises?.[exId])
    .map(([date, w]) => ({ date, sets: w.exercises[exId].sets, level: w.exercises[exId].level }))
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

// Résumé de la semaine courante (lundi → aujourd'hui)
export function weeklySummary({ weights, workouts, dailies, mealChecks, mondayISO }) {
  const days = Array.from({ length: 7 }, (_, i) => addDays(mondayISO, i)).filter((d) => d <= todayISO())
  const sessionsDone = days.filter((d) => workouts[d]).length
  const sessionsPlanned = days.filter((d) => fromISO(d).getDay() !== REST_DAY).length

  const s = sortedWeights(weights)
  const inWeek = s.filter((w) => w.date >= mondayISO)
  const weightDelta = inWeek.length >= 2 ? inWeek[inWeek.length - 1].kg - inWeek[0].kg : null

  const waterVals = days.map((d) => dailies[d]?.water || 0)
  const sleepVals = days.map((d) => dailies[d]?.sleep).filter((v) => v != null)
  const avgWater = waterVals.length ? waterVals.reduce((a, b) => a + b, 0) / waterVals.length : 0
  const avgSleep = sleepVals.length ? sleepVals.reduce((a, b) => a + b, 0) / sleepVals.length : null

  let mealsChecked = 0
  let mealsTotal = 0
  for (const d of days) {
    mealsTotal += 5
    mealsChecked += Object.values(mealChecks[d] || {}).filter(Boolean).length
  }

  return { sessionsDone, sessionsPlanned, weightDelta, avgWater, avgSleep, mealsChecked, mealsTotal }
}

// Volume total d'une séance (reps cumulées)
export function sessionVolume(workout) {
  return Object.values(workout.exercises || {}).reduce(
    (sum, ex) => sum + (ex.sets || []).reduce((a, r) => a + (r || 0), 0),
    0,
  )
}

export const PR_EXERCISES = ['tractions-pronation', 'dips', 'pompes', 'tractions-supination', 'rowing-australien', 'leg-raises']

export function prLabel(exId) {
  return EXERCISES[exId]?.name || exId
}
