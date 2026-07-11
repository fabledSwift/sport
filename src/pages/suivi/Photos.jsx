// Photos de progression : capture quotidienne, galerie, comparaison avant/après.
import { useEffect, useRef, useState, useCallback } from 'react'
import { Camera, Trash2, GitCompareArrows } from 'lucide-react'
import { todayISO, fmtShort, fmtLong } from '../../lib/dates.js'
import { getAllPhotos, savePhoto, deletePhoto, compressImage, POSES } from '../../lib/photos.js'
import { Card, SectionTitle, Sheet, useToast } from '../../components/ui.jsx'
import CompareSlider from '../../components/CompareSlider.jsx'

export default function Photos() {
  const today = todayISO()
  const [photos, setPhotos] = useState([]) // {key, date, pose, url}
  const [compare, setCompare] = useState(null) // {pose, beforeKey, afterKey}
  const [viewer, setViewer] = useState(null) // photo en plein écran
  const urlsRef = useRef([])
  const toast = useToast()

  const reload = useCallback(async () => {
    urlsRef.current.forEach((u) => URL.revokeObjectURL(u))
    const all = await getAllPhotos()
    const withUrls = all.map((p) => ({ ...p, url: URL.createObjectURL(p.blob) }))
    urlsRef.current = withUrls.map((p) => p.url)
    setPhotos(withUrls)
  }, [])

  useEffect(() => {
    reload()
    return () => urlsRef.current.forEach((u) => URL.revokeObjectURL(u))
  }, [reload])

  const upload = async (pose, file) => {
    if (!file) return
    const blob = await compressImage(file)
    await savePhoto({ date: today, pose, blob })
    await reload()
    toast('Photo enregistrée 📸')
  }

  const remove = async (key) => {
    await deletePhoto(key)
    await reload()
    setViewer(null)
  }

  const todayByPose = Object.fromEntries(photos.filter((p) => p.date === today).map((p) => [p.pose, p]))

  // Groupes par date (récentes d'abord)
  const byDate = {}
  for (const p of photos) (byDate[p.date] ||= []).push(p)
  const dates = Object.keys(byDate).sort().reverse()

  // Comparaison
  const comparable = compare ? photos.filter((p) => p.pose === compare.pose) : []
  const before = comparable.find((p) => p.key === compare?.beforeKey) || comparable[0]
  const after = comparable.find((p) => p.key === compare?.afterKey) || comparable[comparable.length - 1]

  const openCompare = () => {
    const posesWithTwo = POSES.filter((pose) => photos.filter((p) => p.pose === pose.id).length >= 2)
    if (!posesWithTwo.length) {
      toast('Il faut au moins 2 photos de la même pose pour comparer', '🤏')
      return
    }
    const pose = posesWithTwo[0].id
    const list = photos.filter((p) => p.pose === pose)
    setCompare({ pose, beforeKey: list[0].key, afterKey: list[list.length - 1].key })
  }

  return (
    <div>
      <div className="lg:grid lg:grid-cols-2 lg:gap-4 lg:items-start">
      {/* Capture du jour */}
      <Card>
        <p className="text-sm font-bold mb-1">Photo du jour</p>
        <p className="text-xs text-zinc-500 mb-3">Une seule photo, de face — même lumière, même distance, chaque matin. C'est ça qui rend la comparaison bluffante.</p>
        {POSES.map((pose) => {
          const done = todayByPose[pose.id]
          return (
            <label key={pose.id} className={`press cursor-pointer rounded-2xl border w-36 mx-auto aspect-[3/4] flex flex-col items-center justify-center gap-1 overflow-hidden relative ${done ? 'border-emerald-500/40' : 'border-dashed border-zinc-700'}`}>
              {done ? (
                <img src={done.url} alt={pose.name} className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <>
                  <Camera size={22} className="text-zinc-500" />
                  <span className="text-xl">{pose.emoji}</span>
                </>
              )}
              <span className={`text-[11px] font-black z-10 rounded-lg px-2 py-0.5 ${done ? 'bg-black/60 absolute bottom-1.5' : 'text-zinc-400'}`}>
                {done ? 'Prise ✔' : 'Prendre la photo'}
              </span>
              <input
                type="file" accept="image/*" className="hidden"
                onChange={(e) => upload(pose.id, e.target.files?.[0])}
              />
            </label>
          )
        })}
      </Card>

      <div className="mt-3 lg:mt-0">
        {/* Comparaison */}
        <button
          onClick={openCompare}
          className="press w-full rounded-2xl bg-zinc-800/80 py-3.5 font-black text-sm flex items-center justify-center gap-2"
        >
          <GitCompareArrows size={18} className="text-orange-400" /> Comparer avant / après
        </button>
        <Card className="mt-3 hidden lg:block border-orange-500/15">
          <p className="text-xs text-zinc-400 leading-relaxed">
            📸 <b>Le rituel :</b> chaque matin, même endroit, même lumière, torse nu, de face.
            Dans 2 mois, le slider avant/après fera le reste. Les photos se synchronisent avec ton compte.
          </p>
        </Card>
      </div>
      </div>

      {/* Galerie */}
      {dates.length === 0 ? (
        <Card className="mt-3">
          <p className="text-sm text-zinc-500 py-6 text-center">
            Ta galerie est vide. La photo du jour 1, c'est celle que tu remercieras dans 2 mois 💪
          </p>
        </Card>
      ) : (
        <>
          <SectionTitle>Galerie ({photos.length})</SectionTitle>
          {dates.map((date) => (
            <div key={date} className="mb-4">
              <p className="text-xs font-bold text-zinc-500 mb-2">{fmtLong(date)}</p>
              <div className="grid grid-cols-3 lg:grid-cols-6 gap-2">
                {byDate[date].map((p) => (
                  <button key={p.key} className="press relative rounded-xl overflow-hidden aspect-[3/4]" onClick={() => setViewer(p)}>
                    <img src={p.url} alt={p.pose} className="w-full h-full object-cover" loading="lazy" />
                    <span className="absolute bottom-1 left-1 text-[10px] font-bold bg-black/60 rounded px-1.5 py-0.5 capitalize">{p.pose}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </>
      )}

      {/* Sheet comparaison */}
      <Sheet open={!!compare} onClose={() => setCompare(null)} title="Avant / Après">
        {compare && before && after && (
          <>
            {POSES.length > 1 && (
              <div className="flex gap-2 mb-3">
                {POSES.map((pose) => {
                  const count = photos.filter((p) => p.pose === pose.id).length
                  return (
                    <button
                      key={pose.id}
                      disabled={count < 2}
                      onClick={() => {
                        const list = photos.filter((p) => p.pose === pose.id)
                        setCompare({ pose: pose.id, beforeKey: list[0].key, afterKey: list[list.length - 1].key })
                      }}
                      className={`flex-1 rounded-xl py-2 text-xs font-black ${compare.pose === pose.id ? 'bg-orange-500 text-zinc-950' : 'bg-zinc-800 text-zinc-400'} disabled:opacity-30`}
                    >
                      {pose.emoji} {pose.name}
                    </button>
                  )
                })}
              </div>
            )}
            <CompareSlider before={before} after={after} />
            <div className="grid grid-cols-2 gap-2 mt-3">
              <select
                value={before.key}
                onChange={(e) => setCompare((c) => ({ ...c, beforeKey: e.target.value }))}
                className="rounded-xl bg-zinc-800 px-3 py-2.5 text-sm font-bold outline-none"
              >
                {comparable.map((p) => <option key={p.key} value={p.key}>Avant : {fmtShort(p.date)}</option>)}
              </select>
              <select
                value={after.key}
                onChange={(e) => setCompare((c) => ({ ...c, afterKey: e.target.value }))}
                className="rounded-xl bg-zinc-800 px-3 py-2.5 text-sm font-bold outline-none"
              >
                {comparable.map((p) => <option key={p.key} value={p.key}>Après : {fmtShort(p.date)}</option>)}
              </select>
            </div>
          </>
        )}
      </Sheet>

      {/* Viewer plein écran */}
      <Sheet open={!!viewer} onClose={() => setViewer(null)} title={viewer ? `${fmtShort(viewer.date)} · ${viewer.pose}` : ''}>
        {viewer && (
          <>
            <img src={viewer.url} alt="" className="w-full rounded-2xl" />
            <button
              onClick={() => remove(viewer.key)}
              className="press mt-3 w-full rounded-xl bg-red-500/10 border border-red-500/30 py-3 text-sm font-black text-red-400 flex items-center justify-center gap-2"
            >
              <Trash2 size={16} /> Supprimer cette photo
            </button>
          </>
        )}
      </Sheet>
    </div>
  )
}
