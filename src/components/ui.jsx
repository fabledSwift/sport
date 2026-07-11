// Petits composants UI partagés.
import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

export function Card({ children, className = '', onClick }) {
  return (
    <div className={`card p-4 ${onClick ? 'press cursor-pointer' : ''} ${className}`} onClick={onClick}>
      {children}
    </div>
  )
}

export function SectionTitle({ children, right }) {
  return (
    <div className="flex items-center justify-between mt-6 mb-3">
      <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400">{children}</h2>
      {right}
    </div>
  )
}

export function ProgressBar({ value, max, color = 'var(--color-accent)', className = '' }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100))
  return (
    <div className={`h-2 rounded-full bg-zinc-800 overflow-hidden ${className}`}>
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  )
}

export function Ring({ value, max, size = 64, stroke = 6, color = 'var(--color-accent)', children }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const pct = Math.max(0, Math.min(1, max ? value / max : 0))
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#2b2622" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={c} strokeDashoffset={c * (1 - pct)} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  )
}

// onChange(nouvelleValeur, delta) — utiliser le delta avec une mise à jour
// fonctionnelle pour rester exact même en tapotant très vite.
export function Stepper({ value, onChange, min = 0, max = 999, step = 1, suffix = '' }) {
  return (
    <div className="flex items-center gap-1">
      <button
        className="press w-9 h-9 rounded-xl bg-zinc-800 text-lg font-bold text-zinc-300"
        onClick={() => onChange(Math.max(min, +(value - step).toFixed(1)), -step)}
      >
        −
      </button>
      <div className="w-14 text-center font-bold tabular-nums">
        {value}
        {suffix && <span className="text-xs text-zinc-500 ml-0.5">{suffix}</span>}
      </div>
      <button
        className="press w-9 h-9 rounded-xl bg-zinc-800 text-lg font-bold text-zinc-300"
        onClick={() => onChange(Math.min(max, +(value + step).toFixed(1)), step)}
      >
        +
      </button>
    </div>
  )
}

export function clampStep(current, delta, min, max) {
  return Math.min(max, Math.max(min, +((current ?? 0) + delta).toFixed(1)))
}

// Bottom sheet (mobile) / modale centrée (desktop) — portail pour échapper
// aux ancêtres transformés (animations)
export function Sheet({ open, onClose, title, children }) {
  if (!open) return null
  return createPortal(
    <div className="fixed inset-0 z-50 anim-fade-in flex items-end justify-center lg:items-center lg:p-8" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative w-full max-h-[88vh] lg:max-h-[85vh] overflow-y-auto rounded-t-3xl lg:rounded-3xl lg:max-w-xl border-t lg:border border-line p-5 lg:p-6 nav-safe anim-fade-up"
        onClick={(e) => e.stopPropagation()}
        style={{ background: 'var(--color-card2)' }}
      >
        <div className="mx-auto w-10 h-1 rounded-full bg-zinc-700 mb-4 lg:hidden" />
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-extrabold">{title}</h3>
          <button className="press p-2 -m-2 text-zinc-400" onClick={onClose} aria-label="Fermer">
            <X size={20} />
          </button>
        </div>
        <div className="pb-6">{children}</div>
      </div>
    </div>,
    document.body,
  )
}

// Toasts
const ToastCtx = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const idRef = useRef(0)

  const toast = useCallback((message, emoji = '✅') => {
    const id = ++idRef.current
    setToasts((t) => [...t, { id, message, emoji }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200)
  }, [])

  return (
    <ToastCtx.Provider value={toast}>
      {children}
      {createPortal(
        <div className="fixed left-4 right-4 lg:left-auto lg:right-8 bottom-[calc(env(safe-area-inset-bottom,0px)+6rem)] lg:bottom-8 z-[60] flex flex-col gap-2 items-center lg:items-end pointer-events-none">
          {toasts.map((t) => (
            <div key={t.id} className="anim-pop card px-4 py-3 flex items-center gap-2 shadow-2xl max-w-sm" style={{ background: 'var(--color-card2)' }}>
              <span className="text-lg">{t.emoji}</span>
              <span className="text-sm font-semibold">{t.message}</span>
            </div>
          ))}
        </div>,
        document.body,
      )}
    </ToastCtx.Provider>
  )
}

export function useToast() {
  return useContext(ToastCtx)
}

// Compte à rebours utilitaire
export function useCountdown(active, seconds, onDone) {
  const [left, setLeft] = useState(seconds)
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone

  useEffect(() => {
    if (!active) return
    setLeft(seconds)
    const startedAt = Date.now()
    const int = setInterval(() => {
      const remaining = seconds - Math.floor((Date.now() - startedAt) / 1000)
      setLeft(Math.max(0, remaining))
      if (remaining <= 0) {
        clearInterval(int)
        onDoneRef.current?.()
      }
    }, 250)
    return () => clearInterval(int)
  }, [active, seconds])

  return [left, setLeft]
}
