// Suivi : Poids / Photos / Hydratation & Sommeil
import { useState } from 'react'
import Poids from './suivi/Poids.jsx'
import Photos from './suivi/Photos.jsx'
import Hydro from './suivi/Hydro.jsx'

const SUBS = [
  { id: 'poids', name: '⚖️ Poids' },
  { id: 'photos', name: '📸 Photos' },
  { id: 'hydro', name: '💧 Hydro & 😴' },
]

export default function Suivi({ initialSub }) {
  const [sub, setSub] = useState(initialSub || 'poids')

  return (
    <div className="anim-fade-up">
      <header className="pt-6 pb-4">
        <h1 className="font-display text-4xl">Suivi</h1>
      </header>

      <div className="flex gap-2 mb-4 lg:max-w-md">
        {SUBS.map((s) => (
          <button
            key={s.id}
            onClick={() => setSub(s.id)}
            className={`press flex-1 rounded-xl py-2.5 text-xs font-black transition-colors ${
              sub === s.id ? 'bg-orange-500 text-zinc-950' : 'bg-zinc-800/70 text-zinc-400'
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      {sub === 'poids' && <Poids />}
      {sub === 'photos' && <Photos />}
      {sub === 'hydro' && <Hydro />}
    </div>
  )
}
