import { useEffect, useState } from 'react'
import navLogo from '../../assets/home/float-nav.png'

const LINKS = [
  { label: '活動簡介', href: '#intro' },
  { label: '組別介紹', href: '#group-intro' },
  { label: '比賽規則', href: '#rules' },
  { label: '獎項資訊', href: '#awards' },
  { label: '參賽數據', href: '#stats' },
  { label: '合作企業', href: '#partners' },
  { label: '贊助單位', href: '#sponsors' },
  { label: '工作人員', href: '#staff' },
]

// Overall floating-nav size — turn this one knob to scale the whole pill
// (height, logo, padding, gaps) up or down. 1 = original design size.
const SIZE = 0.7

const HEIGHT = 76 * SIZE
const cssVars = {
  '--nav-h': `${HEIGHT}px`,
  '--nav-logo-h': `${64 * SIZE}px`,
  '--nav-collapsed-w': `${180 * SIZE}px`,
  '--nav-expanded-w': `${1200 * SIZE}px`,
  '--nav-gap': `${40 * SIZE}px`,
  '--nav-links-gap': `${32 * SIZE}px`,
  '--nav-px': `${17 * SIZE}px`,
  '--nav-font': `${18 * SIZE}px`,
} as React.CSSProperties

const NAV_BOTTOM_OFFSET = 24
const NAV_HEIGHT = HEIGHT

export default function FloatingNav() {
  const [onLightBg, setOnLightBg] = useState(false)

  useEffect(() => {
    function checkBackground() {
      const navBottom = window.innerHeight - NAV_BOTTOM_OFFSET
      const navTop = navBottom - NAV_HEIGHT
      const lightSections = document.querySelectorAll(
        '[data-nav-theme="light"]',
      )
      let over = false
      lightSections.forEach((el) => {
        const rect = el.getBoundingClientRect()
        if (rect.top < navBottom && rect.bottom > navTop) over = true
      })
      setOnLightBg(over)
    }

    checkBackground()
    window.addEventListener('scroll', checkBackground, { passive: true })
    window.addEventListener('resize', checkBackground)
    return () => {
      window.removeEventListener('scroll', checkBackground)
      window.removeEventListener('resize', checkBackground)
    }
  }, [])

  return (
    <nav className="group fixed bottom-10 left-6 z-50" style={cssVars}>
      <div
        className={`flex h-[var(--nav-h)] max-w-[var(--nav-collapsed-w)] items-center gap-[var(--nav-gap)] overflow-hidden rounded-full border border-white/10 px-[var(--nav-px)] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-[max-width,background-color] duration-500 ease-out group-hover:max-w-[var(--nav-expanded-w)] ${
          onLightBg
            ? 'bg-[rgba(70,100,172,0.4)]'
            : 'bg-[rgba(173,171,171,0.36)]'
        }`}
      >
        <img
          src={navLogo}
          alt="梅竹黑客松"
          className="h-[var(--nav-logo-h)] w-auto shrink-0 object-contain object-left"
        />
        <ul className="flex shrink-0 items-center gap-[var(--nav-links-gap)] whitespace-nowrap opacity-0 transition-opacity delay-150 duration-300 group-hover:opacity-100">
          {LINKS.map(({ label, href }) => (
            <li key={href}>
              <a
                href={href}
                className="text-[length:var(--nav-font)] text-white transition-colors hover:text-white/70"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
