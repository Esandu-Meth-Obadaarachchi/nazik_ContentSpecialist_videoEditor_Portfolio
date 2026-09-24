import { useRef } from 'react'
import { about } from '../data/content'
import Counter from '../components/Counter'
import Words from '../components/Words'
import { gsap, reducedMotion, useGSAP } from '../lib/motion'
import './about.css'

export default function About() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (reducedMotion) return
      // rack focus: the portrait pulls from soft to sharp, then the AF point locks
      const tl = gsap.timeline({
        scrollTrigger: { trigger: '.ab-photo', start: 'top 85%', end: 'center 50%', scrub: 0.6 },
      })
      tl.fromTo('.ab-photo img', { filter: 'blur(14px) saturate(0.4)', scale: 1.14 }, { filter: 'blur(0px) saturate(1)', scale: 1, ease: 'none' })
        .fromTo('.ab-af', { scale: 1.8, opacity: 0 }, { scale: 1, opacity: 1, ease: 'power2.out' }, 0)
        .call(() => root.current?.querySelector('.ab-af')?.classList.remove('is-locked'), [], 0.95)
        .call(() => root.current?.querySelector('.ab-af')?.classList.add('is-locked'), [], 1)

      gsap.from('.ab-fact', {
        y: 40,
        opacity: 0,
        stagger: 0.08,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.ab-facts', start: 'top 85%' },
      })
      gsap.from('.ab-quote-mark', {
        scaleY: 0,
        transformOrigin: 'top',
        duration: 1.2,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.ab-quote', start: 'top 80%' },
      })
    },
    { scope: root },
  )

  return (
    <section id="about" ref={root} className="about" aria-labelledby="about-title">
      <div className="wrap ab-grid">
        <figure className="ab-photo">
          <div className="ab-vf">
            <img src="/media/img/nazik-portrait.webp" alt="Mohamed Nazik Hamza, arms crossed, smiling" width={455} height={683} />
            <span className="ab-af" aria-hidden="true" />
            <i className="vf tl" />
            <i className="vf tr" />
            <i className="vf bl" />
            <i className="vf br" />
          </div>
          <figcaption className="t-mono ab-cap">Mohamed Nazik Hamza</figcaption>
        </figure>

        <div className="ab-copy">
          <h2 id="about-title" className="sr-only">
            About Nazik
          </h2>
          <Words text={about.lead} className="ab-lead" mode="scrub" />
          <div className="ab-body">
            {about.body.map((p) => (
              <p key={p.slice(0, 12)} className="t-body">
                {p}
              </p>
            ))}
          </div>

          <blockquote className="ab-quote">
            <span className="ab-quote-mark" aria-hidden="true" />
            <p className="ab-quote-line">
              Great brand content starts with <span className="caption-box">story, not slogans.</span>
            </p>
            <p className="t-body ab-quote-note">{about.philosophyNote}</p>
          </blockquote>
        </div>
      </div>

      <div className="wrap">
        <dl className="ab-facts">
          {about.facts.map((f) => (
            <div key={f.label} className="ab-fact">
              <dt className="t-mono">{f.label}</dt>
              <dd>
                <Counter value={f.value} prefix={f.prefix} suffix={f.suffix} decimals={f.decimals} />
              </dd>
            </div>
          ))}
          <div className="ab-fact ab-award">
            <dt className="t-mono">Recognition</dt>
            <dd>
              <span className="ab-award-name">{about.award.name}</span>
              <span className="ab-award-tier">{about.award.tier}</span>
            </dd>
          </div>
        </dl>
      </div>
    </section>
  )
}
