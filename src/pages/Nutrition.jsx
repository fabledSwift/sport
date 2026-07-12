// Nutrition : checklist du jour, menu de la semaine, liste de courses, meal prep.
import { useState } from 'react'
import { ShoppingCart, ChefHat, CalendarDays, CheckCircle2, RefreshCw } from 'lucide-react'
import { useStore } from '../lib/store.js'
import { DEFAULT_GOALS } from '../lib/config.js'
import { todayISO, mondayOf, weekDates, fmtShort, JOURS, fromISO } from '../lib/dates.js'
import { adjustedKcalTarget } from '../lib/metrics.js'
import {
  MEALS, SLOTS, INGREDIENTS, mealsForDate, effectiveWeekDays, dayTotals, weekPlanFor,
  shoppingList, fmtQty, mealPrepSteps,
} from '../lib/nutrition.js'
import { Card, SectionTitle, ProgressBar, Sheet, useToast } from '../components/ui.jsx'

const SUBS = [
  { id: 'jour', name: 'Aujourd’hui', icon: CheckCircle2 },
  { id: 'semaine', name: 'Semaine', icon: CalendarDays },
  { id: 'courses', name: 'Courses', icon: ShoppingCart },
  { id: 'prep', name: 'Meal prep', icon: ChefHat },
]

export default function Nutrition({ initialSub }) {
  const [sub, setSub] = useState(initialSub || 'jour')
  const [recipe, setRecipe] = useState(null)

  return (
    <div className="anim-fade-up">
      <header className="pt-6 pb-4">
        <h1 className="font-display text-4xl">Nutrition</h1>
        <p className="text-sm text-zinc-500 font-semibold">≈ 3 200 kcal · 145 g de protéines / jour</p>
      </header>

      <div className="seg mb-4 lg:max-w-md">
        {SUBS.map((s) => (
          <button key={s.id} onClick={() => setSub(s.id)} className={`press seg-btn ${sub === s.id ? 'active' : ''}`}>
            <s.icon size={14} />
            {s.name}
          </button>
        ))}
      </div>

      {sub === 'jour' && <Jour onRecipe={setRecipe} />}
      {sub === 'semaine' && <Semaine onRecipe={setRecipe} />}
      {sub === 'courses' && <Courses />}
      {sub === 'prep' && <Prep />}

      <RecipeSheet mealId={recipe} onClose={() => setRecipe(null)} />
    </div>
  )
}

