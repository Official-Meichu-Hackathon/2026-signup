import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import CursorTrail from '../components/layout/CursorTrail'
import ScheduleTimeline from '../components/schedule/ScheduleTimeline'
import bgTop from '../assets/Schedule/bg-top.png'
import bgBottom from '../assets/Schedule/bg-bottom.png'
import constellationLeft from '../assets/Schedule/constellation-left.svg'
import constellationRight from '../assets/Schedule/constellation-right.svg'
import constellationTop from '../assets/Schedule/constellation-top.svg'
import mobileConstellationLeft from '../assets/Schedule/mobile-constellation-left.svg'
import mobileConstellationRight from '../assets/Schedule/mobile-constellation-right.svg'
import mobileConstellationTop from '../assets/Schedule/mobile-constellation-top.svg'

// Scattered star dots around the header constellations (node 128:486–508 for
// desktop, 136:243–267 for mobile) — plain glowing dots, so they're drawn
// with CSS rather than pulled in as 20+ near-identical image assets.
const HEADER_STARS = [
  { left: 2.71, top: 11.19, size: 8 },
  { left: 10.42, top: 11.66, size: 6 },
  { left: 15.42, top: 10.84, size: 8 },
  { left: 17.22, top: 9.32, size: 10 },
  { left: 16.18, top: 7.7, size: 8 },
  { left: 22.15, top: 7.04, size: 7 },
  { left: 22.15, top: 9.32, size: 8 },
  { left: 47.01, top: 1.05, size: 11 },
  { left: 47.78, top: 2.82, size: 8 },
  { left: 53.54, top: 2.38, size: 8 },
  { left: 58.26, top: 1.14, size: 6 },
  { left: 70.97, top: 2.38, size: 8 },
  { left: 75.21, top: 2.38, size: 6 },
  { left: 79.86, top: 1.81, size: 8 },
  { left: 83.26, top: 1.08, size: 8 },
  { left: 85.42, top: 6.85, size: 8 },
  { left: 89.72, top: 7.83, size: 10 },
  { left: 92.43, top: 9.06, size: 6 },
  { left: 94.17, top: 11.95, size: 8 },
  { left: 83.33, top: 8.15, size: 8 },
  { left: 82.71, top: 10.62, size: 6 },
  { left: 83.33, top: 12.74, size: 8 },
  { left: 81.39, top: 14.83, size: 8 },
]

const MOBILE_HEADER_STARS = [
  { left: 40.6, top: 1.21, size: 3.6 },
  { left: 83.87, top: 1.24, size: 2.6 },
  { left: 54.03, top: 1.31, size: 1.9 },
  { left: 79.81, top: 2.03, size: 2.6 },
  { left: 48.4, top: 2.65, size: 2.6 },
  { left: 69.2, top: 2.65, size: 2.6 },
  { left: 74.26, top: 2.65, size: 1.9 },
  { left: 41.52, top: 3.14, size: 2.6 },
  { left: 82.21, top: 6.61, size: 2.6 },
  { left: 27.34, top: 7.57, size: 2.4 },
  { left: 19.73, top: 8.34, size: 2.8 },
  { left: 87.31, top: 7.67, size: 3.2 },
  { left: 79.74, top: 8.01, size: 2.6 },
  { left: 90.52, top: 9.01, size: 1.9 },
  { left: 21.05, top: 10.22, size: 3.5 },
  { left: 27.34, top: 10.22, size: 2.8 },
  { left: 78.99, top: 10.68, size: 1.9 },
  { left: 18.75, top: 11.98, size: 2.8 },
  { left: 2.56, top: 12.39, size: 2.8 },
  { left: 12.39, top: 12.94, size: 2.1 },
  { left: 92.58, top: 12.12, size: 2.6 },
  { left: 79.74, top: 12.97, size: 2.6 },
  { left: 77.44, top: 15.23, size: 2.6 },
]

// Constellation line art has a soft drop-shadow baked in, so the source SVG
// is larger than the "clean" box the design positions it by. `bleed` is that
// extra margin (as a % of the clean box, derived from each SVG's own path
// bounding box — see the desktop bleed comment below for why).
function Constellation({
  src,
  box,
  bleed,
}: {
  src: string
  box: { left: number; top: number; width: number; height: number }
  bleed: string
}) {
  return (
    <div
      className="absolute"
      style={{
        left: `${box.left}%`,
        top: `${box.top}%`,
        width: `${box.width}%`,
        height: `${box.height}%`,
      }}
    >
      <div className="absolute" style={{ inset: bleed }}>
        <img src={src} alt="" className="h-full w-full" />
      </div>
    </div>
  )
}

