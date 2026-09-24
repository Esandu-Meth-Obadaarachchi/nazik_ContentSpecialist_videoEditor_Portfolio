import { useMemo, useRef, useState } from 'react'
import { ArrowUpRightIcon, CaretDownIcon, CaretUpIcon } from '@phosphor-icons/react'
import type { Reel } from '../data/content'
import { compact, platformLabel, totalViews } from '../lib/format'
import { gsap, reducedMotion, useGSAP } from '../lib/motion'
import { PhoneFrame, ReelScreen } from './Phone'
import './reelfeed.css'

type Props = {
  reels: Reel[]
  handle: string
  accent: string
  title?: string
  intro?: string
}

/** One phone you flick through like a feed, beside an index of every reel ranked by reach. */
export default function ReelFeed({ reels: input, handle, accent, title = 'Organic wins', intro }: Props) {
  const reels = useMemo(() => [...input].sort((a, b) => totalViews(b.views) - totalViews(a.views)), [input])
  const [idx, setIdx] = useState(0)
  const stack = useRef<HTMLDivElement>(null)
  const root = useRef<HTMLDivElement>(null)
  const touch = useRef<{ x: number; y: number } | null>(null)
  const sum = reels.reduce((n, r) => n + totalViews(r.views), 0)

  const go = (i: number) => setIdx((i + reels.length) % reels.length)

  useGSAP(
    () => {
      gsap.to(stack.current, { yPercent: -100 * idx, duration: reducedMotion ? 0 : 0.75, ease: 'expo.out' })
    },
    { dependencies: [idx], scope: root },
  )

  useGSAP(
    () => {
      if (reducedMotion) return
      gsap.from('.feed-index li', {
        x: 40,
        opacity: 0,
        stagger: 0.05,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: root.current, start: 'top 70%' },
      })
      gsap.from('.feed-stage', {
        y: 80,
        rotate: -3,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: { trigger: root.current, start: 'top 75%' },
      })
    },
    { scope: root },
  )

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault()
      go(idx + 1)
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault()
      go(idx - 1)
    }
  }

  return (
    <div ref={root} className="feed" style={{ ['--reel-accent' as string]: accent }}>
      <header className="feed-head">
        <h3 className="t-h2 feed-title">{title}</h3>
        <p className="t-body feed-intro">
          {intro ?? 'A selection of organic, high-performing videos I scripted, directed and brought to life.'}
        </p>
        <p className="feed-sum t-mono">
          <strong>{compact(sum)}</strong> views from {reels.length} reels
        </p>
      </header>

      <div className="feed-body">
        <div
          className="feed-stage"
          onKeyDown={onKey}
          onTouchStart={(e) => (touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY })}
          onTouchEnd={(e) => {
            if (!touch.current) return
            const dx = e.changedTouches[0].clientX - touch.current.x
            const dy = e.changedTouches[0].clientY - touch.current.y
            if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(idx + (dx < 0 ? 1 : -1))
            touch.current = null
          }}
        >
          <PhoneFrame className="feed-phone">
            <div ref={stack} className="feed-stack">
              {reels.map((r, i) => (
                <div key={r.id} className="feed-slide" style={{ top: `${i * 100}%` }} aria-hidden={i !== idx}>
                  <ReelScreen reel={r} handle={handle} live={i === idx} autoPlay={i === idx} />

                </div>
              ))}
            </div>
          </PhoneFrame>

          <div className="feed-nav">
            <button onClick={() => go(idx - 1)} aria-label="Previous reel">
              <CaretUpIcon size={18} weight="bold" />
            </button>
            <span className="t-mono" aria-live="polite">
              {String(idx + 1).padStart(2, '0')}
              <i>/</i>
              {String(reels.length).padStart(2, '0')}
            </span>
            <button onClick={() => go(idx + 1)} aria-label="Next reel">
              <CaretDownIcon size={18} weight="bold" />
            </button>
          </div>
        </div>

        <ol className="feed-index" aria-label="Reels">
          {reels.map((r, i) => (
            <li key={r.id}>
              <button
                className={`fi${i === idx ? ' is-on' : ''}`}
                onClick={() => go(i)}
                aria-current={i === idx ? 'true' : undefined}
              >
                <span className="fi-views">{compact(totalViews(r.views))}</span>
                <span className="fi-text">
                  <span className="fi-hook">{r.hook}</span>
                  {r.original && (
                    <span className="fi-si t-si" lang="si">
                      {r.original}
                    </span>
                  )}
                  {r.views && (
                    <span className="fi-split t-mono">
                      <span>IG {platformLabel(r.views, 'ig')}</span>
                      <span>FB {platformLabel(r.views, 'fb')}</span>
                      <span>TT {platformLabel(r.views, 'tt')}</span>
                    </span>
                  )}
                </span>
              </button>
              <a className="fi-link" href={r.url} target="_blank" rel="noreferrer" aria-label={`Open original post: ${r.hook}`}>
                <ArrowUpRightIcon size={16} weight="bold" />
              </a>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
