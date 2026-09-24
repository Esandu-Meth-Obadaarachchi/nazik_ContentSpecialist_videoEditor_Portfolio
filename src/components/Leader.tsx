import { useEffect, useRef, useState } from 'react'
import { gsap, lockScroll, reducedMotion } from '../lib/motion'
import './leader.css'

const KEY = 'nh-leader-seen'

function seen() {
  try {
    return sessionStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}

/** Academy-leader countdown that splits open onto the hero. */
export default function Leader({ onDone }: { onDone: () => void }) {
  const [show] = useState(() => !reducedMotion && !seen())
  const root = useRef<HTMLDivElement>(null)
  const tl = useRef<gsap.core.Timeline | null>(null)

  useEffect(() => {
    if (!show) {
      onDone()
      return
    }
    lockScroll(true)
    const el = root.current!
    const num = el.querySelector('.ld-num') as HTMLElement
    const sweep = { a: 0 }
    const t = gsap.timeline({
      delay: 0.25,
      onComplete: () => {
        try {
          sessionStorage.setItem(KEY, '1')
        } catch {
          /* private mode */
        }
        lockScroll(false)
        el.style.display = 'none'
      },
    })
    tl.current = t
    ;[3, 2, 1].forEach((n, i) => {
      t.call(() => {
        num.textContent = String(n)
      }, [], i * 0.62)
      t.fromTo(
        sweep,
        { a: 0 },
        {
          a: 360,
          duration: 0.62,
          ease: 'none',
          onUpdate: () => el.style.setProperty('--sweep', `${sweep.a}deg`),
        },
        i * 0.62,
      )
    })
    t.set(el, { '--flash': 1 } as gsap.TweenVars, '+=0')
      .call(() => onDone())
      .set(el, { '--flash': 0 } as gsap.TweenVars, '+=0.06')
      .to('.ld-core', { opacity: 0, duration: 0.15 }, '<')
      .to('.ld-top', { yPercent: -100, duration: 1.05, ease: 'expo.inOut' }, '<')
      .to('.ld-bot', { yPercent: 100, duration: 1.05, ease: 'expo.inOut' }, '<')

    return () => {
      t.kill()
      lockScroll(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!show) return null

  return (
    <div ref={root} className="leader" aria-hidden="true">
      <div className="ld-top" />
      <div className="ld-bot" />
      <div className="ld-core">
        <div className="ld-ring" />
        <div className="ld-ring ld-ring-2" />
        <span className="ld-cross-h" />
        <span className="ld-cross-v" />
        <span className="ld-num">3</span>
        <span className="ld-meta t-mono">Nazik Hamza · Portfolio</span>
      </div>
      <button className="ld-skip t-mono" onClick={() => tl.current?.progress(0.999)}>
        Skip intro
      </button>
    </div>
  )
}
