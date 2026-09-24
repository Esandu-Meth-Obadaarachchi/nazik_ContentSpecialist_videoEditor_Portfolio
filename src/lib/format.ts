import type { Views } from '../data/content'

export function compact(n: number) {
  if (n >= 1_000_000) {
    const v = n / 1_000_000
    return `${v >= 10 ? v.toFixed(1).replace(/\.0$/, '') : v.toFixed(2).replace(/0$/, '').replace(/\.0$/, '')}M`
  }
  if (n >= 1_000) {
    const v = n / 1_000
    return `${v >= 100 ? Math.round(v) : v.toFixed(1).replace(/\.0$/, '')}K`
  }
  return String(n)
}

export function totalViews(v?: Views) {
  if (!v) return 0
  return (v.ig ?? 0) + (v.fb ?? 0) + (v.tt ?? 0)
}

export function platformLabel(v: Views, key: 'ig' | 'fb' | 'tt') {
  const n = v[key]
  if (n == null) return 'Not posted'
  return `${v.approx?.includes(key) ? '~' : ''}${compact(n)}`
}

/** 25fps SMPTE-style timecode. */
export function timecode(seconds: number, fps = 25) {
  const s = Math.max(0, seconds)
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = Math.floor(s % 60)
  const f = Math.floor((s % 1) * fps)
  const p = (x: number) => String(x).padStart(2, '0')
  return `${p(h)}:${p(m)}:${p(sec)}:${p(f)}`
}
