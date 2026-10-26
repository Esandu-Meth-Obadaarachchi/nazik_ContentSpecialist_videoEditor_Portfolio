import { useEffect, useId, useRef, useState } from 'react'
import { ArrowUpRightIcon, PlayIcon, YoutubeLogoIcon } from '@phosphor-icons/react'
import { rosses } from '../data/content'
import Counter from '../components/Counter'
import { compact } from '../lib/format'
import { mediaBus } from '../lib/media'
import { gsap, reducedMotion, useGSAP } from '../lib/motion'
import './rosses.css'

const mmss = (s: number) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`
const total = rosses.videos.reduce((n, v) => n + v.views, 0)
const top = rosses.videos[0].views

/** Long-form YouTube edits: a lite embed (thumbnail until pressed) beside an up-next list. */
export default function Rosses() {
  const owner = useId()
  const root = useRef<HTMLDivElement>(null)
  const player = useRef<HTMLDivElement>(null)
  const [sel, setSel] = useState(rosses.videos[0].id)
  const [playing, setPlaying] = useState(false)
  const video = rosses.videos.find((v) => v.id === sel) ?? rosses.videos[0]

  // Another video on the page starts: drop the iframe so its audio stops.
  useEffect(() => mediaBus.subscribe((o) => o !== owner && setPlaying(false)), [owner])

  // Scrolled away: same.
  useEffect(() => {
    const el = player.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => !e.isIntersecting && setPlaying(false), { threshold: 0.1 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const play = (id: string) => {
    setSel(id)
    mediaBus.claim(owner)
    setPlaying(true)
  }

  useGSAP(
    () => {
      if (reducedMotion) return
      gsap.from('.rr-head > *', {
        y: 30,
        opacity: 0,
        stagger: 0.08,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.rr-head', start: 'top 82%' },
      })
      gsap.from('.rr-list li', {
        x: 40,
        opacity: 0,
        stagger: 0.05,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.rr-list', start: 'top 82%' },
      })
      gsap.from('.rr-bar i', {
        scaleX: 0,
        stagger: 0.05,
        duration: 1.4,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.rr-list', start: 'top 78%' },
      })
    },
    { scope: root },
  )

  return (
    <div ref={root} className="rr">
      <header className="rr-head">
        <p className="rr-channel">
          <span className="rr-avatar" aria-hidden="true">
            RR
          </span>
          <span>
            <a href={rosses.channelUrl} target="_blank" rel="noreferrer" className="rr-channel-name" id="rr-title">
              {rosses.channel}
              <ArrowUpRightIcon size={14} weight="bold" />
            </a>
            <span className="rr-client t-mono">
              {rosses.client}, {rosses.clientNote}
            </span>
          </span>
        </p>
        <p className="t-body rr-sum">{rosses.summary}</p>
        <dl className="rr-stats">
          <div>
            <dt className="t-mono">Views</dt>
            <dd>
              <Counter value={total / 1_000_000} decimals={2} suffix="M" />
            </dd>
          </div>
          <div>
            <dt className="t-mono">Long-form edits</dt>
            <dd>{rosses.videos.length}</dd>
          </div>
          <div>
            <dt className="t-mono">Top video</dt>
            <dd>{compact(top)}</dd>
          </div>
        </dl>
      </header>

      <div className="rr-desk">
        <div ref={player} className="rr-player">
          <div className="rr-screen">
            {playing ? (
              <iframe
                key={video.id}
                src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0&playsinline=1`}
                title={video.title}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
              />
            ) : (
              <button
                className="rr-poster"
                onClick={() => play(video.id)}
                data-cursor="play"
                data-cursor-label="Play"
                aria-label={`Play ${video.title}`}
              >
                <img src={`/media/rosses/${video.id}.jpg`} alt="" />
                <span className="rr-play" aria-hidden="true">
                  <PlayIcon size={28} weight="fill" />
                </span>
                <span className="rr-dur t-mono">{mmss(video.duration)}</span>
              </button>
            )}
          </div>
          <div className="rr-now">
            <p className="rr-now-title">{video.title}</p>
            <p className="rr-now-meta t-mono">
              <span>{compact(video.views)} views</span>
              <span>{video.date}</span>
              <a href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noreferrer">
                <YoutubeLogoIcon size={14} weight="fill" /> Watch on YouTube
              </a>
            </p>
          </div>
        </div>

        <div className="rr-list-wrap">
          <ol className="rr-list" aria-label="Edited videos, by views" data-lenis-prevent>
            {rosses.videos.map((v) => (
              <li key={v.id}>
                <button className={`rr-item${v.id === sel ? ' is-on' : ''}`} onClick={() => play(v.id)} aria-current={v.id === sel ? 'true' : undefined}>
                  <span className="rr-thumb">
                    <img src={`/media/rosses/${v.id}.jpg`} alt="" loading="lazy" />
                    <span className="rr-dur t-mono">{mmss(v.duration)}</span>
                  </span>
                  <span className="rr-text">
                    <span className="rr-title">{v.title}</span>
                    <span className="rr-views t-mono">{compact(v.views)} views</span>
                    <span className="rr-bar" aria-hidden="true">
                      <i style={{ width: `${(v.views / top) * 100}%` }} />
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  )
}