function DesktopSchedule() {
  return (
    <div className="overflow-x-auto">
      <div className="relative aspect-[1440/3155] w-full min-w-[768px] overflow-hidden">
        <img
          data-trail-bg="schedule"
          src={bgTop}
          alt=""
          className="absolute top-0 left-0 h-[32.46%] w-full object-cover"
          style={{
            maskImage:
              'linear-gradient(to bottom, black 60%, transparent 100%)',
            WebkitMaskImage:
              'linear-gradient(to bottom, black 60%, transparent 100%)',
          }}
        />
        <img
          data-trail-bg="schedule"
          src={bgBottom}
          alt=""
          className="absolute top-[49.98%] left-0 h-[74.36%] w-full object-cover"
          style={{
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%)',
            WebkitMaskImage:
              'linear-gradient(to bottom, transparent 0%, black 15%)',
          }}
        />

        {/* Bleed % are derived from each SVG's own path bounding box (matched
            against its clean box), not Figma's original PNG-reference bleed —
            re-exporting to SVG crops the drop-shadow region asymmetrically vs.
            the PNG, so reusing the old percentages stretched the art off-true.
            Worst on the top cluster, whose crop removed bleed from the top
            edge entirely and pushed extra bleed onto the bottom instead. */}
        <Constellation
          src={constellationLeft}
          box={{ left: 2.85, top: 7.13, width: 19.58, height: 4.63 }}
          bleed="-32.39% -18.09% -38.16% -14.54%"
        />
        <Constellation
          src={constellationRight}
          box={{ left: 81.39, top: 6.97, width: 13.06, height: 8.11 }}
          bleed="-18.46% -27.11% -21.29% -27.05%"
        />
        <Constellation
          src={constellationTop}
          box={{ left: 47.36, top: 0, width: 36.25, height: 2.98 }}
          bleed="2.13% -9.77% -59.57% -9.77%"
        />

        {/* Star dots render after (i.e. visually on top of) the
            constellation lines so they sit above the strokes, not behind. */}
        {HEADER_STARS.map((star, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white shadow-[0_0_8px_2px_rgba(255,255,255,0.6)]"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: star.size,
              height: star.size,
            }}
          />
        ))}

        <h1 className="glow-text font-zen absolute top-[12.30%] left-1/2 w-[91.25%] -translate-x-1/2 text-center text-[clamp(2.5rem,6.94vw,6.25rem)] leading-[0.64] text-[#f6f6f6]">
          比賽時程
        </h1>

        <p className="font-noto absolute top-[20.60%] left-[93.68%] w-[7.29%] -translate-x-full text-right text-[clamp(0.75rem,2.08vw,1.875rem)] leading-[1.47] font-semibold whitespace-nowrap text-white">
          地點
        </p>
        <p className="font-noto absolute top-[20.60%] left-[85.69%] w-[29.44%] -translate-x-full text-right text-[clamp(0.75rem,2.08vw,1.875rem)] leading-[1.47] font-semibold whitespace-nowrap text-white">
          國立清華大學體育館
        </p>
        <div className="absolute top-[20.41%] left-[87.01%] h-[1.97%] w-px bg-white/70" />

        <p className="font-noto absolute top-[23.26%] left-[93.68%] w-[7.29%] -translate-x-full text-right text-[clamp(0.75rem,2.08vw,1.875rem)] leading-[1.47] font-semibold whitespace-nowrap text-white">
          時間
        </p>
        <p className="font-noto absolute top-[23.26%] left-[85.69%] w-[41.53%] -translate-x-full text-right text-[clamp(0.75rem,2.08vw,1.875rem)] leading-[1.47] font-semibold whitespace-nowrap text-white">
          2026.09.19(六) - 09.20(日)
        </p>
        <div className="absolute top-[23.07%] left-[87.01%] h-[1.97%] w-px bg-white/70" />

        <ScheduleTimeline
          device="desktop"
          className="absolute top-[20.60%] left-0"
        />

        {/* Footer sits over the tail of the nebula background (matching
            node 484:1151 in Figma), not on flat black. Pinned to `bottom-0`
            rather than a `top-%` offset — this canvas has no max-width, so
            past ~1460px viewport width its aspect-ratio height keeps
            growing while Footer's own fluid height caps out, and a `top-%`
            offset would open a growing gap below it. */}
        <div className="absolute bottom-0 left-0 w-full">
          <Footer />
        </div>
      </div>
    </div>
  )
}

