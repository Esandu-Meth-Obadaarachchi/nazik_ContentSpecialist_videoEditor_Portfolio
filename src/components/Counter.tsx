import { useRef } from 'react'
import { gsap, reducedMotion, useGSAP } from '../lib/motion'

type Props = {
  value: number
  decimals?: number
  prefix?: string
  suffix?: string
  className?: string
  duration?: number
  start?: string
}

const fmt = (n: number, d: number) =>
  n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d })

/** A number that counts up the first time it scrolls into view. */
export default function Counter({ value, decimals = 0, prefix = '', suffix = '', className, duration = 1.8, start = 'top 85%' }: Props) {
  const el = useRef<HTMLSpanElement>(null)

  useGSAP(() => {
    if (reducedMotion || !el.current) return
    const obj = { n: 0 }
    const out = el.current.querySelector('.cnt-n') as HTMLElement
    out.textContent = fmt(0, decimals)
    gsap.to(obj, {
      n: value,
      duration,
      ease: 'expo.out',
      scrollTrigger: { trigger: el.current, start, once: true },
      onUpdate: () => {
        out.textContent = fmt(obj.n, decimals)
      },
    })
  })

  return (
    <span ref={el} className={className} aria-label={`${prefix}${fmt(value, decimals)}${suffix}`}>
      <span aria-hidden="true">
        {prefix}
        <span className="cnt-n">{fmt(value, decimals)}</span>
        {suffix}
      </span>
    </span>
  )
}
