// Comparaison avant/après avec curseur glissable.
import { useRef, useState } from 'react'
import { fmtShort } from '../lib/dates.js'

export default function CompareSlider({ before, after }) {
  // before/after: { url, date }
  const [pos, setPos] = useState(50)
  const ref = useRef(null)

  const move = (clientX) => {
    const rect = ref.current.getBoundingClientRect()
    setPos(Math.max(2, Math.min(98, ((clientX - rect.left) / rect.width) * 100)))
  }

  return (
    <div
      ref={ref}
      className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden select-none touch-none bg-zinc-900"
      onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); move(e.clientX) }}
      onPointerMove={(e) => e.buttons > 0 && move(e.clientX)}
    >
      <img src={after.url} alt="Après" className="absolute inset-0 w-full h-full object-cover" draggable={false} />
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
        <img
          src={before.url} alt="Avant" draggable={false}
          className="absolute inset-0 h-full object-cover max-w-none"
          style={{ width: ref.current ? ref.current.getBoundingClientRect().width : '100%' }}
        />
      </div>
      {/* Ligne + poignée */}
      <div className="absolute top-0 bottom-0 w-0.5 bg-white/90" style={{ left: `${pos}%` }}>
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white shadow-xl flex items-center justify-center text-zinc-800 text-xs font-black">
          ⇄
        </div>
      </div>
      <span className="absolute top-2 left-2 text-[11px] font-bold bg-black/60 rounded-lg px-2 py-1">
        {fmtShort(before.date)}
      </span>
      <span className="absolute top-2 right-2 text-[11px] font-bold bg-black/60 rounded-lg px-2 py-1">
        {fmtShort(after.date)}
      </span>
    </div>
  )
}
