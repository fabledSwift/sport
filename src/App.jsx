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
      <div className="mx-auto max-w-lg min-h-screen pt-safe">
        <main className="px-4 pb-safe">
          {nav.tab === 'home' && <Dashboard navigate={navigate} />}
          {nav.tab === 'training' && <Training />}
          {nav.tab === 'nutrition' && <Nutrition initialSub={nav.sub} />}
          {nav.tab === 'suivi' && <Suivi initialSub={nav.sub} />}
          {nav.tab === 'stats' && <Stats />}
        </main>

        <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-line bg-bg/90 backdrop-blur-xl nav-safe" style={{ background: 'rgba(12,10,9,0.92)' }}>
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
                  <span className={`text-[10px] font-bold ${active ? 'text-[--color-accent]' : 'text-zinc-500'}`} style={active ? { color: 'var(--color-accent)' } : {}}>
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
