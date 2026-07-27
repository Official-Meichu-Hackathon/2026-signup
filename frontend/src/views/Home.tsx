import { useEffect, useRef, useState } from 'react'
import { useMotionValueEvent, useScroll } from 'motion/react'
import bg1 from '../assets/home/bg-01.webp'
import bg2 from '../assets/home/bg-02.webp'
import bg3 from '../assets/home/bg-03.webp'
import bgTransition from '../assets/home/bg-transition-figma.png'
import heroTitle from '../assets/home/hero-title-overlay.webp'
import heroCta from '../assets/home/hero-cta-overlay.webp'
import EventVision from '../components/home/EventVision'
import GroupIntro from '../components/home/GroupIntro'
import Rules from '../components/home/Rules'
import Awards from '../components/home/Awards'
import PartnerLogos from '../components/home/PartnerLogos'
import StaffAndThanks from '../components/home/StaffAndThanks'
import FloatingNav from '../components/home/FloatingNav'

const BACKGROUND_SEQUENCE = [bg1, bg2, bg3]
const RESIZE_SCROLL_SECTION = '[data-resize-scroll-section]'
const RESIZE_GESTURE_IDLE_MS = 300

type ResizeScrollAnchor = {
  section: string
  progress: number
  viewportWidth: number
  viewportHeight: number
  pixelRatio: number
}

