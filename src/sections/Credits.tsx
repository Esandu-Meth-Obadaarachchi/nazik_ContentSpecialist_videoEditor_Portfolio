import { useRef, useState } from 'react'
import { ArrowUpRightIcon, CheckIcon, CopyIcon } from '@phosphor-icons/react'
import { credits, person } from '../data/content'
import { gsap, reducedMotion, scrollToTarget, useGSAP } from '../lib/motion'
import './credits.css'

export default function Credits() {
  const root = useRef<HTMLElement>(null)
  const [copied, setCopied] = useState(false)
  const { email, phone, linkedin, instagram } = person.contact

  useGSAP(
    () => {
      if (reducedMotion) return
      gsap.utils.toArray<HTMLElement>('.cr-row').forEach((row) => {
        gsap.fromTo(
          row,
          { opacity: 0 },
          {
            opacity: 1,
            ease: 'none',
            scrollTrigger: { trigger: row, start: 'top 95%', end: 'top 70%', scrub: true },
          },
        )
        gsap.to(row, {
          opacity: 0,
          ease: 'none',
          scrollTrigger: { trigger: row, start: 'top 22%', end: 'top 5%', scrub: true },
        })
      })
      gsap.from('.cr-final > *', {
        y: 60,
        opacity: 0,
        stagger: 0.1,
        duration: 1.2,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.cr-final', start: 'top 70%' },
      })
    },
    { scope: root },
  )

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch {
      window.location.href = `mailto:${email}`
    }
  }

  return (
    <section id="contact" ref={root} className="credits" aria-labelledby="cr-title">
      <div className="cr-roll">
        <p className="cr-presents">A {person.full} production</p>
        <dl className="cr-list">
          {credits.map((c) => (
            <div key={c.role} className="cr-row">
              <dt>{c.role}</dt>
              <dd>
                {c.names.map((n) => (
                  <span key={n}>{n}</span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="cr-final wrap">
        <h2 id="cr-title" className="cr-h">
          Let's make the <span className="caption-box">next one.</span>
        </h2>
        <p className="t-lead cr-sub">
          Brand strategy, scripts, shoot direction and the edit, for brands that want to be watched rather than scrolled past.
        </p>

        <div className="cr-mail">
          <a className="cr-email" href={`mailto:${email}`}>
            {email}
          </a>
          <button className="cr-copy" onClick={copy} aria-live="polite">
            {copied ? <CheckIcon size={16} weight="bold" /> : <CopyIcon size={16} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>

        <ul className="cr-links">
          {phone && (
            <li>
              <a href={`tel:${phone.replace(/\s/g, '')}`}>
                {phone}
                <ArrowUpRightIcon size={14} weight="bold" />
              </a>
            </li>
          )}
          {linkedin && (
            <li>
              <a href={linkedin} target="_blank" rel="noreferrer">
                LinkedIn
                <ArrowUpRightIcon size={14} weight="bold" />
              </a>
            </li>
          )}
          {instagram && (
            <li>
              <a href={instagram} target="_blank" rel="noreferrer">
                Instagram
                <ArrowUpRightIcon size={14} weight="bold" />
              </a>
            </li>
          )}
        </ul>

        <footer className="cr-foot t-mono">
          <span>© 2026 {person.full}</span>
          <button onClick={() => scrollToTarget(0)}>Back to the top</button>
        </footer>
      </div>
    </section>
  )
}
