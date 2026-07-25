import { useEffect, useRef, useState } from 'react'
import { SPARKLE_PATH } from './StarField'

// White sparkles falling from the cursor, on every page. Modelled on the
// reference implementation (lt1stsolomid, "客製化鼠標軌跡效果") — stars drop at a
// constant rate, shrink toward nothing and leave a long ribbon — but rebuilt
// around a fixed pool instead of the article's create-a-div-per-mousemove +
// removeChild-on-death approach, which keeps ~500 nodes churning through the
// DOM at any moment. Here the nodes are allocated once and recycled.
//
// Tuning constants were settled against a live prototype; the numbers below
// are the ones that read closest to the reference at a fraction of its cost.

const COUNT = 120 // pool size — the ceiling on stars alive at once
const SPAWN_DIST = 14 // px of cursor travel between spawns
const LIFE_MS = 2500
const SIZE_MIN = 10
const SIZE_MAX = 14
const FALL = 1 // px per 60fps-frame, fixed (the article's velocity.y)
const DRIFT = 0.5 // ± horizontal jitter (the article's velocity.x)
const FADE_AT = 0.25 // hold opacity 1 until this much life is left, then fade

// Sections opt out of the trail. `data-nav-theme="light"` is reused as-is —
// Navbar/FloatingNav already mark light sections with it (see Navbar.tsx), and
// those are exactly the regions where white stars would wash over dark text.
const OPT_OUT = '[data-nav-theme="light"], [data-trail="off"]'

interface Particle {
  life: number // 1 → 0
  x: number
  y: number
  vx: number
  vy: number
  rot: number
  size: number
}

export default function CursorTrail() {
  // Gated behind an effect so the 120 nodes are never in the initial render:
  // touch devices and reduced-motion users never pay for them at all, and
  // everyone else only gets them once the browser is idle.
  const [enabled, setEnabled] = useState(false)
  const nodesRef = useRef<(SVGSVGElement | null)[]>([])

  useEffect(() => {
    // No cursor to trail on touch, and mousemove still fires on tap — without
    // this, every tap would burst stars. Reduced motion opts out entirely.
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // Mount off the critical path so nothing here competes with first paint.
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(() => setEnabled(true))
      return () => window.cancelIdleCallback(id)
    }
    const id = window.setTimeout(() => setEnabled(true), 200)
    return () => window.clearTimeout(id)
  }, [])

  useEffect(() => {
    if (!enabled) return

    const pool: Particle[] = Array.from({ length: COUNT }, () => ({
      life: 0,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      rot: 0,
      size: 0,
    }))
    let next = 0

    let px = 0
    let py = 0
    let lastX = 0
    let lastY = 0
    let havePointer = false
    let pending = false
    let inside = true
    let rafId: number | null = null
    let last = 0

    function spawn(x: number, y: number) {
      const slot = next
      next = (next + 1) % COUNT
      const p = pool[slot]
      p.life = 1
      p.x = x + (Math.random() - 0.5) * 8
      p.y = y + (Math.random() - 0.5) * 8
      p.vx = (Math.random() - 0.5) * 2 * DRIFT
      p.vy = FALL
      // Static random rotation (never animated) — the reference got its variety
      // from two alternating PNGs; one path at a random angle is the cheaper
      // equivalent.
      p.rot = Math.random() * 360
      p.size = SIZE_MIN + Math.random() * (SIZE_MAX - SIZE_MIN)

      // Size is written once here rather than every frame — only transform and
      // opacity change in the loop.
      const el = nodesRef.current[slot]
      if (el) {
        el.style.width = `${p.size}px`
        el.style.height = `${p.size}px`
      }
    }

    function tick(now: number) {
      const dt = Math.min(now - last, 50) // clamp after tab-switch stalls
      last = now
      const dtf = dt / 16.667 // frame-normalised step, so speed is refresh-independent

      // --- read phase: at most one hit-test per frame, before any writes, so
      // the loop never interleaves a forced layout with style mutations ---
      if (pending && inside) {
        const dx = px - lastX
        const dy = py - lastY
        if (dx * dx + dy * dy >= SPAWN_DIST * SPAWN_DIST) {
          lastX = px
          lastY = py
          const el = document.elementFromPoint(px, py)
          if (!el || !el.closest(OPT_OUT)) spawn(px, py)
        }
        pending = false
      }

      // --- write phase: transform + opacity only, both compositor-friendly ---
      let alive = 0
      for (let i = 0; i < COUNT; i++) {
        const p = pool[i]
        if (p.life <= 0) continue
        const el = nodesRef.current[i]
        p.life -= dt / LIFE_MS
        if (p.life <= 0) {
          p.life = 0
          if (el) el.style.opacity = '0'
          continue
        }
        alive++
        if (!el) continue
        p.x += p.vx * dtf
        p.y += p.vy * dtf
        const half = p.size / 2
        el.style.opacity = p.life < FADE_AT ? `${p.life / FADE_AT}` : '1'
        el.style.transform = `translate3d(${p.x - half}px,${p.y - half}px,0) rotate(${p.rot}deg) scale(${p.life})`
      }

      // Nothing alive and nothing queued — stop scheduling frames entirely. An
      // idle cursor costs zero, which is most of the time while reading or
      // filling in the form.
      if (alive === 0 && !pending) {
        rafId = null
        return
      }
      rafId = requestAnimationFrame(tick)
    }

    function onMove(e: MouseEvent) {
      px = e.clientX
      py = e.clientY
      if (!havePointer) {
        lastX = px
        lastY = py
        havePointer = true
      }
      pending = true
      inside = true
      if (rafId === null) {
        last = performance.now()
        rafId = requestAnimationFrame(tick)
      }
    }

    function onLeave() {
      inside = false
      pending = false
    }

    document.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseleave', onLeave)
    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
      if (rafId !== null) cancelAnimationFrame(rafId)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    // No blend on the wrapper: a viewport-sized blend group would keep the
    // whole backdrop composited every frame whether or not a star is alive.
    // Blending per sparkle confines it to a handful of tiny regions instead.
    <div
      aria-hidden
      className="cursor-trail pointer-events-none fixed inset-0 z-[60] select-none"
    >
      {Array.from({ length: COUNT }, (_, i) => (
        <svg
          key={i}
          ref={(el) => {
            nodesRef.current[i] = el
          }}
          viewBox="0 0 24 24"
          fill="currentColor"
          className="absolute top-0 left-0 text-white"
          style={{ opacity: 0, mixBlendMode: 'screen' }}
        >
          <path d={SPARKLE_PATH} />
        </svg>
      ))}
    </div>
  )
}
