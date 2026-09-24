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
          <p className="pa-en">What do you think?</p>
          <p className="t-mono pa-note">Hooks written in the language the buyer thinks in.</p>
        </div>
      )
    case 'strategy':
      return (
        <dl className="pa pa-wedge">
          <div>
            <dt className="t-mono">Dongfeng</dt>
            <dd>Features over flash</dd>
          </div>
          <div>
            <dt className="t-mono">Jetour</dt>
            <dd>Design as the pitch</dd>
          </div>
        </dl>
      )
    case 'ideas':
      return (
        <ul className="pa pa-formats">
          {['Skits', 'Challenges', 'Customer interviews', 'Owner testimonials', 'Explainers', 'Humour', 'Walkarounds'].map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      )
    case 'script':
      return (
        <div className="pa pa-script t-mono" aria-label="A screenplay-format script fragment">
          <p className="sc-slug">INT. SHOWROOM - DAY</p>
          <p className="sc-action">A buyer circles the T2. Arms folded. Not convinced.</p>
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
          <i className="vf tl" />
          <i className="vf tr" />
          <i className="vf bl" />
          <i className="vf br" />
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
        <ul className="pa pa-platforms">
          <li>
            <FacebookLogoIcon size={26} />
            Facebook
          </li>
          <li>
            <InstagramLogoIcon size={26} />
            Instagram
          </li>
          <li>
            <TiktokLogoIcon size={26} />
            TikTok
          </li>
          <li>
            <YoutubeLogoIcon size={26} />
            YouTube
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
      mm.add('(min-width: 900px)', () => {
        const track = root.current!.querySelector<HTMLElement>('.pr-track')!
        const clips = root.current!.querySelector<HTMLElement>('.pr-clips')!
        const panels = gsap.utils.toArray<HTMLElement>('.pr-panel')
        const tc = root.current!.querySelector<HTMLElement>('.pr-tc')!
        const dist = () => track.scrollWidth - window.innerWidth
        const tween = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: root.current!.querySelector('.pr-pin'),
            start: 'top top',
            end: () => `+=${dist()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              tc.textContent = timecode(self.progress * 94)
            },
          },
        })
        tween.to(track, { x: () => -dist() }, 0).to(clips, { x: () => -dist() * 0.5 }, 0)
        panels.forEach((p) => {
          ScrollTrigger.create({
            trigger: p,
            containerAnimation: tween,
            start: 'left 55%',
            end: 'right 45%',
            toggleClass: 'is-live',
          })
          gsap.from(p.querySelectorAll('.pr-anim'), {
            y: 50,
            opacity: 0,
            stagger: 0.08,
            ease: 'power3.out',
            duration: 1,
            scrollTrigger: { trigger: p, containerAnimation: tween, start: 'left 80%' },
          })
        })
      })
      mm.add('(max-width: 899px)', () => {
        gsap.utils.toArray<HTMLElement>('.pr-panel').forEach((p) => {
          gsap.from(p.querySelectorAll('.pr-anim'), {
            y: 40,
            opacity: 0,
            stagger: 0.08,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: { trigger: p, start: 'top 82%' },
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
              The whole package, from first insight to final frame.
            </h2>
            <p className="t-lead pr-intro-sub">
              Strategy, ideas, scripts, the shoot and the cut. I run every stage, with a team of editors, designers and
              social media managers executing alongside me.
            </p>
          </header>

          {pipeline.map((s, i) => (
            <article key={s.id} className={`pr-panel pr-${s.id}`}>
              <p className="pr-tag t-mono pr-anim">
                <span>{timecode(i * 13.4 + 4)}</span>
                {s.tag}
              </p>
              <h3 className="pr-title pr-anim">{s.title}</h3>
              <p className="t-body pr-body pr-anim">{s.body}</p>
              <div className="pr-anim pr-art">
                <Artifact id={s.id} />
              </div>
            </article>
          ))}
          <div className="pr-tail" aria-hidden="true" />
        </div>

        <div className="pr-timeline" aria-hidden="true">
          <span className="pr-tc t-mono">00:00:00:00</span>
          <div className="pr-clips-wrap">
            <div className="pr-clips">
              <span className="pr-clip pr-clip-intro" />
              {pipeline.map((s) => (
                <span key={s.id} className="pr-clip">
                  <span className="t-mono">{s.tag}</span>
                </span>
              ))}
              <span className="pr-clip pr-clip-tail" />
            </div>
          </div>
          <span className="pr-playhead" />
        </div>
      </div>
    </section>
  )
}
