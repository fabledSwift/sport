// Utilitaires de dates — tout en heure locale (jamais UTC pour les clés de jour).

export const JOURS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
export const JOURS_COURTS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
export const MOIS = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
]

const pad = (n) => String(n).padStart(2, '0')

// 'YYYY-MM-DD' en heure locale
export function toISO(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function fromISO(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function todayISO() {
  return toISO(new Date())
}

export function addDays(iso, n) {
  const d = fromISO(iso)
  d.setDate(d.getDate() + n)
  return toISO(d)
}

export function diffDays(isoA, isoB) {
  return Math.round((fromISO(isoB) - fromISO(isoA)) / 86400000)
}

// Lundi de la semaine contenant `iso`
export function mondayOf(iso) {
  const d = fromISO(iso)
  const shift = (d.getDay() + 6) % 7
  d.setDate(d.getDate() - shift)
  return toISO(d)
}

export function weekDates(mondayISO) {
  return Array.from({ length: 7 }, (_, i) => addDays(mondayISO, i))
}

// Numéro de semaine depuis une date de départ (0 = première semaine)
export function weekIndexSince(startISO, iso) {
  return Math.floor(diffDays(mondayOf(startISO), iso) / 7)
}

export function fmtShort(iso) {
  const d = fromISO(iso)
  return `${d.getDate()} ${MOIS[d.getMonth()].slice(0, 4)}${MOIS[d.getMonth()].length > 4 ? '.' : ''}`
}

export function fmtLong(iso) {
  const d = fromISO(iso)
  return `${JOURS[d.getDay()]} ${d.getDate()} ${MOIS[d.getMonth()]}`
}

export function fmtDayMonth(iso) {
  const d = fromISO(iso)
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}`
}
