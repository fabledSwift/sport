// Programme d'entraînement 6 j/semaine — barre de traction + station de dips + poids du corps.
// Chaque exercice a une échelle de niveaux : quand toutes les séries atteignent le max
// de reps, l'appli passe automatiquement au niveau suivant (reps ↑, tempo, variante, lest).

// type: 'reps' | 'reps-side' (par jambe/côté) | 'secs' (gainage, isométrie)
export const EXERCISES = {
  // ——— PUSH ———
  dips: {
    name: 'Dips',
    muscles: 'Pecs · Triceps · Épaules',
    rest: 120,
    type: 'reps',
    tip: 'Descends coudes à 90°, buste légèrement penché en avant.',
    levels: [
      { sets: 3, min: 5, max: 8 },
      { sets: 4, min: 6, max: 10 },
      { sets: 4, min: 8, max: 12 },
      { sets: 4, min: 8, max: 12, note: 'Tempo : 3 s de descente contrôlée' },
      { sets: 5, min: 8, max: 12, note: 'Lesté ~5 kg (sac à dos + bouteilles d’eau)' },
      { sets: 5, min: 10, max: 15, note: 'Lesté ~8-10 kg' },
    ],
  },
  pompes: {
    name: 'Pompes',
    muscles: 'Pecs · Triceps',
    rest: 90,
    type: 'reps',
    tip: 'Corps gainé, poitrine qui frôle le sol.',
    levels: [
      { sets: 3, min: 12, max: 20 },
      { sets: 4, min: 15, max: 25 },
      { sets: 4, min: 15, max: 20, note: 'Tempo : 3 s de descente' },
      { sets: 4, min: 12, max: 20, note: 'Variante : pieds surélevés (déclinées)' },
      { sets: 5, min: 15, max: 25, note: 'Déclinées + tempo lent' },
      { sets: 5, min: 8, max: 12, note: 'Variante : pompes archer (par côté)' },
    ],
  },
  'pompes-diamant': {
    name: 'Pompes diamant',
    muscles: 'Triceps · Pecs internes',
    rest: 90,
    type: 'reps',
    tip: 'Mains en triangle sous la poitrine, coudes le long du corps.',
    levels: [
      { sets: 3, min: 8, max: 12 },
      { sets: 3, min: 10, max: 15 },
      { sets: 4, min: 10, max: 15 },
      { sets: 4, min: 12, max: 18, note: 'Tempo : 2 s de descente' },
      { sets: 4, min: 10, max: 15, note: 'Pieds surélevés' },
    ],
  },
  'pompes-larges': {
    name: 'Pompes prise large',
    muscles: 'Pecs (étirement)',
    rest: 90,
    type: 'reps',
    tip: 'Mains bien plus larges que les épaules, descente profonde.',
    levels: [
      { sets: 3, min: 10, max: 15 },
      { sets: 4, min: 12, max: 18 },
      { sets: 4, min: 15, max: 22 },
      { sets: 4, min: 12, max: 18, note: 'Tempo : 3 s de descente' },
      { sets: 5, min: 15, max: 20, note: 'Pieds surélevés' },
    ],
  },
  'pike-pushups': {
    name: 'Pike push-ups',
    muscles: 'Épaules · Triceps',
    rest: 90,
    type: 'reps',
    tip: 'Fesses hautes en V inversé, la tête descend entre les mains.',
    levels: [
      { sets: 3, min: 6, max: 10 },
      { sets: 3, min: 8, max: 12 },
      { sets: 4, min: 8, max: 12 },
      { sets: 4, min: 8, max: 12, note: 'Pieds surélevés (chaise / muret)' },
      { sets: 4, min: 10, max: 15, note: 'Pieds surélevés + tempo lent' },
    ],
  },
  // ——— PULL ———
  'tractions-pronation': {
    name: 'Tractions pronation',
    muscles: 'Dos · Biceps',
    rest: 150,
    type: 'reps',
    tip: 'Paumes vers l’avant, menton au-dessus de la barre, descente complète.',
    levels: [
      { sets: 3, min: 4, max: 7 },
      { sets: 4, min: 5, max: 8 },
      { sets: 4, min: 6, max: 10 },
      { sets: 4, min: 8, max: 12, note: 'Tempo : 3 s de descente' },
      { sets: 5, min: 6, max: 10, note: 'Lesté ~5 kg (sac à dos)' },
      { sets: 5, min: 8, max: 12, note: 'Lesté ~8-10 kg' },
    ],
  },
  'tractions-supination': {
    name: 'Tractions supination (chin-ups)',
    muscles: 'Biceps · Dos',
    rest: 150,
    type: 'reps',
    tip: 'Paumes vers toi — la variante la plus biceps.',
    levels: [
      { sets: 3, min: 5, max: 8 },
      { sets: 4, min: 6, max: 9 },
      { sets: 4, min: 7, max: 11 },
      { sets: 4, min: 8, max: 12, note: 'Tempo : 3 s de descente' },
      { sets: 5, min: 7, max: 10, note: 'Lesté ~5 kg' },
    ],
  },
  'tractions-larges': {
    name: 'Tractions prise large',
    muscles: 'Grand dorsal (largeur)',
    rest: 150,
    type: 'reps',
    tip: 'Prise bien plus large que les épaules, tire les coudes vers le bas.',
    levels: [
      { sets: 3, min: 3, max: 6 },
      { sets: 3, min: 4, max: 7 },
      { sets: 4, min: 5, max: 8 },
      { sets: 4, min: 6, max: 10 },
      { sets: 4, min: 6, max: 10, note: 'Tempo : 3 s de descente' },
    ],
  },
  'rowing-australien': {
    name: 'Rowing australien',
    muscles: 'Dos · Arrière d’épaules',
    rest: 90,
    type: 'reps',
    tip: 'Sous les barres de dips (ou barre basse), corps gainé, poitrine vers la barre.',
    levels: [
      { sets: 3, min: 8, max: 12 },
      { sets: 4, min: 10, max: 14 },
      { sets: 4, min: 12, max: 16 },
      { sets: 4, min: 10, max: 14, note: 'Pieds surélevés' },
      { sets: 4, min: 12, max: 16, note: 'Pieds surélevés + tempo lent' },
    ],
  },
  'scapular-pulls': {
    name: 'Scapular pulls',
    muscles: 'Trapèzes · Santé d’épaules',
    rest: 60,
    type: 'reps',
    tip: 'Suspendu bras tendus : hausse et abaisse uniquement les omoplates.',
    levels: [
      { sets: 3, min: 6, max: 10 },
      { sets: 3, min: 8, max: 12 },
      { sets: 4, min: 10, max: 14 },
    ],
  },
  'leg-raises': {
    name: 'Relevés de jambes suspendu',
    muscles: 'Abdos · Grip',
    rest: 90,
    type: 'reps',
    tip: 'Suspendu à la barre, monte les genoux (puis jambes tendues aux niveaux suivants).',
    levels: [
      { sets: 3, min: 8, max: 12, note: 'Genoux pliés' },
      { sets: 3, min: 10, max: 15, note: 'Genoux pliés' },
      { sets: 3, min: 6, max: 10, note: 'Jambes tendues' },
      { sets: 4, min: 8, max: 12, note: 'Jambes tendues' },
      { sets: 4, min: 6, max: 10, note: 'Toes-to-bar (pieds à la barre)' },
    ],
  },
  // ——— LEGS ———
  squats: {
    name: 'Squats',
    muscles: 'Quadriceps · Fessiers',
    rest: 90,
    type: 'reps',
    tip: 'Descends sous la parallèle, talons au sol, dos droit.',
    levels: [
      { sets: 3, min: 15, max: 20 },
      { sets: 4, min: 18, max: 25 },
      { sets: 4, min: 20, max: 25, note: 'Tempo : 3 s de descente' },
      { sets: 4, min: 15, max: 20, note: 'Lesté : sac à dos ~8 kg' },
      { sets: 5, min: 15, max: 20, note: 'Lesté ~10-12 kg' },
    ],
  },
  fentes: {
    name: 'Fentes',
    muscles: 'Quadriceps · Fessiers',
    rest: 90,
    type: 'reps-side',
    tip: 'Grand pas en avant, genou arrière qui frôle le sol.',
    levels: [
      { sets: 3, min: 8, max: 12 },
      { sets: 3, min: 10, max: 14 },
      { sets: 4, min: 10, max: 14 },
      { sets: 4, min: 10, max: 12, note: 'Lesté : sac à dos ~5-8 kg' },
      { sets: 4, min: 8, max: 12, note: 'Fentes sautées (alternées, explosives)' },
    ],
  },
  'squats-bulgares': {
    name: 'Squats bulgares',
    muscles: 'Quadriceps · Fessiers (unilatéral)',
    rest: 120,
    type: 'reps-side',
    tip: 'Pied arrière posé sur une chaise / le banc de la station.',
    levels: [
      { sets: 3, min: 6, max: 10 },
      { sets: 3, min: 8, max: 12 },
      { sets: 4, min: 8, max: 12 },
      { sets: 4, min: 8, max: 12, note: 'Tempo : 3 s de descente' },
      { sets: 4, min: 8, max: 12, note: 'Lesté : sac à dos ~5-8 kg' },
      { sets: 5, min: 8, max: 12, note: 'Lesté ~10 kg' },
    ],
  },
  'squats-sautes': {
    name: 'Squats sautés',
    muscles: 'Explosivité · Quadriceps',
    rest: 90,
    type: 'reps',
    tip: 'Saute le plus haut possible, amortis la réception.',
    levels: [
      { sets: 3, min: 8, max: 12 },
      { sets: 3, min: 10, max: 15 },
      { sets: 4, min: 10, max: 15 },
      { sets: 4, min: 12, max: 18 },
    ],
  },
  'hip-thrust': {
    name: 'Hip thrust une jambe',
    muscles: 'Fessiers · Ischios',
    rest: 90,
    type: 'reps-side',
    tip: 'Dos sur une chaise, une jambe au sol, monte le bassin bien haut.',
    levels: [
      { sets: 3, min: 8, max: 12 },
      { sets: 3, min: 10, max: 15 },
      { sets: 4, min: 10, max: 15 },
      { sets: 4, min: 12, max: 15, note: 'Pause 2 s en haut' },
    ],
  },
  mollets: {
    name: 'Mollets debout (une jambe)',
    muscles: 'Mollets',
    rest: 60,
    type: 'reps-side',
    tip: 'Sur une marche, amplitude complète, monte sur la pointe.',
    levels: [
      { sets: 3, min: 12, max: 18 },
      { sets: 3, min: 15, max: 20 },
      { sets: 4, min: 15, max: 20 },
      { sets: 4, min: 15, max: 20, note: 'Tempo : pause 2 s en haut' },
    ],
  },
  'wall-sit': {
    name: 'Chaise au mur',
    muscles: 'Quadriceps (isométrie)',
    rest: 75,
    type: 'secs',
    tip: 'Dos plaqué au mur, cuisses parallèles au sol.',
    levels: [
      { sets: 3, min: 30, max: 45 },
      { sets: 3, min: 45, max: 60 },
      { sets: 3, min: 60, max: 90 },
      { sets: 3, min: 45, max: 60, note: 'Une jambe tendue devant (alterne)' },
    ],
  },
  // ——— BRAS & POIGNE ———
  'tractions-commando': {
    name: 'Tractions commando',
    muscles: 'Dos · Biceps · Obliques',
    rest: 150,
    type: 'reps-side',
    tip: 'Mains l’une devant l’autre le long de la barre, tire en passant la tête d’un côté puis de l’autre.',
    levels: [
      { sets: 3, min: 2, max: 4 },
      { sets: 3, min: 3, max: 5 },
      { sets: 4, min: 3, max: 6 },
      { sets: 4, min: 4, max: 6, note: 'Tempo : 3 s de descente' },
      { sets: 4, min: 5, max: 8 },
    ],
  },
  'dead-hang': {
    name: 'Suspension (dead hang)',
    muscles: 'Poigne · Avant-bras · Épaules',
    rest: 90,
    type: 'secs',
    tip: 'Suspendu bras tendus, épaules actives (légèrement tirées vers le bas). Une poigne d’acier, ça se construit.',
    levels: [
      { sets: 3, min: 20, max: 30 },
      { sets: 3, min: 30, max: 45 },
      { sets: 3, min: 45, max: 60 },
      { sets: 3, min: 30, max: 45, note: 'Lesté : sac à dos ~5 kg' },
      { sets: 3, min: 20, max: 30, note: 'Une main à la fois (l’autre en soutien léger)' },
    ],
  },
  // ——— CORE ———
  planche: {
    name: 'Planche',
    muscles: 'Gainage',
    rest: 60,
    type: 'secs',
    tip: 'Corps aligné, fesses serrées, ne cambre pas.',
    levels: [
      { sets: 3, min: 30, max: 45 },
      { sets: 3, min: 45, max: 60 },
      { sets: 3, min: 60, max: 90 },
      { sets: 3, min: 45, max: 60, note: 'Bras tendus, lève un pied (alterne)' },
    ],
  },
  'planche-laterale': {
    name: 'Planche latérale',
    muscles: 'Obliques',
    rest: 60,
    type: 'secs',
    tip: 'Sur un coude, bassin haut. Temps par côté.',
    levels: [
      { sets: 3, min: 20, max: 30 },
      { sets: 3, min: 30, max: 45 },
      { sets: 3, min: 45, max: 60 },
    ],
  },
  'hollow-hold': {
    name: 'Hollow hold',
    muscles: 'Abdos profonds',
    rest: 60,
    type: 'secs',
    tip: 'Allongé, bas du dos plaqué au sol, jambes et épaules décollées. Ton passé de nageur va parler !',
    levels: [
      { sets: 3, min: 20, max: 30 },
      { sets: 3, min: 30, max: 45 },
      { sets: 3, min: 45, max: 60 },
      { sets: 4, min: 45, max: 60 },
    ],
  },
  superman: {
    name: 'Superman',
    muscles: 'Lombaires · Dos',
    rest: 60,
    type: 'reps',
    tip: 'Allongé sur le ventre, décolle bras et jambes, pause 1 s en haut.',
    levels: [
      { sets: 3, min: 10, max: 15 },
      { sets: 3, min: 12, max: 18 },
      { sets: 4, min: 15, max: 20 },
    ],
  },
}

