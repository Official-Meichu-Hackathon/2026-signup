import { useState } from 'react'
import { Link } from 'react-router-dom'

interface NavLink {
  label: string
  href: string
}

interface NavGroup {
  label: string
  children: NavLink[]
}

// Two collapsible sections (首頁 / 報名方式), each revealing their own
// sub-links, plus three flat links that always show. Matches node 190:120's
// three accordion states (closed / 首頁 open / 報名方式 open).
const GROUPS: NavGroup[] = [
  {
    label: '首頁',
    children: [
      { label: '活動簡介', href: '/' },
      { label: '比賽組別、工作坊', href: '/' },
      { label: '比賽規則', href: '/' },
      { label: '獎項資訊', href: '/' },
      { label: '合作、贊助企業與單位', href: '/' },
      { label: '工作人員名單', href: '/' },
    ],
  },
  {
    label: '報名方式',
    children: [
      { label: '報名時程', href: '/' },
      { label: '報名資訊', href: '/' },
    ],
  },
]

const LEAF_LINKS: NavLink[] = [
  { label: '比賽時程', href: '/schedule' },
  { label: '題目說明', href: '/' },
  { label: '參賽數據', href: '/' },
]

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

function Row({
  children,
  onClick,
}: {
  children: React.ReactNode
  onClick?: () => void
}) {
  const className =
    'flex h-14 w-full items-center justify-between border-b border-white/30 px-4 text-left'
  return onClick ? (
    <button type="button" onClick={onClick} className={className}>
      {children}
    </button>
  ) : (
    <div className={className}>{children}</div>
  )
}

export default function MobileNavMenu({
  onNavigate,
}: {
  onNavigate?: () => void
}) {
  const [openGroup, setOpenGroup] = useState<string | null>(null)

  return (
    <nav className="w-full border-t border-white/30 bg-black/90 backdrop-blur-md">
      {GROUPS.map((group) => {
        const expanded = openGroup === group.label
        return (
          <div key={group.label}>
            <Row onClick={() => setOpenGroup(expanded ? null : group.label)}>
              <span className="font-chiron text-2xl font-bold text-white">
                {group.label}
              </span>
              <ToggleIcon expanded={expanded} />
            </Row>
            {expanded &&
              group.children.map((child) => (
                <Row key={child.label}>
                  <Link
                    to={child.href}
                    onClick={onNavigate}
                    className="font-chiron w-full text-2xl font-normal text-white"
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
            onClick={onNavigate}
            className="font-chiron w-full text-2xl font-bold text-white"
          >
            {link.label}
          </Link>
        </Row>
      ))}
    </nav>
  )
}
