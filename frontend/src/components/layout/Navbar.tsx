import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../../assets/meichuhackathon.png'
import MobileNavMenu from './MobileNavMenu'

// Header height it's checking against (py-4 + h-12 logo) — keep in sync with
// the header's own padding/logo size below.
const NAV_HEIGHT = 80

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  // Mirrors FloatingNav's approach: sections opt into a light background via
  // `data-nav-theme="light"` (see Home.tsx's white PartnerLogos/StaffAndThanks
  // section), and the header swaps to dark text/icons while it overlaps one —
  // otherwise the white logo/button/hamburger disappear against white.
  const [onLightBg, setOnLightBg] = useState(false)

  useEffect(() => {
    function checkBackground() {
      const lightSections = document.querySelectorAll(
        '[data-nav-theme="light"]',
      )
      let over = false
      lightSections.forEach((el) => {
        const rect = el.getBoundingClientRect()
        if (rect.top < NAV_HEIGHT && rect.bottom > 0) over = true
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
    <>
      <header className="site-header fixed top-0 left-0 z-50 flex w-full items-center justify-between bg-black/5 px-6 py-4 backdrop-blur-[2px]">
        {/* Faded/blurred (not literally layered under the drawer — `fixed`
            elements always open their own stacking context, so nesting these
            under a lower z-index header would trap them there too) to look
            covered by the glass panel while it's open, per the reference
            screenshot. The hamburger button below is deliberately excluded
            from this fade — unlike these two, it's the only control that
            closes the drawer again (no separate "X" icon), so it stays
            fully opaque and clickable instead of also dimming. */}
        <Link
          to="/"
          className={`transition duration-300 ${menuOpen ? 'pointer-events-none opacity-30 blur-[2px]' : ''}`}
        >
          <img
            src={logo}
            alt="梅竹黑客松"
            className={`site-logo h-12 w-auto transition duration-300 ${onLightBg ? 'invert' : ''}`}
          />
        </Link>
        <div className="site-header-actions flex items-center gap-4">
          <Link
            to="/signup"
            className={`site-signup rounded-full border px-5 py-1.5 text-sm backdrop-blur transition duration-300 ${
              onLightBg
                ? 'border-black/20 bg-black/5 text-neutral-900 hover:bg-black/10'
                : 'border-white/20 bg-white/10 text-white hover:bg-white/20'
            } ${menuOpen ? 'pointer-events-none opacity-30 blur-[2px]' : ''}`}
          >
            點我報名
          </Link>
          <button
            type="button"
            aria-label={menuOpen ? '關閉選單' : '選單'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className={`site-menu-button transition duration-300 hover:opacity-70 ${onLightBg ? 'text-neutral-900' : 'text-white'}`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="site-menu-icon h-6 w-6"
            >
              <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
      </header>
      <MobileNavMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
