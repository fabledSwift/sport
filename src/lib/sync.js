// Synchronisation cloud via un dépôt GitHub privé (gratuit, à vie).
// Le "compte" = ton compte GitHub. Les données (et les photos) sont poussées
// dans un dépôt privé `transfo-data` ; chaque appareil qui a le token se synchronise.
import { load, save, SYNCED_KEYS } from './store.js'
import { getAllPhotos, savePhoto } from './photos.js'

const API = 'https://api.github.com'
const DATA_KEYS = SYNCED_KEYS

function headers(token, raw = false) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: raw ? 'application/vnd.github.raw+json' : 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  }
}

export function getSyncConfig() {
  return load('sync', null)
}

export function setSyncConfig(cfg) {
  save('sync', cfg, { silent: true })
}

// — encodage base64 sûr pour l'unicode et les gros contenus —
function toBase64(str) {
  const bytes = new TextEncoder().encode(str)
  let bin = ''
  for (let i = 0; i < bytes.length; i += 8192) bin += String.fromCharCode(...bytes.subarray(i, i + 8192))
  return btoa(bin)
}

function fromBase64(b64) {
  const bin = atob(b64.replace(/\n/g, ''))
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(r.result.split(',')[1])
    r.onerror = reject
    r.readAsDataURL(blob)
  })
}

async function gh(token, path, options = {}) {
  const res = await fetch(`${API}${path}`, { ...options, headers: { ...headers(token, options.raw), ...(options.body ? { 'Content-Type': 'application/json' } : {}) } })
  if (res.status === 404) return null
  if (res.status === 401) throw new Error('Token invalide ou expiré — vérifie que tu l’as copié en entier (il commence par github_pat_)')
  if (res.status === 403) throw new Error('Accès refusé — vérifie que le token a bien la permission « Contents : Read and write » sur le dépôt')
  if (!res.ok) throw new Error(`GitHub ${res.status} : ${(await res.text()).slice(0, 120)}`)
  return options.raw ? res : res.json()
}

// Vérifie le token + l'accès au dépôt. Retourne { login, repoOk }
export async function checkAccess(token, repo) {
  const user = await gh(token, '/user')
  if (!user) throw new Error('Token invalide')
  const repoInfo = await gh(token, `/repos/${repo}`)
  return { login: user.login, repoOk: !!repoInfo, isPrivate: repoInfo?.private ?? false }
}

async function getRemoteData(token, repo) {
  const file = await gh(token, `/repos/${repo}/contents/data.json`)
  if (!file) return null
  return { sha: file.sha, json: JSON.parse(fromBase64(file.content)) }
}

async function putFile(token, repo, path, base64Content, sha, message) {
  return gh(token, `/repos/${repo}/contents/${path}`, {
    method: 'PUT',
    body: JSON.stringify({ message, content: base64Content, ...(sha ? { sha } : {}) }),
  })
}

function localSnapshot() {
  const data = {}
  for (const key of DATA_KEYS) data[key] = load(key, null)
  return { app: 'transfo-matteo', updatedAt: load('lastModified', 0), data }
}

function applySnapshot(snapshot) {
  for (const key of DATA_KEYS) {
    if (snapshot.data[key] != null) save(key, snapshot.data[key], { silent: true })
  }
  save('lastModified', snapshot.updatedAt, { silent: true })
}

// Synchronise les photos dans les deux sens (ajouts uniquement, pas de suppression)
async function syncPhotos(token, repo) {
  const localPhotos = await getAllPhotos()
  const localKeys = new Set(localPhotos.map((p) => p.key))
  const remoteList = (await gh(token, `/repos/${repo}/contents/photos`)) || []
  const remoteKeys = new Set(remoteList.map((f) => f.name.replace(/\.jpg$/, '')))

  let up = 0
  let down = 0
  for (const p of localPhotos) {
    if (!remoteKeys.has(p.key)) {
      const b64 = await blobToBase64(p.blob)
      await putFile(token, repo, `photos/${p.key}.jpg`, b64, null, `photo ${p.key}`)
      up++
    }
  }
  for (const f of remoteList) {
    const key = f.name.replace(/\.jpg$/, '')
    if (!localKeys.has(key)) {
      const res = await gh(token, `/repos/${repo}/contents/photos/${f.name}`, { raw: true })
      const blob = await res.blob()
      const [date, pose] = key.split('_')
      await savePhoto({ date, pose, blob })
      down++
    }
  }
  return { up, down }
}

// Synchro complète. Retourne un résumé { action, photos }
export async function syncNow() {
  const cfg = getSyncConfig()
  if (!cfg?.token || !cfg?.repo || !cfg.enabled) return { action: 'off' }

  const remote = await getRemoteData(cfg.token, cfg.repo)
  const localTime = load('lastModified', 0)
  const remoteTime = remote?.json?.updatedAt || 0
  let action = 'aucun-changement'

  if (remote && remoteTime > localTime) {
    applySnapshot(remote.json)
    action = 'données-récupérées'
  } else if (localTime > remoteTime) {
    const snap = localSnapshot()
    await putFile(cfg.token, cfg.repo, 'data.json', toBase64(JSON.stringify(snap)), remote?.sha, `sync ${new Date().toISOString()}`)
    action = 'données-envoyées'
  }

  const photos = await syncPhotos(cfg.token, cfg.repo)
  setSyncConfig({ ...cfg, lastSyncAt: Date.now(), lastError: null })
  return { action, photos }
}

// Planifie une synchro automatique (debounce) après chaque modification
let timer = null
export function scheduleSync(delayMs = 45000) {
  const cfg = getSyncConfig()
  if (!cfg?.enabled) return
  clearTimeout(timer)
  timer = setTimeout(() => {
    syncNow().catch((e) => {
      const c = getSyncConfig()
      if (c) setSyncConfig({ ...c, lastError: String(e.message || e) })
    })
  }, delayMs)
}
