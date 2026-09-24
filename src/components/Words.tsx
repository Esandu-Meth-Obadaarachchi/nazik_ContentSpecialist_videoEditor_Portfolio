import { useRef, type ElementType } from 'react'
import { gsap, reducedMotion, useGSAP } from '../lib/motion'

type Props = {
  text: string
  as?: ElementType
  className?: string
  /** 'scrub' ties brightness to scroll; 'rise' lifts words in once */
  mode?: 'scrub' | 'rise'
  /** words wrapped in the burned-in caption style */
  highlight?: string[]
}

/** Splits text into words for scroll-driven reveals. Screen readers get the plain sentence. */
export default function Words({ text, as: Tag = 'p', className, mode = 'rise', highlight = [] }: Props) {
  const el = useRef<HTMLElement>(null)
  const words = text.split(' ')

  useGSAP(() => {
    if (reducedMotion || !el.current) return
    const targets = el.current.querySelectorAll('.w > span')
    if (mode === 'scrub') {
      gsap.fromTo(
        targets,
        { opacity: 0.16 },
        {
          opacity: 1,
          stagger: 0.08,
          ease: 'none',
          scrollTrigger: { trigger: el.current, start: 'top 80%', end: 'bottom 45%', scrub: true },
        },
      )
    } else {
      gsap.from(targets, {
        yPercent: 110,
        rotate: 4,
        duration: 1.1,
        stagger: 0.035,
        ease: 'expo.out',
        scrollTrigger: { trigger: el.current, start: 'top 88%' },
      })
    }
  })

  const hl = new Set(highlight.map((w) => w.toLowerCase()))

  return (
    <Tag ref={el} className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i}>
          <span
            className="w"
            aria-hidden="true"
            style={{
              display: 'inline-block',
              overflow: mode === 'rise' ? 'hidden' : undefined,
              verticalAlign: 'top',
              paddingBottom: mode === 'rise' ? '0.08em' : undefined,
            }}
          >
            <span style={{ display: 'inline-block' }} className={hl.has(w.toLowerCase().replace(/[^a-z]/g, '')) ? 'caption-box' : undefined}>
              {w}
            </span>
          </span>
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  )
}
