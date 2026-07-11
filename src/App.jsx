import { useState, useCallback, useEffect } from 'react'
import { Home, Dumbbell, UtensilsCrossed, LineChart, Trophy } from 'lucide-react'
import { ToastProvider, useToast } from './components/ui.jsx'
import { STORE_EVENT, SYNCED_KEYS } from './lib/store.js'
import { syncNow, scheduleSync, getSyncConfig, setSyncConfig } from './lib/sync.js'
import Dashboard from './pages/Dashboard.jsx'
import Training from './pages/Training.jsx'
import Nutrition from './pages/Nutrition.jsx'
import Suivi from './pages/Suivi.jsx'
import Stats from './pages/Stats.jsx'

// Synchro cloud : au lancement, puis automatiquement après chaque changement.
function SyncManager() {
  const toast = useToast()
  useEffect(() => {
    if (getSyncConfig()?.enabled) {
      syncNow()
        .then((r) => {
          if (r.action === 'données-récupérées') toast('Données récupérées depuis le cloud', '☁️')
          if (r.photos?.down > 0) toast(`${r.photos.down} photo(s) récupérée(s)`, '📸')
        })
        .catch((e) => {
          const c = getSyncConfig()
          if (c) setSyncConfig({ ...c, lastError: String(e.message || e) })
        })
    }
    const handler = (e) => {
      if (!e.detail.silent && SYNCED_KEYS.includes(e.detail.key)) scheduleSync()
    }
    window.addEventListener(STORE_EVENT, handler)
    return () => window.removeEventListener(STORE_EVENT, handler)
  }, [toast])
  return null
}

const TABS = [
  { id: 'home', name: 'Accueil', icon: Home },
  { id: 'training', name: 'Séance', icon: Dumbbell },
  { id: 'nutrition', name: 'Repas', icon: UtensilsCrossed },
  { id: 'suivi', name: 'Suivi', icon: LineChart },
  { id: 'stats', name: 'Stats', icon: Trophy },
]

export default function App() {
  const [nav, setNav] = useState({ tab: 'home', sub: null })

  const navigate = useCallback((tab, sub = null) => {
    setNav({ tab, sub })
    window.scrollTo({ top: 0 })
  }, [])

  return (
    <ToastProvider>
      <SyncManager />
      <div className="min-h-screen lg:pl-64">
        {/* Barre latérale — PC uniquement */}
        <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 flex-col border-r border-line p-4 z-30" style={{ background: '#100d0b' }}>
          <div className="flex items-center gap-3 px-2 py-3 mb-4">
            <img src={`${import.meta.env.BASE_URL}icon.svg`} alt="" className="w-10 h-10 rounded-xl" />
            <div>
              <p className="font-black text-lg leading-none">Transfo</p>
              <p className="text-[11px] text-zinc-500 font-bold mt-1">Mattéo · objectif 83 kg</p>
            </div>
          </div>
          {TABS.map(({ id, name, icon: Icon }) => {
            const active = nav.tab === id
            return (
              <button
                key={id}
                onClick={() => navigate(id)}
                className={`press flex items-center gap-3 rounded-xl px-4 py-3 mb-1 text-sm font-bold ${
                  active ? 'bg-orange-500/15 text-orange-400' : 'text-zinc-400'
                }`}
              >
                <Icon size={19} strokeWidth={active ? 2.4 : 1.8} />
                {name}
              </button>
            )
          })}
          <p className="mt-auto px-2 text-[11px] text-zinc-600 font-semibold leading-relaxed">
            Mi-juillet → mi-septembre 2026
            <br />+6 kg de muscle 💪
          </p>
        </aside>

        <div className="mx-auto max-w-lg lg:max-w-4xl pt-safe">
          <main className="px-4 lg:px-8 pb-safe">
            {nav.tab === 'home' && <Dashboard navigate={navigate} />}
            {nav.tab === 'training' && <Training />}
            {nav.tab === 'nutrition' && <Nutrition initialSub={nav.sub} />}
            {nav.tab === 'suivi' && <Suivi initialSub={nav.sub} />}
            {nav.tab === 'stats' && <Stats />}
          </main>
        </div>

        {/* Barre du bas — mobile uniquement */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 border-t border-line backdrop-blur-xl nav-safe" style={{ background: 'rgba(12,10,9,0.92)' }}>
          <div className="mx-auto max-w-lg flex">
            {TABS.map(({ id, name, icon: Icon }) => {
              const active = nav.tab === id
              return (
                <button
                  key={id}
                  onClick={() => navigate(id)}
                  className="press flex-1 flex flex-col items-center gap-1 pt-3 pb-2"
                >
                  <Icon size={22} strokeWidth={active ? 2.5 : 1.8} color={active ? 'var(--color-accent)' : '#78716c'} />
                  <span className={`text-[10px] font-bold ${active ? '' : 'text-zinc-500'}`} style={active ? { color: 'var(--color-accent)' } : {}}>
                    {name}
                  </span>
                </button>
              )
            })}
          </div>
        </nav>
      </div>
    </ToastProvider>
  )
}
