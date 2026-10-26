import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import './showroomceiling.css'

export type CeilingHandle = { set: (lit: number) => void }

// A showroom drop ceiling seen from eye level: rows of LED panels receding to the back wall,
// mirrored in the polished floor. `lit` (0..1) switches rows on from the front to the back.
//
// Performance: the scene is painted once into three still layers (dark room, bright room, lit
// panels) on mount and on resize. Scrolling only crossfades the bright room (GPU opacity) and
// moves the clip on the lit-panel layer when a row changes, so nothing repaints per frame.
const ROWS = 11
const COLS = 6
const NEAR = 1.75
const ROW_DEPTH = 1.35
const PANEL_DEPTH = 0.62
const PANEL_W = 1.15
const GAP_X = 0.85
const CEILING_H = 1
const DARK = 'rgb(15,17,20)'
const ROOM = 'rgb(238,240,242)'

type Geo = { w: number; h: number; horizon: number; f: number; cx: number }

function geometry(w: number, h: number): Geo {
  return { w, h, horizon: h * 0.5, f: Math.min(w, h * 1.6) * 0.55, cx: w / 2 }
}

function panelPath(ctx: CanvasRenderingContext2D, g: Geo, r: number, c: number, side: 1 | -1) {
  const span = COLS * PANEL_W + (COLS - 1) * GAP_X
  const xa = -span / 2 + c * (PANEL_W + GAP_X)
  const xb = xa + PANEL_W
  const za = NEAR + r * ROW_DEPTH
  const zb = za + PANEL_DEPTH
  const y = side * CEILING_H
  const px = (x: number, z: number) => g.cx + (x * g.f) / z
  const py = (z: number) => g.horizon - (y * g.f) / z
  ctx.beginPath()
  ctx.moveTo(px(xa, za), py(za))
  ctx.lineTo(px(xb, za), py(za))
  ctx.lineTo(px(xb, zb), py(zb))
  ctx.lineTo(px(xa, zb), py(zb))
  ctx.closePath()
}

/** Screen y where the lit region ends after `n` rows, measured from the horizon. */
function rowEdge(g: Geo, n: number) {
  if (n <= 0) return g.horizon + 2 // nothing lit: clip everything away
  if (n >= ROWS) return 0
  const zMid = NEAR + (n - 1) * ROW_DEPTH + PANEL_DEPTH + (ROW_DEPTH - PANEL_DEPTH) / 2
  return Math.max(0, (CEILING_H * g.f) / zMid) // distance above (and below) the horizon
}

function prep(cv: HTMLCanvasElement, w: number, h: number) {
  // A soft, glowing scene doesn't need retina pixels; capping the scale keeps the layers small.
  const s = Math.min(1.25, window.devicePixelRatio || 1)
  cv.width = Math.round(w * s)
  cv.height = Math.round(h * s)
  const ctx = cv.getContext('2d')!
  ctx.setTransform(s, 0, 0, s, 0, 0)
  return ctx
}

function paintRoom(cv: HTMLCanvasElement, g: Geo, bg: string, panel: string, haze: string | null) {
  const ctx = prep(cv, g.w, g.h)
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, g.w, g.h)
  ctx.fillStyle = panel
  for (const side of [1, -1] as const) {
    ctx.globalAlpha = side === 1 ? 0.9 : 0.25
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
      panelPath(ctx, g, r, c, side)
      ctx.fill()
    }
  }
  ctx.globalAlpha = 1
  if (haze) {
    const grad = ctx.createRadialGradient(g.cx, g.horizon, 0, g.cx, g.horizon, g.h * 0.55)
    grad.addColorStop(0, haze)
    grad.addColorStop(1, 'rgba(238,240,242,0)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, g.w, g.h)
  }
}

function paintLit(cv: HTMLCanvasElement, g: Geo) {
  const ctx = prep(cv, g.w, g.h)
  ctx.clearRect(0, 0, g.w, g.h)
  for (const side of [1, -1] as const) {
    for (let r = ROWS - 1; r >= 0; r--) {
      const fade = 1 - r / (ROWS + 4) // atmospheric falloff toward the back wall
      // the floor gets a dimmer, softer copy instead of a blur filter
      ctx.shadowColor = `rgba(235,245,255,${(side === 1 ? 0.85 : 0.3) * fade})`
      ctx.shadowBlur = (side === 1 ? 22 : 14) * fade
      ctx.fillStyle = `rgba(252,253,255,${(side === 1 ? 0.55 + 0.45 * fade : 0.22 * fade)})`
      for (let c = 0; c < COLS; c++) {
        panelPath(ctx, g, r, c, side)
        ctx.fill()
      }
    }
  }
}

const ShowroomCeiling = forwardRef<CeilingHandle, { className?: string }>(function ShowroomCeiling({ className }, ref) {
  const box = useRef<HTMLDivElement>(null)
  const dark = useRef<HTMLCanvasElement>(null)
  const bright = useRef<HTMLCanvasElement>(null)
  const lit = useRef<HTMLCanvasElement>(null)
  const state = useRef({ geo: null as Geo | null, rows: -1, lux: -1 })

  const reveal = (rows: number) => {
    const s = state.current
    const cv = lit.current
    if (!s.geo || !cv) return
    const e = rowEdge(s.geo, rows)
    const top = s.geo.horizon - e
    const bottom = s.geo.horizon + e
    // two bands, ceiling and floor, as one polygon (the shared left edge cancels out)
    cv.style.clipPath = `polygon(0 0, 100% 0, 100% ${top}px, 0 ${top}px, 0 ${bottom}px, 100% ${bottom}px, 100% 100%, 0 100%)`
  }

  useImperativeHandle(ref, () => ({
    set(value: number) {
      const s = state.current
      const lux = Math.round(value * 100) / 100
      if (lux !== s.lux && bright.current) {
        s.lux = lux
        bright.current.style.opacity = String(lux)
      }
      const rows = Math.round(value * ROWS)
      if (rows === s.rows) return
      const turnedOn = rows > s.rows && s.rows >= 0
      s.rows = rows
      reveal(rows)
      if (turnedOn && lit.current) {
        // restart the flicker on the light layer (opacity only, runs on the GPU)
        lit.current.classList.remove('is-flick')
        void lit.current.offsetWidth
        lit.current.classList.add('is-flick')
      }
    },
  }))

  useEffect(() => {
    const paint = () => {
      const el = box.current
      if (!el || !dark.current || !bright.current || !lit.current) return
      const g = geometry(el.clientWidth, el.clientHeight)
      if (!g.w || !g.h) return
      state.current.geo = g
      paintRoom(dark.current, g, DARK, 'rgb(38,41,46)', null)
      paintRoom(bright.current, g, ROOM, 'rgb(214,218,223)', 'rgba(238,240,242,0.85)')
      paintLit(lit.current, g)
      reveal(Math.max(0, state.current.rows))
    }
    paint()
    let t = 0
    const ro = new ResizeObserver(() => {
      clearTimeout(t)
      t = window.setTimeout(paint, 150)
    })
    if (box.current) ro.observe(box.current)
    return () => {
      ro.disconnect()
      clearTimeout(t)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div ref={box} className={`sc ${className ?? ''}`} aria-hidden="true">
      <canvas ref={dark} />
      <canvas ref={bright} className="sc-bright" />
      <canvas ref={lit} className="sc-lit" />
    </div>
  )
})

export default ShowroomCeiling
