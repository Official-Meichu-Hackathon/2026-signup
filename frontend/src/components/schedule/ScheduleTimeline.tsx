import { useEffect, useRef, useState } from 'react'
import {
  animate,
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
const EVENTS_20: EventItem[] = [
  {
    time: '08:00-09:00',
    label: '參賽者簽到＋早餐',
    dot: { top: 10.81, left: 25.75 },
    text: { top: 9.98, left: 31.36 },
  },
  {
    time: '09:00-11:00',
    label: 'Coding...... / 企業博覽會 / 娛樂交流活動',
    dot: { top: 16.93, left: 33.97 },
    text: { top: 16.65, left: 38.9 },
  },
  {
    time: '11:00-12:00',
    label: '午餐',
    dot: { top: 27.31, left: 22.26 },
    text: { top: 26.48, left: 26.07 },
  },
  {
    time: '11:20-12:30',
    label: 'Demo前置準備',
    dot: { top: 37.69, left: 33.97 },
    text: { top: 36.91, left: 38.4 },
  },
  {
    time: '12:30-14:30',
    label: '黑客初賽',
    dot: { top: 51.05, left: 18.02 },
    text: { top: 50.73, left: 23.26 },
  },
  {
    time: '11:50-15:10',
    label: '創客決賽',
    dot: { top: 59.57, left: 25.75 },
    text: { top: 58.69, left: 32.36 },
  },
  {
    time: '15:30-17:30',
    label: '黑客決賽',
    dot: { top: 66.81, left: 47.43 },
    text: { top: 65.93, left: 51.42 },
  },
  {
    time: '17:30-18:00',
    label: '評審、人氣獎結算',
    dot: { top: 80.71, left: 32.23 },
    text: { top: 80.38, left: 37.53 },
  },
  {
    time: '18:10-20:00',
    label: '頒獎 / 抽獎 / 閉幕式',
    dot: { top: 98.14, left: 40.2 },
    text: { top: 97.81, left: 44.75 },
  },
]

const LINE_20 = {
  src: timelineLine20,
  aspect: '1604/2156',
  box: '10.81% 52.56% 1.81% 18.02%',
  bleed: '-2.48% -10.93% -2.88% -10.86%',
}

const TABS_20 = {
  sat: { w: 9.975, h: 8.627, top: 0 },
  sun: { w: 13.093, h: 8.627, top: 8.627 },
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
        label: 'Coding...... / 企業博覽會 / 娛樂交流活動',
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
        label: 'Coding...... / 娛樂交流活動',
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
      sat: { w: 13.283, h: 10.016, top: 0 },
      sun: { w: 10.121, h: 10.016, top: 10.016 },
    },
    '20': TABS_20,
  },
  mobile: {
    '19': {
      sat: { w: 14.72, h: 10.03, top: 0 },
      sun: { w: 11.21, h: 10.03, top: 10.06 },
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
      className={`absolute overflow-clip rounded-tr-[65px] rounded-br-[65px] border shadow-[0_10px_30px_rgba(0,0,0,0.25)] backdrop-blur-[35px] transition-all duration-300 ease-out ${active ? 'border-white/30 bg-white/15' : 'border-white/20 bg-white/10'}`}
    >
      <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_8px_rgba(255,255,255,0.5)]" />
      <p className="font-noto absolute top-[22.6%] left-1/2 -translate-x-1/2 text-center text-[clamp(0.75rem,2.08vw,1.875rem)] leading-[1.47] font-semibold whitespace-nowrap text-white">
        {date}
      </p>
      {/* Sized off the viewport (like the text), not the pill's own width —
          the pill's width differs between active/inactive states, but the
          circle+label shouldn't shrink with it or the label overflows it. */}
      <div className="absolute top-[52.2%] left-1/2 aspect-square w-[clamp(0.875rem,3.75vw,3.375rem)] -translate-x-1/2 rounded-full border border-white" />
      <p className="font-zen absolute inset-x-0 top-[53.8%] text-center text-[clamp(0.328rem,1.39vw,1.25rem)] leading-[2.2] text-white">
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
    offset:
      device === 'mobile' ? ['start 35%', 'end 45%'] : ['start end', 'end end'],
  })
  // Ratchets up with scrollYProgress but never back down, so scrolling back
  // up doesn't retract the line once it's been drawn — once connected, a
  // segment stays connected. Tracked per day (not one shared value) so
  // switching tabs doesn't carry 09/19's progress over onto 09/20, or vice
  // versa — each day remembers only how far its own line has been scrolled
  // through.
  const maxProgress19 = useMotionValue(0)
  const maxProgress20 = useMotionValue(0)

  useEffect(() => {
    const target = selectedDay === '19' ? maxProgress19 : maxProgress20
    if (device === 'mobile') {
      const controls = animate(target, 1, {
        duration: 1.2,
        ease: [0.25, 0.1, 0.25, 1],
      })
      return () => controls.stop()
    } else {
      const v = scrollYProgress.get()
      if (v > target.get()) target.set(v)
    }
  }, [device, selectedDay, scrollYProgress, maxProgress19, maxProgress20])

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const target = selectedDay === '19' ? maxProgress19 : maxProgress20
    if (v > target.get()) target.set(v)
  })
  const maskFor = (p: number) => {
    const pct = p * 100
    return `linear-gradient(to bottom, black ${Math.max(0, pct - 6)}%, transparent ${pct}%)`
  }
  // Soft-edged reveal (not a hard cut): fully visible above the furthest
  // scroll position reached, fading out over the last 6% before it — reads
  // as a comet trail drawing the constellation rather than a wipe.
  const lineMask19 = useTransform(maxProgress19, maskFor)
  const lineMask20 = useTransform(maxProgress20, maskFor)
  const lineMask = selectedDay === '19' ? lineMask19 : lineMask20

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
        {/* Masked at the full-container scale (same 0~100% space as each
            dot's `top`), wrapping the box+bleed-inset nesting the line art
            itself needs for its drop-shadow bleed — keeps the mask's percent
            values directly comparable to dot.top instead of needing a
            conversion between the two coordinate spaces. */}
        <motion.div
          className="absolute inset-0"
          style={{ WebkitMaskImage: lineMask, maskImage: lineMask }}
        >
          <div className="absolute" style={{ inset: line.box }}>
            <div className="absolute" style={{ inset: line.bleed }}>
              <img src={line.src} alt="" className="h-full w-full" />
            </div>
          </div>
        </motion.div>

        {EVENTS[device][selectedDay].map(({ time, label, dot, text }) => (
          <div key={time}>
            <span
              className="absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_10px_3px_rgba(255,255,255,0.65)]"
              style={{ top: `${dot.top}%`, left: `${dot.left}%` }}
            />
            {/* Desktop: no wrap — there's always enough room past the
                text's start position for even the longest label. Mobile
                keeps the max-w-[40%] cap (and wraps): the two longest
                labels genuinely need more width than mobile has left of
                their start position, and the font is already at this
                clamp's floor, so nowrap would just overflow invisibly
                past the canvas's own overflow-hidden edge instead of
                wrapping — worse than the wrap it's replacing. */}
            <p
              className={`font-noto absolute w-max text-[clamp(0.6875rem,1.74vw,1.5625rem)] leading-[1.6] font-semibold text-white ${device === 'desktop' ? 'whitespace-nowrap' : 'max-w-[40%]'}`}
              style={{ top: `${text.top}%`, left: `${text.left}%` }}
            >
              {time}&nbsp;&nbsp;{label}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
