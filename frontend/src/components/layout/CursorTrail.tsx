import { memo, useEffect, useRef, useState, type CSSProperties } from 'react'

// 4-point sparkle matching the classic cursor trail from the previous version
const SPARKLE_PATH =
  'M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0Z'
const SPARKLE_VIEWBOX = '0 0 24 24'

// White sparkles falling from the cursor. Mounted inside the page's background
// wrapper and layered under content, like 2025-signup's #light-cursor, so it
// can't cover a block or a word.
//
// No rAF loop: each star's whole tween goes to the compositor via el.animate(),
// so JS touches a node once per spawn rather than once per frame per star.
//
// Everything keeping stars off text and off bright art lives at the mount site,
// not in here, so checkContract() below states and checks it in dev builds.

const COUNT = 60
// Re-rolled per spawn so stars don't land at even intervals; the delay
// scatters them in time too.
const SPAWN_DIST_MIN = 9
const SPAWN_DIST_MAX = 34
const DELAY_MAX_MS = 120
const LIFE_MS = 1800
const BOX = 24 // fixed box; size variety comes from scale, so no layout
// Cycled, not random — random sizes clump and read as one size.
const SCALE_TIERS = [0.4, 0.85, 0.55, 1]
const SCALE_JITTER = 0.08
const FALL = 150 // px down over a full life
const DRIFT = 45 // ± px sideways over a full life
const FADE_AT = 0.6 // opacity holds at 1 until this fraction of life

// Brightness gate, measured against bg-1/bg-2: their blue/lavender tops out at
// 173, white blooms run 208-250. Reads the decoded source, so a CSS mask or
// opacity on the <img> is invisible to it — a masked-out region still reads at
// its unmasked brightness and over-suppresses. Fails safe, but it will confuse
// anyone calibrating luminanceMax against what they see on screen.
const BG_SELECTOR = '[data-trail-bg]'
const MAP_W = 64
const LUM_MAX = 190

// Capped so a permanently busy main thread can't withhold the trail forever.
const IDLE_TIMEOUT_MS = 500
const IDLE_FALLBACK_MS = 200

// Background image, not inline <svg>: decoded once for all nodes, and a div's
// transform gets composited where an animated <svg>'s does not.
const SPARKLE_URL = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='${SPARKLE_VIEWBOX}'><path fill='#fff' d='${SPARKLE_PATH}'/></svg>`,
)}")`

const NODE_STYLE: CSSProperties = {
  width: BOX,
  height: BOX,
  opacity: 0,
  backgroundImage: SPARKLE_URL,
  backgroundSize: 'contain',
  backgroundRepeat: 'no-repeat',
}

interface LumMap {
  w: number
  h: number
  data: Uint8Array
}

async function buildMap(el: HTMLImageElement): Promise<LumMap> {
  // Samples the <img> already on the page — a fresh Image() would be a second
  // fetch and a second full-size decode of a ~900KB PNG. decode() also waits
  // for load, so a slow connection delays the map rather than losing it.
  await el.decode()
  if (!el.naturalWidth) throw new Error('no intrinsic size')
  const w = MAP_W
  const h = Math.max(1, Math.round((w * el.naturalHeight) / el.naturalWidth))
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) throw new Error('no 2d context')
  ctx.drawImage(el, 0, 0, w, h)
  const px = ctx.getImageData(0, 0, w, h).data
  const data = new Uint8Array(w * h)
  for (let i = 0; i < w * h; i++) {
    data[i] =
      0.2126 * px[i * 4] + 0.7152 * px[i * 4 + 1] + 0.0722 * px[i * 4 + 2]
  }
  return { w, h, data }
}

// Holds the promise, not the map, so concurrent callers share one decode.
// Module-level, so re-entering the route reuses the maps.
const mapCache = new Map<string, Promise<LumMap | null>>()

// Keyed on the caller's currentSrc, not el.src: drawImage rasterises whatever
// srcset is currently displaying, so keying on src would serve one map for two
// different crops across a breakpoint.
function loadMap(el: HTMLImageElement, key: string): Promise<LumMap | null> {
  const cached = mapCache.get(key)
  if (cached) return cached
  const pending = buildMap(el).catch(() => null)
  mapCache.set(key, pending)
  return pending
}

