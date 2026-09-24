import { useRef } from 'react'
import { timekeeper as t } from '../data/content'
import { PhoneFrame, ReelScreen } from '../components/Phone'
import Counter from '../components/Counter'
import { compact, platformLabel, totalViews } from '../lib/format'
import { gsap, reducedMotion, useGSAP } from '../lib/motion'
import './timekeeper.css'

function Dial() {
  return (
    <svg className="tk-dial" viewBox="-200 -200 400 400" aria-hidden="true">
      <circle r="196" className="d-outer" />
      <circle r="176" className="d-inner" />
      {Array.from({ length: 60 }, (_, i) => {
        const a = (i * 6 * Math.PI) / 180
        const hour = i % 5 === 0
        const r1 = hour ? 146 : 162
        return (
          <line
            key={i}
            x1={Math.sin(a) * r1}
            y1={-Math.cos(a) * r1}
            x2={Math.sin(a) * 170}
            y2={-Math.cos(a) * 170}
            className={hour ? 'd-hour' : 'd-min'}
          />
        )
      })}
      <g className="tk-hand-h">
        <path d="M-5 16 L-2.5 -92 L0 -100 L2.5 -92 L5 16 Z" />
      </g>
      <g className="tk-hand-m">
        <path d="M-3.5 20 L-1.5 -140 L0 -150 L1.5 -140 L3.5 20 Z" />
      </g>
      <circle r="7" className="d-hub" />
    </svg>
  )
}

export default function Timekeeper() {
  const root = useRef<HTMLElement>(null)
  const sum = t.reels.reduce((n, r) => n + totalViews(r.views), 0)

  useGSAP(
    () => {
      if (reducedMotion) {
        root.current?.style.setProperty('--a', '360deg')
        root.current?.style.setProperty('--p', '1')
        return
      }
      // clock wipe in
      gsap.fromTo(
        root.current,
        { '--a': '0deg', '--p': 0 } as gsap.TweenVars,
        {
          '--a': '360deg',
          '--p': 1,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top 88%', end: 'top 8%', scrub: true },
        } as gsap.TweenVars,
      )
      // hands follow the scroll through the section
      gsap.fromTo('.tk-hand-m', { rotate: -60 }, { rotate: 300, svgOrigin: '0 0', ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: 0.4 } })
      gsap.fromTo('.tk-hand-h', { rotate: 150 }, { rotate: 180, svgOrigin: '0 0', ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: 0.4 } })
      gsap.from('.tk-head > *', {
        y: 50,
        opacity: 0,
        stagger: 0.1,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.tk-head', start: 'top 75%' },
      })
      gsap.from('.tk-item', {
        y: 120,
        opacity: 0,
        stagger: 0.12,
        duration: 1.3,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.tk-row', start: 'top 80%' },
      })
    },
    { scope: root },
  )

  return (
    <section id="timekeeper" ref={root} className="tk" aria-labelledby="tk-title">
      <div className="tk-sweep" aria-hidden="true" />
      <div className="tk-face">
        <div className="wrap tk-inner">
          <header className="tk-head">
            <img className="tk-logo" src="/media/logos/timekeeper-gold.png" alt="Timekeeper" width={268} height={279} />
            <h2 id="tk-title" className="tk-h1">
              {t.title}
            </h2>
            <p className="t-lead tk-sum">{t.summary}</p>
            <p className="tk-total">
              <Counter value={sum / 1_000_000} decimals={1} suffix="M" />
              <span>views from three reels</span>
            </p>
          </header>

          <div className="tk-stage">
            <Dial />
            <ul className="tk-row">
              {t.reels.map((r, i) => (
                <li key={r.id} className={`tk-item tk-item-${i}`}>
                  <PhoneFrame className="tk-phone">
                    <ReelScreen reel={r} handle="Timekeeper" hoverPreview showCaption={false} />
                  </PhoneFrame>
                  <div className="tk-meta">
                    <p className="tk-views">{compact(totalViews(r.views))}</p>
                    <p className="tk-hook">{r.hook}</p>
                    {r.views && (
                      <p className="tk-split t-mono">
                        <span>IG {platformLabel(r.views, 'ig')}</span>
                        <span>FB {platformLabel(r.views, 'fb')}</span>
                        <span>TT {platformLabel(r.views, 'tt')}</span>
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
