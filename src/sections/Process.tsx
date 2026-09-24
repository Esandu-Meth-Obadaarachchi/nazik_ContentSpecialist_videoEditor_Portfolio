import { useRef } from 'react'
import { FacebookLogoIcon, InstagramLogoIcon, TiktokLogoIcon, YoutubeLogoIcon } from '@phosphor-icons/react'
import { pipeline } from '../data/content'
import { timecode } from '../lib/format'
import { ScrollTrigger, gsap, reducedMotion, useGSAP } from '../lib/motion'
import './process.css'

function Artifact({ id }: { id: string }) {
  switch (id) {
    case 'audience':
      return (
        <div className="pa pa-audience">
          <p className="pa-si t-si" lang="si">
            <span className="caption-box">මොනවද හිතන්නේ?</span>
          </p>
          <p className="t-mono pa-note">"What do you think?" Hooks in the language the buyer thinks in.</p>
        </div>
      )
    case 'script':
      return (
        <div className="pa pa-script t-mono" aria-label="A screenplay-format script fragment">
          <p className="sc-slug">INT. SHOWROOM - DAY</p>
          <p className="sc-char">NAZIK (O.S.)</p>
          <p className="sc-line">So what made you pick this one?</p>
          <p className="sc-char">OWNER</p>
          <p className="sc-line">Honestly? The way it looks.</p>
        </div>
      )
    case 'shoot':
      return (
        <figure className="pa pa-shoot">
          <img src="/media/reels/jt-05.jpg" alt="A frame from a Jetour customer interview shoot" loading="lazy" />
          <span className="pa-rec t-mono">
            <b />
            REC
          </span>
        </figure>
      )
    case 'edit':
      return (
        <div className="pa pa-nle" aria-hidden="true">
          {[
            ['V2', [[8, 14], [40, 22], [70, 12]]],
            ['V1', [[0, 26], [27, 30], [58, 20], [79, 21]]],
            ['A1', [[0, 100]]],
          ].map(([name, clips]) => (
            <div key={name as string} className={`nle-track nle-${(name as string).toLowerCase()}`}>
              <span className="t-mono">{name as string}</span>
              <div>
                {(clips as number[][]).map(([l, w], i) => (
                  <i key={i} style={{ left: `${l}%`, width: `${w}%` }} />
                ))}
              </div>
            </div>
          ))}
          <span className="nle-head" />
        </div>
      )
    case 'scale':
      return (
        <ul className="pa pa-platforms" aria-label="Facebook, Instagram, TikTok, YouTube">
          <li>
            <FacebookLogoIcon size={22} />
          </li>
          <li>
            <InstagramLogoIcon size={22} />
          </li>
          <li>
            <TiktokLogoIcon size={22} />
          </li>
          <li>
            <YoutubeLogoIcon size={22} />
          </li>
        </ul>
      )
    default:
      return null
  }
}

export default function Process() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (reducedMotion) return
      const mm = gsap.matchMedia()
      // desktop: a short pinned sideways pass; the page scrolls less than the track moves
      mm.add('(min-width: 900px)', () => {
        const track = root.current!.querySelector<HTMLElement>('.pr-track')!
        const tc = root.current!.querySelector<HTMLElement>('.pr-tc')!
        const bar = root.current!.querySelector<HTMLElement>('.pr-bar i')!
        const dist = () => Math.max(0, track.scrollWidth - window.innerWidth)
        const tween = gsap.to(track, {
          x: () => -dist(),
          ease: 'none',
          scrollTrigger: {
            trigger: root.current!.querySelector('.pr-pin'),
            start: 'top top',
            end: () => `+=${dist() * 0.55}`,
            pin: true,
            scrub: 0.5,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              tc.textContent = timecode(self.progress * 60)
              bar.style.transform = `scaleX(${self.progress})`
            },
          },
        })
        gsap.utils.toArray<HTMLElement>('.pr-panel').forEach((p) => {
          ScrollTrigger.create({
            trigger: p,
            containerAnimation: tween,
            start: 'left 70%',
            end: 'right 30%',
            toggleClass: 'is-live',
          })
        })
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section id="process" ref={root} className="process" aria-labelledby="process-title">
      <div className="pr-pin">
        <div className="pr-track">
          <header className="pr-intro">
            <h2 id="process-title" className="t-h2">
              The whole package.
            </h2>
            <p className="t-lead pr-intro-sub">Strategy, scripts, the shoot and the cut, run end to end with my team.</p>
          </header>

          {pipeline.map((s, i) => (
            <article key={s.id} className="pr-panel">
              <p className="pr-tag t-mono">
                <span>{String(i + 1).padStart(2, '0')}</span>
                {s.tag}
              </p>
              <h3 className="pr-title">{s.title}</h3>
              <p className="pr-body">{s.body}</p>
              <Artifact id={s.id} />
            </article>
          ))}
        </div>

        <div className="pr-meter" aria-hidden="true">
          <span className="pr-tc t-mono">00:00:00:00</span>
          <span className="pr-bar">
            <i />
          </span>
        </div>
      </div>
    </section>
  )
}
