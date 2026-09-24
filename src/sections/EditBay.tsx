import { useEffect, useId, useRef, useState } from 'react'
import { ArrowsOutIcon, PauseIcon, PlayIcon, SpeakerHighIcon, SpeakerSlashIcon } from '@phosphor-icons/react'
import { edits, type Edit } from '../data/content'
import { timecode } from '../lib/format'
import { mediaBus } from '../lib/media'
import { gsap, reducedMotion, useGSAP } from '../lib/motion'
import './editbay.css'

function Monitor({ item }: { item: Edit }) {
  const owner = useId()
  const video = useRef<HTMLVideoElement>(null)
  const bar = useRef<HTMLDivElement>(null)
  const fill = useRef<HTMLSpanElement>(null)
  const tc = useRef<HTMLSpanElement>(null)
  const box = useRef<HTMLDivElement>(null)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [duration, setDuration] = useState(0)
  const [hover, setHover] = useState<{ x: number; t: number } | null>(null)
  const [now, setNow] = useState(0)

  useEffect(() => mediaBus.subscribe((o) => o !== owner && video.current?.pause()), [owner])

  useEffect(() => {
    if (!playing) return
    let raf = 0
    const tick = () => {
      const v = video.current
      if (v && v.duration) {
        if (fill.current) fill.current.style.transform = `scaleX(${v.currentTime / v.duration})`
        if (tc.current) tc.current.textContent = timecode(v.currentTime)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [playing])

  // pause when scrolled away
  useEffect(() => {
    const el = box.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => !e.isIntersecting && video.current?.pause(), { threshold: 0.1 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const toggle = () => {
    const v = video.current
    if (!v) return
    if (v.paused) {
      mediaBus.claim(owner)
      v.play().catch(() => {})
    } else v.pause()
  }

  const seekFrom = (clientX: number) => {
    const r = bar.current!.getBoundingClientRect()
    const p = Math.min(1, Math.max(0, (clientX - r.left) / r.width))
    return { p, x: clientX - r.left, t: p * (duration || 0) }
  }

  const onKeyBar = (e: React.KeyboardEvent) => {
    const v = video.current
    if (!v) return
    if (e.key === 'ArrowRight') v.currentTime = Math.min(v.duration, v.currentTime + 1)
    if (e.key === 'ArrowLeft') v.currentTime = Math.max(0, v.currentTime - 1)
    if (fill.current && v.duration) fill.current.style.transform = `scaleX(${v.currentTime / v.duration})`
    if (tc.current) tc.current.textContent = timecode(v.currentTime)
  }

  const sprite = item.sprite
  const frame = hover && sprite ? Math.min(sprite.count - 1, Math.floor(hover.t / sprite.interval)) : 0

  return (
    <div ref={box} className="eb-monitor">
      <div className={`eb-screen is-${item.aspect === '9:16' ? 'tall' : 'wide'}`}>
        {item.aspect === '9:16' && <img className="eb-fill" src={item.poster} alt="" aria-hidden="true" />}
        {item.src ? (
          <video
            ref={video}
            className="eb-media"
            src={item.src}
            poster={item.poster}
            playsInline
            muted={muted}
            preload="metadata"
            onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
            onTimeUpdate={(e) => setNow(Math.round(e.currentTarget.currentTime))}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={() => setPlaying(false)}
          />
        ) : (
          <img className="eb-media" src={item.poster} alt={`Still from ${item.title}`} />
        )}
        {item.src ? (
          <button
            className={`eb-hit${playing ? ' is-playing' : ''}`}
            onClick={toggle}
            data-cursor="play"
            data-cursor-label={playing ? 'Pause' : 'Play'}
            aria-label={playing ? `Pause ${item.title}` : `Play ${item.title}`}
          >
            <span className="eb-big-play" aria-hidden="true">
              <PlayIcon size={30} weight="fill" />
            </span>
          </button>
        ) : (
          <p className="eb-soon t-mono">Full edit coming soon</p>
        )}
        <span className="eb-safe" aria-hidden="true" />
      </div>

      <div className={`eb-transport${item.src ? '' : ' is-off'}`}>
        <button className="eb-btn" onClick={toggle} aria-label={playing ? 'Pause' : 'Play'} disabled={!item.src}>
          {playing ? <PauseIcon size={16} weight="fill" /> : <PlayIcon size={16} weight="fill" />}
        </button>
        <span className="eb-tc t-mono">
          <span ref={tc}>00:00:00:00</span>
          <i>/</i>
          {timecode(duration)}
        </span>
        <div
          ref={bar}
          className="eb-scrub"
          role="slider"
          tabIndex={item.src ? 0 : -1}
          aria-label="Seek"
          aria-valuemin={0}
          aria-valuemax={Math.round(duration)}
          aria-valuenow={now}
          data-cursor="drag"
          data-cursor-label="Scrub"
          onKeyDown={onKeyBar}
          onPointerMove={(e) => item.src && setHover(seekFrom(e.clientX))}
          onPointerLeave={() => setHover(null)}
          onPointerDown={(e) => {
            const v = video.current
            if (!v || !duration) return
            const s = seekFrom(e.clientX)
            v.currentTime = s.t
            if (fill.current) fill.current.style.transform = `scaleX(${s.p})`
            if (tc.current) tc.current.textContent = timecode(s.t)
          }}
        >
          <span className="eb-scrub-track">
            <span ref={fill} className="eb-scrub-fill" />
          </span>
          {hover && sprite && (
            <span className="eb-thumb" style={{ left: hover.x }}>
              <span
                className="eb-thumb-img"
                style={{
                  backgroundImage: `url(${sprite.url})`,
                  backgroundSize: `${sprite.cols * 100}% ${sprite.rows * 100}%`,
                  backgroundPosition: `${((frame % sprite.cols) / (sprite.cols - 1)) * 100}% ${(Math.floor(frame / sprite.cols) / (sprite.rows - 1)) * 100}%`,
                }}
              />
              <span className="t-mono">{timecode(hover.t)}</span>
            </span>
          )}
        </div>
        <button className="eb-btn" onClick={() => setMuted((m) => !m)} aria-label={muted ? 'Unmute' : 'Mute'} disabled={!item.src}>
          {muted ? <SpeakerSlashIcon size={16} weight="fill" /> : <SpeakerHighIcon size={16} weight="fill" />}
        </button>
        <button
          className="eb-btn"
          onClick={() => {
            const v = video.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null
            if (!v) return
            if (v.requestFullscreen) v.requestFullscreen().catch(() => {})
            else v.webkitEnterFullscreen?.()
          }}
          aria-label="Full screen"
          disabled={!item.src}
        >
          <ArrowsOutIcon size={16} weight="bold" />
        </button>
      </div>
    </div>
  )
}

export default function EditBay() {
  const root = useRef<HTMLElement>(null)
  const [sel, setSel] = useState(edits[0].id)
  const item = edits.find((e) => e.id === sel) ?? edits[0]

  useGSAP(
    () => {
      if (reducedMotion) return
      gsap.from('.eb-head > *', {
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.eb-head', start: 'top 80%' },
      })
      gsap.from('.eb-monitor', {
        clipPath: 'inset(0 50% 0 50%)',
        duration: 1.4,
        ease: 'expo.inOut',
        scrollTrigger: { trigger: '.eb-desk', start: 'top 75%' },
      })
      gsap.from('.eb-bin li', {
        x: 40,
        opacity: 0,
        stagger: 0.06,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.eb-bin', start: 'top 80%' },
      })
    },
    { scope: root },
  )

  return (
    <section id="edits" ref={root} className="eb" aria-labelledby="eb-title">
      <div className="wrap">
        <header className="eb-head">
          <h2 id="eb-title" className="t-h2">
            Editing showcase
          </h2>
          <p className="t-lead eb-sub">A look at the edits I've crafted across freelance projects and brand accounts at Zirateh.</p>
        </header>

        <div className="eb-desk">
          <Monitor key={item.id} item={item} />

          <div className="eb-bin-wrap">
            <p className="eb-bin-title t-mono">
              Media bin <span>{edits.length} items</span>
            </p>
            <ul className="eb-bin">
              {edits.map((e) => (
                <li key={e.id}>
                  <button className={`eb-clip${e.id === sel ? ' is-on' : ''}`} onClick={() => setSel(e.id)} aria-pressed={e.id === sel}>
                    <span className={`eb-clip-thumb is-${e.aspect === '9:16' ? 'tall' : 'wide'}`}>
                      <img src={e.poster} alt="" loading="lazy" />
                    </span>
                    <span className="eb-clip-text">
                      <span className="eb-clip-title">{e.title}</span>
                      <span className="t-mono eb-clip-kind">
                        {e.kind} <i>{e.aspect}</i>
                        {!e.src && <b>Still</b>}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
