import { useState } from 'react'
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
    time: '00:00-08:00',
    label: '參賽者休息',
    dot: { top: 10.25, left: 24.75 },
    text: { top: 9.42, left: 30.36 },
  },
  {
    time: '08:00-09:00',
    label: '早餐',
    dot: { top: 16.05, left: 33.04 },
    text: { top: 15.77, left: 37.97 },
  },
  {
    time: '09:00-11:00',
    label: 'Coding...... / 企業博覽會 / 娛樂交流活動',
    dot: { top: 27.04, left: 21.88 },
    text: { top: 26.21, left: 25.69 },
  },
  {
    time: '11:00-11:50',
    label: '午餐 / 活動攤位',
    dot: { top: 37.38, left: 33.54 },
    text: { top: 36.6, left: 37.97 },
  },
  {
    time: '11:50-15:10',
    label: '創客交流組決賽',
    dot: { top: 50.6, left: 17.39 },
    text: { top: 50.28, left: 22.63 },
  },
  {
    time: '12:10-14:00',
    label: '黑客組初賽',
    dot: { top: 59.04, left: 25 },
    text: { top: 58.16, left: 31.61 },
  },
  {
    time: '15:20-17:30',
    label: '黑客組決賽',
    dot: { top: 66.6, left: 47.07 },
    text: { top: 65.72, left: 51.06 },
  },
  {
    time: '17:30-18:30',
    label: '頒獎 / 抽獎',
    dot: { top: 80.15, left: 31.48 },
    text: { top: 79.82, left: 36.78 },
  },
  {
    time: '18:30-19:30',
    label: '閉幕式',
    dot: { top: 97.5, left: 39.46 },
    text: { top: 97.17, left: 44.01 },
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
        label: '報到',
        dot: { top: 12.87, left: 28.91 },
        text: { top: 11.85, left: 32.26 },
      },
      {
        time: '09:00-10:30',
        label: '開幕式',
        dot: { top: 25.47, left: 18.66 },
        text: { top: 24.56, left: 22.39 },
      },
      {
        time: '10:30-12:00',
        label: 'Coding...... / 企業博覽會 / 娛樂交流活動',
        dot: { top: 38.18, left: 25.24 },
        text: { top: 36.83, left: 28.59 },
      },
      {
        time: '12:00-13:30',
        label: '午餐',
        dot: { top: 45.83, left: 37 },
        text: { top: 44.86, left: 39.78 },
      },
      {
        time: '13:30-18:00',
        label: 'Coding...... / 企業博覽會（到17:00）/ 娛樂交流活動',
        dot: { top: 55.95, left: 32.26 },
        text: { top: 55.2, left: 37 },
      },
      {
        time: '18:00-19:30',
        label: '晚餐',
        dot: { top: 66.07, left: 13.28 },
        text: { top: 65.27, left: 18.47 },
      },
      {
        time: '19:30-21:00',
        label: 'Coding...... / 娛樂交流活動',
        dot: { top: 83.09, left: 50.35 },
        text: { top: 82.12, left: 53.64 },
      },
      {
        time: '21:00-21:30',
        label: '發宵夜、散場',
        dot: { top: 97.25, left: 34.98 },
        text: { top: 96.72, left: 39.28 },
      },
    ],
    '20': EVENTS_20,
  },
  mobile: {
    '19': [
      {
        time: '08:30-09:00',
        label: '報到',
        dot: { top: 21.1, left: 32.03 },
        text: { top: 20.12, left: 35.74 },
      },
      {
        time: '09:00-10:30',
        label: '開幕式',
        dot: { top: 33.71, left: 20.67 },
        text: { top: 32.85, left: 24.81 },
      },
      {
        time: '10:30-12:00',
        label: 'Coding...... / 企業博覽會 / 娛樂交流活動',
        dot: { top: 46.43, left: 27.96 },
        text: { top: 45.17, left: 31.67 },
      },
      {
        time: '12:00-13:30',
        label: '午餐',
        dot: { top: 54.08, left: 41 },
        text: { top: 53.11, left: 44.08 },
      },
      {
        time: '13:30-18:00',
        label: 'Coding...... / 企業博覽會（到17:00）/ 娛樂交流活動',
        dot: { top: 64.22, left: 35.74 },
        text: { top: 63.46, left: 41 },
      },
      {
        time: '18:00-19:30',
        label: '晚餐',
        dot: { top: 74.54, left: 14.72 },
        text: { top: 73.51, left: 20.46 },
      },
      {
        time: '19:30-21:00',
        label: 'Coding...... / 娛樂交流活動',
        dot: { top: 91.38, left: 55.78 },
        text: { top: 90.41, left: 59.43 },
      },
      {
        time: '21:00-21:30',
        label: '發宵夜、散場',
        dot: { top: 105.56, left: 38.75 },
        text: { top: 104.93, left: 43.52 },
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

  return (
    <div
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
        {/* The line art's drop-shadow bleeds past its own bounds, so it needs
            the same clean-box + bleed-inset nesting as the header constellations. */}
        <div className="absolute" style={{ inset: line.box }}>
          <div className="absolute" style={{ inset: line.bleed }}>
            <img src={line.src} alt="" className="h-full w-full" />
          </div>
        </div>

        {EVENTS[device][selectedDay].map(({ time, label, dot, text }) => (
          <div key={time}>
            <span
              className="absolute size-2.5 rounded-full bg-white shadow-[0_0_10px_3px_rgba(255,255,255,0.65)]"
              style={{ top: `${dot.top}%`, left: `${dot.left}%` }}
            />
            <p
              className="font-noto absolute w-max max-w-[40%] text-[clamp(0.6875rem,1.74vw,1.5625rem)] leading-[1.6] font-semibold text-white"
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
