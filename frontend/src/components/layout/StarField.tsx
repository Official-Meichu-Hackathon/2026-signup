import { useMemo, type CSSProperties } from 'react'

// Designer requirement: every star on the page twinkles, each with a
// different time offset. Positions are seeded so they don't jump between
// renders.
function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Same fluid clamp(min, preferred, max) approach used elsewhere in this
// codebase (RegistrationMethodView.tsx, Footer.tsx, MobileNavMenu.tsx) —
// a flat px size looked right on the 1460px reference but ballooned to
// dominate the whole screen at 390px, so each star's size scales between
// the two breakpoints instead of staying fixed.
const fluid = (minPx: number, maxPx: number) => {
  const minVw = 390
  const maxVw = 1460
  const slope = (maxPx - minPx) / (maxVw - minVw)
  const intercept = minPx - slope * minVw
  return `clamp(${minPx}px, ${intercept.toFixed(2)}px + ${(slope * 100).toFixed(4)}vw, ${maxPx}px)`
}

interface Star {
  top: number
  left: number
  size: string
  delay: number
  duration: number
}

// 4-point sparkle — exact path exported from Figma node 894:10335's "main"
// vector (the twinkle-star illustration), not a hand-drawn approximation.
// Exported because CursorTrail draws raw <svg> nodes (it needs refs on each
// one to write transforms imperatively) rather than rendering <Sparkle> —
// the shape has to stay identical between the static field and the cursor
// trail.
export const SPARKLE_VIEWBOX = '0 0 83.8422 91.0007'
export const SPARKLE_PATH =
  'M35.4627 39.6311L16.603 20.4901L35.1137 36.4226C38.6914 39.5021 44.0514 38.8786 46.867 35.0549L61.4358 15.2748L47.2265 38.2622C45.1695 41.5902 45.6488 45.9406 48.3795 48.7119L67.2392 67.8529L48.7285 51.9216C45.1509 48.8421 39.7908 49.4656 36.9752 53.2893L22.4064 73.0694L36.6157 50.082C38.6739 46.7517 38.1934 42.4024 35.4627 39.6311Z'

export function Sparkle({
  className = '',
  style,
}: {
  className?: string
  style?: CSSProperties
}) {
  return (
    <svg
      viewBox={SPARKLE_VIEWBOX}
      fill="currentColor"
      className={className}
      style={style}
    >
      <path d={SPARKLE_PATH} />
    </svg>
  )
}

interface StarFieldProps {
  count?: number
  seed?: number
}

export default function StarField({ count = 24, seed = 2026 }: StarFieldProps) {
  const stars = useMemo<Star[]>(() => {
    const rand = mulberry32(seed)
    return Array.from({ length: count }, () => {
      // One draw shared between both ends of the clamp, so a star that's
      // big at desktop width is also (proportionally) the bigger ones at
      // mobile width, rather than each breakpoint picking independently.
      const t = rand()
      return {
        top: rand() * 100,
        left: rand() * 100,
        size: fluid(10 + t * 15, 20 + t * 70),
        delay: rand() * 4,
        duration: 2.5 + rand() * 2.5,
      }
    })
  }, [count, seed])

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {stars.map((star, i) => (
        <Sparkle
          key={i}
          className="animate-twinkle absolute text-white"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: star.size,
            height: star.size,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
          }}
        />
      ))}
    </div>
  )
}
