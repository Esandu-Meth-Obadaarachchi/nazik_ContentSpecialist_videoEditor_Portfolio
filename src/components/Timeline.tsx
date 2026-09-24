import { useEffect, useRef, useState } from 'react'
import { chapters } from '../data/content'
import { timecode } from '../lib/format'
import { ScrollTrigger, gsap, scrollToTarget, setCursorColor } from '../lib/motion'
import './timeline.css'

// The page's "runtime": the combined length of every film shown on it (reels + car edit).
const RUNTIME = 19 * 60 + 47

type Seg = { id: string; label: string; color: string; start: number; width: number }

/** Bottom-docked edit timeline: chapters as clips, the scroll position as the playhead. */
export default function Timeline() {
  const [segs, setSegs] = useState<Seg[]>([])
  const [current, setCurrent] = useState<string>('intro')
  const tcRef = useRef<HTMLSpanElement>(null)
  const headRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLElement>(null)
  const currentRef = useRef('intro')
  const topsRef = useRef<Array<{ id: string; top: number }>>([])

  useEffect(() => {
    const measure = () => {
      const max = document.documentElement.scrollHeight
      const next: Seg[] = []
      const tops: Array<{ id: string; top: number }> = []
      chapters.forEach((c) => {
        const el = document.getElementById(c.id)
        if (!el) return
        const top = el.getBoundingClientRect().top + window.scrollY
        tops.push({ id: c.id, top })
        next.push({ id: c.id, label: c.label, color: c.color, start: top / max, width: el.offsetHeight / max })
      })
      topsRef.current = tops
      setSegs(next)
    }
    ScrollTrigger.addEventListener('refresh', measure)
    measure()

    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate(self) {
        const p = self.progress
        if (headRef.current) gsap.set(headRef.current, { left: `${p * 100}%` })
        if (tcRef.current) tcRef.current.textContent = timecode(p * RUNTIME)
        barRef.current?.classList.toggle('is-live', p > 0.004)

        // which chapter holds the middle of the viewport
        const mid = window.scrollY + window.innerHeight * 0.5
        let id = 'intro'
        for (const t of topsRef.current) if (t.top <= mid) id = t.id
        if (id !== currentRef.current) {
          currentRef.current = id
          setCurrent(id)
          const chapter = chapters.find((c) => c.id === id)
          if (chapter) setCursorColor(chapter.cursor)
        }
      },
    })

    return () => {
      ScrollTrigger.removeEventListener('refresh', measure)
      st.kill()
    }
  }, [])

  const cur = chapters.find((c) => c.id === current)

  return (
    <nav ref={barRef} className="timeline" aria-label="Chapters">
      <div className="tl-tc t-mono" aria-hidden="true">
        <span className="tl-rec" />
        <span ref={tcRef}>00:00:00:00</span>
      </div>

      <div className="tl-track">
        <div className="tl-ruler" aria-hidden="true" />
        <ol className="tl-clips">
          {segs.map((s) => (
            <li key={s.id} style={{ left: `${s.start * 100}%`, width: `${s.width * 100}%` }}>
              <button
                className={`tl-clip${current === s.id ? ' is-current' : ''}`}
                style={{ ['--clip' as string]: s.color }}
                onClick={() => scrollToTarget(`#${s.id}`)}
                aria-current={current === s.id ? 'true' : undefined}
                data-cursor-label={s.label}
              >
                <span className="tl-clip-label t-mono">{s.label}</span>
              </button>
            </li>
          ))}
        </ol>
        <div ref={headRef} className="tl-head" aria-hidden="true" />
      </div>

      <div className="tl-now t-mono" aria-live="polite">
        <span className="tl-swatch" style={{ background: cur?.color }} />
        {cur?.label}
      </div>
    </nav>
  )
}
