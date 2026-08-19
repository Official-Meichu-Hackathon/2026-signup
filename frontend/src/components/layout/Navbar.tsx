import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../../assets/meichuhackathon.svg'
import MobileNavMenu from './MobileNavMenu'
import { SIGNUP_OPEN } from '../../lib/signupOpen'

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
      <header className="site-header fixed top-0 left-0 z-50 flex h-[64px] w-full items-center justify-between bg-black/5 px-[16px] backdrop-blur-[2px] sm:h-[72px] sm:px-[30px] md:h-[80px] md:pr-[50px] md:pl-[47px]">
        {/* Faded/blurred (not literally layered under the drawer — `fixed`
            elements always open their own stacking context, so nesting these
            under a lower z-index header would trap them there too) to look
            covered by the glass panel while it's open, per the reference
            screenshot. The logo sits outside the drawer's own width at every
            breakpoint, so it only ever needs this fake "covered" look, never
            a real one. */}
        <Link
          to="/"
          className={`transition duration-300 ${menuOpen ? 'pointer-events-none opacity-30 blur-[2px]' : ''}`}
        >
          <img
            src={logo}
            alt="梅竹黑客松"
            className={`site-logo h-[45px] w-[100px] object-contain transition duration-300 sm:h-[55px] sm:w-[125px] md:h-[67px] md:w-[148px] ${onLightBg ? 'invert' : ''}`}
          />
        </Link>
        <div className="site-header-actions flex items-center gap-[12px] sm:gap-[20px] md:gap-[37px]">
          {/* Unlike the logo, this sits inside the drawer's own width, so it's
              genuinely underneath the glass panel once open (not just faked
              via opacity) — hidden outright instead of left to bleed through
              the panel's translucency as a ghost. */}
          {SIGNUP_OPEN ? (
            <Link
              to="/signup"
              className={`site-signup font-chiron flex h-[34px] w-[95px] items-center justify-center rounded-[30px] border text-[13px] leading-[40px] font-bold backdrop-blur transition duration-300 sm:h-[40px] sm:w-[120px] sm:text-[16px] md:h-[46px] md:w-[140px] md:text-[20px] ${
                onLightBg
                  ? 'border-black/20 bg-black/5 text-neutral-900 hover:bg-black/10'
                  : 'border-white/20 bg-white/10 text-white hover:bg-white/20'
              } ${menuOpen ? 'pointer-events-none opacity-0' : ''}`}
            >
              點我報名
            </Link>
          ) : (
            <button
              type="button"
              disabled
              className={`site-signup font-chiron flex h-[34px] w-[95px] cursor-not-allowed items-center justify-center rounded-[30px] border text-[13px] leading-[40px] font-bold opacity-50 backdrop-blur transition duration-300 sm:h-[40px] sm:w-[120px] sm:text-[16px] md:h-[46px] md:w-[140px] md:text-[20px] ${
                onLightBg
                  ? 'border-black/20 bg-black/5 text-neutral-900'
                  : 'border-white/20 bg-white/10 text-white'
              } ${menuOpen ? 'pointer-events-none opacity-0' : ''}`}
            >
              報名結束
            </button>
          )}
          {/* Covered by the drawer while open, same as the signup button —
              closing then relies on the drawer's own backdrop click-outside
              (see MobileNavMenu), not this button. */}
          <button
            type="button"
            aria-label={menuOpen ? '關閉選單' : '選單'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className={`site-menu-button transition duration-300 hover:opacity-70 ${onLightBg ? 'text-neutral-900' : 'text-white'} ${menuOpen ? 'pointer-events-none opacity-0' : ''}`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="site-menu-icon h-[24px] w-[24px] sm:h-[28px] sm:w-[28px] md:h-[30px] md:w-[30px]"
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