function Jour({ onRecipe }) {
  const today = todayISO()
  const [goals] = useStore('goals', DEFAULT_GOALS)
  const [mealChecks, setMealChecks] = useStore('mealChecks', {})
  const [mealSwaps, setMealSwaps] = useStore('mealSwaps', {})
  const [dailies, setDailies] = useStore('dailies', {})
  const [burnedInput, setBurnedInput] = useState('')
  const mealIds = mealsForDate(today, mealSwaps)
  const checks = mealChecks[today] || {}
  const totals = dayTotals(mealIds)
  const daily = dailies[today]
  const { target: kcalGoal, extra } = adjustedKcalTarget(goals, daily)

  const saveBurned = () => {
    const v = parseInt(burnedInput, 10)
    if (!v || v < 0 || v > 6000) return
    setDailies((d) => ({ ...d, [today]: { ...d[today], burned: v } }))
    setBurnedInput('')
  }

  const kcalDone = mealIds.reduce((s, id, i) => s + (checks[`${i}`] ? MEALS[id].kcal : 0), 0)
  const protDone = mealIds.reduce((s, id, i) => s + (checks[`${i}`] ? MEALS[id].prot : 0), 0)

  const toggle = (i) =>
    setMealChecks((mc) => ({ ...mc, [today]: { ...mc[today], [`${i}`]: !mc[today]?.[`${i}`] } }))

  // 🔄 remplace le repas du créneau par l'alternative suivante (cycle complet)
  const swapMeal = (i) => {
    const slotMeals = Object.keys(MEALS).filter((id) => MEALS[id].slot === SLOTS[i].id)
    const next = slotMeals[(slotMeals.indexOf(mealIds[i]) + 1) % slotMeals.length]
    const base = mealsForDate(today)[i]
    setMealSwaps((s) => {
      const day = { ...(s?.[today] || {}) }
      if (next === base) delete day[i]
      else day[i] = next
      return { ...s, [today]: day }
    })
  }

  return (
    <div>
      <Card>
        <div className="flex justify-between text-sm font-black mb-1.5">
          <span>🔥 {kcalDone} / {kcalGoal} kcal</span>
          <span className="text-zinc-500 font-bold">plan du jour : ≈ {totals.kcal}</span>
        </div>
        <ProgressBar value={kcalDone} max={kcalGoal} color="var(--color-accent)" />
        {extra > 0 && (
          <p className="text-[11px] font-bold text-amber-300/90 mt-1.5">
            ⚡ Objectif +{extra} kcal aujourd'hui : grosse dépense détectée ({daily.burned} kcal actives) — ajoute une collation.
          </p>
        )}
        <div className="flex justify-between text-sm font-black mt-3 mb-1.5">
          <span>🥩 {protDone} / {goals.proteinTarget} g prot.</span>
          <span className="text-zinc-500 font-bold">plan : ≈ {totals.prot} g</span>
        </div>
        <ProgressBar value={protDone} max={goals.proteinTarget} color="var(--color-good)" />
      </Card>

      {/* Calories brûlées (app Santé) */}
      <Card className="mt-3">
        <div className="flex items-center gap-3">
          <span className="text-xl">⌚</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold">
              Calories actives (app Santé)
              {daily?.burned != null && <span className="text-orange-400"> : {daily.burned} kcal</span>}
            </p>
            <p className="text-[11px] text-zinc-500">
              L'objectif n'augmente que si tu dépasses ta journée normale (~{goals.burnBaseline ?? 700} kcal actives)
            </p>
          </div>
          <input
            type="text" inputMode="numeric" placeholder={daily?.burned != null ? `${daily.burned}` : '850'}
            value={burnedInput} onChange={(e) => setBurnedInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && saveBurned()}
            className="w-20 shrink-0 rounded-xl bg-zinc-800 px-3 py-2.5 text-center font-bold outline-none focus:ring-2 ring-orange-500"
          />
          <button onClick={saveBurned} className="press shrink-0 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-black text-zinc-950">
            OK
          </button>
        </div>
      </Card>

      <SectionTitle>Coche au fil de la journée</SectionTitle>
      <div className="lg:grid lg:grid-cols-2 lg:gap-x-4 lg:items-start">
      {mealIds.map((id, i) => {
        const meal = MEALS[id]
        const slot = SLOTS[i]
        const checked = !!checks[`${i}`]
        return (
          <Card key={i} className={`mb-2 ${checked ? 'border-emerald-500/30 bg-emerald-500/5' : ''}`}>
            <div className="flex items-center gap-3">
              <button
                onClick={() => toggle(i)}
                className={`press w-11 h-11 shrink-0 rounded-xl flex items-center justify-center text-xl ${
                  checked ? 'bg-emerald-500 text-zinc-950' : 'bg-zinc-800'
                }`}
              >
                {checked ? '✓' : meal.emoji}
              </button>
              <button className="flex-1 text-left press" onClick={() => onRecipe(id)}>
                <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
                  {slot.emoji} {slot.name}
                </p>
                <p className={`font-bold ${checked ? 'line-through text-zinc-500' : ''}`}>{meal.name}</p>
                <p className="text-xs text-zinc-500">{meal.kcal} kcal · {meal.prot} g prot. · {meal.prep}</p>
              </button>
              <button
                onClick={() => swapMeal(i)}
                className="press p-2.5 rounded-xl bg-zinc-800/70 shrink-0"
                aria-label="Remplacer ce repas"
              >
                <RefreshCw size={15} className="text-zinc-400" />
              </button>
            </div>
          </Card>
        )
      })}
      </div>
      <p className="text-[11px] text-zinc-600 text-center mt-1 mb-2">
        Pas envie d'un repas ? Touche 🔄 pour le remplacer — les courses et le meal prep s'adaptent tout seuls.
      </p>
    </div>
  )
}

