import { useRef } from 'react'
import { LightningIcon } from '@phosphor-icons/react'
import { dongfeng as d } from '../data/content'
import Counter from '../components/Counter'
import ReelFeed from '../components/ReelFeed'
import { ScrollTrigger, gsap, reducedMotion, useGSAP } from '../lib/motion'
import './dongfeng.css'

// Wheel hubs on the side-view render (680 x 280), used to place the spinning rims.
const RIM = 88 / 680

function Car({ className = '' }: { className?: string }) {
  return (
    <div className={`df-car ${className}`}>
      <img className="df-car-body" src="/media/img/dongfeng-box-side.webp" alt="" width={680} height={280} />
      <img className="df-rim df-rim-f" src="/media/img/dongfeng-rim-front.png" alt="" />
      <img className="df-rim df-rim-r" src="/media/img/dongfeng-rim-rear.png" alt="" />
      <span className="df-car-shadow" />
    </div>
  )
}

// Callouts: an anchor on the side-view car (680 x 280 space) and where its leader line ends.
const anchors = [
  { x: 310, y: 58, tx: 500, ty: -70 }, // cabin: infotainment
  { x: 40, y: 128, tx: 150, ty: -70 }, // headlight: feature-forward
  { x: 648, y: 104, tx: 530, ty: 370 }, // tail: multi-platform
  { x: 110, y: 219, tx: 150, ty: 370 }, // front wheel: running costs
]

