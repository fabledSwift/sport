// Stats : records perso, résumé hebdo, badges, compte & sync, réglages et sauvegarde.
import { useEffect, useRef, useState } from 'react'
import { Trophy, Settings, Download, Upload, Cloud, CloudOff, RefreshCw, Share2 } from 'lucide-react'
import { generateShareCard, shareOrDownload } from '../lib/shareCard.js'
import { computeStreak } from '../lib/metrics.js'
import { useStore, load, save, SYNCED_KEYS } from '../lib/store.js'
import { getSyncConfig, setSyncConfig, checkAccess, syncNow } from '../lib/sync.js'
import { DEFAULT_GOALS } from '../lib/config.js'
import { todayISO, mondayOf, fmtShort } from '../lib/dates.js'
import { personalRecords, weeklySummary, fmtSigned, PR_EXERCISES, prLabel } from '../lib/metrics.js'
import { BADGES, computeBadges } from '../lib/badges.js'
import { getAllPhotos } from '../lib/photos.js'
import { Card, SectionTitle, Sheet, Stepper, clampStep, useToast } from '../components/ui.jsx'

export default function Stats() {
  const today = todayISO()
  const [goals, setGoals] = useStore('goals', DEFAULT_GOALS)
  const [weights] = useStore('weights', [])
  const [workouts] = useStore('workouts', {})
  const [dailies] = useStore('dailies', {})
  const [mealChecks] = useStore('mealChecks', {})
  const [photoCount, setPhotoCount] = useState(0)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const fileRef = useRef(null)
  const toast = useToast()

  useEffect(() => {
    getAllPhotos().then((all) => setPhotoCount(all.length))
  }, [])

  const prs = personalRecords(workouts)
  const summary = weeklySummary({ weights, workouts, dailies, mealChecks, mondayISO: mondayOf(today) })
  const unlocked = computeBadges({ workouts, weights, dailies, mealChecks, photoCount, goals })

  const exportData = () => {
    const data = {}
    for (const key of SYNCED_KEYS) data[key] = load(key, null)
    const blob = new Blob([JSON.stringify({ app: 'transfo-matteo', exportedAt: today, data }, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `transfo-sauvegarde-${today}.json`
    a.click()
    URL.revokeObjectURL(a.href)
    toast('Sauvegarde téléchargée (photos non incluses)', '💾')
  }

  const importData = async (file) => {
    if (!file) return
    try {
      const parsed = JSON.parse(await file.text())
      if (parsed.app !== 'transfo-matteo') throw new Error('mauvais fichier')
      for (const [key, value] of Object.entries(parsed.data)) if (value != null) save(key, value)
      toast('Données restaurées ✔')
    } catch {
      toast('Fichier de sauvegarde invalide', '❌')
    }
  }

  return (
    <div className="anim-fade-up">
      <header className="pt-6 pb-4 flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl">Stats & Badges</h1>
          <p className="text-sm text-zinc-500 font-semibold">
            {Object.keys(workouts).length} séance{Object.keys(workouts).length > 1 ? 's' : ''} au total
          </p>
        </div>
        <button className="press p-2.5 rounded-xl bg-zinc-800/70" onClick={() => setSettingsOpen(true)} aria-label="Réglages">
          <Settings size={18} className="text-zinc-400" />
        </button>
      </header>

      {/* Records */}
      <SectionTitle>Records perso</SectionTitle>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {PR_EXERCISES.map((exId) => (
          <Card key={exId}>
            <div className="flex items-center gap-2">
              <Trophy size={15} className={prs[exId] ? 'text-amber-400' : 'text-zinc-700'} />
              <p className="text-[11px] font-bold text-zinc-500 leading-tight">{prLabel(exId)}</p>
            </div>
            <p className="font-display text-3xl leading-none tabular-nums mt-1.5">
              {prs[exId] ? prs[exId].value : '—'}
              <span className="text-sm text-zinc-500"> reps</span>
            </p>
            {prs[exId] && <p className="text-[10px] text-zinc-600 font-semibold">{fmtShort(prs[exId].date)}</p>}
          </Card>
        ))}
      </div>

      {/* Résumé hebdo */}
      <SectionTitle>Cette semaine</SectionTitle>
      <Card>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3">
          <Metric label="Séances" value={`${summary.sessionsDone}/${summary.sessionsPlanned}`} emoji="💪" good={summary.sessionsDone >= summary.sessionsPlanned} />
          <Metric label="Poids" value={summary.weightDelta != null ? `${fmtSigned(summary.weightDelta)} kg` : '—'} emoji="⚖️" good={summary.weightDelta > 0} />
          <Metric label="Eau (moy.)" value={`${summary.avgWater.toFixed(1)} verres`} emoji="💧" good={summary.avgWater >= 10} />
          <Metric label="Sommeil (moy.)" value={summary.avgSleep != null ? `${summary.avgSleep.toFixed(1)} h` : '—'} emoji="😴" good={summary.avgSleep >= 7.5} />
          <Metric label="Repas cochés" value={`${summary.mealsChecked}/${summary.mealsTotal}`} emoji="🍽️" good={summary.mealsChecked >= summary.mealsTotal * 0.8} />
          <Metric label="Cardio" value={`${summary.cardioMin} min`} emoji="🏊" good={summary.cardioMin > 0 && summary.cardioMin <= 120} />
          {goals.creatine && <Metric label="Créatine" value={`${summary.creatineDays}/7 j`} emoji="💊" good={summary.creatineDays >= 6} />}
          <Metric label="Photos" value={`${photoCount} au total`} emoji="📸" good={photoCount > 0} />
        </div>
      </Card>

      {/* Badges */}
      <SectionTitle right={<span className="text-xs font-black text-zinc-500">{unlocked.size}/{BADGES.length}</span>}>
        Badges
      </SectionTitle>
      <div className="grid grid-cols-3 lg:grid-cols-5 gap-2.5 mb-4">
        {BADGES.map((b) => {
          const has = unlocked.has(b.id)
          return (
            <div
              key={b.id}
              className={`card p-3 text-center ${has ? 'border-amber-500/30' : 'opacity-40 grayscale'}`}
            >
              <p className="text-2xl mb-1">{b.emoji}</p>
              <p className="text-[11px] font-black leading-tight">{b.name}</p>
              <p className="text-[9px] text-zinc-500 font-semibold mt-0.5 leading-tight">{b.desc}</p>
            </div>
          )
        })}
      </div>

      {/* Compte & synchronisation */}
      <SectionTitle>Compte & Sync</SectionTitle>
      <SyncSection />

      {/* Partage */}
      <button
        onClick={async () => {
          try {
            const blob = await generateShareCard({ goals, weights, prs, streak: computeStreak(workouts) })
            const result = await shareOrDownload(blob, `transfo-${today}.png`)
            if (result === 'downloaded') toast('Carte téléchargée — prête à poster 🖼️')
            if (result === 'shared') toast('Carte partagée 🖼️')
          } catch {
            toast('Impossible de générer la carte', '❌')
          }
        }}
        className="press mt-4 w-full rounded-2xl bg-gradient-to-r from-orange-500 to-emerald-500 py-4 font-black text-zinc-950 flex items-center justify-center gap-2"
      >
        <Share2 size={18} /> Partager ma progression
      </button>

      {/* Sauvegarde */}
      <SectionTitle>Données</SectionTitle>
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button onClick={exportData} className="press card p-4 flex items-center justify-center gap-2 text-sm font-black">
          <Download size={16} className="text-emerald-400" /> Sauvegarder
        </button>
        <button onClick={() => fileRef.current?.click()} className="press card p-4 flex items-center justify-center gap-2 text-sm font-black">
          <Upload size={16} className="text-orange-400" /> Restaurer
        </button>
        <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={(e) => importData(e.target.files?.[0])} />
      </div>

      {/* Réglages */}
      <Sheet open={settingsOpen} onClose={() => setSettingsOpen(false)} title="Réglages des objectifs">
        <div className="flex flex-col gap-4">
          <Setting label="Poids objectif (kg)">
            <Stepper value={goals.goalWeight} onChange={(_, d) => setGoals((g) => ({ ...g, goalWeight: clampStep(g.goalWeight, d, 70, 100) }))} min={70} max={100} step={0.5} />
          </Setting>
          <Setting label="Calories / jour">
            <Stepper value={goals.kcalTarget} onChange={(_, d) => setGoals((g) => ({ ...g, kcalTarget: clampStep(g.kcalTarget, d, 2000, 5000) }))} min={2000} max={5000} step={100} />
          </Setting>
          <Setting label="Protéines / jour (g)">
            <Stepper value={goals.proteinTarget} onChange={(_, d) => setGoals((g) => ({ ...g, proteinTarget: clampStep(g.proteinTarget, d, 80, 250) }))} min={80} max={250} step={5} />
          </Setting>
          <Setting label="Eau / jour (verres de 25 cl)">
            <Stepper value={goals.waterTarget} onChange={(_, d) => setGoals((g) => ({ ...g, waterTarget: clampStep(g.waterTarget, d, 4, 20) }))} min={4} max={20} step={1} />
          </Setting>
          <Setting label="Sommeil / nuit (h)">
            <Stepper value={goals.sleepTarget} onChange={(_, d) => setGoals((g) => ({ ...g, sleepTarget: clampStep(g.sleepTarget, d, 6, 10) }))} min={6} max={10} step={0.5} />
          </Setting>
          <Setting label="Journée normale (kcal actives)">
            <Stepper value={goals.burnBaseline ?? 700} onChange={(_, d) => setGoals((g) => ({ ...g, burnBaseline: clampStep(g.burnBaseline ?? 700, d, 300, 1500) }))} min={300} max={1500} step={50} />
          </Setting>
          <Setting label="Suivi créatine">
            <button
              onClick={() => setGoals((g) => ({ ...g, creatine: !(g.creatine ?? true) }))}
              className={`press rounded-xl px-4 py-2 text-sm font-black ${goals.creatine ?? true ? 'bg-emerald-500 text-zinc-950' : 'bg-zinc-800 text-zinc-400'}`}
            >
              {goals.creatine ?? true ? 'Activé' : 'Désactivé'}
            </button>
          </Setting>
          {(goals.creatine ?? true) && (
            <Setting label="Dose créatine / jour (g)">
              <Stepper value={goals.creatineDose ?? 5} onChange={(_, d) => setGoals((g) => ({ ...g, creatineDose: clampStep(g.creatineDose ?? 5, d, 3, 10) }))} min={3} max={10} step={1} />
            </Setting>
          )}
        </div>
        <p className="text-[11px] text-zinc-600 mt-4">
          Transfo du {fmtShort(goals.startDate)} au {fmtShort(goals.endDate)} · départ {goals.startWeight} kg
        </p>
      </Sheet>
    </div>
  )
}

function SyncSection() {
  const [cfg, setCfg] = useState(() => getSyncConfig())
  const [sheetOpen, setSheetOpen] = useState(false)
  const [repo, setRepo] = useState(cfg?.repo || '')
  const [token, setToken] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const toast = useToast()

  const connect = async () => {
    setBusy(true)
    setError(null)
    try {
      const cleanRepo = repo.trim().replace(/^https:\/\/github\.com\//, '').replace(/\/$/, '')
      const { login, repoOk, isPrivate } = await checkAccess(token.trim(), cleanRepo)
      if (!repoOk) throw new Error(`Le dépôt « ${cleanRepo} » est introuvable. Crée-le d'abord sur github.com/new (privé), ou vérifie que le token a bien accès à ce dépôt.`)
      if (!isPrivate) throw new Error('Ce dépôt est PUBLIC — tes données seraient visibles par tous. Recrée-le en privé.')
      const next = { enabled: true, token: token.trim(), repo: cleanRepo, login, lastSyncAt: null, lastError: null }
      setSyncConfig(next)
      setCfg(next)
      const r = await syncNow()
      setCfg(getSyncConfig())
      setSheetOpen(false)
      setToken('')
      toast(
        r.action === 'données-récupérées' || r.action === 'fusionné'
          ? 'Connecté — données fusionnées avec le cloud !'
          : 'Connecté — tes données sont maintenant sauvegardées en ligne',
        '☁️',
      )
    } catch (e) {
      setError(String(e.message || e))
    } finally {
      setBusy(false)
    }
  }

  const manualSync = async () => {
    setBusy(true)
    try {
      const r = await syncNow()
      setCfg(getSyncConfig())
      toast(
        {
          'données-envoyées': 'Données envoyées vers le cloud',
          'données-récupérées': 'Données récupérées depuis le cloud',
          'fusionné': 'Données fusionnées entre tes appareils',
        }[r.action] || 'Tout est déjà à jour',
        '☁️',
      )
    } catch (e) {
      toast(`Échec de synchro : ${String(e.message || e).slice(0, 80)}`, '⚠️')
      setCfg(getSyncConfig())
    } finally {
      setBusy(false)
    }
  }

  const disconnect = () => {
    setSyncConfig(null)
    setCfg(null)
    toast('Synchro désactivée — tes données restent sur cet appareil', '🔌')
  }

  if (!cfg?.enabled) {
    return (
      <>
        <Card onClick={() => setSheetOpen(true)}>
          <div className="flex items-center gap-3">
            <CloudOff size={20} className="text-zinc-500" />
            <div className="flex-1">
              <p className="text-sm font-bold">Synchronisation cloud désactivée</p>
              <p className="text-xs text-zinc-500">Connecte ton compte GitHub pour retrouver tes données sur tous tes appareils</p>
            </div>
            <span className="press rounded-xl bg-orange-500 px-3 py-2 text-xs font-black text-zinc-950">Connecter</span>
          </div>
        </Card>
        <Sheet open={sheetOpen} onClose={() => setSheetOpen(false)} title="☁️ Connecter ton compte">
          <div className="text-sm text-zinc-300 leading-relaxed flex flex-col gap-2 mb-4">
            <p>Tes données seront sauvegardées dans un dépôt <b>privé</b> GitHub (gratuit, illimité dans le temps). 3 étapes, une seule fois :</p>
            <p><b className="text-orange-400">1.</b> Crée un compte sur <b>github.com</b> (si tu n'en as pas)</p>
            <p><b className="text-orange-400">2.</b> Va sur <b>github.com/new</b> → nom : <code className="bg-zinc-800 px-1.5 py-0.5 rounded">transfo-data</code> → coche <b>Private</b> → Create</p>
            <p><b className="text-orange-400">3.</b> Va sur <b>github.com/settings/personal-access-tokens/new</b> → nom « transfo », expiration 1 an → « Only select repositories » → choisis <b>transfo-data</b> → Permissions → <b>Contents : Read and write</b> → Generate → copie le token ci-dessous</p>
          </div>
          <input
            type="text" placeholder="ton-pseudo/transfo-data" value={repo}
            onChange={(e) => setRepo(e.target.value)} autoCapitalize="none" autoCorrect="off"
            className="w-full rounded-xl bg-zinc-800 px-4 py-3 font-semibold outline-none focus:ring-2 ring-orange-500 mb-2"
          />
          <input
            type="password" placeholder="Token (github_pat_…)" value={token}
            onChange={(e) => setToken(e.target.value)}
            className="w-full rounded-xl bg-zinc-800 px-4 py-3 font-semibold outline-none focus:ring-2 ring-orange-500"
          />
          {error && <p className="text-xs text-red-400 font-semibold mt-2 leading-relaxed">❌ {error}</p>}
          <button
            onClick={connect} disabled={busy || !repo.trim() || !token.trim()}
            className="press mt-4 w-full rounded-2xl bg-orange-500 py-3.5 font-black text-zinc-950 disabled:opacity-40"
          >
            {busy ? 'Connexion…' : 'Connecter et synchroniser'}
          </button>
          <p className="text-[11px] text-zinc-600 mt-3 leading-relaxed">
            🔐 Le token reste sur ton appareil et ne donne accès qu'à ce seul dépôt. Refais l'étape 3 sur chaque appareil (iPhone inclus).
          </p>
        </Sheet>
      </>
    )
  }

  const ago = cfg.lastSyncAt ? Math.round((Date.now() - cfg.lastSyncAt) / 60000) : null
  return (
    <Card className={cfg.lastError ? 'border-amber-500/30' : 'border-emerald-500/20'}>
      <div className="flex items-center gap-3">
        <Cloud size={20} className={cfg.lastError ? 'text-amber-400' : 'text-emerald-400'} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold">Connecté : @{cfg.login}</p>
          <p className="text-xs text-zinc-500 truncate">
            {cfg.lastError
              ? `⚠️ ${cfg.lastError.slice(0, 60)}`
              : ago == null ? 'Pas encore synchronisé' : ago < 1 ? 'Synchronisé à l’instant' : `Synchronisé il y a ${ago} min`}
          </p>
        </div>
        <button onClick={manualSync} disabled={busy} className="press p-2.5 rounded-xl bg-zinc-800 disabled:opacity-40" aria-label="Synchroniser">
          <RefreshCw size={16} className={`text-zinc-300 ${busy ? 'animate-spin' : ''}`} />
        </button>
        <button onClick={disconnect} className="press p-2.5 rounded-xl bg-zinc-800 text-xs font-black text-zinc-500">
          ✕
        </button>
      </div>
    </Card>
  )
}

function Metric({ label, value, emoji, good }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="text-lg">{emoji}</span>
      <div>
        <p className={`font-black tabular-nums text-sm ${good ? 'text-emerald-400' : ''}`}>{value}</p>
        <p className="text-[10px] text-zinc-500 font-bold">{label}</p>
      </div>
    </div>
  )
}

function Setting({ label, children }) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-sm font-bold">{label}</p>
      {children}
    </div>
  )
}
