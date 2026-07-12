// Timer de repos flottant : lancé automatiquement quand une série est validée.
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Ring } from './ui.jsx'
import { beep } from '../lib/sound.js'
import { SkipForward, Plus } from 'lucide-react'

export default function RestTimer({ timer, onClose }) {
  // timer: { total, exName } | null
  const [left, setLeft] = useState(0)
  const [total, setTotal] = useState(0)
  const endRef = useRef(0)
  const doneRef = useRef(false)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    if (!timer) return
    doneRef.current = false
    setTotal(timer.total)
    endRef.current = Date.now() + timer.total * 1000
    setLeft(timer.total)
    const int = setInterval(() => {
      const remaining = Math.max(0, Math.round((endRef.current - Date.now()) / 1000))
      setLeft(remaining)
      if (remaining <= 0 && !doneRef.current) {
        doneRef.current = true
        beep()
        clearInterval(int)
        setTimeout(() => onCloseRef.current(), 1200)
      }
    }, 250)
    return () => clearInterval(int)
  }, [timer])

  if (!timer) return null

  const addTime = (s) => {
    endRef.current += s * 1000
    setTotal((t) => t + s)
    setLeft(Math.max(0, Math.round((endRef.current - Date.now()) / 1000)))
  }

  return createPortal(
    <div className="fixed left-4 right-4 lg:left-auto lg:right-8 lg:w-[26rem] bottom-[calc(env(safe-area-inset-bottom,0px)+5.5rem)] lg:bottom-8 z-40 anim-fade-up">
      <div className="card flex items-center gap-4 px-4 py-3 shadow-2xl" style={{ background: 'var(--color-card2)' }}>
        <Ring value={left} max={total} size={56} stroke={5} color={left <= 5 ? 'var(--color-good)' : 'var(--color-accent)'}>
          <span className="font-extrabold tabular-nums text-sm">{left}</span>
        </Ring>
        <div className="flex-1 min-w-0">
          <div className="text-xs uppercase tracking-wider text-zinc-500 font-bold">Repos</div>
          <div className="text-sm font-semibold truncate">{timer.exName}</div>
        </div>
        <button className="press flex items-center gap-1 rounded-xl bg-zinc-800 px-3 py-2 text-xs font-bold" onClick={() => addTime(15)}>
          <Plus size={14} /> 15s
        </button>
        <button className="press flex items-center gap-1 rounded-xl bg-zinc-800 px-3 py-2 text-xs font-bold text-zinc-300" onClick={onClose}>
          <SkipForward size={14} />
        </button>
      </div>
    </div>,
    document.body,
  )
}
