import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from 'motion/react'
import timelineLine19 from '../../assets/Schedule/timeline-line.svg'
import timelineLine20 from '../../assets/Schedule/timeline-line-0920.svg'
import mobileTimelineLine19 from '../../assets/Schedule/mobile-timeline-line.svg'

type Day = '19' | '20'
type Device = 'desktop' | 'mobile'

interface EventItem {
  time: string
  label: string
  dot: { top: number; left: number }
  text: { top: number; left: number }
}

// 09/20 has no mobile-specific mock in Figma, so both devices share it — its
// artboard aspect ratio (1604x2156) happens to be close to the real mobile
// 09/19 one, so reusing it doesn't reflow the page much when switching days.
// Shifted down 12 points from the raw Figma-read numbers (see DAY20_Y_SHIFT
// below) — at the original values, the first dot/label fell inside the day
// tabs' own vertical span (TABS_20 occupies 0~19.654%), overlapping them.
const DAY20_Y_SHIFT = 12
const EVENTS_20: EventItem[] = [
  {
    time: '08:00-09:00',
    label: '參賽者簽到＋早餐',
    dot: { top: 10.81 + DAY20_Y_SHIFT, left: 25.75 },
    text: { top: 9.98 + DAY20_Y_SHIFT, left: 31.36 },
  },
  {
    time: '09:00-11:00',
    label: 'Coding...... / 企業博覽會 / 娛樂交流活動',
    dot: { top: 16.93 + DAY20_Y_SHIFT, left: 33.97 },
    text: { top: 16.65 + DAY20_Y_SHIFT, left: 38.9 },
  },
  {
    time: '11:00-12:00',
    label: '午餐',
    dot: { top: 27.31 + DAY20_Y_SHIFT, left: 22.26 },
    text: { top: 26.48 + DAY20_Y_SHIFT, left: 26.07 },
  },
  {
    time: '11:20-12:30',
    label: 'Demo前置準備',
    dot: { top: 37.69 + DAY20_Y_SHIFT, left: 33.97 },
    text: { top: 36.91 + DAY20_Y_SHIFT, left: 38.4 },
  },
  {
    time: '12:30-14:30',
    label: '黑客初賽',
    dot: { top: 51.05 + DAY20_Y_SHIFT, left: 18.02 },
    text: { top: 50.73 + DAY20_Y_SHIFT, left: 23.26 },
  },
  {
    time: '11:50-15:10',
    label: '創客決賽',
    dot: { top: 59.57 + DAY20_Y_SHIFT, left: 25.75 },
    text: { top: 58.69 + DAY20_Y_SHIFT, left: 32.36 },
  },
  {
    time: '15:30-17:30',
    label: '黑客決賽',
    dot: { top: 66.81 + DAY20_Y_SHIFT, left: 47.43 },
    text: { top: 65.93 + DAY20_Y_SHIFT, left: 51.42 },
  },
  {
    time: '17:30-18:00',
    label: '評審、人氣獎結算',
    dot: { top: 80.71 + DAY20_Y_SHIFT, left: 32.23 },
    text: { top: 80.38 + DAY20_Y_SHIFT, left: 37.53 },
  },
  {
    time: '18:10-20:00',
    label: '頒獎 / 抽獎 / 閉幕式',
    dot: { top: 98.14 + DAY20_Y_SHIFT, left: 40.2 },
    text: { top: 97.81 + DAY20_Y_SHIFT, left: 44.75 },
  },
]

const LINE_20 = {
  src: timelineLine20,
  aspect: '1604/2156',
  // Top/bottom insets shifted by the same DAY20_Y_SHIFT as the dots above
  // (translating the box down, not resizing it) so the line stays exactly
  // on the dots instead of the box being re-scaled to a different height.
  box: `${10.81 + DAY20_Y_SHIFT}% 52.56% ${1.81 - DAY20_Y_SHIFT}% 18.02%`,
  bleed: '-2.48% -10.93% -2.88% -10.86%',
}

const TABS_20 = {
  sat: { w: 9.975, h: 9.827, top: 0 },
  sun: { w: 13.093, h: 9.827, top: 9.827 },
}

