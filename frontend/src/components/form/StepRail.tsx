import { useLayoutEffect, useRef } from 'react'
import { RAIL_SECTIONS, type Section } from './railSections'

interface StepRailProps {
  activeSection: Section
  reached: Record<Section, boolean>
  onNavigate: (section: Section) => void
  onActiveOffset?: (px: number) => void
}

// Left rail: 4 glass tabs stacked flush; the active tab is wider. Unreached
// tabs are disabled for navigation.
export default function StepRail({
  activeSection,
  reached,
  onNavigate,
  onActiveOffset,
}: StepRailProps) {
  const navRef = useRef<HTMLElement>(null)
  // Only fire the setter when the offset changes, to avoid render churn.
  const lastOffsetRef = useRef<number>(-1)

  useLayoutEffect(() => {
    const nav = navRef.current
    if (!nav) return

    const measure = () => {
      const active = nav.querySelector<HTMLElement>('[aria-current="step"]')
      const offset = active ? active.offsetTop : 0
      if (offset !== lastOffsetRef.current) {
        lastOffsetRef.current = offset
        onActiveOffset?.(offset)
      }
    }

    // Measure now and whenever the rail resizes (text reflows per breakpoint).
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(nav)
    window.addEventListener('resize', measure)

    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [activeSection, onActiveOffset])

  return (
    <nav
      ref={navRef}
      aria-label="報名區段"
      className="relative z-20 flex shrink-0 flex-col gap-0"
    >
      {RAIL_SECTIONS.map(({ section, label }, index) => {
        const isActive = section === activeSection
        const isReached = reached[section]
        return (
          <button
            key={section}
            type="button"
            aria-label={label}
            aria-current={isActive ? 'step' : undefined}
            disabled={!isReached}
            onClick={() => isReached && onNavigate(section)}
            // Glass spec; flush stacking (-mt-px overlaps borders into one line).
            className={`relative flex min-h-[4.5rem] transform-gpu items-center justify-center overflow-hidden rounded-r-[1.75rem] border-[0.272px] border-[rgba(255,255,255,0.2)] bg-[linear-gradient(161deg,rgba(255,255,255,0.14)_0%,rgba(255,255,255,0.03)_90.55%)] py-5 shadow-[0_0.1701rem_0.5104rem_0_rgba(0,0,0,0.25),inset_0_0.017rem_0.1361rem_0_rgba(255,255,255,0.5)] backdrop-blur-[0.5954rem] transition-all duration-200 [will-change:transform] [backface-visibility:hidden] md:min-h-40 md:rounded-r-[4.0625rem] md:border md:py-12 md:shadow-[0_0.625rem_1.875rem_0_rgba(0,0,0,0.25),inset_0_0.0625rem_0.5rem_0_rgba(255,255,255,0.5)] md:backdrop-blur-[2.1875rem] ${
              index > 0 ? '-mt-px' : ''
            } ${
              isActive
                ? 'z-20 w-20 pr-2 pl-4 md:w-52 md:pr-3 md:pl-9'
                : `z-10 w-16 md:w-40 ${
                    isReached ? 'cursor-pointer' : 'cursor-default'
                  }`
            }`}
          >
            <span
              className={`relative z-10 text-xs tracking-[0.15em] text-white [writing-mode:vertical-rl] md:text-[1.875rem] md:tracking-[0.35em] ${
                isActive ? '-translate-y-1 md:-translate-y-2' : ''
              }`}
            >
              {label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