function Semaine({ onRecipe }) {
  const today = todayISO()
  const monday = mondayOf(today)
  const dates = weekDates(monday)
  const plan = weekPlanFor(today)
  const [mealSwaps] = useStore('mealSwaps', {})
  const effectiveDays = effectiveWeekDays(today, mealSwaps)

  return (
    <div>
      <Card className="mb-3 bg-gradient-to-br from-[#12181d] to-[#171412]">
        <p className="text-sm font-black">{plan.label} <span className="text-zinc-500 font-semibold">· rotation sur 4 semaines</span></p>
        <p className="text-xs text-zinc-500 mt-1">
          Menu pensé meal prep : tu cuisines le dimanche, tu assembles en semaine.
        </p>
      </Card>
      <div className="lg:grid lg:grid-cols-2 lg:gap-x-4 lg:items-start">
      {dates.map((date, di) => {
        const mealIds = effectiveDays[di]
        const totals = dayTotals(mealIds)
        const isToday = date === today
        return (
          <Card key={date} className={`mb-2 ${isToday ? 'border-orange-500/40' : ''}`}>
            <div className="flex items-baseline justify-between mb-2">
              <p className="font-black text-sm">
                {JOURS[fromISO(date).getDay()]} <span className="text-zinc-500 font-semibold">{fmtShort(date)}</span>
                {isToday && <span className="text-orange-400"> · aujourd’hui</span>}
              </p>
              <p className="text-[11px] font-bold text-zinc-500">≈ {totals.kcal} kcal · {totals.prot} g</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {mealIds.map((id, i) => (
                <button
                  key={i}
                  onClick={() => onRecipe(id)}
                  className="press rounded-lg bg-zinc-800/70 px-2.5 py-1.5 text-xs font-semibold text-zinc-300"
                >
                  {MEALS[id].emoji} {MEALS[id].name}
                </button>
              ))}
            </div>
          </Card>
        )
      })}
      </div>
    </div>
  )
}

function Courses() {
  const today = todayISO()
  const monday = mondayOf(today)
  const plan = weekPlanFor(today)
  const [mealSwaps] = useStore('mealSwaps', {})
  const { byRayon, budget } = shoppingList(effectiveWeekDays(today, mealSwaps))
  const [checks, setChecks] = useStore('shoppingChecks', {})
  const weekChecks = checks[monday] || {}
  const toast = useToast()

  const toggle = (id) =>
    setChecks((c) => ({ ...c, [monday]: { ...c[monday], [id]: !c[monday]?.[id] } }))

  const total = Object.values(byRayon).flat().length
  const done = Object.values(byRayon).flat().filter((i) => weekChecks[i.id]).length

  const copyList = async () => {
    const text = Object.entries(byRayon)
      .map(([rayon, items]) => `${rayon.toUpperCase()}\n${items.map((i) => `- ${i.name} : ${fmtQty(i.qty, i.unit)}`).join('\n')}`)
      .join('\n\n')
    try {
      await navigator.clipboard.writeText(text)
      toast('Liste copiée — colle-la dans tes notes 📋')
    } catch {
      toast('Copie impossible sur ce navigateur', '😕')
    }
  }

  return (
    <div>
      <Card className="mb-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-black">{plan.label} · liste complète</p>
            <p className="text-xs text-zinc-500 mt-0.5">
              Budget estimé : <b className="text-emerald-400">≈ {Math.round(budget)} €</b> · {done}/{total} articles
            </p>
          </div>
          <button onClick={copyList} className="press rounded-xl bg-zinc-800 px-3 py-2 text-xs font-black text-zinc-300">
            Copier 📋
          </button>
        </div>
        <ProgressBar value={done} max={total} className="mt-3" color="var(--color-good)" />
      </Card>

      <div className="lg:grid lg:grid-cols-2 lg:gap-x-4 lg:items-start">
      {Object.entries(byRayon).map(([rayon, items]) => (
        <div key={rayon} className="mb-4">
          <p className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-2">{rayon}</p>
          <Card className="p-0 divide-y divide-zinc-800/70">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => toggle(item.id)}
                className="press w-full flex items-center gap-3 px-4 py-3 text-left"
              >
                <span className={`w-6 h-6 shrink-0 rounded-lg flex items-center justify-center text-xs font-black ${
                  weekChecks[item.id] ? 'bg-emerald-500 text-zinc-950' : 'bg-zinc-800'
                }`}>
                  {weekChecks[item.id] ? '✓' : ''}
                </span>
                <span className={`flex-1 text-sm font-semibold ${weekChecks[item.id] ? 'line-through text-zinc-600' : ''}`}>
                  {item.name}
                </span>
                <span className="text-sm font-black text-zinc-400 tabular-nums">{fmtQty(item.qty, item.unit)}</span>
              </button>
            ))}
          </Card>
        </div>
      ))}
      </div>

      <Card className="border-emerald-500/20 bg-emerald-500/5">
        <p className="text-xs text-emerald-200/90 leading-relaxed">
          💶 <b>Astuce budget :</b> riz, pâtes, avoine et œufs en marque distributeur ; poulet en gros au rayon
          promo (congèle) ; thon par lot de 4-6 boîtes. Le skyr premier prix est aussi bon que les marques.
        </p>
      </Card>
    </div>
  )
}

