import { useRef } from 'react'
import { butler as b } from '../data/content'
import { PhoneFrame, ReelScreen } from '../components/Phone'
import { ScrollTrigger, gsap, reducedMotion, useGSAP } from '../lib/motion'
import './butler.css'

/** The Butler mark as a single stroke: two verticals joined by crossing diagonals. */
function Mark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="-4 -4 205 185" aria-hidden="true">
      <path d="M0 0 L197 177 L197 42 L0 177 Z" pathLength={1} />
    </svg>
  )
}

const pct = (n: number) => `${n}%`

export default function Butler() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const el = root.current!
      const iris = el.querySelector<HTMLElement>('.bt-iris')!
      // bow-tie polygon: A(0,0) P1(50,50-o) B(100,0) C(100,100) P2(50,50+o) D(0,100), scaled by s around centre
      const shape = (s: number, o: number) => {
        const sx = (x: number) => 50 + (x - 50) * s
        const sy = (y: number) => 50 + (y - 50) * s
        return `polygon(${pct(sx(0))} ${pct(sy(0))}, 50% ${pct(50 - o)}, ${pct(sx(100))} ${pct(sy(0))}, ${pct(sx(100))} ${pct(sy(100))}, 50% ${pct(50 + o)}, ${pct(sx(0))} ${pct(sy(100))})`
      }
      if (reducedMotion) {
        iris.style.clipPath = 'none'
        return
      }
      iris.style.clipPath = shape(0, 0)

      const intro = gsap.timeline({ paused: true })
      intro
        .fromTo('.bt-mark-big path', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.6, ease: 'power2.inOut' }, 0)
        .from('.bt-title-card > *:not(.bt-mark-big)', { y: 40, opacity: 0, stagger: 0.1, duration: 0.5, ease: 'power3.out' }, 0.15)

      ScrollTrigger.create({
        trigger: el.querySelector('.bt-open'),
        start: 'top top',
        end: () => `+=${window.innerHeight * 1.6}`,
        pin: true,
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress
          const grow = Math.min(1, p / 0.32)
          const open = Math.min(1, Math.max(0, (p - 0.3) / 0.28))
          const e1 = 1 - Math.pow(1 - grow, 3)
          const e2 = open < 0.5 ? 2 * open * open : 1 - Math.pow(-2 * open + 2, 2) / 2
          iris.style.clipPath = shape(e1 * 1.02, e2 * 51)
          intro.progress(Math.min(1, Math.max(0, (p - 0.34) / 0.4)))
        },
      })

      gsap.utils.toArray<HTMLElement>('.bt-item').forEach((item, i) => {
        gsap.fromTo(
          item,
          { y: 140 + i * 30 },
          { y: -40 - (i % 2) * 60, ease: 'none', scrollTrigger: { trigger: '.bt-gallery', start: 'top bottom', end: 'bottom top', scrub: true } },
        )
      })
    },
    { scope: root },
  )

  return (
    <section id="butler" ref={root} className="bt" aria-labelledby="bt-title">
      <div className="bt-open">
        <div className="bt-iris">
          <div className="bt-title-card wrap">
            <Mark className="bt-mark-big" />
            <p className="bt-brand">The Butler</p>
            <h2 id="bt-title" className="bt-h1">
              {b.title}
            </h2>
            <p className="bt-sum">{b.summary}</p>
          </div>
        </div>
      </div>

      <div className="bt-body">
        <ul className="wrap bt-gallery">
          {b.reels.map((r) => (
            <li key={r.id} className="bt-item">
              <PhoneFrame className="bt-phone">
                <ReelScreen reel={r} handle="The Butler" hoverPreview showStats={false} showCaption={false} />
              </PhoneFrame>
              <p className="bt-hook">{r.hook}</p>
              <a className="bt-link" href={r.url} target="_blank" rel="noreferrer">
                View original
              </a>
            </li>
          ))}
        </ul>
        <p className="wrap bt-note">
          Every frame styled to the brand: warm practicals, slow push-ins, leather in close-up and a restrained serif on
          screen.
        </p>
      </div>
    </section>
  )
}
