// Génère une carte de progression (PNG 1080×1350, format story) à partager.
import { sortedWeights, withMovingAverage } from './metrics.js'
import { diffDays, todayISO, fmtShort } from './dates.js'

export async function generateShareCard({ goals, weights, prs, streak }) {
  await document.fonts.ready
  const W = 1080
  const H = 1350
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const ctx = c.getContext('2d')

  // Fond
  ctx.fillStyle = '#0c0a09'
  ctx.fillRect(0, 0, W, H)
  const g1 = ctx.createRadialGradient(140, -40, 0, 140, -40, 700)
  g1.addColorStop(0, 'rgba(255,138,30,0.16)')
  g1.addColorStop(1, 'rgba(255,138,30,0)')
  ctx.fillStyle = g1
  ctx.fillRect(0, 0, W, H)
  const g2 = ctx.createRadialGradient(W - 100, H + 60, 0, W - 100, H + 60, 700)
  g2.addColorStop(0, 'rgba(52,211,153,0.13)')
  g2.addColorStop(1, 'rgba(52,211,153,0)')
  ctx.fillStyle = g2
  ctx.fillRect(0, 0, W, H)

  // Éclair (logo)
  ctx.save()
  ctx.translate(W / 2 - 60, 70)
  ctx.scale(0.24, 0.24)
  const bolt = new Path2D('M 296 68 L 172 292 L 252 292 L 216 444 L 348 212 L 262 212 Z')
  const bg = ctx.createLinearGradient(170, 60, 350, 450)
  bg.addColorStop(0, '#ff8a1e')
  bg.addColorStop(1, '#34d399')
  ctx.fillStyle = bg
  ctx.fill(bolt)
  ctx.restore()

  const bebas = (size) => `${size}px "Bebas Neue", sans-serif`
  ctx.textAlign = 'center'

  // Titre
  ctx.fillStyle = '#f5f0eb'
  ctx.font = bebas(76)
  ctx.fillText('T R A N S F O', W / 2, 250)
  ctx.fillStyle = '#a8a29e'
  ctx.font = '600 30px -apple-system, "Segoe UI", sans-serif'
  const today = todayISO()
  ctx.fillText(`${fmtShort(goals.startDate)} → ${fmtShort(today)}`, W / 2, 300)

  // Poids
  const s = sortedWeights(weights)
  const current = s.length ? s[s.length - 1].kg : goals.startWeight
  const delta = current - goals.startWeight
  ctx.fillStyle = '#f5f0eb'
  ctx.font = bebas(190)
  ctx.fillText(`${current.toFixed(1)} KG`, W / 2, 510)
  ctx.fillStyle = delta >= 0 ? '#34d399' : '#f87171'
  ctx.font = bebas(64)
  ctx.fillText(`${delta >= 0 ? '+' : ''}${delta.toFixed(1)} KG DEPUIS LE DÉBUT`, W / 2, 590)

  // Courbe de poids
  const ma = withMovingAverage(weights)
  if (ma.length >= 2) {
    const x0 = 120
    const x1 = W - 120
    const y0 = 660
    const y1 = 880
    const vals = ma.map((w) => w.ma)
    const min = Math.min(...vals) - 0.3
    const max = Math.max(...vals) + 0.3
    const px = (i) => x0 + ((x1 - x0) * i) / (ma.length - 1)
    const py = (v) => y1 - ((y1 - y0) * (v - min)) / (max - min)

    // aire
    ctx.beginPath()
    ctx.moveTo(px(0), y1)
    ma.forEach((w, i) => ctx.lineTo(px(i), py(w.ma)))
    ctx.lineTo(px(ma.length - 1), y1)
    ctx.closePath()
    const ag = ctx.createLinearGradient(0, y0, 0, y1)
    ag.addColorStop(0, 'rgba(255,138,30,0.35)')
    ag.addColorStop(1, 'rgba(255,138,30,0)')
    ctx.fillStyle = ag
    ctx.fill()
    // ligne
    ctx.beginPath()
    ma.forEach((w, i) => (i === 0 ? ctx.moveTo(px(i), py(w.ma)) : ctx.lineTo(px(i), py(w.ma))))
    ctx.strokeStyle = '#ff8a1e'
    ctx.lineWidth = 7
    ctx.lineJoin = 'round'
    ctx.lineCap = 'round'
    ctx.stroke()
  }

  // Stats en bas
  const stats = [
    { label: 'JOURS DE STREAK', value: `${streak}` },
    { label: 'TRACTIONS MAX', value: prs['tractions-pronation']?.value ?? '—' },
    { label: 'DIPS MAX', value: prs['dips']?.value ?? '—' },
    { label: 'POMPES MAX', value: prs['pompes']?.value ?? '—' },
  ]
  const cols = stats.length
  stats.forEach((st, i) => {
    const cx = (W / cols) * (i + 0.5)
    ctx.fillStyle = '#f5f0eb'
    ctx.font = bebas(96)
    ctx.fillText(`${st.value}`, cx, 1050)
    ctx.fillStyle = '#78716c'
    ctx.font = '700 22px -apple-system, "Segoe UI", sans-serif'
    ctx.fillText(st.label, cx, 1095)
  })

  // Footer
  const daysLeft = Math.max(0, diffDays(today, goals.endDate))
  ctx.fillStyle = '#a8a29e'
  ctx.font = bebas(46)
  ctx.fillText(`OBJECTIF ${goals.goalWeight} KG · J-${daysLeft}`, W / 2, 1230)
  ctx.fillStyle = '#57534e'
  ctx.font = '600 24px -apple-system, "Segoe UI", sans-serif'
  ctx.fillText('Mattéo · Transfo été 2026', W / 2, 1280)

  const blob = await new Promise((r) => c.toBlob(r, 'image/png'))
  return blob
}

export async function shareOrDownload(blob, filename) {
  const file = new File([blob], filename, { type: 'image/png' })
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: 'Ma progression Transfo' })
      return 'shared'
    } catch (e) {
      if (e.name === 'AbortError') return 'cancelled'
    }
  }
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = filename
  a.click()
  URL.revokeObjectURL(a.href)
  return 'downloaded'
}
