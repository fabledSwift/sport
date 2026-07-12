// Petit bip de fin de timer (WebAudio) + vibration si dispo.
export function beep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const play = (freq, at, dur) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.value = freq
      gain.gain.setValueAtTime(0.25, ctx.currentTime + at)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + at + dur)
      osc.start(ctx.currentTime + at)
      osc.stop(ctx.currentTime + at + dur)
    }
    play(880, 0, 0.15)
    play(880, 0.2, 0.15)
    play(1175, 0.4, 0.3)
  } catch { /* pas grave */ }
  navigator.vibrate?.([200, 100, 200])
}