// Mirrors DesktopSchedule but built from the mobile mock (node 136:209,
// 390x938 including the footer band) — its own zigzag artboard, constellation
// art and type scale, not just the desktop version shrunk down.
function MobileSchedule() {
  return (
    <div className="relative aspect-[390/938] w-full min-w-[320px] overflow-hidden">
      <img
        data-trail-bg="schedule"
        src={bgTop}
        alt=""
        className="absolute top-0 left-0 h-[29.53%] w-full object-cover"
        style={{
          maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to bottom, black 60%, transparent 100%)',
        }}
      />
      <img
        data-trail-bg="schedule"
        src={bgBottom}
        alt=""
        className="absolute top-[50%] left-0 h-[66.84%] w-full object-cover"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%)',
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent 0%, black 15%)',
        }}
      />

      <Constellation
        src={mobileConstellationLeft}
        box={{ left: 2.74, top: 7.68, width: 24.95, height: 5.37 }}
        bleed="-32.39% -18.51% -38.32% -10.99%"
      />
      <Constellation
        src={mobileConstellationRight}
        box={{ left: 77.44, top: 6.75, width: 15.47, height: 8.76 }}
        bleed="-18.46% -27.10% -21.52% -27.05%"
      />
      <Constellation
        src={mobileConstellationTop}
        box={{ left: 41.02, top: 0, width: 43.26, height: 3.24 }}
        bleed="0% -9.94% -61.27% -9.77%"
      />

      {MOBILE_HEADER_STARS.map((star, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white shadow-[0_0_8px_2px_rgba(255,255,255,0.6)]"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: star.size,
            height: star.size,
          }}
        />
      ))}

      <h1 className="glow-text font-zen absolute top-[11.94%] left-1/2 w-[68.97%] -translate-x-1/2 text-center text-[clamp(1.75rem,10.26vw,2.5rem)] leading-[1.1] text-[#f6f6f6]">
        比賽時程
      </h1>

      <p className="font-noto absolute top-[22.98%] left-[94.87%] w-[6.76%] -translate-x-full text-right text-[clamp(0.5rem,3.08vw,0.75rem)] leading-[1] font-medium whitespace-nowrap text-white">
        地點
      </p>
      <p className="font-noto absolute top-[23.03%] left-[85.13%] w-[34.62%] -translate-x-full text-right text-[clamp(0.5rem,3.08vw,0.75rem)] leading-[1] font-medium whitespace-nowrap text-white">
        國立清華大學體育館
      </p>
      <div className="absolute top-[22.81%] left-[87.15%] h-[1.66%] w-px bg-white/70" />

      <p className="font-noto absolute top-[25.22%] left-[94.87%] w-[6.76%] -translate-x-full text-right text-[clamp(0.5rem,3.08vw,0.75rem)] leading-[1] font-medium whitespace-nowrap text-white">
        時間
      </p>
      <p className="font-noto absolute top-[25.27%] left-[85.16%] w-[38.49%] -translate-x-full text-right text-[clamp(0.5rem,3.08vw,0.75rem)] leading-[1] font-medium whitespace-nowrap text-white">
        2026.09.19(六) - 09.20(日)
      </p>
      <div className="absolute top-[25.06%] left-[87.15%] h-[1.66%] w-px bg-white/70" />

      <ScheduleTimeline
        device="mobile"
        className="absolute top-[22.81%] left-0 w-[96.04%]"
      />

      {/* Footer sits over the tail of the nebula background, not on flat
          black. Pinned to `bottom-0` rather than a `top-%` offset — see the
          matching comment in DesktopSchedule for why. */}
      <div className="absolute bottom-0 left-0 w-full">
        <Footer />
      </div>
    </div>
  )
}

export default function ScheduleView() {
  return (
    <div className="relative bg-black text-white">
      <div className="relative -z-10">
        <CursorTrail bgSelector="[data-trail-bg='schedule']" />
      </div>
      <Navbar />

      {/* This frame ships two hand-matched layouts rather than one fluidly
          scaled canvas — the mobile mock (136:209) redraws the zigzag and
          constellations for a taller/narrower artboard instead of just
          shrinking the desktop one, so a single percentage system can't
          represent both faithfully. */}
      <div className="hidden md:block">
        <DesktopSchedule />
      </div>
      <div className="md:hidden">
        <MobileSchedule />
      </div>
    </div>
  )
}
