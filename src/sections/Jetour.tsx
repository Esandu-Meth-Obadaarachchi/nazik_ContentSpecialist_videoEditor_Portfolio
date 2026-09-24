import { useRef } from 'react'
import { jetour as j } from '../data/content'
import Counter from '../components/Counter'
import ReelFeed from '../components/ReelFeed'
import { ScrollTrigger, finePointer, gsap, reducedMotion, useGSAP } from '../lib/motion'
import './jetour.css'

// Speedometer geometry: 0-200 units/month across a 240 degree sweep.
const G_MAX = 200
const G_START = -120
const G_SWEEP = 240
const angleFor = (v: number) => G_START + (v / G_MAX) * G_SWEEP

function Gauge() {
  const ticks = Array.from({ length: 41 }, (_, i) => i * 5)
  return (
    <svg className="jt-gauge-svg" viewBox="-160 -160 320 320" aria-hidden="true">
      <circle r="150" className="g-ring" />
      <path className="g-arc" d={describeArc(0, 0, 132, G_START, G_START + G_SWEEP)} pathLength={1} />
      <path className="g-arc-live" d={describeArc(0, 0, 132, angleFor(50), angleFor(150))} pathLength={1} />
      {ticks.map((t) => {
        const a = ((angleFor(t) - 90) * Math.PI) / 180
        const major = t % 50 === 0
        const r1 = major ? 112 : t % 10 === 0 ? 118 : 122
        return (
          <line
            key={t}
            x1={Math.cos(a) * r1}
            y1={Math.sin(a) * r1}
            x2={Math.cos(a) * 128}
            y2={Math.sin(a) * 128}
            className={major ? 'g-tick g-major' : 'g-tick'}
          />
        )
      })}
      {[0, 50, 100, 150, 200].map((t) => {
        const a = ((angleFor(t) - 90) * Math.PI) / 180
        return (
          <text key={t} x={Math.cos(a) * 94} y={Math.sin(a) * 94 + 5} className="g-num">
            {t}
          </text>
        )
      })}
      <g className="g-needle" style={{ transform: `rotate(${angleFor(50)}deg)` }}>
        <path d="M-3 12 L0 -124 L3 12 Z" />
      </g>
      <circle r="11" className="g-hub" />
    </svg>
  )
}

function describeArc(cx: number, cy: number, r: number, a0: number, a1: number) {
  const p = (a: number) => {
    const rad = ((a - 90) * Math.PI) / 180
    return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)]
  }
  const [x0, y0] = p(a0)
  const [x1, y1] = p(a1)
  const large = a1 - a0 > 180 ? 1 : 0
  return `M${x0} ${y0} A${r} ${r} 0 ${large} 1 ${x1} ${y1}`
}

const HEADLINE = 'MADE IN CHINA'