export const SESSIONS = {
  'push-a': {
    name: 'Push A',
    subtitle: 'Dips & pectoraux',
    emoji: '🔥',
    exercises: ['dips', 'pompes', 'pike-pushups', 'pompes-diamant', 'planche'],
  },
  'pull-a': {
    name: 'Pull A',
    subtitle: 'Tractions force',
    emoji: '🦍',
    exercises: ['tractions-pronation', 'tractions-supination', 'rowing-australien', 'scapular-pulls', 'hollow-hold'],
  },
  arms: {
    name: 'Bras & Poigne',
    subtitle: 'Biceps, triceps, avant-bras',
    emoji: '💪',
    exercises: ['tractions-supination', 'dips', 'tractions-commando', 'pompes-diamant', 'dead-hang'],
  },
  'push-b': {
    name: 'Push B',
    subtitle: 'Pompes & volume',
    emoji: '💥',
    exercises: ['pompes-larges', 'dips', 'pompes', 'pike-pushups', 'planche-laterale'],
  },
  'pull-b': {
    name: 'Pull B',
    subtitle: 'Largeur de dos & abdos',
    emoji: '🪽',
    exercises: ['tractions-larges', 'tractions-supination', 'rowing-australien', 'leg-raises', 'superman'],
  },
  core: {
    name: 'Abdos & Gainage',
    subtitle: 'Core solide (+ meal prep du dimanche)',
    emoji: '🧱',
    exercises: ['leg-raises', 'planche', 'hollow-hold', 'planche-laterale', 'superman'],
  },
  repos: {
    name: 'Repos',
    subtitle: 'Récupération complète',
    emoji: '😴',
    exercises: [],
  },
}

