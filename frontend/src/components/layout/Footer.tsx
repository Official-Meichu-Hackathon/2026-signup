import facebookIcon from '../../assets/facebook-icon.png'
import instagramIcon from '../../assets/instagram-icon.png'
import mailIcon from '../../assets/mail-icon.png'

// Fluid clamp(min, preferred, max) built from the two Figma frames (mobile:
// 390px viewport → node 786:4617; desktop: 1460px viewport → node 688:3871),
// linearly interpolated between them instead of snapping at a `md:`
// breakpoint — 注意事項.txt: "width height 盡量用 vw vh 來寫，不要寫死 (RWD 會出事)".
// Capped at the desktop frame so these are constants past it — a live vw term
// there would cancel out browser zoom (see index.css).
const fluid = (minPx: number, maxPx: number) => {
  const minVw = 390
  const maxVw = 1460
  const slope = (maxPx - minPx) / (maxVw - minVw)
  const intercept = minPx - slope * minVw
  return `clamp(${minPx}px, ${intercept.toFixed(2)}px + ${(slope * 100).toFixed(4)}vw, ${maxPx}px)`
}

const iconSize = fluid(19.11, 60)
const iconGap = fluid(16.5, 52)
const rowGap = fluid(6, 9)
const paddingY = fluid(12, 18)
const textSize = fluid(8, 20)

const SOCIAL_LINKS = [
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/HackMeiChu',
    icon: facebookIcon,
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/mc_hackathon',
    icon: instagramIcon,
  },
  {
    label: 'Email',
    href: 'mailto:2026mchackathon@gmail.com',
    icon: mailIcon,
  },
]

// Fully transparent — node 484:1151, the current desktop "footer" frame,
// drops the purple glass card down to a bare `backdrop-blur-[2px]` with no
// fill or shadow, so the page background shows straight through.
//
// No positioning of its own — callers decide (`fixed bottom-0` to overlay a
// short page like Home, `absolute` at a specific offset to sit over a tall
// custom canvas like ScheduleView's nebula art). Baking in `fixed` here once
// broke ScheduleView's `absolute top-[94.77%]` placement, since `fixed`
// unconditionally wins over an ancestor's positioning.
export default function Footer({ className = '' }: { className?: string }) {
  return (
    <footer
      className={`flex w-full flex-col items-center justify-center backdrop-blur-[2px] ${className}`}
      style={{ paddingBlock: paddingY }}
    >
      <div className="flex flex-col items-center" style={{ gap: rowGap }}>
        <div className="flex items-center" style={{ gap: iconGap }}>
          {SOCIAL_LINKS.map(({ label, href, icon }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              target={href.startsWith('mailto:') ? undefined : '_blank'}
              rel={href.startsWith('mailto:') ? undefined : 'noreferrer'}
              className="block transition duration-300 hover:opacity-70"
              style={{ width: iconSize, height: iconSize }}
            >
              <img src={icon} alt="" className="h-full w-full" />
            </a>
          ))}
        </div>
        <p
          className="font-noto-tc text-center font-bold text-[#f6f6f6]"
          style={{ fontSize: textSize }}
        >
          Copyright © 2026 Meichu Hackathon
        </p>
      </div>
    </footer>
  )
}