// Percentages read off the Figma frames (node 816:2013 for desktop, 136:209's
// "Component" for mobile 09/19) so the zigzag line, dots and labels stay
// aligned with each other at any width.
const EVENTS: Record<Device, Record<Day, EventItem[]>> = {
  desktop: {
    '19': [
      {
        time: '08:30-09:00',
        label: '參賽者報到、貴賓報到',
        dot: { top: 13.19, left: 29.65 },
        text: { top: 12.17, left: 33 },
      },
      {
        time: '09:00-10:30',
        label: '開幕式',
        dot: { top: 26.08, left: 19.29 },
        text: { top: 25.17, left: 23.02 },
      },
      {
        time: '10:30-12:00',
        label: 'Coding...... / 企業博覽會 / 娛樂交流活動',
        dot: { top: 38.31, left: 25.61 },
        text: { top: 36.96, left: 28.96 },
      },
      {
        time: '12:00-13:30',
        label: '午餐',
        dot: { top: 46.25, left: 37.49 },
        text: { top: 45.28, left: 40.27 },
      },
      {
        time: '13:30-18:00',
        label: 'Coding...... / 企業博覽會 / 娛樂交流活動',
        dot: { top: 56.82, left: 32.94 },
        text: { top: 56.07, left: 37.68 },
      },
      {
        time: '18:00-19:30',
        label: '晚餐',
        dot: { top: 66.74, left: 13.98 },
        text: { top: 65.94, left: 19.17 },
      },
      {
        time: '19:30-21:00',
        label: 'Coding......',
        dot: { top: 83.27, left: 50.9 },
        text: { top: 82.3, left: 54.19 },
      },
      {
        time: '21:00-21:30',
        label: '參賽者領宵夜散場',
        dot: { top: 97.81, left: 35.72 },
        text: { top: 97.28, left: 40.02 },
      },
    ],
    '20': EVENTS_20,
  },
  mobile: {
    '19': [
      {
        time: '08:30-09:00',
        label: '報到',
        dot: { top: 21.42, left: 32.87 },
        text: { top: 20.44, left: 36.58 },
      },
      {
        time: '09:00-10:30',
        label: '開幕式',
        dot: { top: 34.33, left: 21.37 },
        text: { top: 33.47, left: 25.51 },
      },
      {
        time: '10:30-12:00',
        label: 'Coding...... / 企業博覽會 / \n             娛樂交流活動',
        dot: { top: 46.58, left: 28.38 },
        text: { top: 45.32, left: 32.09 },
      },
      {
        time: '12:00-13:30',
        label: '午餐',
        dot: { top: 54.52, left: 41.56 },
        text: { top: 53.55, left: 44.64 },
      },
      {
        time: '13:30-18:00',
        label: 'Coding...... / 企業博覽會（到17:00）/ 娛樂交流活動',
        dot: { top: 65.11, left: 36.51 },
        text: { top: 64.35, left: 41.77 },
      },
      {
        time: '18:00-19:30',
        label: '晚餐',
        dot: { top: 75.04, left: 15.49 },
        text: { top: 74.01, left: 21.23 },
      },
      {
        time: '19:30-21:00',
        label: `Coding...... / \n${' '.repeat(13)}娛樂交流活動`,
        dot: { top: 91.59, left: 56.41 },
        text: { top: 90.62, left: 60.06 },
      },
      {
        time: '21:00-21:30',
        label: '發宵夜、散場',
        dot: { top: 106.15, left: 39.59 },
        text: { top: 105.52, left: 44.36 },
      },
    ],
    '20': EVENTS_20,
  },
}

// Each variant's zigzag line art has its own drop-shadow bleed and lives on a
// differently-proportioned artboard, so the container aspect ratio switches
// along with the day (and, for 09/19, the device).
const LINE: Record<
  Device,
  Record<Day, { src: string; aspect: string; box: string; bleed: string }>