// Planning hebdo : index = getDay() (0 = dimanche) — repos le mercredi
export const WEEK_SCHEDULE = ['core', 'push-a', 'pull-a', 'repos', 'push-b', 'pull-b', 'arms']

// Jour de repos automatique (ne casse pas le streak) : 3 = mercredi
export const REST_DAY = 3

export function sessionForDate(iso) {
  const day = new Date(iso.split('-')[0], iso.split('-')[1] - 1, iso.split('-')[2]).getDay()
  return WEEK_SCHEDULE[day]
}

export function getLevel(levels, exId) {
  const lv = levels?.[exId] ?? 0
  return Math.min(lv, EXERCISES[exId].levels.length - 1)
}

export function levelTarget(exId, levelIdx) {
  const ex = EXERCISES[exId]
  return ex.levels[Math.min(levelIdx, ex.levels.length - 1)]
}

// Vrai si toutes les séries ont atteint le max du niveau → on monte de niveau.
export function shouldLevelUp(exId, levelIdx, reps) {
  const ex = EXERCISES[exId]
  const lv = ex.levels[levelIdx]
  if (!lv || levelIdx >= ex.levels.length - 1) return false
  const done = reps.filter((r) => r != null)
  return done.length >= lv.sets && done.slice(0, lv.sets).every((r) => r >= lv.max)
}

export function unitLabel(exId) {
  const t = EXERCISES[exId].type
  if (t === 'secs') return 's'
  if (t === 'reps-side') return '/côté'
  return 'reps'
}
