import { useEffect, useRef, useState } from 'react'
import { useMotionValueEvent, useScroll } from 'motion/react'
import bg1 from '../assets/home/bg-01.jpg'
import bg2 from '../assets/home/bg-02.jpg'
import bg3 from '../assets/home/bg-03.jpg'
import bg4 from '../assets/home/bg-04.png'
import bg5 from '../assets/home/bg-05.png'
import heroTitle from '../assets/home/hero-title-overlay.png'
import heroCta from '../assets/home/hero-cta-overlay.png'
import EventVision from '../components/home/EventVision'
import GroupIntro from '../components/home/GroupIntro'
import Rules from '../components/home/Rules'
import Awards from '../components/home/Awards'
import PartnerLogos from '../components/home/PartnerLogos'
import StaffAndThanks from '../components/home/StaffAndThanks'
import FloatingNav from '../components/home/FloatingNav'

const BACKGROUND_SEQUENCE = [bg1, bg2, bg3, bg4]

export default function Home() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [frozenRange, setFrozenRange] = useState({ start: 0, height: 0 })
  const [bg5Start, setBg5Start] = useState<number | null>(null)
  const { scrollY } = useScroll()

  useEffect(() => {
    function measure() {
      const vision = document.getElementById('vision')
      if (vision) {
        setFrozenRange({
          start: vision.offsetTop,
          height: Math.max(0, vision.offsetHeight - window.innerHeight),
        })
      }

      const rules = document.getElementById('rules')
      if (rules) {
        const rulesTop = rules.getBoundingClientRect().top + window.scrollY
        setBg5Start(rulesTop + rules.offsetHeight * 0.7)
      }
    }

    measure()
    window.addEventListener('resize', measure)

    const rules = document.getElementById('rules')
    const resizeObserver = new ResizeObserver(measure)
    if (rules) resizeObserver.observe(rules)

    return () => {
      window.removeEventListener('resize', measure)
      resizeObserver.disconnect()
    }
  }, [])

  useMotionValueEvent(scrollY, 'change', (y) => {
    const { start, height } = frozenRange
    const end = start + height
    let effective = y
    if (y > start && y <= end) effective = start
    else if (y > end) effective = y - height
    if (trackRef.current) {
      trackRef.current.style.transform = `translateY(${-effective}px)`
    }
  })

  return (
    <div className="home-page relative font-sans">
      <div className="home-background pointer-events-none fixed inset-0 z-0 overflow-hidden bg-black">
        <div
          ref={trackRef}
          className="home-background-track flex w-full flex-col"
        >
          {BACKGROUND_SEQUENCE.map((bg) => (
            <img
              key={bg}
              src={bg}
              alt=""
              className="min-h-0 w-full object-cover"
            />
          ))}
        </div>
      </div>

      {bg5Start !== null && (
        <div
          className="home-light-background pointer-events-none absolute inset-x-0 bottom-0 z-0 overflow-hidden bg-white"
          style={{ top: `${bg5Start}px` }}
        >
          <img src={bg5} alt="" className="h-auto w-full" />
          <div
            className="absolute inset-x-0 top-0 h-[min(28vw,400px)] bg-black"
            style={{
              maskImage:
                'linear-gradient(to bottom, black 0%, transparent 100%)',
              WebkitMaskImage:
                'linear-gradient(to bottom, black 0%, transparent 100%)',
            }}
          />
        </div>
      )}

      <FloatingNav />

      <section
        id="intro"
        className="home-hero relative aspect-[1440/1024] w-full overflow-hidden"
      >
        <img
          src={heroTitle}
          alt="梅竹黑客松 14th"
          className="home-hero-title animate-pop-in-right absolute top-[11.9%] left-[15.14%] w-[82.75%]"
          style={{ animationDelay: '0.1s' }}
        />
        <img
          src={heroCta}
          alt="準備好創造未來了嗎？"
          className="home-hero-cta animate-pop-in-right absolute top-[50.98%] left-[56.11%] w-[42.13%]"
          style={{ animationDelay: '0.4s' }}
        />
      </section>

      <EventVision />

      <section className="relative">
        <GroupIntro />
        <Rules />
      </section>

      <section id="awards" className="relative">
        <Awards lightBackgroundStart={bg5Start} />
      </section>

      <section className="home-light-section relative" data-nav-theme="light">
        <PartnerLogos />
        <StaffAndThanks />
      </section>
    </div>
  )
}
