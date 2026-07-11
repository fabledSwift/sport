// Badges : calculés dynamiquement depuis les données.
import { computeStreak, personalRecords, sortedWeights } from './metrics.js'
import { mondayOf, addDays, todayISO, fromISO } from './dates.js'

export const BADGES = [
  { id: 'first-workout', emoji: '🎬', name: 'Premier pas', desc: 'Première séance validée' },
  { id: 'streak-7', emoji: '🔥', name: 'Une semaine !', desc: '7 jours de régularité' },
  { id: 'streak-14', emoji: '🔥', name: 'Deux semaines', desc: '14 jours de régularité' },
  { id: 'streak-30', emoji: '🌋', name: 'Machine', desc: '30 jours de régularité' },
  { id: 'streak-60', emoji: '🏆', name: 'Transformation', desc: '60 jours — le programme complet !' },
  { id: 'pullups-10', emoji: '🦍', name: 'Double chiffre', desc: '10 tractions d’affilée' },
  { id: 'pullups-15', emoji: '🦾', name: 'Dominateur de barre', desc: '15 tractions d’affilée' },
  { id: 'dips-15', emoji: '💪', name: 'Roi des dips', desc: '15 dips d’affilée' },
  { id: 'dips-25', emoji: '🤖', name: 'Piston hydraulique', desc: '25 dips d’affilée' },
  { id: 'pushups-40', emoji: '💥', name: 'Mitraillette', desc: '40 pompes d’affilée' },
  { id: 'weight-2', emoji: '📈', name: '+2 kg', desc: '2 kg de pris depuis le départ' },
  { id: 'weight-4', emoji: '📈', name: '+4 kg', desc: '4 kg de pris — plus que la moitié !' },
  { id: 'weight-goal', emoji: '👑', name: 'Objectif atteint', desc: 'Poids objectif atteint !' },
  { id: 'photo-first', emoji: '📸', name: 'Jour 1', desc: 'Première photo enregistrée' },
  { id: 'photo-30', emoji: '🎞️', name: 'Time-lapse', desc: '30 photos de progression' },
  { id: 'weights-14', emoji: '⚖️', name: 'Rigueur', desc: '14 pesées enregistrées' },
  { id: 'water-week', emoji: '💧', name: 'Hydraté', desc: 'Objectif eau atteint 7 jours d’affilée' },
  { id: 'meals-perfect-week', emoji: '🍽️', name: 'Semaine parfaite', desc: 'Tous les repas cochés sur 7 jours' },
  { id: 'volume-1000', emoji: '🏗️', name: 'Bâtisseur', desc: '1 000 reps cumulées au total' },
]

export function computeBadges({ workouts, weights, dailies, mealChecks, photoCount, goals }) {
  const unlocked = new Set()
  const streak = computeStreak(workouts)
  const prs = personalRecords(workouts)
  const nbWorkouts = Object.keys(workouts).length

  if (nbWorkouts >= 1) unlocked.add('first-workout')
  if (streak >= 7) unlocked.add('streak-7')
  if (streak >= 14) unlocked.add('streak-14')
  if (streak >= 30) unlocked.add('streak-30')
  if (streak >= 60) unlocked.add('streak-60')

  const pullups = Math.max(prs['tractions-pronation']?.value || 0, prs['tractions-supination']?.value || 0)
  if (pullups >= 10) unlocked.add('pullups-10')
  if (pullups >= 15) unlocked.add('pullups-15')
  if ((prs['dips']?.value || 0) >= 15) unlocked.add('dips-15')
  if ((prs['dips']?.value || 0) >= 25) unlocked.add('dips-25')
  if ((prs['pompes']?.value || 0) >= 40) unlocked.add('pushups-40')

  const s = sortedWeights(weights)
  if (s.length) {
    const gain = s[s.length - 1].kg - goals.startWeight
    if (gain >= 2) unlocked.add('weight-2')
    if (gain >= 4) unlocked.add('weight-4')
    if (s[s.length - 1].kg >= goals.goalWeight) unlocked.add('weight-goal')
  }
  if (s.length >= 14) unlocked.add('weights-14')

  if (photoCount >= 1) unlocked.add('photo-first')
  if (photoCount >= 30) unlocked.add('photo-30')

  // Eau : 7 jours consécutifs à l'objectif (en partant d'hier)
  let waterStreak = 0
  let d = addDays(todayISO(), -1)
  while ((dailies[d]?.water || 0) >= goals.waterTarget) {
    waterStreak++
    d = addDays(d, -1)
    if (waterStreak >= 7) break
  }
  if (waterStreak >= 7) unlocked.add('water-week')

  // Repas : 7 derniers jours tous cochés (5/5)
  const last7 = Array.from({ length: 7 }, (_, i) => addDays(todayISO(), -(i + 1)))
  if (last7.every((day) => Object.values(mealChecks[day] || {}).filter(Boolean).length >= 5))
    unlocked.add('meals-perfect-week')

  const totalVolume = Object.values(workouts).reduce(
    (sum, w) => sum + Object.values(w.exercises || {}).reduce(
      (s2, ex) => s2 + (ex.sets || []).reduce((a, r) => a + (r || 0), 0), 0), 0)
  if (totalVolume >= 1000) unlocked.add('volume-1000')

  return unlocked
}
