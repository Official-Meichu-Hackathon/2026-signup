import { useState, type ReactNode } from 'react'
import Navbar from '../layout/Navbar'
import Footer from '../layout/Footer'
import HeroDecorations from '../layout/HeroDecorations'
import StepRail from './StepRail'
import { type Section } from './railSections'

interface FormShellProps {
  activeSection: Section
  reached: Record<Section, boolean>
  onNavigate: (section: Section) => void
  children: ReactNode
}

const BG1_MASK = 'linear-gradient(to bottom, black 40%, transparent 100%)'
const BG2_MASK = 'linear-gradient(to bottom, transparent 0%, black 85%)'

// Starry shell for the /registration form: bg layers, glow title, Navbar,
// Footer, plus a rail slot and card children.
export default function FormShell({
  activeSection,
  reached,
  onNavigate,
  children,
}: FormShellProps) {
  // StepRail reports the active tab's offsetTop; the card is pushed down by it
  // at md+ so its top lines up with the active tab (mobile has no rail → 0).
  const [railOffset, setRailOffset] = useState(0)
  return (
    // Single-cell grid: background and content overlap in one grid slot so the
    // page grows to the taller of the two and the background shows un-cropped.
    <div className="relative grid [min-height:100dvh] w-full min-w-0 grid-cols-[minmax(0,1fr)] overflow-hidden text-white">
      {/* Background cell: bg-black base + two pinned imgs (bg-1 top, bg-2
          bottom); each fades into the black band between them (RWD, no seam). */}
      <div className="pointer-events-none relative -z-10 col-start-1 row-start-1 overflow-hidden bg-black">
        {/* bg-1 — top glow */}
        <img
          src="/bg-1.png"
          alt=""
          draggable={false}
          className="absolute inset-x-0 top-0 block h-auto w-full max-w-none select-none"
          style={{
            maskImage: BG1_MASK,
            WebkitMaskImage: BG1_MASK,
          }}
        />
        {/* bg-2 — lower blob */}
        <img
          src="/bg-2.png"
          alt=""
          draggable={false}
          className="absolute inset-x-0 bottom-0 block h-auto w-full max-w-none select-none"
          style={{
            maskImage: BG2_MASK,
            WebkitMaskImage: BG2_MASK,
          }}
        />
      </div>

      <Navbar />

      {/* Content cell — same grid slot, above the -z-10 background. Top pad
          clears the fixed navbar. */}
      <div className="relative col-start-1 row-start-1 pt-28 md:pt-56">
        {/* lower-left star, far down below the hero star (Figma 894:10450) */}
        <img
          src="/deco/star-03.png"
          alt=""
          draggable={false}
          aria-hidden
          className="twinkle pointer-events-none absolute top-[118rem] left-[6.5%] hidden w-[46.171px] rotate-[-10deg] drop-shadow-[0_10px_4px_rgba(0,0,0,0.25)] select-none md:block"
          style={{ animation: 'twinkle 4.2s ease-in-out infinite 1.4s' }}
        />
        {/* Hero — the glowing title over the shared background layer */}
        <section className="relative flex items-center justify-center py-8 md:py-36">
          <HeroDecorations />
          <h1 className="font-zen relative z-10 text-center text-[3rem] leading-[3.25rem] tracking-widest text-[#F6F6F6] [text-shadow:0_4px_40px_rgba(255,255,255,0.20),0_0_20px_rgba(255,255,255,0.35)] md:text-8xl md:leading-none md:text-white md:[text-shadow:0_0_12px_rgba(255,255,255,0.8),0_0_40px_rgba(255,255,255,0.45),0_0_80px_rgba(160,180,255,0.35)]">
            報名黑客松
          </h1>
        </section>

        {/* Content row — flush-left rail + card column, top-aligned. */}
        <div className="relative z-10 mt-14 flex w-full items-start justify-start gap-2 pr-10 pb-24 pl-0 md:mx-auto md:mt-6 md:w-auto md:max-w-[1600px] md:gap-8 md:pr-12">
          <StepRail
            activeSection={activeSection}
            reached={reached}
            onNavigate={onNavigate}
            onActiveOffset={setRailOffset}
          />

          {/* Card column — left-aligned so the rail→card gap stays constant at
              every width. Card top lines up with the active rail tab via
              --rail-offset. */}
          <div className="min-w-0 flex-1">
            <div
              className="mt-[var(--rail-offset)] md:max-w-[1120px]"
              style={{ ['--rail-offset' as string]: `${railOffset}px` }}
            >
              {children}
            </div>
          </div>
        </div>

        {/* Tall breathing room so bg-2 sits far below the card before it fades
            in. Hosts star-04, just below the card (Figma 894:10451). */}
        <div className="relative h-[22rem]">
          <img
            src="/deco/star-04.png"
            alt=""
            draggable={false}
            aria-hidden
            className="twinkle pointer-events-none absolute top-8 left-[32%] hidden w-[49.266px] rotate-[-150deg] drop-shadow-[0_10px_4px_rgba(0,0,0,0.25)] select-none md:block"
            style={{ animation: 'twinkle 3.4s ease-in-out infinite 2.1s' }}
          />
        </div>

        <Footer />
      </div>
    </div>
  )
}