> = {
  desktop: {
    '19': {
      src: timelineLine19,
      aspect: '1581/1857',
      box: '13.19% 49.08% 2.15% 13.98%',
      bleed: '-2.96% -8.83% -3.48% -8.91%',
    },
    '20': LINE_20,
  },
  mobile: {
    '19': {
      src: mobileTimelineLine19,
      aspect: '374.577/487',
      box: '21.42% 43.59% -6.15% 15.49%',
      bleed: '-2.96% -9.18% -3.68% -8.91%',
    },
    '20': LINE_20,
  },
}

// The active day's tab is rendered larger; both sit at a fixed top offset
// (Sat above Sun) regardless of which is active. Mobile pills are the same
// shape as desktop's (just a smaller artboard), so DayTab's own internal
// layout is shared — only these outer box percentages differ.
const TABS: Record<
  Device,
  Record<
    Day,
    {
      sat: { w: number; h: number; top: number }
      sun: { w: number; h: number; top: number }
    }
  >
> = {
  desktop: {
    '19': {
      sat: { w: 13.283, h: 11.216, top: 0 },
      sun: { w: 10.121, h: 11.216, top: 11.216 },
    },
    '20': TABS_20,
  },
  mobile: {
    '19': {
      sat: { w: 14.72, h: 11.23, top: 0 },
      sun: { w: 11.21, h: 11.23, top: 11.26 },
    },
    '20': TABS_20,
  },
}

function DayTab({
  style,
  date,
  day,
  active,
  onClick,
}: {
  style: { top: string; left: string; width: string; height: string }
  date: string
  day: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={style}
      className={`absolute overflow-clip rounded-tr-[60px] rounded-br-[60px] border shadow-[0_10px_30px_rgba(0,0,0,0.25)] backdrop-blur-[14px] transition-all duration-300 ease-out ${active ? 'border-white/35 bg-white/20' : 'border-white/25 bg-white/12'}`}
    >
      <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-br from-white/25 via-white/5 to-transparent shadow-[inset_0_1px_8px_rgba(255,255,255,0.5)]" />
      <p className="font-noto absolute top-[22.6%] left-1/2 -translate-x-1/2 text-center text-[clamp(0.75rem,2.08vw,1.875rem)] leading-[1.47] font-semibold whitespace-nowrap text-white">
        {date}
      </p>
      {/* Sized off the viewport (like the text), not the pill's own width —
          the pill's width differs between active/inactive states, but the
          circle+label shouldn't shrink with it or the label overflows it.
          Anchored the same way as the date above (from the pill's own
          center via left-1/2) plus a fixed rightward nudge, rather than a
          fixed distance from the pill's right edge — the active/inactive
          pill widths differ, so anchoring from the edge instead would slide
          the circle relative to the (fixed-width, always-centered) date
          text above it depending on which state is active. */}
      <div
        className="absolute top-[52.2%] left-1/2 aspect-square w-[clamp(0.875rem,3.75vw,3.375rem)] rounded-full border border-white"
        style={{
          transform: 'translateX(calc(-50% + clamp(0.5rem, 1.6vw, 1.1rem)))',
        }}
      />
      <p
        className="font-zen absolute top-[53.8%] left-1/2 w-[clamp(0.875rem,3.75vw,3.375rem)] text-center text-[clamp(0.328rem,1.39vw,1.25rem)] leading-[2.2] text-white"
        style={{
          transform: 'translateX(calc(-50% + clamp(0.5rem, 1.6vw, 1.1rem)))',
        }}
      >
        {day}
      </p>
    </button>
  )
}

