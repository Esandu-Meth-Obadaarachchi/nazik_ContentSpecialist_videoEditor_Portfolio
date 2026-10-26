import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'

export type CeilingHandle = { set: (lit: number) => void }

// A showroom drop ceiling seen from eye level: rows of LED panels receding to the back wall,
// mirrored in the polished floor. `lit` (0..1) switches rows on from the front to the back.
const ROWS = 11
const COLS = 6
const NEAR = 1.75
const ROW_DEPTH = 1.35
const PANEL_DEPTH = 0.62
const PANEL_W = 1.15
const GAP_X = 0.85
const CEILING_H = 1

const mix = (a: number[], b: number[], t: number) => a.map((v, i) => Math.round(v + (b[i] - v) * t))
const rgb = (c: number[], a = 1) => `rgba(${c[0]},${c[1]},${c[2]},${a})`

const ShowroomCeiling = forwardRef<CeilingHandle, { className?: string }>(function ShowroomCeiling({ className }, ref) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const state = useRef({ lit: 0, rows: 0, flick: new Map<number, number>(), raf: 0 })

  const draw = () => {
    const cv = canvas.current
    if (!cv) return
    const ctx = cv.getContext('2d')!
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    const w = cv.clientWidth
    const h = cv.clientHeight
    if (cv.width !== Math.round(w * dpr) || cv.height !== Math.round(h * dpr)) {
      cv.width = Math.round(w * dpr)
      cv.height = Math.round(h * dpr)
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    const { lit, rows, flick } = state.current
    const now = performance.now()

    // room tone follows how many lights are on
    const dark = [15, 17, 20]
    const room = [238, 240, 242]
    ctx.fillStyle = rgb(mix(dark, room, lit))
    ctx.fillRect(0, 0, w, h)

    const horizon = h * 0.5
    const f = Math.min(w, h * 1.6) * 0.55
    const cx = w / 2
    const project = (x: number, y: number, z: number) => [cx + (x * f) / z, horizon - (y * f) / z]

    const span = COLS * PANEL_W + (COLS - 1) * GAP_X
    const x0 = -span / 2

    const quad = (xa: number, xb: number, za: number, zb: number, y: number) => {
      const [ax, ay] = project(xa, y, za)
      const [bx, by] = project(xb, y, za)
      const [cx2, cy] = project(xb, y, zb)
      const [dx, dy] = project(xa, y, zb)
      ctx.beginPath()
      ctx.moveTo(ax, ay)
      ctx.lineTo(bx, by)
      ctx.lineTo(cx2, cy)
      ctx.lineTo(dx, dy)
      ctx.closePath()
    }

    // ceiling (y = +H) and its reflection in the floor (y = -H)
    for (const side of [1, -1] as const) {
      ctx.save()
      if (side === -1) {
        ctx.globalAlpha = 0.28
        ctx.filter = 'blur(3px)'
      }
      // far rows first so near ones overlap
      for (let r = ROWS - 1; r >= 0; r--) {
        const za = NEAR + r * ROW_DEPTH
        const zb = za + PANEL_DEPTH
        const on = r < rows
        let a = 1
        const t0 = flick.get(r)
        if (on && t0 !== undefined) {
          const k = (now - t0) / 320
          a = k >= 1 ? 1 : [0.15, 1, 0.4, 1][Math.floor(k * 4)]
        }
        const fade = 1 - r / (ROWS + 4) // atmospheric falloff toward the back wall
        for (let c = 0; c < COLS; c++) {
          const xa = x0 + c * (PANEL_W + GAP_X)
          quad(xa, xa + PANEL_W, za, zb, side * CEILING_H)
          if (on) {
            ctx.shadowColor = `rgba(235,245,255,${0.9 * a * fade})`
            ctx.shadowBlur = 26 * fade
            ctx.fillStyle = `rgba(252,253,255,${a * (0.55 + 0.45 * fade)})`
          } else {
            ctx.shadowBlur = 0
            ctx.fillStyle = rgb(mix([38, 41, 46], [214, 218, 223], lit), 0.9)
          }
          ctx.fill()
        }
      }
      ctx.restore()
    }

    // soft haze at the vanishing point
    const g = ctx.createRadialGradient(cx, horizon, 0, cx, horizon, h * 0.55)
    g.addColorStop(0, rgb(mix(dark, room, lit), 0.85 * lit))
    g.addColorStop(1, rgb(mix(dark, room, lit), 0))
    ctx.fillStyle = g
    ctx.fillRect(0, 0, w, h)
  }

  const tick = () => {
    draw()
    const { flick } = state.current
    const now = performance.now()
    for (const [r, t0] of flick) if (now - t0 > 340) flick.delete(r)
    state.current.raf = flick.size ? requestAnimationFrame(tick) : 0
  }

  useImperativeHandle(ref, () => ({
    set(lit: number) {
      const s = state.current
      const rows = Math.round(lit * ROWS)
      if (rows > s.rows) for (let r = s.rows; r < rows; r++) s.flick.set(r, performance.now())
      if (rows === s.rows && Math.abs(lit - s.lit) < 0.004) return
      s.rows = rows
      s.lit = lit
      if (!s.raf) s.raf = requestAnimationFrame(tick)
    },
  }))

  useEffect(() => {
    draw()
    const s = state.current
    const ro = new ResizeObserver(() => draw())
    if (canvas.current) ro.observe(canvas.current)
    return () => {
      ro.disconnect()
      cancelAnimationFrame(s.raf)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <canvas ref={canvas} className={className} aria-hidden="true" />
})

export default ShowroomCeiling
