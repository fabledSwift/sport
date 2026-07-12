// Échauffement guidé : enchaîne les mouvements avec compte à rebours et bip.
import { useEffect, useRef, useState } from 'react'
import { SkipForward, Pause, Play } from 'lucide-react'
import { Sheet, Ring } from './ui.jsx'
import { beep } from '../lib/sound.js'

export default function Warmup({ open, moves, onClose, onDone }) {
  const [idx, setIdx] = useState(0)
  const [left, setLeft] = useState(0)
  const [paused, setPaused] = useState(false)
  const endRef = useRef(0)
  const pausedLeftRef = useRef(0)

  const move = moves?.[idx]
  const total = moves?.reduce((s, m) => s + m.secs, 0) || 0

  // (Re)démarre le chrono à chaque ouverture / changement de mouvement
  useEffect(() => {
    if (!open || !move) return
    setPaused(false)
    endRef.current = Date.now() + move.secs * 1000
    setLeft(move.secs)
  }, [open, idx]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!open || !move || paused) return
    const int = setInterval(() => {
      const remaining = Math.max(0, Math.round((endRef.current - Date.now()) / 1000))
      setLeft(remaining)
      if (remaining <= 0) {
        clearInterval(int)
        beep()
        if (idx < moves.length - 1) setIdx((i) => i + 1)
        else {
          onDone?.()
        }
      }
    }, 200)
    return () => clearInterval(int)
  }, [open, idx, paused]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!open) {
      setIdx(0)
      setPaused(false)
    }
  }, [open])

  const togglePause = () => {
    if (paused) {
      endRef.current = Date.now() + pausedLeftRef.current * 1000
      setPaused(false)
    } else {
      pausedLeftRef.current = left
      setPaused(true)
    }
  }

  const skip = () => {
    if (idx < moves.length - 1) setIdx((i) => i + 1)
    else onDone?.()
  }

  if (!moves) return null

  return (
    <Sheet open={open} onClose={onClose} title={`Échauffement · ${Math.round(total / 60)} min`}>
      {move && (
        <div className="flex flex-col items-center py-2">
          <p className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-4">
            Mouvement {idx + 1} / {moves.length}
          </p>
          <Ring value={left} max={move.secs} size={150} stroke={10} color={left <= 3 ? 'var(--color-good)' : 'var(--color-accent)'}>
            <span className="font-display text-5xl tabular-nums">{left}</span>
          </Ring>
          <p className="font-display text-3xl mt-5 text-center">{move.name}</p>
          <p className="text-sm text-zinc-500 mt-1 text-center">{move.tip}</p>

          {/* Prochain mouvement */}
          {moves[idx + 1] && (
            <p className="text-xs text-zinc-600 font-bold mt-4">
              Ensuite : {moves[idx + 1].name} · {moves[idx + 1].secs}s
            </p>
          )}

          <div className="flex gap-2 mt-6 w-full">
            <button onClick={togglePause} className="press flex-1 rounded-2xl bg-zinc-800 py-3.5 font-black text-sm flex items-center justify-center gap-2">
              {paused ? <Play size={16} /> : <Pause size={16} />}
              {paused ? 'Reprendre' : 'Pause'}
            </button>
            <button onClick={skip} className="press flex-1 rounded-2xl bg-zinc-800 py-3.5 font-black text-sm flex items-center justify-center gap-2 text-zinc-300">
              <SkipForward size={16} /> Passer
            </button>
          </div>
        </div>
      )}
    </Sheet>
  )
}
