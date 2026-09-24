import { forwardRef, useEffect, useId, useImperativeHandle, useRef, useState, type ReactNode } from 'react'
import {
  BatteryFullIcon,
  CellSignalFullIcon,
  FacebookLogoIcon,
  InstagramLogoIcon,
  SpeakerHighIcon,
  SpeakerSlashIcon,
  TiktokLogoIcon,
  WifiHighIcon,
} from '@phosphor-icons/react'
import type { Reel } from '../data/content'
import { platformLabel } from '../lib/format'
import { mediaBus, sound } from '../lib/media'
import { reducedMotion } from '../lib/motion'
import './phone.css'

export function PhoneFrame({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`phone ${className}`}>
      <div className="phone-screen">
        {children}
        <div className="phone-status" aria-hidden="true">
          <span>9:41</span>
          <span className="phone-status-r">
            <CellSignalFullIcon size={13} weight="fill" />
            <WifiHighIcon size={13} weight="bold" />
            <BatteryFullIcon size={17} weight="fill" />
          </span>
        </div>
        <div className="phone-island" aria-hidden="true" />
      </div>
    </div>
  )
}

export type ReelScreenHandle = { play: (withSound?: boolean) => void; pause: () => void }

type Props = {
  reel: Reel
  handle: string
  /** mount the <video>; inactive slides only show their poster */
  live?: boolean
  /** play muted automatically while visible */
  autoPlay?: boolean
  /** play muted on hover (desktop), click plays with sound */
  hoverPreview?: boolean
  showStats?: boolean
  showCaption?: boolean
}

export const ReelScreen = forwardRef<ReelScreenHandle, Props>(function ReelScreen(
  { reel, handle, live = true, autoPlay = false, hoverPreview = false, showStats = true, showCaption = true },
  ref,
) {
  const owner = useId()
  const video = useRef<HTMLVideoElement>(null)
  const bar = useRef<HTMLSpanElement>(null)
  const box = useRef<HTMLDivElement>(null)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(!sound.get())
  const [inView, setInView] = useState(false)
  const [loading, setLoading] = useState(false)
  const playable = Boolean(reel.src)

  const play = (withSound?: boolean) => {
    const v = video.current
    if (!v) return
    if (withSound !== undefined) {
      v.muted = !withSound
      setMuted(!withSound)
      if (withSound) sound.set(true)
    }
    mediaBus.claim(owner)
    setLoading(true)
    v.play().catch(() => {
      // Autoplay with sound can be refused; fall back to muted.
      v.muted = true
      setMuted(true)
      v.play().catch(() => setLoading(false))
    })
  }
  const pause = () => video.current?.pause()

  useImperativeHandle(ref, () => ({ play, pause }))

  // pause when another video claims the stage
  useEffect(() => mediaBus.subscribe((o) => o !== owner && video.current?.pause()), [owner])
  useEffect(
    () =>
      sound.subscribe((on) => {
        if (video.current && !video.current.paused) {
          video.current.muted = !on
          setMuted(!on)
        }
      }),
    [],
  )

  // visibility
  useEffect(() => {
    const el = box.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting && e.intersectionRatio > 0.35), {
      threshold: [0, 0.35, 0.6],
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!live || !playable) return
    if (!inView) {
      pause()
      return
    }
    if (autoPlay && !reducedMotion) play()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, live, autoPlay, playable])

  useEffect(() => {
    if (!live) {
      setPlaying(false)
      if (bar.current) bar.current.style.transform = 'scaleX(0)'
    }
  }, [live])

  // progress
  useEffect(() => {
    if (!playing) return
    let raf = 0
    const tick = () => {
      const v = video.current
      if (v && bar.current && v.duration) bar.current.style.transform = `scaleX(${v.currentTime / v.duration})`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [playing])

  const toggle = () => {
    if (!playable) return
    const v = video.current
    if (!v) return
    if (v.paused) play(true)
    else if (v.muted) {
      // first tap on a muted preview turns the sound on instead of stopping it
      v.muted = false
      setMuted(false)
      sound.set(true)
    } else pause()
  }

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation()
    const v = video.current
    if (!v) return
    const next = !v.muted
    v.muted = next
    setMuted(next)
    sound.set(!next)
    if (v.paused) play(!next)
  }

  const label = !playable ? 'Still' : playing ? (muted ? 'Sound on' : 'Pause') : 'Play'

  return (
    <div
      ref={box}
      className={`reel${playing ? ' is-playing' : ''}${playable ? '' : ' is-still'}`}
      onMouseEnter={hoverPreview && playable && live ? () => video.current?.paused && play(false) : undefined}
      onMouseLeave={hoverPreview && playable ? () => video.current?.muted && pause() : undefined}
    >
      <img className="reel-poster" src={reel.poster} alt="" loading="lazy" decoding="async" />
      {live && playable && (
        <video
          ref={video}
          className="reel-video"
          src={reel.src}
          poster={reel.poster}
          playsInline
          muted={muted}
          loop
          preload="none"
          onPlaying={() => {
            setPlaying(true)
            setLoading(false)
          }}
          onPause={() => setPlaying(false)}
          onWaiting={() => setLoading(true)}
          onCanPlay={() => setLoading(false)}
        />
      )}

      <button
        className="reel-hit"
        onClick={toggle}
        data-cursor={playable ? 'play' : undefined}
        data-cursor-label={label}
        aria-label={playable ? `${playing ? 'Pause' : 'Play'}: ${reel.hook}` : `${reel.hook} (still image)`}
        tabIndex={live ? 0 : -1}
      />

      <div className="reel-ui" aria-hidden={!live}>
        {playable && (
          <button className="reel-mute" onClick={toggleMute} aria-label={muted ? 'Turn sound on' : 'Mute'} tabIndex={live ? 0 : -1}>
            {muted ? <SpeakerSlashIcon size={15} weight="fill" /> : <SpeakerHighIcon size={15} weight="fill" />}
          </button>
        )}

        {playable && (
          <span className={`reel-play${playing ? ' is-hidden' : ''}${loading ? ' is-loading' : ''}`} aria-hidden="true">
            <svg viewBox="0 0 24 24" width="26" height="26">
              <path d="M8 5.5v13l10.5-6.5z" fill="currentColor" />
            </svg>
          </span>
        )}

        {showStats && reel.views && (
          <ul className="reel-rail">
            {reel.views.ig != null && (
              <li>
                <InstagramLogoIcon size={22} weight="regular" />
                <span>{platformLabel(reel.views, 'ig')}</span>
              </li>
            )}
            {reel.views.fb != null && (
              <li>
                <FacebookLogoIcon size={22} weight="regular" />
                <span>{platformLabel(reel.views, 'fb')}</span>
              </li>
            )}
            {reel.views.tt != null && (
              <li>
                <TiktokLogoIcon size={22} weight="regular" />
                <span>{platformLabel(reel.views, 'tt')}</span>
              </li>
            )}
          </ul>
        )}

        {showCaption && (
          <div className="reel-cap">
            <p className="reel-handle">
              <span className="reel-avatar">{handle.slice(0, 1)}</span>
              {handle}
            </p>
            <p className="reel-hook">{reel.hook}</p>
            {reel.original && (
              <p className="reel-si t-si" lang="si">
                {reel.original}
              </p>
            )}
          </div>
        )}

        <span className="reel-progress">
          <span ref={bar} />
        </span>
      </div>
    </div>
  )
})
