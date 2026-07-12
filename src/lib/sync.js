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

// ————————————————————————————————————————————————————————————————
// FUSION des données (au lieu de « dernier qui écrit gagne »).
// On unit tout par date/clé : aucune donnée d'un appareil n'écrase
// celle de l'autre. Le résultat est le même quel que soit l'ordre des
// synchros → les deux appareils convergent vers l'union de tout.
// ————————————————————————————————————————————————————————————————

// Fusionne deux objets indexés par date/clé (workouts, checks…)
function mergeMap(local, remote, mergeEntry) {
  const out = { ...(local || {}) }
  for (const [k, rv] of Object.entries(remote || {})) {
    out[k] = k in out ? mergeEntry(out[k], rv) : rv
  }
  return out
}

// Pesées : tableau [{date, kg}] → union par date
function mergeWeights(local, remote, preferRemote) {
  const map = {}
  for (const w of local || []) map[w.date] = w
  for (const w of remote || []) map[w.date] = w.date in map ? (preferRemote ? w : map[w.date]) : w
  return Object.values(map).sort((a, b) => (a.date < b.date ? -1 : 1))
}

// Un jour de dailies : eau/sommeil/créatine/cardio/kcal → fusion champ par champ
function mergeDaily(a, b, preferRemote) {
  const out = {}
  for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) {
    if (a[k] === undefined) out[k] = b[k]
    else if (b[k] === undefined) out[k] = a[k]
    else if (k === 'creatine') out[k] = a[k] || b[k]        // pris sur l'un des deux = pris
    else if (k === 'water') out[k] = Math.max(a[k], b[k])   // le plus de verres comptés gagne
    else out[k] = preferRemote ? b[k] : a[k]
  }
  return out
}

// Cases à cocher (repas, courses, meal prep) : coché sur l'un = coché
function mergeChecks(a, b) {
  const out = { ...a }
  for (const [k, v] of Object.entries(b)) out[k] = out[k] || v
  return out
}

// Remplacements de repas / niveaux
function mergeSwaps(a, b, preferRemote) {
  const out = { ...a }
  for (const [k, v] of Object.entries(b)) out[k] = k in a ? (preferRemote ? v : a[k]) : v
  return out
}

function mergeData(localData, remoteData, localTime, remoteTime) {
  const L = localData || {}
  const R = remoteData || {}
  const pr = remoteTime > localTime // en cas de vrai conflit sur un même champ

  const merged = {}
  for (const key of DATA_KEYS) {
    const lv = L[key]
    const rv = R[key]
    if (lv == null) { merged[key] = rv ?? null; continue }
    if (rv == null) { merged[key] = lv; continue }

    switch (key) {
      case 'weights':
        merged[key] = mergeWeights(lv, rv, pr); break
      case 'workouts':
        merged[key] = mergeMap(lv, rv, (a, b) => (pr ? b : a)); break // 1 séance/jour
      case 'dailies':
        merged[key] = mergeMap(lv, rv, (a, b) => mergeDaily(a, b, pr)); break
      case 'mealChecks': case 'shoppingChecks': case 'prepChecks':
        merged[key] = mergeMap(lv, rv, (a, b) => mergeChecks(a, b)); break
      case 'mealSwaps':
        merged[key] = mergeMap(lv, rv, (a, b) => mergeSwaps(a, b, pr)); break
      case 'levels': {
        const out = { ...lv }
        for (const [ex, n] of Object.entries(rv)) out[ex] = Math.max(out[ex] ?? 0, n ?? 0)
        merged[key] = out; break
      }
      case 'goals':
      default:
        merged[key] = pr ? rv : lv; break
    }
  }
  return merged
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

// Synchro complète : fusionne local + cloud, applique le résultat des deux côtés.
// Retourne un résumé { action, photos }
export async function syncNow() {
  const cfg = getSyncConfig()
  if (!cfg?.token || !cfg?.repo || !cfg.enabled) return { action: 'off' }

  let action = 'à-jour'
  for (let attempt = 1; attempt <= 3; attempt++) {
    const remote = await getRemoteData(cfg.token, cfg.repo)
    const localTime = load('lastModified', 0)
    const remoteTime = remote?.json?.updatedAt || 0

    const localData = {}
    for (const k of DATA_KEYS) localData[k] = load(k, null)

    const merged = mergeData(localData, remote?.json?.data, localTime, remoteTime)
    const mergedTime = Math.max(localTime, remoteTime, 1)

    // Applique le résultat fusionné en local (ce qui a changé déclenche le re-render)
    let pulled = false
    for (const key of DATA_KEYS) {
      if (merged[key] != null && JSON.stringify(merged[key]) !== JSON.stringify(localData[key])) {
        save(key, merged[key], { silent: true })
        pulled = true
      }
    }
    save('lastModified', mergedTime, { silent: true })

    // Le cloud a-t-il besoin d'être mis à jour ?
    const needPush = !remote || JSON.stringify(merged) !== JSON.stringify(remote.json.data)
    if (needPush) {
      const snap = { app: 'transfo-matteo', updatedAt: mergedTime, data: merged }
      try {
        await putFile(cfg.token, cfg.repo, 'data.json', toBase64(JSON.stringify(snap)), remote?.sha, `sync ${new Date().toISOString()}`)
      } catch (e) {
        // Un autre appareil a écrit entre-temps (sha périmé) → on refait un tour de fusion
        const msg = String(e.message || e)
        if ((msg.includes('409') || msg.includes('422')) && attempt < 3) continue
        throw e
      }
    }
    action = pulled ? (needPush ? 'fusionné' : 'données-récupérées') : (needPush ? 'données-envoyées' : 'à-jour')
    break
  }

  const photos = await syncPhotos(cfg.token, cfg.repo)
  setSyncConfig({ ...getSyncConfig(), lastSyncAt: Date.now(), lastError: null })
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
