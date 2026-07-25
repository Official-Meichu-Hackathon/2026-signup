import { useEffect, useRef, useState } from 'react'
import { SPARKLE_PATH } from './StarField'

// White sparkles falling from the cursor. Same containment approach as
// 2025-signup's #light-cursor: mounted inside a page's background wrapper and
// layered under content, so it can't cover a block or a word.
//
// There is no rAF loop. Each star's full 2.5s tween is handed to the
// compositor via el.animate(), so JS touches a node once per spawn instead of
// once per frame per star. Nothing animates but transform and opacity, and the
// element's box never changes size — scale does the shrinking, so no layout
// and no SVG re-rasterisation.

const COUNT = 60 // pool size; recycled round-robin
const SPAWN_DIST = 14 // px of cursor travel between spawns
const LIFE_MS = 2500
const BOX = 24 // fixed element size; variety comes from the start scale
const SCALE_MIN = 0.4
const SCALE_MAX = 0.6
const FALL = 150 // px travelled downward over a full life
const DRIFT = 45 // ± horizontal travel over a full life
const FADE_AT = 0.75 // hold opacity 1 until this fraction of life has passed

// Backdrop brightness gate. The artwork's blue/lavender tops out at 173 and
// its white blooms run 208-250, so 190 keeps the colour and drops only white.
// CSS can't tell these apart — both live inside one <img> — so the image is
// sampled directly. Untagged areas are the bg-black base and always pass.
const BG_SELECTOR = '[data-trail-bg]'
const MAP_W = 64
const LUM_MAX = 190

// The sparkle as a background image rather than an inline <svg>: the raster is
// decoded once and reused by all 60 nodes, and a plain div's transform gets
// promoted to the compositor, which an animated <svg> does not reliably do.
const SPARKLE_URL = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='#fff' d='${SPARKLE_PATH}'/></svg>`,
)}")`

interface LumMap {
  w: number
  h: number
  data: Uint8Array
}

const mapCache = new Map<string, LumMap | null>()

async function loadMap(url: string): Promise<LumMap | null> {
  const cached = mapCache.get(url)
  if (cached !== undefined) return cached
  try {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = url
    await img.decode()
    if (!img.naturalWidth) throw new Error('no intrinsic size')
    const w = MAP_W
    const h = Math.max(
      1,
      Math.round((w * img.naturalHeight) / img.naturalWidth),
    )
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) throw new Error('no 2d context')
    ctx.drawImage(img, 0, 0, w, h)
    const px = ctx.getImageData(0, 0, w, h).data
    const data = new Uint8Array(w * h)
    for (let i = 0; i < w * h; i++) {
      data[i] =
        0.2126 * px[i * 4] + 0.7152 * px[i * 4 + 1] + 0.0722 * px[i * 4 + 2]
    }
    const map = { w, h, data }
    mapCache.set(url, map)
    return map
  } catch {
    mapCache.set(url, null)
    return null
  }
}

export default function CursorTrail() {
  // Deferred so the pool is never in the initial render.
  const [enabled, setEnabled] = useState(false)
  const nodesRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    // No cursor on touch, and mousemove fires on tap — without this every tap
    // would burst stars.
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(() => setEnabled(true))
      return () => window.cancelIdleCallback(id)
    }
    const id = window.setTimeout(() => setEnabled(true), 200)
    return () => window.clearTimeout(id)
  }, [])

  useEffect(() => {
    if (!enabled) return

    const anims: (Animation | null)[] = new Array(COUNT).fill(null)
    let next = 0
    let lastX = 0
    let lastY = 0
    let havePointer = false

    // Background rects are cached and only refreshed on scroll/resize, so the
    // spawn path does no layout reads at all.
    const bgEls = Array.from(
      document.querySelectorAll<HTMLImageElement>(BG_SELECTOR),
    )
    let rects: DOMRect[] = []
    let rectsDirty = true
    for (const el of bgEls) void loadMap(el.currentSrc || el.src)

    function refreshRects() {
      rects = bgEls.map((el) => el.getBoundingClientRect())
      rectsDirty = false
    }
    function markDirty() {
      rectsDirty = true
    }

    function tooBright(x: number, y: number) {
      if (rectsDirty) refreshRects()
      for (let i = bgEls.length - 1; i >= 0; i--) {
        const map = mapCache.get(bgEls[i].currentSrc || bgEls[i].src)
        const r = rects[i]
        if (!map || !r) continue
        if (x < r.left || x > r.right || y < r.top || y > r.bottom) continue
        const u = (x - r.left) / r.width
        const v = (y - r.top) / r.height
        const cx = Math.min(map.w - 1, Math.max(0, Math.floor(u * map.w)))
        const cy = Math.min(map.h - 1, Math.max(0, Math.floor(v * map.h)))
        return map.data[cy * map.w + cx] > LUM_MAX
      }
      return false
    }

    function spawn(x: number, y: number) {
      const slot = next
      next = (next + 1) % COUNT
      const el = nodesRef.current[slot]
      if (!el) return

      const scale = SCALE_MIN + Math.random() * (SCALE_MAX - SCALE_MIN)
      const rot = Math.random() * 360
      const dx = (Math.random() - 0.5) * 2 * DRIFT
      const half = BOX / 2
      const sx = x - half + (Math.random() - 0.5) * 8
      const sy = y - half + (Math.random() - 0.5) * 8

      anims[slot]?.cancel()
      // No `fill`, so the animation releases the node on finish and the base
      // opacity: 0 applies again — a filled animation would stay live forever
      // and keep the element in the style-recalc set.
      const anim = el.animate(
        [
          {
            transform: `translate3d(${sx}px,${sy}px,0) rotate(${rot}deg) scale(${scale})`,
            opacity: 1,
          },
          { opacity: 1, offset: FADE_AT },
          {
            transform: `translate3d(${sx + dx}px,${sy + FALL}px,0) rotate(${rot}deg) scale(0)`,
            opacity: 0,
          },
        ],
        { duration: LIFE_MS, easing: 'linear' },
      )
      anim.onfinish = () => anim.cancel()
      anims[slot] = anim
    }

    function onMove(e: MouseEvent) {
      const x = e.clientX
      const y = e.clientY
      if (!havePointer) {
        lastX = x
        lastY = y
        havePointer = true
        return
      }
      const dx = x - lastX
      const dy = y - lastY
      if (dx * dx + dy * dy < SPAWN_DIST * SPAWN_DIST) return
      lastX = x
      lastY = y
      if (!tooBright(x, y)) spawn(x, y)
    }

    document.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('scroll', markDirty, { passive: true })
    window.addEventListener('resize', markDirty)
    return () => {
      document.removeEventListener('mousemove', onMove)
      window.removeEventListener('scroll', markDirty)
      window.removeEventListener('resize', markDirty)
      for (const a of anims) a?.cancel()
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div
      aria-hidden
      className="cursor-trail pointer-events-none fixed inset-0 select-none"
    >
      {Array.from({ length: COUNT }, (_, i) => (
        <div
          key={i}
          ref={(el) => {
            nodesRef.current[i] = el
          }}
          className="absolute top-0 left-0"
          style={{
            width: BOX,
            height: BOX,
            opacity: 0,
            backgroundImage: SPARKLE_URL,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
          }}
        />
      ))}
    </div>
  )
}
