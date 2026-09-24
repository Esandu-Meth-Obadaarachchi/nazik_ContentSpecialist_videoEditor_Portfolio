import { scrollToTarget } from '../lib/motion'
import './topbar.css'

export default function TopBar() {
  return (
    <header className="topbar">
      <a
        className="tb-mark"
        href="#intro"
        onClick={(e) => {
          e.preventDefault()
          scrollToTarget(0)
        }}
        aria-label="Nazik Hamza, back to top"
      >
        <span className="tb-name">Nazik Hamza</span>
      </a>
      <a
        className="tb-cta"
        href="#contact"
        onClick={(e) => {
          e.preventDefault()
          scrollToTarget('#contact')
        }}
      >
        Get in touch
      </a>
    </header>
  )
}