const REROOTS_FIXED = ['transform', 'filter', 'backdropFilter', 'perspective']

// The gate maps a background's on-screen box linearly onto its decoded pixels,
// which only holds while the element is drawn upright. Tailwind v4 emits
// `rotate-180` as the standalone `rotate` property rather than a `transform`,
// so both have to be read — checking `transform` alone silently misses the flip
// and the gate comes out inverted.
const HALF_TURN_MATRIX = 'matrix(-1, 0, 0, -1, 0, 0)'
const IDENTITY_MATRIX = 'matrix(1, 0, 0, 1, 0, 0)'

function isHalfTurn(cs: CSSStyleDeclaration) {
  return cs.rotate === '180deg' || cs.transform === HALF_TURN_MATRIX
}

function isUpright(cs: CSSStyleDeclaration) {
  return (
    (cs.rotate === 'none' || cs.rotate === '0deg') &&
    (cs.transform === 'none' || cs.transform === IDENTITY_MATRIX) &&
    cs.scale === 'none' &&
    cs.translate === 'none'
  )
}

let liveInstances = 0

// Dev only (DEV is statically false in a build, so this all drops out). Every
// condition here fails silently otherwise: it renders, it just looks wrong.
function checkContract(
  root: HTMLElement,
  matches: Element[],
  selector: string,
) {
  const warn = (msg: string) => console.warn(`[CursorTrail] ${msg}`)
  const name = (el: Element) =>
    `<${el.tagName.toLowerCase()}${el.className ? ` class="${String(el.className).slice(0, 60)}"` : ''}>`

  if (liveInstances > 1) {
    warn(
      `${liveInstances} instances are mounted at once. Each runs its own pool and its own mousemove listener, so the trail is ~${liveInstances}x as dense as it was tuned to be.`,
    )
  }

  let negativeZ = false
  for (let el = root.parentElement; el; el = el.parentElement) {
    const cs = getComputedStyle(el)
    if (Number(cs.zIndex) < 0) negativeZ = true
    const blocking = REROOTS_FIXED.filter(
      (p) => cs[p as 'transform'] !== 'none',
    )
    if (/transform|filter/.test(cs.willChange)) blocking.push('will-change')
    if (/paint|layout|strict|content/.test(cs.contain)) blocking.push('contain')
    if (blocking.length) {
      warn(
        `ancestor ${name(el)} sets ${blocking.join(', ')}, which makes it the containing block for this fixed layer. Stars will be positioned in its coordinate space and clipped to its box.`,
      )
    }
  }
  if (!negativeZ) {
    warn(
      'no ancestor has a negative z-index, so this layer paints above ordinary text. Mount it inside the page background wrapper (see FormShell.tsx).',
    )
  }

  if (!matches.length) {
    warn(
      `nothing matches "${selector}", so the brightness gate is off and stars will spawn over bright artwork. Intended only if the background is uniformly dark.`,
    )
    return
  }
  for (const el of matches) {
    if (!(el instanceof HTMLImageElement)) {
      warn(
        `"${selector}" matched ${name(el)}; only <img> can be sampled, so the gate is off for it.`,
      )
      continue
    }
    const cs = getComputedStyle(el)
    const fit = cs.objectFit
    if (fit !== 'fill') {
      warn(
        `background ${name(el)} uses object-fit: ${fit}. The gate maps the element box linearly onto the decoded pixels, so a crop or letterbox makes it sample the wrong ones. Use a natural-aspect image (w-full h-auto).`,
      )
    }
    // A half turn is special-cased (see `flipped`); anything else leaves the
    // box and the decoded pixels out of alignment.
    if (!isUpright(cs) && !isHalfTurn(cs)) {
      warn(
        `background ${name(el)} is transformed (transform: ${cs.transform}, rotate: ${cs.rotate}, scale: ${cs.scale}, translate: ${cs.translate}). Only an upright image or a rotate-180 one samples correctly; anything else gates against the wrong pixels.`,
      )
    }
    const src = el.currentSrc || el.src
    if (src && new URL(src, location.href).origin !== location.origin) {
      if (!el.crossOrigin) {
        warn(
          `background ${name(el)} is cross-origin without crossorigin="anonymous", so sampling it taints the canvas and the gate stays off. Add the attribute and have the host send Access-Control-Allow-Origin.`,
        )
      }
    }
  }
}

