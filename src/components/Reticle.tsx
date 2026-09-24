import { useEffect, useRef } from 'react'
import { finePointer, gsap, reducedMotion } from '../lib/motion'
import './reticle.css'

const INTERACTIVE = '[data-cursor], a, button, [role="button"], summary, label[for]'
const BOX = 30
const C = 11 // corner arm length
const PAD = 7

type Mode = 'free' | 'lock' | 'play' | 'drag' | 'hidden'

/**
 * Focus-reticle cursor. Four AF brackets follow the pointer, lock onto anything pressable,
 * and become a play control over video. Off for touch and reduced motion.
 */
export default function Reticle() {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!finePointer || reducedMotion || !root.current) return
    const el = root.current
    const corners = Array.from(el.querySelectorAll<HTMLElement>('.ret-c'))
    const dot = el.querySelector<HTMLElement>('.ret-dot')!
    const label = el.querySelector<HTMLElement>('.ret-label')!
    document.documentElement.classList.add('has-reticle')

    const qx = corners.map((c) => gsap.quickTo(c, 'x', { duration: 0.32, ease: 'power3.out' }))
    const qy = corners.map((c) => gsap.quickTo(c, 'y', { duration: 0.32, ease: 'power3.out' }))
    const dx = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3.out' })
    const dy = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3.out' })
    const lx = gsap.quickTo(label, 'x', { duration: 0.4, ease: 'power3.out' })
    const ly = gsap.quickTo(label, 'y', { duration: 0.4, ease: 'power3.out' })

    let mx = -100
    let my = -100
    let mode: Mode = 'free'
    let target: HTMLElement | null = null
    let down = false
    let raf = 0

    const setMode = (m: Mode, text = '') => {
      if (m !== mode) {
        el.dataset.mode = m
        mode = m
      }
      label.textContent = text
    }

    const place = () => {
      let l: number, t: number, r: number, b: number
      if (mode === 'lock' && target) {
        const rect = target.getBoundingClientRect()
        const pad = down ? PAD - 3 : PAD
        l = rect.left - pad
        t = rect.top - pad
        r = rect.right + pad
        b = rect.bottom + pad
      } else {
        const half = (mode === 'play' ? 44 : mode === 'drag' ? 34 : BOX / 2) - (down ? 4 : 0)
        l = mx - half
        t = my - half
        r = mx + half
        b = my + half
      }
      qx[0](l); qy[0](t)
      qx[1](r - C); qy[1](t)
      qx[2](l); qy[2](b - C)
      qx[3](r - C); qy[3](b - C)
      dx(mx); dy(my)
      if (mode === 'lock' && target) {
        lx(l); ly(b + 8)
      } else {
        lx(mx + 22); ly(my + 26)
      }
    }

    const loop = () => {
      place()
      raf = requestAnimationFrame(loop)
    }

    const resolve = (node: EventTarget | null) => {
      const hit = node instanceof Element ? (node.closest(INTERACTIVE) as HTMLElement | null) : null
      target = hit
      if (!hit) return setMode('free')
      const kind = hit.dataset.cursor
      const text = hit.dataset.cursorLabel ?? ''
      if (kind === 'play') return setMode('play', text || 'Play')
      if (kind === 'drag') return setMode('drag', text || 'Drag')
      if (kind === 'hide') return setMode('hidden')
      if (hit.closest('[aria-disabled="true"]')) return setMode('free')
      return setMode('lock', text)
    }

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      mx = e.clientX
      my = e.clientY
      el.classList.add('is-on')
    }
    const onOver = (e: PointerEvent) => resolve(e.target)
    const onDown = () => {
      down = true
      el.classList.add('is-down')
    }
    const onUp = () => {
      down = false
      el.classList.remove('is-down')
    }
    const onLeave = () => el.classList.remove('is-on')
    // Re-resolve after scroll: the element under a still pointer changes.
    const onScroll = () => {
      const under = document.elementFromPoint(mx, my)
      resolve(under)
    }
    // Labels on elements can change while hovered (play -> pause).
    const mo = new MutationObserver(() => target && resolve(target))
    mo.observe(document.body, { subtree: true, attributes: true, attributeFilter: ['data-cursor-label', 'data-cursor'] })

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerover', onOver, { passive: true })
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    document.documentElement.addEventListener('pointerleave', onLeave)
    window.addEventListener('scroll', onScroll, { passive: true })
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      mo.disconnect()
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerover', onOver)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('scroll', onScroll)
      document.documentElement.classList.remove('has-reticle')
    }
  }, [])

  if (!finePointer || reducedMotion) return null

  return (
    <div ref={root} className="reticle" data-mode="free" aria-hidden="true">
      <span className="ret-c tl" />
      <span className="ret-c tr" />
      <span className="ret-c bl" />
      <span className="ret-c br" />
      <span className="ret-dot">
        <svg className="ret-play" viewBox="0 0 24 24" width="22" height="22">
          <path d="M8 5.5v13l10.5-6.5z" fill="currentColor" />
        </svg>
        <span className="ret-drag">
          <i />
          <i />
        </span>
      </span>
      <span className="ret-label t-mono" />
    </div>
  )
}