export default function Home() {
  const trackRef = useRef<HTMLDivElement>(null)
  const resizeScrollAnchorRef = useRef<ResizeScrollAnchor | null>(null)
  const [frozenRange, setFrozenRange] = useState({ start: 0, height: 0 })
  const [lightTransitionRange, setLightTransitionRange] = useState<{
    start: number
    end: number
  } | null>(null)
  const { scrollY } = useScroll()

  useEffect(() => {
    let resizeFrame = 0
    let scrollTimer = 0
    let settleFrame = 0
    let resizeTimer = 0
    let isRestoring = false
    let lastDirectScrollInput = 0
    let activeResizeAnchor: ResizeScrollAnchor | null = null

    function captureScrollAnchor(force = false) {
      const previous = resizeScrollAnchorRef.current
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      const pixelRatio = window.devicePixelRatio

      // Zooming can dispatch scroll after the layout has changed but before
      // resize. Keep the last pre-resize anchor until restoration is complete.
      if (
        !force &&
        previous &&
        (previous.viewportWidth !== viewportWidth ||
          previous.viewportHeight !== viewportHeight ||
          previous.pixelRatio !== pixelRatio)
      ) {
        return
      }

      const sections = Array.from(
        document.querySelectorAll<HTMLElement>(RESIZE_SCROLL_SECTION),
      )
      if (sections.length === 0) return

      const viewportCenter = window.scrollY + viewportHeight / 2
      const section =
        sections.find((element) => {
          const top = element.getBoundingClientRect().top + window.scrollY
          return (
            viewportCenter >= top && viewportCenter < top + element.offsetHeight
          )
        }) ?? sections.at(-1)

      const sectionName = section?.dataset.resizeScrollSection
      if (!section || !sectionName) return

      const sectionTop = section.getBoundingClientRect().top + window.scrollY
      const sectionHeight = Math.max(1, section.offsetHeight)

      resizeScrollAnchorRef.current = {
        section: sectionName,
        progress: Math.min(
          1,
          Math.max(0, (viewportCenter - sectionTop) / sectionHeight),
        ),
        viewportWidth,
        viewportHeight,
        pixelRatio,
      }
    }

    function restoreScrollAnchor(
      anchor: ResizeScrollAnchor,
      captureAfterRestore = true,
    ) {
      const section = document.querySelector<HTMLElement>(
        `[data-resize-scroll-section="${anchor.section}"]`,
      )
      if (!section) {
        captureScrollAnchor(true)
        return
      }

      const sectionTop = section.getBoundingClientRect().top + window.scrollY
      const targetCenter = sectionTop + section.offsetHeight * anchor.progress
      const maxScroll = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight,
      )
      const targetScroll = Math.min(
        maxScroll,
        Math.max(0, targetCenter - window.innerHeight / 2),
      )

      isRestoring = true
      if (Math.abs(window.scrollY - targetScroll) > 0.5) {
        window.scrollTo(0, targetScroll)
      }
      cancelAnimationFrame(settleFrame)
      settleFrame = requestAnimationFrame(() => {
        isRestoring = false
        if (captureAfterRestore) captureScrollAnchor(true)
      })
    }

    function handleWheel(event: WheelEvent) {
      // Ctrl/⌘ + wheel is browser zoom, not page navigation.
      if (!event.ctrlKey && !event.metaKey) {
        lastDirectScrollInput = performance.now()
      }
    }

    function handleTouchMove() {
      lastDirectScrollInput = performance.now()
    }

    function handleScroll() {
      if (isRestoring) return
      window.clearTimeout(scrollTimer)

      if (performance.now() - lastDirectScrollInput < 250) {
        captureScrollAnchor()
        return
      }

      // Resize/zoom can emit its own scroll event immediately before resize.
      // Only commit a new anchor after scrolling has actually settled.
      scrollTimer = window.setTimeout(() => {
        captureScrollAnchor()
      }, 100)
    }

    function handleResize() {
      window.clearTimeout(scrollTimer)
      window.clearTimeout(resizeTimer)

      // Keep the first anchor for the entire zoom gesture. Using each
      // intermediate correction as the next baseline would accumulate a small
      // rounding/layout error on every frame.
      if (!activeResizeAnchor) {
        activeResizeAnchor = resizeScrollAnchorRef.current
      }

      // Window and visualViewport can both fire for the same size change.
      // Coalesce them into one correction per rendered frame to avoid the
      // visible back-and-forth caused by repeated scrollTo calls.
      if (!resizeFrame) {
        resizeFrame = requestAnimationFrame(() => {
          resizeFrame = 0
          if (activeResizeAnchor) {
            restoreScrollAnchor(activeResizeAnchor, false)
          } else {
            captureScrollAnchor(true)
          }
        })
      }

      // Finish on the exact anchor and save it as the baseline for the next
      // resize gesture.
      resizeTimer = window.setTimeout(() => {
        if (activeResizeAnchor) restoreScrollAnchor(activeResizeAnchor)
        activeResizeAnchor = null
      }, RESIZE_GESTURE_IDLE_MS)
    }

    captureScrollAnchor(true)
    const visualViewport = window.visualViewport
    window.addEventListener('wheel', handleWheel, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize)
    visualViewport?.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
      visualViewport?.removeEventListener('resize', handleResize)
      window.clearTimeout(scrollTimer)
      cancelAnimationFrame(resizeFrame)
      cancelAnimationFrame(settleFrame)
      window.clearTimeout(resizeTimer)
    }
  }, [])

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
      const lightSection = document.querySelector<HTMLElement>(
        '.home-light-section',
      )
      if (rules && lightSection) {
        const rulesTop = rules.getBoundingClientRect().top + window.scrollY
        const lightSectionTop =
          lightSection.getBoundingClientRect().top + window.scrollY
        const start = rulesTop + rules.offsetHeight * 0.8

        setLightTransitionRange({
          start,
          end: Math.max(start + 1, lightSectionTop),
        })
      }
    }

    measure()
    window.addEventListener('resize', measure)

    const observedElements = [
      document.getElementById('rules'),
      document.getElementById('awards'),
      document.querySelector<HTMLElement>('.home-light-section'),
    ].filter((element): element is HTMLElement => element !== null)
    const resizeObserver = new ResizeObserver(measure)
    observedElements.forEach((element) => resizeObserver.observe(element))

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
          {BACKGROUND_SEQUENCE.map((bg, index) => {
            const isLastBackground = index === BACKGROUND_SEQUENCE.length - 1

            return (
              <div key={bg} className="relative w-full shrink-0">
                <img
                  src={bg}
                  alt=""
                  loading={index === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  fetchPriority={index === 0 ? 'high' : 'low'}
                  className="block h-auto w-full"
                />
                {isLastBackground && (
                  <div className="absolute inset-x-0 bottom-0 h-[38%] bg-gradient-to-b from-transparent via-black/80 to-black" />
                )}
              </div>
            )
          })}
          <div className="h-screen min-h-[720px] w-full shrink-0 bg-black" />
        </div>
      </div>

      {lightTransitionRange !== null && (
        <div
          className="home-light-background pointer-events-none absolute inset-x-0 z-0 overflow-hidden"
          style={{
            top: `${lightTransitionRange.start}px`,
            height: `${lightTransitionRange.end - lightTransitionRange.start}px`,
          }}
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(8,5,6,0.88)_18%,#17203a_46%,#5d7ec0_68%,#e9eef7_87%,#fdfdfd_100%)]" />
          <img
            src={bgTransition}
            alt=""
            loading="lazy"
            decoding="async"
            fetchPriority="low"
            className="absolute top-1/2 left-0 h-[86%] w-full -translate-y-1/2 object-fill opacity-90"
            style={{
              maskImage:
                'linear-gradient(to bottom, transparent 0%, black 16%, black 82%, transparent 100%)',
              WebkitMaskImage:
                'linear-gradient(to bottom, transparent 0%, black 16%, black 82%, transparent 100%)',
            }}
          />
          <div className="absolute inset-x-0 bottom-0 h-[14%] bg-gradient-to-b from-transparent to-[#fdfdfd]" />
        </div>
      )}

      <FloatingNav />

      <section
        id="intro"
        data-resize-scroll-section="intro"
        className="home-hero relative aspect-[1440/1024] w-full overflow-hidden"
      >
        <img
          src={heroTitle}
          alt="梅竹黑客松 14th"
          loading="eager"
          decoding="async"
          fetchPriority="high"
          className="home-hero-title animate-pop-in-right absolute top-[11.9%] left-[15.14%] w-[82.75%]"
          style={{ animationDelay: '0.1s' }}
        />
        <img
          src={heroCta}
          alt="準備好創造未來了嗎？"
          loading="eager"
          decoding="async"
          className="home-hero-cta animate-pop-in-right absolute top-[50.98%] left-[56.11%] w-[42.13%]"
          style={{ animationDelay: '0.4s' }}
        />
      </section>

      <EventVision />

      <section
        className="relative"
        data-resize-scroll-section="groups-and-rules"
      >
        <GroupIntro />
        <Rules />
      </section>

      <section
        id="awards"
        className="relative z-10"
        data-resize-scroll-section="awards"
      >
        <Awards lightBackgroundStart={lightTransitionRange?.start ?? null} />
      </section>

      <section
        className="home-light-section relative z-0 bg-[#fdfdfd] md:pb-[172px]"
        data-nav-theme="light"
        data-resize-scroll-section="partners-and-staff"
      >
        <PartnerLogos />
        <StaffAndThanks />
      </section>
    </div>
  )
}
