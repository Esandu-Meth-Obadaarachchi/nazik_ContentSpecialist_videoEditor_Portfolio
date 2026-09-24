import { useEffect, useRef } from 'react'
import { FacebookLogoIcon, InstagramLogoIcon, TiktokLogoIcon } from '@phosphor-icons/react'
import { person } from '../data/content'
import { timecode } from '../lib/format'
import { ScrollTrigger, gsap, reducedMotion, useGSAP } from '../lib/motion'
import './hero.css'

const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const clamp01 = (t: number) => Math.min(1, Math.max(0, t))
const seg = (p: number, a: number, b: number) => clamp01((p - a) / (b - a))
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)
const PHONE = 9 / 19.5

function chars(word: string) {
  return word.split('').map((c, i) => (
    <span key={i} className="hn-ch">
      <span>{c}</span>
    </span>
  ))
}

/**
 * Cinemascope to reel. The 2.39:1 frame closes in from the sides into a phone-shaped reel
 * while the name condenses along the font's width axis and splits to flank it.
 */
export default function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const tc = useRef<HTMLSpanElement>(null)

  // video timecode in the HUD
  useEffect(() => {
    let raf = 0
    const tick = () => {
      if (video.current && tc.current) tc.current.textContent = timecode(video.current.currentTime)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  // play only while the hero is on screen
  useEffect(() => {
    const v = video.current
    if (!ready || !v || !root.current) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !reducedMotion) v.play().catch(() => {})
      else v.pause()
    })
    io.observe(root.current)
    return () => io.disconnect()
  }, [ready])

  // entrance once the leader opens
  useGSAP(
    () => {
      if (!ready || reducedMotion) return
      gsap
        .timeline()
        .from('.hn-ch > span', { yPercent: 105, duration: 1.3, stagger: 0.04, ease: 'expo.out' }, 0.1)
        .from('.hero-role, .hero-hud', { opacity: 0, y: 12, duration: 1, stagger: 0.1, ease: 'power3.out' }, 0.5)
        .from('.hero-frameline', { opacity: 0, scale: 1.04, duration: 1.2, ease: 'expo.out' }, 0.3)
    },
    { dependencies: [ready], scope: root },
  )

  useGSAP(
    () => {
      const el = root.current!
      const frame = el.querySelector<HTMLElement>('.hero-frame')!
      const vid = el.querySelector<HTMLElement>('.hero-video')!
      const first = el.querySelector<HTMLElement>('.hn-first')!
      const last = el.querySelector<HTMLElement>('.hn-last')!
      const role = el.querySelector<HTMLElement>('.hero-role')!
      const device = el.querySelector<HTMLElement>('.hero-device')!
      const reelui = el.querySelector<HTMLElement>('.hero-reelui')!
      const lines = el.querySelector<HTMLElement>('.hero-frameline')!
      const dims = el.querySelector<HTMLElement>('.hud-dims')!
      const aspect = el.querySelector<HTMLElement>('.hud-aspect')!
      const hud = el.querySelector<HTMLElement>('.hero-hud')!

      let vw = 0
      let vh = 0
      let h0 = 0
      let w1 = 0
      let h1 = 0
      let wide = true
      let nameH = 0
      let shift0 = 0 // centres the full name at the widest setting

      const measure = () => {
        vw = window.innerWidth
        vh = window.innerHeight
        // side-by-side names need a landscape screen; portrait tablets stack like phones
        wide = vw >= 760 && vw / vh >= 1.15
        el.classList.toggle('is-stacked', !wide)
        h0 = Math.min(vw / 2.39, vh * 0.78)
        // final frame uses a real iPhone screen ratio (9:19.5), not a squat 9:16
        h1 = wide ? vh * 0.8 : vh * 0.6
        w1 = h1 * PHONE
        if (w1 > vw * 0.82) {
          w1 = vw * 0.82
          h1 = w1 / PHONE
        }
        nameH = first.offsetHeight
        const prev = first.style.fontVariationSettings
        first.style.fontVariationSettings = last.style.fontVariationSettings = `'wdth' 125`
        shift0 = (last.offsetWidth - first.offsetWidth) / 2
        first.style.fontVariationSettings = last.style.fontVariationSettings = prev
      }

      const render = (p: number) => {
        const tFrame = easeInOut(seg(p, 0.02, 0.62))
        const w = lerp(vw, w1, tFrame)
        const h = lerp(h0, h1, tFrame)
        const top = (vh - h) / 2
        const left = (vw - w) / 2
        const rad = lerp(0, w1 * 0.15, easeOut(seg(p, 0.35, 0.62)))
        frame.style.clipPath = `inset(${top}px ${left}px ${top}px ${left}px round ${rad}px)`
        vid.style.transform = `scale(${lerp(1.12, 1, tFrame)})`
        lines.style.transform = `translate(${left}px, ${top}px)`
        lines.style.width = `${w}px`
        lines.style.height = `${h}px`
        lines.style.opacity = String(1 - seg(p, 0.55, 0.7))
        dims.textContent = `${Math.round(w)} × ${Math.round(h)}`
        aspect.textContent = tFrame > 0.985 ? '9:19.5' : tFrame < 0.015 ? '2.39:1' : (w / h).toFixed(2) + ':1'
        hud.style.transform = `translate(${left}px, ${top}px)`
        hud.style.width = `${w}px`
        hud.style.opacity = String(1 - seg(p, 0.6, 0.72))

        // name: condense along wdth, split to flank the reel
        const tName = easeInOut(seg(p, 0.05, 0.66))
        const wdth = lerp(125, wide ? 62 : 80, tName)
        first.style.fontVariationSettings = `'wdth' ${wdth}`
        last.style.fontVariationSettings = `'wdth' ${wdth}`
        const sx = wide ? -shift0 * (1 - tName) : 0
        if (wide) {
          const dx = lerp(0, w1 / 2 + Math.max(28, vw * 0.03), tName)
          first.style.transform = `translate3d(${sx - dx}px, 0, 0)`
          last.style.transform = `translate3d(${sx + dx}px, 0, 0)`
        } else {
          // stacked on phones, then pushed above and below the reel
          const dy = lerp(nameH * 0.5, h1 / 2 + nameH * 0.78, tName)
          first.style.transform = `translate3d(${sx}px, ${-dy}px, 0)`
          last.style.transform = `translate3d(${sx}px, ${dy}px, 0)`
        }

        role.style.opacity = String(1 - seg(p, 0.0, 0.16))
        role.style.transform = `translateY(${seg(p, 0, 0.16) * 20}px)`

        // device + reel interface assemble around the final frame
        const tDev = easeOut(seg(p, 0.58, 0.78))
        device.style.setProperty('--rad', `${w1 * 0.15}px`)
        device.style.width = `${w1}px`
        device.style.height = `${h1}px`
        device.style.opacity = String(tDev)
        device.style.transform = `translate(-50%, -50%) scale(${lerp(1.06, 1, tDev)})`
        const tUi = easeOut(seg(p, 0.7, 0.9))
        reelui.style.width = `${w1}px`
        reelui.style.height = `${h1}px`
        reelui.style.opacity = String(tUi)
        reelui.style.setProperty('--ui', String(tUi))
      }

      measure()
      render(0)
      if (reducedMotion) return

      const st = ScrollTrigger.create({
        trigger: el,
        start: 'top top',
        end: () => `+=${window.innerHeight * 1.9}`,
        pin: el.querySelector('.hero-pin'),
        scrub: true,
        onUpdate: (self) => render(self.progress),
        onRefresh: (self) => {
          measure()
          render(self.progress)
        },
      })
      return () => st.kill()
    },
    { scope: root },
  )

  return (
    <section id="intro" ref={root} className="hero" aria-label="Introduction">
      <div className="hero-pin">
        <div className="hero-device" aria-hidden="true" />
        <div className="hero-frame">
          <video
            ref={video}
            className="hero-video"
            src="/media/video/showreel-loop.mp4"
            poster="/media/video/hero-poster.jpg"
            muted
            loop
            playsInline
            autoPlay={!reducedMotion}
            preload="auto"
            aria-hidden="true"
          />
          <div className="hero-shade" />
        </div>

        <div className="hero-frameline" aria-hidden="true">
          <i className="fl tl" />
          <i className="fl tr" />
          <i className="fl bl" />
          <i className="fl br" />
        </div>

        <div className="hero-hud t-mono" aria-hidden="true">
          <span className="hud-rec">
            <b />
            REC <span ref={tc}>00:00:00:00</span>
          </span>
          <span className="hud-right">
            <span className="hud-dims">1440 × 603</span>
            <span className="hud-aspect">2.39:1</span>
          </span>
        </div>

        <div className="hero-reelui" aria-hidden="true">
          <span className="hd-island" />
          <ul className="hr-rail">
            <li>
              <InstagramLogoIcon size={24} />
            </li>
            <li>
              <FacebookLogoIcon size={24} />
            </li>
            <li>
              <TiktokLogoIcon size={24} />
            </li>
          </ul>
          <div className="hr-cap">
            <p className="hr-handle">
              <span>N</span>Nazik Hamza
            </p>
            <p>117M+ views. Still shaping the story, frame by frame.</p>
          </div>
          <span className="hr-progress" />
        </div>

        <h1 className="hero-name" aria-label={`${person.full}. ${person.roles.join(', ')}.`}>
          <span className="hn-first" aria-hidden="true">
            {chars(person.first)}
          </span>
          <span className="hn-last" aria-hidden="true">
            {chars(person.last)}
          </span>
        </h1>

        <p className="hero-role">
          <span>Brand & content strategist</span>
          <span>Automotive marketing lead</span>
          <span>Video editor</span>
        </p>
      </div>
    </section>
  )
}
