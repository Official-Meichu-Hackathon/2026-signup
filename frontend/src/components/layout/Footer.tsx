import facebookIcon from '../../assets/facebook-icon.png'
import instagramIcon from '../../assets/instagram-icon.png'
import mailIcon from '../../assets/mail-icon.png'

// Fluid clamp(min, preferred, max) built from the two Figma frames (mobile:
// 390px viewport → node 786:4617; desktop: 1460px viewport → node 688:3871),
// linearly interpolated between them instead of snapping at a `md:`
// breakpoint — 注意事項.txt: "width height 盡量用 vw vh 來寫，不要寫死 (RWD 會出事)".
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

// Same purple frosted-glass card at every size — node 786:4617 (mobile) and
// node 1368:61523 ("footer電腦版", the finished desktop frame that wraps
// 688:3871's bare content in this card) use identical fill/blur/shadow
// values, so this isn't a per-breakpoint style switch, just fluid spacing.
//
// Fixed to the viewport bottom (mirroring Navbar's `fixed top-0`) so it
// overlays on top of the page background instead of trailing after it in
// normal flow, per the reference screenshot where both hero and footer sit
// in the same view with no scrolling.
export default function Footer() {
  return (
    <footer
      className="fixed bottom-0 left-0 z-40 flex w-full flex-col items-center justify-center bg-[rgba(177,162,202,0.56)] shadow-[0px_10px_30px_0px_rgba(0,0,0,0.25),inset_0px_1px_8px_0px_rgba(255,255,255,0.5)] backdrop-blur-[35px]"
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
