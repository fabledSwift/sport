// Génère les icônes PNG de la PWA à partir d'un SVG (une seule fois).
import sharp from 'sharp'
import { mkdirSync } from 'node:fs'

const svg = (pad = 0) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ff8a1e"/>
      <stop offset="1" stop-color="#34d399"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="${pad ? 0 : 116}" fill="#0c0a09"/>
  <g transform="translate(256 262) scale(${pad ? 0.72 : 1}) translate(-256 -262)">
    <path d="M 296 68 L 172 292 L 252 292 L 216 444 L 348 212 L 262 212 Z"
      fill="url(#g)" stroke="#0c0a09" stroke-width="10" stroke-linejoin="round"/>
  </g>
</svg>`

mkdirSync('public', { recursive: true })
await sharp(Buffer.from(svg())).resize(192, 192).png().toFile('public/pwa-192.png')
await sharp(Buffer.from(svg())).resize(512, 512).png().toFile('public/pwa-512.png')
await sharp(Buffer.from(svg(1))).resize(512, 512).png().toFile('public/pwa-maskable-512.png')
await sharp(Buffer.from(svg())).resize(180, 180).png().toFile('public/apple-touch-icon.png')
console.log('Icônes générées ✔')
