// Vérifie que chaque journée des 4 semaines respecte les cibles :
// 3 000-3 450 kcal et ≥ 140 g de protéines, et que tous les repas/ingrédients existent.
import { MEALS, INGREDIENTS, WEEK_A, WEEK_B, WEEK_C, WEEK_D } from '../src/lib/nutrition.js'

const JOURS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
let errors = 0

// Intégrité des repas
for (const [id, meal] of Object.entries(MEALS)) {
  for (const [ing] of meal.ingredients) {
    if (!INGREDIENTS[ing]) { console.error(`❌ ${id} : ingrédient inconnu "${ing}"`); errors++ }
  }
}

for (const [label, week] of [['A', WEEK_A], ['B', WEEK_B], ['C', WEEK_C], ['D', WEEK_D]]) {
  for (let i = 0; i < 7; i++) {
    const day = week[i]
    for (const id of day) {
      if (!MEALS[id]) { console.error(`❌ Semaine ${label} ${JOURS[i]} : repas inconnu "${id}"`); errors++ }
    }
    const kcal = day.reduce((s, id) => s + (MEALS[id]?.kcal || 0), 0)
    const prot = day.reduce((s, id) => s + (MEALS[id]?.prot || 0), 0)
    const ok = kcal >= 3000 && kcal <= 3450 && prot >= 140
    if (!ok) errors++
    console.log(`${ok ? '✅' : '❌'} Semaine ${label} ${JOURS[i]} : ${kcal} kcal · ${prot} g prot`)
  }
}

console.log(errors ? `\n${errors} problème(s) !` : '\nTous les menus sont dans les clous 💪')
process.exit(errors ? 1 : 0)
