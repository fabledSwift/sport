// Suivi : Poids / Photos / Hydratation & Sommeil
import { useState } from 'react'
import { Scale, Camera, Droplets, Ruler } from 'lucide-react'
import Poids from './suivi/Poids.jsx'
import Photos from './suivi/Photos.jsx'
import Hydro from './suivi/Hydro.jsx'
import Mesures from './suivi/Mesures.jsx'

const SUBS = [
  { id: 'poids', name: 'Poids', icon: Scale },
  { id: 'mesures', name: 'Mesures', icon: Ruler },
  { id: 'photos', name: 'Photos', icon: Camera },
  { id: 'hydro', name: 'Hydro', icon: Droplets },
]

export default function Suivi({ initialSub }) {
  const [sub, setSub] = useState(initialSub || 'poids')

  return (
    <div className="anim-fade-up">
      <header className="pt-6 pb-4">
        <h1 className="font-display text-4xl">Suivi</h1>
      </header>

      <div className="seg mb-4 lg:max-w-md">
        {SUBS.map((s) => (
          <button key={s.id} onClick={() => setSub(s.id)} className={`press seg-btn ${sub === s.id ? 'active' : ''}`}>
            <s.icon size={14} />
            {s.name}
          </button>
        ))}
      </div>

      {sub === 'poids' && <Poids />}
      {sub === 'mesures' && <Mesures />}
      {sub === 'photos' && <Photos />}
      {sub === 'hydro' && <Hydro />}
    </div>
  )
}
