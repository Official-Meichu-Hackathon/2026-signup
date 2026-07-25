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

interface Star {
  top: number
  left: number
  size: number
  delay: number
  duration: number
}

// 4-point sparkle matching the ✦ shapes in the mock. Exported because
// CursorTrail draws raw <svg> nodes (it needs refs on each one to write
// transforms imperatively) rather than rendering <Sparkle> — the shape has to
// stay identical between the static field and the cursor trail.
export const SPARKLE_PATH =
  'M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0Z'

export function Sparkle({
  className = '',
  style,
}: {
  className?: string
  style?: CSSProperties
}) {
  return (
    <svg
      viewBox="0 0 24 24"
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
    return Array.from({ length: count }, () => ({
      top: rand() * 100,
      left: rand() * 100,
      size: 8 + rand() * 20,
      delay: rand() * 4,
      duration: 2.5 + rand() * 2.5,
    }))
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
