import { useState } from 'react'
import { Link } from 'react-router-dom'

interface NavLink {
  label: string
  href: string
}

interface NavGroup {
  label: string
  href: string
  children: NavLink[]
}

// Two collapsible sections (首頁 / 報名方式), each revealing their own
// sub-links, plus three flat links that always show. Matches node 190:120's
// three accordion states (closed / 首頁 open / 報名方式 open).
// Sub-link hashes match the actual section ids rendered in Home.tsx /
// RegistrationMethodView.tsx (see FloatingNav.tsx for the same id set used
// by the desktop floating nav) — the previous Chinese-text hashes here never
// matched any real id, so every link silently did nothing.
const GROUPS: NavGroup[] = [
  {
    label: '首頁',
    href: '/',
    children: [
      { label: '活動簡介', href: '/#vision' },
      { label: '比賽組別、工作坊', href: '/#group-intro' },
      { label: '比賽規則', href: '/#rules' },
      { label: '獎項資訊', href: '/#awards' },
      { label: '合作、贊助企業與單位', href: '/#partners' },
      { label: '工作人員名單', href: '/#staff' },
    ],
  },
  {
    label: '報名方式',
    href: '/registration',
    children: [
      { label: '報名時程', href: '/registration#報名時程' },
      { label: '報名資訊', href: '/registration' },
    ],
  },
]

const LEAF_LINKS: NavLink[] = [
  { label: '比賽時程', href: '/schedule' },
  { label: '題目說明', href: '/problems' },
  { label: '參賽數據', href: '/stats' },
]

// Fluid clamp(min, preferred, max) built from the two Figma frames (mobile:
// 390px viewport → node 346:1263; desktop: 1440px viewport → node 190:120),
// linearly interpolated between them instead of snapping at a `md:` breakpoint
// — 注意事項.txt: "width height 盡量用 vw vh 來寫，不要寫死 (RWD 會出事)".
// Capped at the desktop frame for the same reason as Footer (see index.css).
const fluid = (minPx: number, maxPx: number) => {
  const minVw = 390
  const maxVw = 1440
  const slope = (maxPx - minPx) / (maxVw - minVw)
  const intercept = minPx - slope * minVw
  return `clamp(${minPx}px, ${intercept.toFixed(2)}px + ${(slope * 100).toFixed(4)}vw, ${maxPx}px)`
}

const rowHeight = fluid(37, 56)
const rowPaddingX = fluid(13, 38)
const labelSize = fluid(14, 24)
const drawerWidth = fluid(280, 428)

function ToggleIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg viewBox="0 0 12 12" className="size-3 shrink-0 text-white">
      <path
        d="M1 6h10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {!expanded && (
        <path
          d="M6 1v10"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      )}
    </svg>
  )
}

// Dividers mark boundaries between rows, except between a group's own
// children — those stack with no line between them, only picking one back up
// after the last child (before the next section). Group headers and leaf
// links always keep their line, expanded or not.
function Row({
  children,
  onClick,
  divider = true,
}: {
  children: React.ReactNode
  onClick?: () => void
  divider?: boolean
}) {
  const style = {
    height: rowHeight,
    paddingLeft: rowPaddingX,
    paddingRight: rowPaddingX,
  }
  const className = `flex w-full items-center justify-between text-left ${divider ? 'border-b border-white/30' : ''}`
  return onClick ? (
    <button type="button" onClick={onClick} style={style} className={className}>
      {children}
    </button>
  ) : (
    <div style={style} className={className}>
      {children}
    </div>
  )
}

// Slides in from the right as a fixed-width overlay panel (not a full-width
// dropdown pushed down from the header) — matches the reference screenshot,
// where the drawer is a translucent/blurred overlay on top of the page (not
// an opaque panel), covering only the right side of the viewport, with no
// separate close ("X") icon — the hamburger button itself just toggles it.
export default function MobileNavMenu({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [openGroup, setOpenGroup] = useState<string | null>(null)

  return (
    <>
      <button
        type="button"
        aria-label="收起選單背景"
        tabIndex={open ? 0 : -1}
        onClick={onClose}
        className={`fixed inset-0 z-30 cursor-default bg-gray-500/40 transition-opacity duration-300 ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
      />
      <nav
        aria-hidden={!open}
        style={{
          backgroundImage:
            'linear-gradient(146.2114deg, rgba(244, 244, 244, 0.1) 18.297%, rgba(59, 94, 168, 0.06) 100%)',
          width: drawerWidth,
          maxWidth: '100%',
        }}
        className={`fixed top-0 right-0 z-40 h-full transform pt-20 backdrop-blur-[28px] transition-transform duration-300 ease-out ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {GROUPS.map((group) => {
          const expanded = openGroup === group.label
          return (
            <div key={group.label}>
              <Row>
                <Link
                  to={group.href}
                  onClick={onClose}
                  style={{ fontSize: labelSize }}
                  className="font-noto-tc md:font-chiron flex flex-1 items-center self-stretch font-bold text-white md:font-[800]"
                >
                  {group.label}
                </Link>
                <button
                  type="button"
                  aria-expanded={expanded}
                  aria-label={`${expanded ? '收合' : '展開'}${group.label}選單`}
                  onClick={() => setOpenGroup(expanded ? null : group.label)}
                  className="-mx-3 flex shrink-0 items-center self-stretch px-3"
                >
                  <ToggleIcon expanded={expanded} />
                </button>
              </Row>
              {expanded &&
                group.children.map((child, i) => (
                  <Row
                    key={child.label}
                    divider={i === group.children.length - 1}
                  >
                    <Link
                      to={child.href}
                      onClick={onClose}
                      style={{ fontSize: labelSize }}
                      className="font-noto-tc md:font-chiron w-full font-light text-white md:font-normal"
                    >
                      {child.label}
                    </Link>
                  </Row>
                ))}
            </div>
          )
        })}
        {LEAF_LINKS.map((link) => (
          <Row key={link.label}>
            <Link
              to={link.href}
              onClick={onClose}
              style={{ fontSize: labelSize }}
              className="font-noto-tc md:font-chiron w-full font-bold text-white md:font-[800]"
            >
              {link.label}
            </Link>
          </Row>
        ))}
      </nav>
    </>
  )
}