export default function Dongfeng() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const el = root.current!
      if (reducedMotion) return

      // ---------- 1. the drive-in wipe ----------
      const stage = el.querySelector<HTMLElement>('.df-drive')!
      const car = stage.querySelector<HTMLElement>('.df-car')!
      const rims = stage.querySelectorAll<HTMLElement>('.df-rim')
      const wipe = stage.querySelector<HTMLElement>('.df-wipe')!
      const streaks = stage.querySelector<HTMLElement>('.df-streaks')!

      let vw = window.innerWidth
      let cw = car.offsetWidth
      const measure = () => {
        vw = window.innerWidth
        cw = car.offsetWidth
      }
      const drive = (p: number) => {
        // car travels from beyond the right edge to beyond the left edge
        const t = Math.min(1, p / 0.46)
        const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
        const x = vw + 40 - eased * (vw + cw + 80)
        car.style.transform = `translate3d(${x}px, 0, 0)`
        const r = (RIM * cw) / 2
        const deg = (-(vw + 40 - x) / r) * (180 / Math.PI)
        rims.forEach((rim) => (rim.style.transform = `rotate(${deg}deg)`))
        const rear = Math.max(0, x + cw * 0.9)
        wipe.style.clipPath = `inset(0 0 0 ${Math.min(vw, rear)}px)`
        streaks.style.transform = `translate3d(${x + cw * 0.85}px, 0, 0)`
        streaks.style.opacity = t > 0 && t < 1 ? '1' : '0'
      }
      drive(0)

      const intro = gsap.timeline({ paused: true })
      intro
        .from('.df-title-card > *', { y: 60, opacity: 0, stagger: 0.07, duration: 0.5, ease: 'power3.out' }, 0)
        .from('.df-front', { xPercent: 45, opacity: 0, duration: 0.8, ease: 'power3.out' }, 0.15)
        .from('.df-drive-meta', { opacity: 0, duration: 0.4 }, 0.4)

      ScrollTrigger.create({
        trigger: stage,
        start: 'top top',
        end: () => `+=${window.innerHeight * 2.1}`,
        pin: true,
        scrub: true,
        onRefresh: () => {
          measure()
        },
        onUpdate: (self) => {
          drive(self.progress)
          const q = Math.min(1, Math.max(0, (self.progress - 0.42) / 0.48))
          intro.progress(q)
          // rim motion blur at speed
          const v = Math.min(8, Math.abs(self.getVelocity()) / 400)
          rims.forEach((rim) => (rim.style.filter = `blur(${v * 0.5}px)`))
        },
      })

      // ---------- 2. battery charge ----------
      gsap.fromTo(
        '.df-charge-fill',
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: { trigger: '.df-battery', start: 'top 80%', end: 'bottom 40%', scrub: 0.5 },
        },
      )
      ScrollTrigger.create({
        trigger: '.df-battery',
        start: 'top 80%',
        end: 'bottom 40%',
        onUpdate: (self) => {
          const pct = el.querySelector('.df-pct')
          if (pct) pct.textContent = `${Math.round(self.progress * 100)}%`
        },
      })

      // ---------- 3. spec sheet rows ----------
      gsap.utils.toArray<HTMLElement>('.df-spec li').forEach((row) => {
        gsap.from(row.children, {
          y: 30,
          opacity: 0,
          stagger: 0.06,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: row, start: 'top 85%' },
        })
        gsap.from(row.querySelector('.df-x'), {
          scale: 0,
          rotate: -90,
          duration: 0.6,
          ease: 'back.out(2)',
          scrollTrigger: { trigger: row, start: 'top 80%' },
        })
      })

      // ---------- 4. the Box parks, callouts draw ----------
      const park = gsap.timeline({ scrollTrigger: { trigger: '.df-strat-stage', start: 'top 75%', end: 'center 45%', scrub: 0.6 } })
      const parkCar = el.querySelector<HTMLElement>('.df-strat-stage .df-car')!
      const parkRims = parkCar.querySelectorAll('.df-rim')
      park
        .fromTo(parkCar, { xPercent: 70, opacity: 0 }, { xPercent: 0, opacity: 1, ease: 'power2.out', duration: 1 }, 0)
        .fromTo(parkRims, { rotate: 400 }, { rotate: 0, ease: 'power2.out', duration: 1 }, 0)
        .fromTo('.df-callout-line', { strokeDashoffset: 1 }, { strokeDashoffset: 0, stagger: 0.12, duration: 0.5 }, 0.7)
        .fromTo('.df-callout', { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.12, duration: 0.5 }, 0.8)
        .fromTo('.df-dot', { scale: 0 }, { scale: 1, stagger: 0.12, duration: 0.3 }, 0.7)

      // ---------- 5. results ----------
      gsap.from('.df-bar i', {
        scaleX: 0,
        duration: 1.6,
        stagger: 0.12,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.df-bars', start: 'top 80%' },
      })
      const units = gsap.utils.toArray<HTMLElement>('.df-unit.is-new')
      gsap.fromTo(
        units,
        { backgroundColor: 'rgba(255,255,255,0.08)', scale: 0.6 },
        {
          backgroundColor: '#cdeb35',
          scale: 1,
          stagger: 0.03,
          ease: 'back.out(3)',
          duration: 0.4,
          scrollTrigger: { trigger: '.df-units', start: 'top 75%' },
        },
      )
    },
    { scope: root },
  )

  const totalUnits = d.sales.after

  return (
    <section id="dongfeng" ref={root} className="df" aria-labelledby="df-title">
      {/* 1. drive-in title */}
      <div className="df-drive">
        <div className="df-wipe">
          <div className="df-title-card wrap">
            <p className="df-brand">
              <img src="/media/logos/dongfeng-emblem.png" alt="" width={76} height={77} />
              <img src="/media/logos/dongfeng-wordmark.png" alt="Dongfeng" width={605} height={70} />
            </p>
            <h2 id="df-title" className="df-h1">
              {d.title}
            </h2>
            <p className="t-lead df-summary">{d.summary}</p>
          </div>
          <img className="df-front" src="/media/img/dongfeng-box-front.webp" alt="The lime-green Dongfeng Box EV" width={860} height={652} />
          <p className="df-drive-meta t-mono wrap">
            <span>Client: {d.client}</span>
            <span>{d.period}</span>
            <span>{d.platforms.join(' / ')}</span>
          </p>
        </div>
        <div className="df-streaks" aria-hidden="true">
          {Array.from({ length: 7 }, (_, i) => (
            <i key={i} style={{ ['--k' as string]: i }} />
          ))}
        </div>
        <Car />
      </div>

      <div className="df-body">
        {/* 2. battery */}
        <div className="wrap df-charge-wrap">
          <div className="df-battery">
            <div className="df-charge-fill" />
            <ul className="df-cells">
              {d.charge.map((c) => (
                <li key={c.label}>
                  <Counter className="df-num" value={c.value} decimals={c.decimals} prefix={c.prefix} suffix={c.suffix} />
                  <span className="df-lbl">{c.label}</span>
                </li>
              ))}
            </ul>
            <span className="df-nub" />
          </div>
          <p className="df-charge-read t-mono">
            <LightningIcon size={14} weight="fill" /> Charging <span className="df-pct">0%</span>
          </p>
        </div>

        {/* 3. challenge as a spec sheet */}
        <div className="wrap df-challenge">
          <h3 className="t-h2 df-h2">{d.challengeTitle}</h3>
          <ul className="df-spec">
            {d.challenges.map((c) => (
              <li key={c.title}>
                <span className="df-x" aria-hidden="true" />
                <h4 className="t-h3">{c.title}</h4>
                <p className="t-body">{c.body}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* 4. strategy: the Box parks, pillars call out */}
        <div className="wrap df-strategy">
          <div className="df-strat-copy">
            <h3 className="t-h2 df-h2">{d.strategyTitle}</h3>
            <p className="t-lead df-strat-body">{d.strategyBody}</p>
          </div>
          <div className="df-strat-stage">
            <div className="df-strat-car">
              <Car />
              <svg className="df-lines" viewBox="0 0 680 280" preserveAspectRatio="none" aria-hidden="true">
                {anchors.map((a, i) => (
                  <path key={i} className="df-callout-line" d={`M${a.x} ${a.y} L${a.tx} ${a.ty}`} pathLength={1} />
                ))}
              </svg>
              {anchors.map((a, i) => (
                <span key={i} className="df-dot" style={{ left: `${(a.x / 680) * 100}%`, top: `${(a.y / 280) * 100}%` }} />
              ))}
            </div>
            <ul className="df-callouts">
              {d.pillars.map((p, i) => (
                <li key={p.title} className={`df-callout df-c${i}`}>
                  <h4 className="t-h3">{p.title}</h4>
                  <p className="t-body">{p.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 5. results */}
        <div className="wrap df-results">
          <div className="df-res-head">
            <p className="df-big">
              <Counter value={54.6} decimals={1} suffix="M+" />
            </p>
            <p className="t-lead">
              views across all platforms in 12 months, June 2025 to May 2026.
            </p>
          </div>

          <div className="df-res-grid">
            <div className="df-bars">
              <p className="t-mono df-cap">Views by platform</p>
              {d.platformViews.map((p) => (
                <div key={p.name} className="df-bar">
                  <span className="df-bar-name">{p.name}</span>
                  <span className="df-bar-track">
                    <i style={{ width: `${(p.value / d.platformViews[0].value) * 100}%` }} />
                  </span>
                  <span className="df-bar-val">{p.value}M</span>
                </div>
              ))}
              <dl className="df-extra">
                {d.extra.map((x) => (
                  <div key={x.label}>
                    <dt>
                      <Counter value={x.value} decimals={x.decimals} suffix={x.suffix} />
                    </dt>
                    <dd>{x.label}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="df-sales">
              <p className="t-mono df-cap">Average vehicles sold per month</p>
              <div className="df-units" aria-label={`${d.sales.before} per month in ${d.sales.beforeLabel}, ${d.sales.after} per month in ${d.sales.afterLabel}`}>
                {Array.from({ length: totalUnits }, (_, i) => (
                  <span key={i} className={`df-unit${i < d.sales.before ? ' is-old' : ' is-new'}`} />
                ))}
              </div>
              <div className="df-sales-legend">
                <p>
                  <b>{d.sales.before}</b>
                  <span>{d.sales.beforeLabel}</span>
                </p>
                <p>
                  <b className="is-lime">{d.sales.after}</b>
                  <span>{d.sales.afterLabel}</span>
                </p>
              </div>
              <p className="df-growth">
                <Counter value={200} prefix="+" suffix="%" />
              </p>
              <p className="t-body df-goal">
                Monthly sales tripled, tracking toward the {d.sales.goal}-unit Year 1 goal. Real, verifiable progress from a
                harder starting position, in the most price-sensitive, comparison-driven segment.
              </p>
            </div>
          </div>
        </div>

        {/* 6. reels */}
        <div className="wrap df-reels">
          <ReelFeed reels={d.reels} handle="Dongfeng Sri Lanka" accent="#CDEB35" />
        </div>
      </div>
    </section>
  )
}