interface CursorTrailProps {
  /**
   * Which background `<img>`s to luminance-sample. Scope it per page (e.g.
   * `[data-trail-bg="schedule"]`) so a shared layout image can't leak in.
   */
  bgSelector?: string
  /** 0-255; spawns are suppressed above it. Re-measure for your own artwork. */
  luminanceMax?: number
}

function CursorTrail({
  bgSelector = BG_SELECTOR,
  luminanceMax = LUM_MAX,
}: CursorTrailProps = {}) {
  const [enabled, setEnabled] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const nodesRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    // Touch has no cursor, and mousemove fires on tap — every tap would burst.
    const pointer = window.matchMedia('(hover: hover) and (pointer: fine)')
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const hasIdle = typeof window.requestIdleCallback === 'function'
    let handle: number | undefined

    function clear() {
      if (handle === undefined) return
      if (hasIdle) window.cancelIdleCallback(handle)
      else window.clearTimeout(handle)
      handle = undefined
    }

    // Subscribed rather than read once: turning reduced motion on mid-session
    // has to tear the listeners down, not just hide the nodes from CSS.
    function sync() {
      clear()
      if (!pointer.matches || motion.matches) {
        setEnabled(false)
        return
      }
      // Deferred so the pool is never in the initial render.
      handle = hasIdle
        ? window.requestIdleCallback(() => setEnabled(true), {
            timeout: IDLE_TIMEOUT_MS,
          })
        : window.setTimeout(() => setEnabled(true), IDLE_FALLBACK_MS)
    }

    sync()
    pointer.addEventListener('change', sync)
    motion.addEventListener('change', sync)
    return () => {
      clear()
      pointer.removeEventListener('change', sync)
      motion.removeEventListener('change', sync)
    }
  }, [])

  useEffect(() => {
    if (!enabled) return

    const anims: (Animation | null)[] = new Array(COUNT).fill(null)
    let next = 0
    let spawnCount = 0
    const rollGap = () =>
      SPAWN_DIST_MIN + Math.random() * (SPAWN_DIST_MAX - SPAWN_DIST_MIN)
    let gap = rollGap()
    let lastX = 0
    let lastY = 0
    let havePointer = false

    // Rects cached, invalidated on scroll/resize — spawn does no layout reads.
    // maps/keys run parallel to bgEls, so the spawn path reads an array slot
    // instead of re-deriving a cache key and hitting a Map.
    let bgEls: HTMLImageElement[] = []
    let maps: (LumMap | null)[] = []
    let keys: string[] = []
    let rects: DOMRect[] = []
    // getBoundingClientRect() reports the box after transforms, but the map is
    // built from the unrotated source. A background flipped with rotate-180
    // (both problems/stats pages stack the same gradient twice, the lower one
    // upside down) therefore reads its own opposite end — the gate comes out
    // exactly inverted. Sampling (1-u, 1-v) for those puts it back.
    let flipped: boolean[] = []
    let rectsDirty = true

    // Re-queried rather than snapshotted once: a background can be rendered
    // conditionally, and srcset can swap the displayed resource at a breakpoint.
    function syncBackgrounds() {
      const matches = Array.from(document.querySelectorAll(bgSelector))
      const found = matches.filter(
        (el): el is HTMLImageElement => el instanceof HTMLImageElement,
      )
      if (
        found.length !== bgEls.length ||
        found.some((el, i) => el !== bgEls[i])
      ) {
        for (const el of bgEls) ro.unobserve(el)
        bgEls = found
        maps = new Array(found.length).fill(null)
        keys = new Array(found.length).fill('')
        for (const el of bgEls) ro.observe(el)
        rectsDirty = true
      }
      bgEls.forEach((el, i) => {
        const key = el.currentSrc || el.src
        if (keys[i] === key) return
        keys[i] = key
        maps[i] = null
        const myMaps = maps
        const myKeys = keys
        void loadMap(el, key).then((map) => {
          if (myKeys[i] === key) myMaps[i] = map
        })
      })
      return matches
    }

    // Read here rather than in syncBackgrounds so a class swap is picked up by
    // the same scroll/resize invalidation that already refreshes the rects.
    function refreshRects() {
      rects = bgEls.map((el) => el.getBoundingClientRect())
      flipped = bgEls.map((el) => isHalfTurn(getComputedStyle(el)))
      rectsDirty = false
    }
    function markDirty() {
      rectsDirty = true
    }

    function tooBright(x: number, y: number) {
      if (rectsDirty) refreshRects()
      for (let i = bgEls.length - 1; i >= 0; i--) {
        const map = maps[i]
        const r = rects[i]
        if (!map || !r) continue
        if (x < r.left || x > r.right || y < r.top || y > r.bottom) continue
        let u = (x - r.left) / r.width
        let v = (y - r.top) / r.height
        if (flipped[i]) {
          u = 1 - u
          v = 1 - v
        }
        const cx = Math.min(map.w - 1, Math.max(0, Math.floor(u * map.w)))
        const cy = Math.min(map.h - 1, Math.max(0, Math.floor(v * map.h)))
        return map.data[cy * map.w + cx] > luminanceMax
      }
      return false
    }

    function spawn(x: number, y: number) {
      const slot = next
      next = (next + 1) % COUNT
      const el = nodesRef.current[slot]
      if (!el) return

      const tier = SCALE_TIERS[spawnCount++ % SCALE_TIERS.length]
      const scale = tier * (1 + (Math.random() - 0.5) * 2 * SCALE_JITTER)
      const rot = Math.random() * 360
      const dx = (Math.random() - 0.5) * 2 * DRIFT
      const half = BOX / 2
      const sx = x - half + (Math.random() - 0.5) * 8
      const sy = y - half + (Math.random() - 0.5) * 8

      anims[slot]?.cancel()
      // No `fill` — it would keep every finished animation live forever.
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
        {
          duration: LIFE_MS,
          delay: Math.random() * DELAY_MAX_MS,
          easing: 'linear',
        },
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
      if (dx * dx + dy * dy < gap * gap) return
      lastX = x
      lastY = y
      gap = rollGap()
      if (!tooBright(x, y)) spawn(x, y)
    }

    document.addEventListener('mousemove', onMove, { passive: true })
    // Capture, on document: scroll doesn't bubble, so a listener on window
    // alone misses any inner scroll container the page might put art inside.
    document.addEventListener('scroll', markDirty, {
      passive: true,
      capture: true,
    })
    window.addEventListener('resize', markDirty)
    // Backgrounds with no width/height attribute have a 0-height box until they
    // load, and a rect cached then switches the gate off for good; a
    // bottom-pinned one also moves whenever page height changes, which fires
    // neither scroll nor resize.
    const ro = new ResizeObserver(() => {
      markDirty()
      syncBackgrounds()
    })
    ro.observe(document.documentElement)
    const matches = syncBackgrounds()

    if (import.meta.env.DEV) {
      liveInstances++
      if (rootRef.current) checkContract(rootRef.current, matches, bgSelector)
    }

    return () => {
      if (import.meta.env.DEV) liveInstances--
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('scroll', markDirty, { capture: true })
      window.removeEventListener('resize', markDirty)
      ro.disconnect()
      for (const a of anims) a?.cancel()
    }
  }, [enabled, bgSelector, luminanceMax])

  if (!enabled) return null

  return (
    <div
      ref={rootRef}
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
          style={NODE_STYLE}
        />
      ))}
    </div>
  )
}

// Host pages re-render on every keystroke; without this each one would diff 60
// nodes and re-run 60 ref callbacks for no DOM change.
export default memo(CursorTrail)