function Prep() {
  const today = todayISO()
  const monday = mondayOf(today)
  const plan = weekPlanFor(today)
  const [mealSwaps] = useStore('mealSwaps', {})
  const steps = mealPrepSteps(effectiveWeekDays(today, mealSwaps))
  const [checks, setChecks] = useStore('prepChecks', {})
  const weekChecks = checks[monday] || {}

  const toggle = (i) =>
    setChecks((c) => ({ ...c, [monday]: { ...c[monday], [i]: !c[monday]?.[i] } }))

  const done = steps.filter((_, i) => weekChecks[i]).length

  return (
    <div>
      <Card className="mb-3 bg-gradient-to-br from-[#171d14] to-[#171412]">
        <p className="font-black">🍚 Meal prep du dimanche</p>
        <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
          ~1 h 30 le dimanche = tes déjeuners et la moitié de tes dîners prêts pour la semaine.
          Quantités calculées automatiquement depuis le menu de la {plan.label.toLowerCase()}.
        </p>
        <ProgressBar value={done} max={steps.length} className="mt-3" color="var(--color-good)" />
      </Card>

      <div className="lg:grid lg:grid-cols-2 lg:gap-x-4 lg:items-start">
      {steps.map((step, i) => (
        <Card key={i} className={`mb-2 ${weekChecks[i] ? 'border-emerald-500/30 bg-emerald-500/5' : ''}`}>
          <button onClick={() => toggle(i)} className="press w-full flex items-start gap-3 text-left">
            <span className={`w-8 h-8 shrink-0 rounded-xl flex items-center justify-center text-sm font-black ${
              weekChecks[i] ? 'bg-emerald-500 text-zinc-950' : 'bg-zinc-800 text-zinc-400'
            }`}>
              {weekChecks[i] ? '✓' : i + 1}
            </span>
            <span className="flex-1">
              <span className={`text-sm font-semibold block ${weekChecks[i] ? 'line-through text-zinc-600' : ''}`}>
                {step.text}
              </span>
              <span className="text-[11px] font-bold text-zinc-500">⏱ {step.time}</span>
            </span>
          </button>
        </Card>
      ))}
      </div>

      <Card className="border-amber-500/20 bg-amber-500/5">
        <p className="text-xs text-amber-200/90 leading-relaxed">
          🧊 <b>Conservation :</b> 3 jours au frigo dans des boîtes hermétiques, le reste au congélateur.
          Sors la box du lendemain le soir. Riz : refroidis-le vite et garde-le bien au froid.
        </p>
      </Card>
    </div>
  )
}

function RecipeSheet({ mealId, onClose }) {
  const meal = mealId ? MEALS[mealId] : null
  if (!meal) return null
  return (
    <Sheet open={!!mealId} onClose={onClose} title={`${meal.emoji} ${meal.name}`}>
      <div className="flex gap-2 mb-4">
        <span className="rounded-lg bg-orange-500/15 text-orange-300 px-2.5 py-1 text-xs font-black">{meal.kcal} kcal</span>
        <span className="rounded-lg bg-emerald-500/15 text-emerald-300 px-2.5 py-1 text-xs font-black">{meal.prot} g prot.</span>
        <span className="rounded-lg bg-zinc-800 text-zinc-400 px-2.5 py-1 text-xs font-black">⏱ {meal.prep}</span>
      </div>

      <p className="text-xs uppercase tracking-widest text-zinc-500 font-bold mb-2">Ingrédients</p>
      <div className="flex flex-col gap-1 mb-4">
        {meal.ingredients.map(([ing, qty]) => (
          <IngredientRow key={ing} ing={ing} qty={qty} />
        ))}
      </div>

      <p className="text-xs uppercase tracking-widest text-zinc-500 font-bold mb-2">Préparation</p>
      <ol className="flex flex-col gap-2">
        {meal.recipe.map((step, i) => (
          <li key={i} className="flex gap-2 text-sm text-zinc-300">
            <span className="font-black text-orange-400">{i + 1}.</span> {step}
          </li>
        ))}
      </ol>

      {meal.astuce && (
        <p className="mt-4 rounded-xl bg-zinc-800/60 p-3 text-xs text-zinc-400 leading-relaxed">💡 {meal.astuce}</p>
      )}
    </Sheet>
  )
}

function IngredientRow({ ing, qty }) {
  return (
    <div className="flex justify-between text-sm rounded-lg bg-zinc-800/40 px-3 py-1.5">
      <span className="text-zinc-300 font-semibold">{INGREDIENTS[ing].name}</span>
      <span className="text-zinc-500 font-bold tabular-nums">{fmtQty(qty, INGREDIENTS[ing].unit)}</span>
    </div>
  )
}
