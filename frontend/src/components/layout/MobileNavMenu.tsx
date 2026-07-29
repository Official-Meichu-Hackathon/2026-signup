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

const fluid = (minPx: number, maxPx: number) => {
  const minVw = 390
  const maxVw = 1440
  const slope = (maxPx - minPx) / (maxVw - minVw)
  const intercept = minPx - slope * minVw
  return `clamp(${minPx}px, ${intercept.toFixed(2)}px + ${(slope * 100).toFixed(4)}vw, ${maxPx}px)`
}

// Narrower drawer width to match design (node 190:120 / navbar對照圖2.png)
const drawerWidth = fluid(290, 500)
const rowHeight = fluid(38, 56)
const contentPaddingX = fluid(38, 39)
const labelSize = fluid(15, 22)

function ToggleIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="size-4 shrink-0 text-white transition-transform duration-200"
    >
      {expanded ? (
        <path d="M3 8h10" strokeLinecap="round" />
      ) : (
        <path d="M8 3v10M3 8h10" strokeLinecap="round" />
      )}
    </svg>
  )
}

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
  }
  const className = `flex w-full items-center justify-between text-left ${
    divider ? 'border-b border-white' : ''
  }`
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
        className={`fixed inset-0 z-90 cursor-default bg-black/35 transition-opacity duration-300 ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />
      <nav
        aria-hidden={!open}
        style={{
          backgroundImage:
            'linear-gradient(135deg, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0.05) 100%)',
          width: drawerWidth,
          maxWidth: '100%',
          paddingLeft: contentPaddingX,
          paddingRight: contentPaddingX,
        }}
        className={`fixed top-0 right-0 z-100 h-full transform border-l border-white/40 pt-[50px] backdrop-blur-[5px] transition-transform duration-300 ease-out sm:pt-[50px] md:pt-[50px] ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {GROUPS.map((group) => {
          const expanded = openGroup === group.label
          return (
            <div key={group.label}>
              <Row divider={true}>
                <Link
                  to={group.href}
                  onClick={onClose}
                  style={{ fontSize: labelSize }}
                  className="font-noto-tc flex flex-1 items-center self-stretch pl-4 font-normal text-white"
                >
                  {group.label}
                </Link>
                <button
                  type="button"
                  aria-expanded={expanded}
                  aria-label={`${expanded ? '收合' : '展開'}${group.label}選單`}
                  onClick={() => setOpenGroup(expanded ? null : group.label)}
                  className="-mr-2 flex shrink-0 items-center self-stretch px-2 text-white/90 hover:text-white"
                >
                  <ToggleIcon expanded={expanded} />
                </button>
              </Row>
              {expanded &&
                group.children.map((child) => (
                  <Row key={child.label} divider={false}>
                    <Link
                      to={child.href}
                      onClick={onClose}
                      style={{ fontSize: labelSize }}
                      className="font-noto-tc w-full pl-4 font-light text-white/90 hover:text-white md:font-light"
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
              className="font-noto-tc w-full pl-4 font-normal text-white"
            >
              {link.label}
            </Link>
          </Row>
        ))}
      </nav>
    </>
  )
}
