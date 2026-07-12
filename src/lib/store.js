// Stockage local : localStorage + hook React synchronisé entre composants.
import { useState, useEffect, useCallback } from 'react'

const PREFIX = 'transfo.'
const EVENT = 'transfo-store'

// Clés synchronisées vers le cloud (voir sync.js). sessionDraft et sync restent locaux.
export const SYNCED_KEYS = [
  'goals', 'weights', 'workouts', 'levels', 'dailies',
  'mealChecks', 'mealSwaps', 'shoppingChecks', 'prepChecks',
]

export function load(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    return raw === null ? fallback : JSON.parse(raw)
  } catch {
    return fallback
  }
}

// options.silent : ne marque pas la donnée comme "modifiée localement"
// (utilisé quand on APPLIQUE des données venues du cloud, pour éviter les boucles)
export function save(key, value, { silent = false } = {}) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
    if (!silent && SYNCED_KEYS.includes(key)) {
      localStorage.setItem(PREFIX + 'lastModified', JSON.stringify(Date.now()))
    }
  } catch (e) {
    console.error('localStorage plein ?', e)
  }
  window.dispatchEvent(new CustomEvent(EVENT, { detail: { key, value, silent } }))
}

// Hook : comme useState mais persistant et synchronisé entre composants montés.
export function useStore(key, fallback) {
  const [value, setValue] = useState(() => load(key, fallback))

  useEffect(() => {
    const handler = (e) => {
      if (e.detail.key === key) setValue(e.detail.value)
    }
    window.addEventListener(EVENT, handler)
    return () => window.removeEventListener(EVENT, handler)
  }, [key])

  const set = useCallback(
    (next) => {
      const resolved = typeof next === 'function' ? next(load(key, fallback)) : next
      save(key, resolved)
    },
    [key, fallback],
  )

  return [value, set]
}

export const STORE_EVENT = EVENT
