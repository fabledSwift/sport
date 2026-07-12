// Profil et objectifs de Mattéo — modifiables dans l'onglet Stats > Réglages.

export const PROFIL = {
  prenom: 'Mattéo',
  age: 18,
  taille: 186, // cm
}

export const DEFAULT_GOALS = {
  startDate: '2026-07-11',   // début de la transfo
  endDate: '2026-09-15',     // mi-septembre
  startWeight: 77,           // kg
  goalWeight: 83,            // +6 kg (fourchette +5 à +7)
  kcalTarget: 3200,          // kcal / jour
  proteinTarget: 145,        // g / jour
  waterTarget: 12,           // verres de 25 cl = 3 L (boulot au soleil !)
  sleepTarget: 8,            // heures / nuit
  burnBaseline: 700,         // kcal actives d'une journée normale (app Santé) — déjà comptées dans les 3 200
  creatine: true,            // suit la prise de créatine ?
  creatineDose: 5,           // g / jour (3-5 g recommandés, pas de charge nécessaire)
}

// Rythme de prise sain (kg / semaine) — la recherche recommande ~0,25 à 0,5 %
// du poids de corps par semaine pour un débutant (au-delà : surtout du gras).
export const PACE_MIN = 0.3
export const PACE_MAX = 0.8
