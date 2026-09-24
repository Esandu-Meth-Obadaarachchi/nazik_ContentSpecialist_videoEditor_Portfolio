import { useRef } from 'react'
import { experience, roster } from '../data/content'
import { gsap, reducedMotion, useGSAP } from '../lib/motion'
import './experience.css'

export default function Experience() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (reducedMotion) return
      const slates = gsap.utils.toArray<HTMLElement>('.slate')
      slates.forEach((s, i) => {
        // the clapper snaps shut as the slate arrives
        gsap.fromTo(
          s.querySelector('.clap-arm'),
          { rotate: -11 },
          {
            rotate: 0,
            ease: 'back.in(2.2)',
            duration: 0.55,
            scrollTrigger: { trigger: s, start: 'top 62%', toggleActions: 'play none none reverse' },
          },
        )
        // earlier takes recede under the next one
        if (i < slates.length - 1) {
          gsap.to(s.querySelector('.slate-inner'), {
            scale: 0.94,
            '--dim': 0.72,
            ease: 'none',
            scrollTrigger: { trigger: slates[i + 1], start: 'top 85%', end: 'top 20%', scrub: true },
          })
        }
      })
      gsap.from('.xp-head > *', {
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.xp-head', start: 'top 80%' },
      })
    },
    { scope: root },
  )

  return (
    <section id="experience" ref={root} className="experience" aria-labelledby="xp-title">
      <div className="wrap">
        <header className="xp-head">
          <h2 id="xp-title" className="xp-title">
            Experience
          </h2>
          <div className="xp-where">
            <img className="xp-logo" src="/media/logos/zirateh.png" alt="Zirateh" width={392} height={95} />
            <p className="t-mono xp-span">
              Oct 2021 - Present
              <span>3 roles</span>
            </p>
          </div>
          <p className="t-lead xp-sub">Three takes at one studio, from junior editor to leading content end to end.</p>
        </header>

        <div className="takes">
          {experience.takes.map((t, i) => (
            <article key={t.role} className="slate" style={{ ['--i' as string]: i }}>
              <div className="slate-inner">
                <div className="clapper" aria-hidden="true">
                  <div className="clap-base" />
                  <div className="clap-arm" />
                </div>
                <div className="slate-board">
                  <dl className="slate-meta t-mono">
                    <div>
                      <dt>Prod.</dt>
                      <dd>{experience.company}</dd>
                    </div>
                    <div>
                      <dt>Roll</dt>
                      <dd>A{String(i + 1).padStart(3, '0')}</dd>
                    </div>
                    <div>
                      <dt>Take</dt>
                      <dd>{i + 1}</dd>
                    </div>
                    <div>
                      <dt>Date</dt>
                      <dd>
                        {t.from} - {t.to}
                      </dd>
                    </div>
                  </dl>
                  <div className="slate-scene">
                    <span className="t-mono">Scene</span>
                    <h3>{t.role}</h3>
                  </div>
                  <p className="slate-body t-body">{t.body}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="roster" aria-labelledby="roster-title">
        <h2 id="roster-title" className="wrap roster-title">
          Brands I've built content for
        </h2>
        <div className="roster-marquee">
          <ul className="roster-row">
            {[...roster, ...roster].map((b, i) => (
              <li key={i} aria-hidden={i >= roster.length}>
                <img src={b.logo} alt={i < roster.length ? b.name : ''} style={{ height: b.h }} loading="lazy" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