export default function Jetour() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const el = root.current!
      const scene = el.querySelector<HTMLElement>('.jt-scene')!

      // flashlight follows the cursor through the dark
      if (finePointer && !reducedMotion) {
        const qx = gsap.quickTo(scene, '--mx', { duration: 0.6, ease: 'power3.out' })
        const qy = gsap.quickTo(scene, '--my', { duration: 0.6, ease: 'power3.out' })
        const move = (e: PointerEvent) => {
          const r = scene.getBoundingClientRect()
          qx(((e.clientX - r.left) / r.width) * 100)
          qy(((e.clientY - r.top) / r.height) * 100)
        }
        scene.addEventListener('pointermove', move)
      }
      if (reducedMotion) {
        scene.style.setProperty('--ignite', '1')
        return
      }

      // ignition: scrubbed across the pinned scene
      const letters = gsap.utils.toArray<HTMLElement>('.jt-led')
      const ign = gsap.timeline({ paused: true })
      ign
        .to(scene, { '--ignite': 1, duration: 1, ease: 'power2.in' } as gsap.TweenVars, 0.25)
        .fromTo('.jt-flare', { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'expo.out' }, 0.95)
        .fromTo('.jt-grille-sweep', { xPercent: -120 }, { xPercent: 260, duration: 0.9, ease: 'power1.inOut' }, 0.7)
        .to(letters, { color: '#f4f6ff', textShadow: '0 0 18px rgba(200,210,255,0.85), 0 0 60px rgba(160,170,255,0.4)', stagger: 0.07, duration: 0.2 }, 0.9)
        .fromTo('.jt-after', { opacity: 0, y: 30 }, { opacity: 1, y: 0, stagger: 0.12, duration: 0.5 }, 1.9)

      ScrollTrigger.create({
        trigger: scene,
        start: 'top top',
        end: () => `+=${window.innerHeight * 1.7}`,
        pin: true,
        scrub: true,
        onUpdate: (self) => ign.progress(self.progress),
      })

      // problem banner parallax
      gsap.fromTo('.jt-wheels img', { yPercent: -12, scale: 1.15 }, { yPercent: 12, scale: 1.05, ease: 'none', scrollTrigger: { trigger: '.jt-wheels', scrub: true } })

      gsap.from('.jt-pillar', {
        y: 50,
        opacity: 0,
        stagger: 0.1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.jt-pillars', start: 'top 80%' },
      })

      // results
      gsap.from('.jt-bar i', {
        scaleX: 0,
        duration: 1.6,
        stagger: 0.12,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.jt-bars', start: 'top 80%' },
      })
      const needle = el.querySelector('.g-needle')
      const live = el.querySelector('.g-arc-live')
      const read = el.querySelector('.jt-gauge-read b')
      const obj = { v: 50 }
      gsap.fromTo(live, { strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: '.jt-gauge', start: 'top 70%', end: 'center 45%', scrub: 0.8 } })
      gsap.to(obj, {
        v: 150,
        ease: 'none',
        scrollTrigger: { trigger: '.jt-gauge', start: 'top 70%', end: 'center 45%', scrub: 0.8 },
        onUpdate: () => {
          gsap.set(needle, { rotate: angleFor(obj.v), svgOrigin: '0 0' })
          if (read) read.textContent = String(Math.round(obj.v))
        },
      })
    },
    { scope: root },
  )

  return (
    <section id="jetour" ref={root} className="jt" aria-labelledby="jt-title">
      {/* 1. ignition */}
      <div className="jt-scene" style={{ ['--mx' as string]: 72, ['--my' as string]: 42, ['--ignite' as string]: 0 }}>
        <div className="jt-car">
          <img src="/media/img/jetour-t2-front.webp" alt="The front of a Jetour T2 in the dark, headlights on" width={1120} height={1080} />
          <span className="jt-grille-sweep" aria-hidden="true" />
          <span className="jt-flare jt-flare-r" aria-hidden="true" />
          <span className="jt-flare jt-flare-l" aria-hidden="true" />
        </div>
        <div className="jt-dark" aria-hidden="true" />

        <div className="jt-copy wrap">
          <img className="jt-logo" src="/media/logos/jetour.png" alt="Jetour, Drive Your Future" width={430} height={90} />
          <h2 id="jt-title" className="jt-h1" aria-label="Made in China">
            {HEADLINE.split(' ').map((w, wi) => (
              <span key={wi} className="jt-word" aria-hidden="true">
                {w.split('').map((c, ci) => (
                  <span key={ci} className="jt-led">
                    {c}
                  </span>
                ))}
              </span>
            ))}
          </h2>
          <p className="jt-after jt-views">
            <b>62.9M+ views</b>
            <span>combined across all platforms, {j.period}</span>
          </p>
          <p className="jt-after t-lead jt-sum">{j.summary}</p>
        </div>
      </div>

      {/* 2. the problem */}
      <div className="jt-body">
        <figure className="jt-wheels">
          <img src="/media/img/jetour-wheels.webp" alt="" loading="lazy" />
          <figcaption className="wrap t-h2">{j.challengeLead}</figcaption>
        </figure>

        <ul className="wrap jt-pillars">
          {j.pillars.map((p) => (
            <li key={p.title} className="jt-pillar">
              <h4 className="t-h3">{p.title}</h4>
              <p className="t-body">{p.body}</p>
            </li>
          ))}
        </ul>

        {/* 3. results */}
        <div className="wrap jt-results">
          <div className="jt-res-head">
            <p className="jt-big">
              <Counter value={62.9} decimals={1} suffix="M+" />
            </p>
            <p className="t-lead">views across all platforms in 12 months. Pages launched from zero followers.</p>
          </div>

          <div className="jt-res-grid">
            <div className="jt-bars">
              {j.platformViews.map((p) => (
                <div key={p.name} className="jt-bar">
                  <span>{p.name}</span>
                  <span className="jt-bar-track">
                    <i style={{ width: `${(p.value / j.platformViews[0].value) * 100}%` }} />
                  </span>
                  <span className="t-mono">{p.value}M</span>
                </div>
              ))}
              <dl className="jt-stats">
                {j.stats.map((s) => (
                  <div key={s.label}>
                    <dt>
                      <Counter value={s.value} decimals={s.decimals} suffix={s.suffix} />
                    </dt>
                    <dd>{s.label}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="jt-gauge">
              <p className="t-mono jt-cap">Average vehicles sold per month</p>
              <div className="jt-gauge-dial">
                <Gauge />
                <p className="jt-gauge-read">
                  <b>50</b>
                  <span className="t-mono">units / month</span>
                </p>
              </div>
              <div className="jt-gauge-legend t-mono">
                <span>
                  {j.sales.beforeLabel}: <b>{j.sales.before}</b>
                </span>
                <span>
                  {j.sales.afterLabel}: <b>{j.sales.after}</b>
                </span>
              </div>
            </div>
          </div>

          <div className="jt-leads">
            <p className="jt-growth">+200%</p>
            <div>
              <p className="jt-leads-big">
                <Counter value={j.leads.total} /> direct calls and leads.
              </p>
              <p className="t-body">
                {j.leads.calls.toLocaleString('en-US')} calls and {j.leads.leads} leads from dedicated paid call and lead-gen
                campaigns: a measurable purchase-intent channel that excludes every organically generated contact. Tracking
                toward the {j.sales.goal.toLocaleString('en-US')}-SUV Year 1 goal with 8 months of the campaign still ahead.
              </p>
            </div>
          </div>
        </div>

        {/* 4. reels */}
        <div className="wrap jt-reels">
          <ReelFeed reels={j.reels} handle="Jetour Sri Lanka" accent="#B3B5DC" />
        </div>
      </div>
    </section>
  )
}
