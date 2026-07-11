// Stockage des photos de progression dans IndexedDB (blobs compressés).
const DB_NAME = 'transfo-photos'
const STORE = 'photos'

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE)) {
        const store = db.createObjectStore(STORE, { keyPath: 'key' })
        store.createIndex('date', 'date')
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

function tx(db, mode, fn) {
  return new Promise((resolve, reject) => {
    const t = db.transaction(STORE, mode)
    const store = t.objectStore(STORE)
    const result = fn(store)
    t.oncomplete = () => resolve(result?.result ?? result)
    t.onerror = () => reject(t.error)
  })
}

// Redimensionne + compresse en JPEG avant stockage (max 1080 px)
export async function compressImage(file, maxSize = 1080, quality = 0.82) {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height))
  const w = Math.round(bitmap.width * scale)
  const h = Math.round(bitmap.height * scale)
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  canvas.getContext('2d').drawImage(bitmap, 0, 0, w, h)
  bitmap.close()
  return new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality))
}

export async function savePhoto({ date, pose, blob }) {
  const db = await openDB()
  await tx(db, 'readwrite', (store) => store.put({ key: `${date}_${pose}`, date, pose, blob }))
  db.close()
}

export async function deletePhoto(key) {
  const db = await openDB()
  await tx(db, 'readwrite', (store) => store.delete(key))
  db.close()
}

export async function getAllPhotos() {
  const db = await openDB()
  const all = await new Promise((resolve, reject) => {
    const req = db.transaction(STORE, 'readonly').objectStore(STORE).getAll()
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
  db.close()
  return all.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : a.pose < b.pose ? -1 : 1))
}

export const POSES = [
  { id: 'face', name: 'Face', emoji: '🧍' },
  { id: 'profil', name: 'Profil', emoji: '🚶' },
  { id: 'dos', name: 'Dos', emoji: '🔙' },
]
