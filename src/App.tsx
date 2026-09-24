import { useEffect, useState } from 'react'
import Leader from './components/Leader'
import Reticle from './components/Reticle'
import Timeline from './components/Timeline'
import TopBar from './components/TopBar'
import About from './sections/About'
import Butler from './sections/Butler'
import Credits from './sections/Credits'
import Dongfeng from './sections/Dongfeng'
import EditBay from './sections/EditBay'
import Experience from './sections/Experience'
import Hero from './sections/Hero'
import Jetour from './sections/Jetour'
import Process from './sections/Process'
import Timekeeper from './sections/Timekeeper'
import { ScrollTrigger, startSmoothScroll } from './lib/motion'

export default function App() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    startSmoothScroll()
    // Pinned sections measure layout, so re-measure once fonts and images settle.
    const refresh = () => ScrollTrigger.refresh()
    document.fonts?.ready.then(refresh)
    window.addEventListener('load', refresh)
    return () => window.removeEventListener('load', refresh)
  }, [])

  return (
    <>
      <a className="skip-link" href="#about">
        Skip to content
      </a>
      <Leader onDone={() => setReady(true)} />
      <TopBar />
      <main>
        <Hero ready={ready} />
        <About />
        <Process />
        <Experience />
        <Dongfeng />
        <Jetour />
        <Timekeeper />
        <Butler />
        <EditBay />
        <Credits />
      </main>
      <Timeline />
      <Reticle />
      <div className="grain" aria-hidden="true" />
    </>
  )
}