// Renders the 比賽時程 zigzag for whichever day is selected (node 816:2013's
// two property1 variants: 0919頁面 / 0920頁面). `device` picks the desktop
// (816:2013) or mobile (136:209) source geometry — 09/20 has no mobile mock,
// so it's shared between both.
export default function ScheduleTimeline({
  className = '',
  device = 'desktop',
}: {
  className?: string
  device?: Device
}) {
  const [selectedDay, setSelectedDay] = useState<Day>('19')
  const tabs = TABS[device][selectedDay]
  const line = LINE[device][selectedDay]

  const containerRef = useRef<HTMLDivElement>(null)
  // 0 as the timeline starts entering the viewport from the bottom, 1 once
  // its bottom edge reaches the viewport's bottom (fully scrolled into
  // view) — stars connect in step with this as the user scrolls down, not
  // on a fixed timer. Deliberately 'end end', not 'end start': the latter
  // needs the container to scroll completely past the top of the viewport,
  // which requires more scroll distance than the page actually has left
  // after the container (just the Footer band), so the line never finished
  // connecting even at the bottom of the page. 'end end' always finishes at
  // or before the true page bottom, since the container can't extend past
  // its own page.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end end'],
  })
  // Ratchets up with scrollYProgress but never back down, so scrolling back
  // up doesn't retract the line once it's been drawn — once connected, a
  // segment stays connected. Tracked per day (not one shared value) so
  // switching tabs doesn't carry 09/19's progress over onto 09/20, or vice
  // versa — each day remembers only how far its own line has been scrolled
  // through.
  const maxProgress19 = useMotionValue(0)
  const maxProgress20 = useMotionValue(0)

  const maskFor = (p: number) => {
    const pct = p * 100
    if (device === 'mobile') {
      return `linear-gradient(to bottom, black ${pct}%, transparent ${pct}%)`
    }

    // 桌面版維持原樣
    return `linear-gradient(to bottom, black ${Math.max(0, pct - 6)}%, transparent ${pct}%)`
  }
  // Soft-edged reveal (not a hard cut): fully visible above the furthest
  // scroll position reached, fading out over the last 6% before it — reads
  // as a comet trail drawing the constellation rather than a wipe.
  const lineMask19 = useTransform(maxProgress19, maskFor)
  const lineMask20 = useTransform(maxProgress20, maskFor)

  useEffect(() => {
    if (device === 'mobile') return
    const target = selectedDay === '19' ? maxProgress19 : maxProgress20
    const v = scrollYProgress.get()
    if (v > target.get()) target.set(v)
  }, [device, selectedDay, scrollYProgress, maxProgress19, maxProgress20])

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (device === 'mobile') return
    const target = selectedDay === '19' ? maxProgress19 : maxProgress20
    if (v > target.get()) target.set(v)
  })

  // Mobile screens run proportionally much taller relative to the timeline
  // than desktop's, so tying the reveal to scroll position (like desktop)
  // left too much of the page still scrollable with the line only partly
  // drawn — auto-connect instead, independent of scroll. This is plain
  // React state, not maxProgress19/20: useTransform's derived output never
  // recomputed when maxProgress was set outside of useScroll's own update
  // pump (confirmed by logging maxProgress's 'change' event firing while
  // lineMask19/20's own 'change' event never did) — apparently that scroll-
  // linked pipeline only re-evaluates chained transforms inside its own
  // scroll-driven tick, not on an arbitrary manual `.set()`. Plain state
  // sidesteps that entirely and re-renders through React as normal.
  // Tracked per day, and only ever set to true (never back to false), so —
  // matching desktop's ratchet — flipping between tabs doesn't replay the
  // connect animation for a day that's already been shown once.
  const [mobileConnected19, setMobileConnected19] = useState(false)
  const [mobileConnected20, setMobileConnected20] = useState(false)
  useEffect(() => {
    if (device !== 'mobile') return
    const setConnected =
      selectedDay === '19' ? setMobileConnected19 : setMobileConnected20
    const id = requestAnimationFrame(() => setConnected(true))
    return () => cancelAnimationFrame(id)
  }, [device, selectedDay])

  const mobileConnected =
    selectedDay === '19' ? mobileConnected19 : mobileConnected20
  const lineMask =
    device === 'mobile'
      ? maskFor(mobileConnected ? 1 : 0)
      : selectedDay === '19'
        ? lineMask19
        : lineMask20

  return (
    <div
      ref={containerRef}
      className={`relative w-full transition-[aspect-ratio] duration-300 ease-out ${className}`}
      style={{ aspectRatio: line.aspect }}
    >
      <DayTab
        style={{
          top: `${tabs.sat.top}%`,
          left: '0',
          width: `${tabs.sat.w}%`,
          height: `${tabs.sat.h}%`,
        }}
        date="09.19"
        day="Sat"
        active={selectedDay === '19'}
        onClick={() => setSelectedDay('19')}
      />
      <DayTab
        style={{
          top: `${tabs.sun.top}%`,
          left: '0',
          width: `${tabs.sun.w}%`,
          height: `${tabs.sun.h}%`,
        }}
        date="09.20"
        day="Sun"
        active={selectedDay === '20'}
        onClick={() => setSelectedDay('20')}
      />

      {/* Keyed by day so switching days re-triggers the fade-in instead of
          the line/dots/labels just snapping to their new spots. */}
      <div
        key={selectedDay}
        className="animate-fade-in pointer-events-none absolute inset-0"
      >
        {/* The mask is applied directly on the box-inset div, not on an
            inset-0 wrapper around it: line.box's own insets already expand
            past the container's 0~100% where a variant's line art (and its
            last dot) needs it — e.g. mobile 09/19's box bottom inset is
            -6.15%, since its last dot sits at top:106.15%. Masking an
            inset-0 ancestor instead clips that overflow away (the last
            segment never got revealed), and *resizing* that ancestor to
            compensate (an earlier attempt) re-based line.box's own
            percentages on the resized ancestor instead of the container,
            shifting the whole line out of alignment with the dots. Masking
            the box div itself sidesteps both: its rendered box already
            equals the true art bounds, so 0~100% of the mask always matches
            0~100% of the actual content, however far it overflows. */}
        <motion.div
          className="absolute"
          style={{
            inset: line.box,
            WebkitMaskImage: lineMask,
            maskImage: lineMask,
            willChange: 'transform', // 提示瀏覽器這個元素會變動，優化 GPU 處理
            imageRendering: 'crisp-edges', // 某些瀏覽器有效
            // Only mobile's mask is a plain (non-motion) string that flips
            // once per day via React state — this transition is what makes
            // that read as a smooth auto-connect instead of an instant pop.
            // Desktop's is still a motion value driven frame-by-frame by
            // scroll position, so it must stay untransitioned there or
            // every scroll tick would lag behind the actual scroll.
            transition:
              device === 'mobile' ? 'mask-image 1.2s ease-out' : undefined,
          }}
        >
          <div className="absolute" style={{ inset: line.bleed }}>
            {/* 👇 1. 如果是手機版 09/19 */}
            {device === 'mobile' && selectedDay === '19' && (
              <svg
                viewBox="0 0 181 440"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-full w-full"
              >
                <g id="mobile-line-19">
                  <g filter="url(#filter-shadow-19)">
                    <path
                      d="M78.7523 12.2231L35.7036 75.0859L61.9528 134.725L111.301 173.41L92.4019 224.989L13.6543 273.345L166.95 353.939L103.952 424.861"
                      stroke="#D9D9D9"
                      vectorEffect="non-scaling-stroke"
                      strokeWidth="1.2" // 🌟 09/19 的粗細
                    />
                  </g>
                </g>
                <defs>
                  <filter
                    id="filter-shadow-19"
                    x="-0.00155735"
                    y="7.11679e-05"
                    width="180.495"
                    height="439.21"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                  >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      result="hardAlpha"
                    />
                    <feOffset />
                    <feGaussianBlur stdDeviation="0.5" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.01 0"
                    />
                    <feBlend
                      mode="normal"
                      in2="BackgroundImageFix"
                      result="effect1_dropShadow_0_1"
                    />
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      result="hardAlpha"
                    />
                    <feOffset dy="1.04997" />
                    <feGaussianBlur stdDeviation="1.1" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.01 0"
                    />
                    <feBlend
                      mode="normal"
                      in2="effect1_dropShadow_0_1"
                      result="effect2_dropShadow_0_1"
                    />
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      result="hardAlpha"
                    />
                    <feOffset dy="1.04997" />
                    <feGaussianBlur stdDeviation="2.6" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0"
                    />
                    <feBlend
                      mode="normal"
                      in2="effect2_dropShadow_0_1"
                      result="effect3_dropShadow_0_1"
                    />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="effect3_dropShadow_0_1"
                      result="shape"
                    />
                  </filter>
                </defs>
              </svg>
            )}

            {/* 👇 2. 如果是手機版 09/20 */}
            {device === 'mobile' && selectedDay === '20' && (
              <svg
                viewBox="0 0 575 1986"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-full w-full"
              >
                <g id="mobile-line-20">
                  <g filter="url(#filter-shadow-20)">
                    <path
                      d="M175.262 46.707L307.262 178.707L119.262 402.707L307.262 626.707L51.2617 914.707L175.262 1098.71L523.262 1254.71L279.262 1554.71L407.262 1930.71"
                      stroke="#D9D9D9"
                      vectorEffect="non-scaling-stroke"
                      strokeWidth="1.5" // 🌟 09/20 的粗細 (可自行調整，例如 1.2 或 2)
                    />
                  </g>
                </g>
                <defs>
                  <filter
                    id="filter-shadow-20"
                    x="0"
                    y="0"
                    width="574.859"
                    height="1985.03"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                  >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      result="hardAlpha"
                    />
                    <feOffset />
                    <feGaussianBlur stdDeviation="0.5" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.2 0"
                    />
                    <feBlend
                      mode="normal"
                      in2="BackgroundImageFix"
                      result="effect1_dropShadow_0_1"
                    />
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      result="hardAlpha"
                    />
                    <feOffset dy="4" />
                    <feGaussianBlur stdDeviation="10" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0"
                    />
                    <feBlend
                      mode="normal"
                      in2="effect1_dropShadow_0_1"
                      result="effect2_dropShadow_0_1"
                    />
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      result="hardAlpha"
                    />
                    <feOffset dy="4" />
                    <feGaussianBlur stdDeviation="25" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0"
                    />
                    <feBlend
                      mode="normal"
                      in2="effect2_dropShadow_0_1"
                      result="effect3_dropShadow_0_1"
                    />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="effect3_dropShadow_0_1"
                      result="shape"
                    />
                  </filter>
                </defs>
              </svg>
            )}

            {/* 👇 3. 剩下的電腦版維持用 img 載入 */}
            {device === 'desktop' && (
              <img
                src={line.src}
                alt=""
                className="h-full w-full"
                style={{ imageRendering: 'crisp-edges' }}
              />
            )}
          </div>
        </motion.div>

        {/* 注意這裡多抓了一個 index 變數出來 */}
        {EVENTS[device][selectedDay].map(
          ({ time, label, dot, text }, index) => {
            const isBigStar = !(index === 2 || index === 3 || index === 6)

            return (
              <div key={time}>
                <span
                  className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-white ${
                    device === 'mobile'
                      ? // 手機版的 大星星 vs 小星星
                        isBigStar
                        ? 'size-2 shadow-[0_0_8px_2px_rgba(255,255,255,0.65)]'
                        : 'size-1 shadow-[0_0_4px_1px_rgba(255,255,255,0.4)]'
                      : // 電腦版的 大星星 vs 小星星
                        isBigStar
                        ? 'size-3 shadow-[0_0_12px_4px_rgba(255,255,255,0.65)]'
                        : 'size-1.5 shadow-[0_0_6px_2px_rgba(255,255,255,0.4)]'
                  }`}
                  style={{ top: `${dot.top}%`, left: `${dot.left}%` }}
                />

                {/* 原本的文字區塊維持不變 */}
                <p
                  className={`font-noto absolute w-max -translate-y-[0.8em] text-[clamp(0.6875rem,1.74vw,1.5625rem)] leading-[1.6] font-semibold text-white ${device === 'desktop' ? 'whitespace-nowrap' : 'max-w-[58%] whitespace-pre-line'}`}
                  style={{ top: `${dot.top}%`, left: `${text.left}%` }}
                >
                  {time}&nbsp;&nbsp;{label}
                </p>
              </div>
            )
          },
        )}
      </div>
    </div>
  )
}
