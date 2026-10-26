import { useRef } from 'react'
import { perodua as p } from '../data/content'
import Counter from '../components/Counter'
import ReelFeed from '../components/ReelFeed'
import ShowroomCeiling, { type CeilingHandle } from '../components/ShowroomCeiling'
import { compact, totalViews } from '../lib/format'
import { ScrollTrigger, gsap, reducedMotion, useGSAP } from '../lib/motion'
import './perodua.css'

export default function Perodua() {
  const root = useRef<HTMLElement>(null)
  const ceiling = useRef<CeilingHandle>(null)
  const top = [...p.reels].sort((a, b) => totalViews(b.views) - totalViews(a.views))[0]
  const avg = Math.round((p.sticker.views * 1000) / p.sticker.reels)

  useGSAP(
    () => {
      const el = root.current!
      const scene = el.querySelector<HTMLElement>('.pd-open')!
      if (reducedMotion) {
        ceiling.current?.set(1)
        return
      }

      const title = gsap.timeline({ paused: true })
      title
        .from('.pd-title > *', { y: 40, opacity: 0, stagger: 0.08, duration: 0.5, ease: 'power3.out' }, 0)
        .from('.pd-meta', { opacity: 0, duration: 0.4 }, 0.3)

      // Lights come on row by row from the front of the showroom to the back wall.
      ScrollTrigger.create({
        trigger: scene,
        start: 'top top',
        end: () => `+=${window.innerHeight * 1.4}`,
        pin: true,
        scrub: true,
        onUpdate: (self) => {
          const q = self.progress
          ceiling.current?.set(Math.min(1, q / 0.62))
          title.progress(Math.min(1, Math.max(0, (q - 0.55) / 0.4)))
        },
      })

      // Dealer sticker slaps onto the glass.
      gsap.fromTo(
        '.pd-sticker',
        { y: 90, rotate: -9, opacity: 0, scale: 0.92 },
        {
          y: 0,
          rotate: -2.5,
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: 'back.out(1.6)',
          scrollTrigger: { trigger: '.pd-sticker-wrap', start: 'top 78%' },
        },
      )
      gsap.from('.pd-stk-row', {
        x: -24,
        opacity: 0,
        stagger: 0.07,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.pd-sticker-wrap', start: 'top 70%' },
      })
    },
    { scope: root },
  )

  return (
    <section id="perodua" ref={root} className="pd" aria-labelledby="pd-title">
      <div className="pd-open">
        <ShowroomCeiling ref={ceiling} className="pd-ceiling" />

        <div className="pd-title wrap">
          <img className="pd-logo" src="/media/logos/perodua.png" alt="Perodua" width={308} height={212} />
          <h2 id="pd-title" className="pd-h1">
            {p.title}
          </h2>
          <p className="t-lead pd-sum">{p.summary}</p>
        </div>
        <p className="pd-meta t-mono wrap">
          <span>Client: {p.client}</span>
          <span>{p.period}</span>
          <span>Facebook</span>
        </p>
      </div>

      <div className="pd-body">
        <div className="wrap pd-sticker-wrap">
          <article className="pd-sticker" aria-label={`${p.sticker.views}K Facebook views from ${p.sticker.reels} reels`}>
            <header className="pd-stk-head t-mono">
              <span>Perodua Sri Lanka</span>
              <span>Showroom sticker</span>
            </header>
            <div className="pd-stk-hero">
              <span className="t-mono">Total views</span>
              <p className="pd-stk-big">
                <Counter value={p.sticker.views} suffix="K" />
              </p>
              <span className="pd-stk-note">Facebook, across {p.sticker.reels} reels</span>
            </div>
            <dl className="pd-stk-rows">
              <div className="pd-stk-row">
                <dt>Top reel</dt>
                <dd>{compact(totalViews(top.views))}</dd>
              </div>
              <div className="pd-stk-row">
                <dt>Average per reel</dt>
                <dd>{compact(avg)}</dd>
              </div>
              <div className="pd-stk-row">
                <dt>On air</dt>
                <dd>{p.period}</dd>
              </div>
              <div className="pd-stk-row pd-stk-models">
                <dt>Models featured</dt>
                <dd>
                  {p.sticker.models.map((m) => (
                    <span key={m}>{m}</span>
                  ))}
                </dd>
              </div>
            </dl>
            <footer className="pd-stk-foot" aria-hidden="true">
              <span className="pd-barcode" />
              <span className="t-mono">PD-SL-2026</span>
            </footer>
          </article>
        </div>

        <div className="wrap pd-reels">
          <ReelFeed reels={p.reels} handle="Perodua Sri Lanka" accent="#E2231A" title="Showroom reels" />
        </div>
      </div>
    </section>
  )
}
