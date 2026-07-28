import { useEffect, useState } from 'react'
import navLogo from '../../assets/home/float-nav.webp'

// href targets must match a real section id (see Home.tsx and its child
// components). '#intro' used to point at the hero banner instead of the
// actual 簡介 copy in EventVision (id="vision"), and '#stats' never had a
// matching section at all — both silently failed to scroll anywhere.
const LINKS = [
  { label: '活動簡介', href: '#vision', weight: 'normal' },
  { label: '組別介紹', href: '#group-intro', weight: 'normal' },
  { label: '比賽規則', href: '#rules', weight: 'normal' },
  { label: '獎項資訊', href: '#awards', weight: 'medium' },
  { label: '合作企業', href: '#partners', weight: 'medium' },
  { label: '贊助單位', href: '#sponsors', weight: 'medium' },
  { label: '工作人員', href: '#staff', weight: 'medium' },
] as const

const HEIGHT = 76
const cssVars = {
  '--nav-h': `${HEIGHT}px`,
  '--nav-logo-h': '48px',
  '--nav-logo-w': 'clamp(80px, 10.25vw, 123px)',
  '--nav-collapsed-w': '182px',
  '--nav-gap': 'clamp(20px, calc(9.95vw - 56.4px), 63px)',
  '--nav-links-gap': 'clamp(16px, calc(9.26vw - 55.1px), 56px)',
  '--nav-px': 'clamp(12px, 1.417vw, 17px)',
  '--nav-font': 'clamp(14px, 1.667vw, 20px)',
  '--nav-logo-offset':
    'max(0px, calc((var(--nav-collapsed-w) - 2 * var(--nav-px) - var(--nav-logo-w)) / 2))',
} as React.CSSProperties

const NAV_BOTTOM_OFFSET = 24
const NAV_HEIGHT = HEIGHT

export default function FloatingNav() {
  const [onLightBg, setOnLightBg] = useState(false)
  const [activeHref, setActiveHref] =
    useState<(typeof LINKS)[number]['href']>('#vision')

  useEffect(() => {
    function updateNavState() {
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

      const marker = window.scrollY + window.innerHeight * 0.45
      let nextActive: (typeof LINKS)[number]['href'] = '#vision'

      LINKS.forEach(({ href }) => {
        const section = document.querySelector<HTMLElement>(href)
        if (!section) return

        const sectionTop = section.getBoundingClientRect().top + window.scrollY
        if (sectionTop <= marker) nextActive = href
      })

      setActiveHref(nextActive)
    }

    updateNavState()
    window.addEventListener('scroll', updateNavState, { passive: true })
    window.addEventListener('resize', updateNavState)
    return () => {
      window.removeEventListener('scroll', updateNavState)
      window.removeEventListener('resize', updateNavState)
    }
  }, [])

  return (
    <nav
      tabIndex={0}
      className="floating-nav group fixed bottom-15 left-6 z-50 outline-none"
      style={cssVars}
    >
      <div
        className={`flex h-[var(--nav-h)] w-max max-w-[var(--nav-collapsed-w)] items-center gap-[var(--nav-gap)] overflow-hidden rounded-full border border-white/10 px-[var(--nav-px)] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-[max-width,background-color] duration-500 ease-out group-focus-within:max-w-[calc(100vw-48px)] group-hover:max-w-[calc(100vw-48px)] ${
          onLightBg
            ? 'bg-[rgba(70,100,172,0.4)]'
            : 'bg-[rgba(173,171,171,0.36)]'
        }`}
      >
        <img
          src={navLogo}
          alt="梅竹黑客松"
          decoding="async"
          className="ml-[var(--nav-logo-offset)] h-[var(--nav-logo-h)] w-[var(--nav-logo-w)] shrink-0 object-contain object-center transition-[margin-left] duration-500 ease-out group-focus-within:ml-0 group-hover:ml-0"
        />
        <ul className="flex shrink-0 items-center gap-[var(--nav-links-gap)] whitespace-nowrap opacity-0 transition-opacity delay-150 duration-300 group-focus-within:opacity-100 group-hover:opacity-100">
          {LINKS.map(({ label, href, weight }) => (
            <li key={href}>
              <a
                href={href}
                className={`font-noto-tc block w-[4em] text-center text-[length:var(--nav-font)] transition-colors ${
                  weight === 'medium' ? 'font-medium' : 'font-normal'
                } ${
                  activeHref === href
                    ? 'text-[#989898]'
                    : 'text-white hover:text-white/70'
                }`}
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
