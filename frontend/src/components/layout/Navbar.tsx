import { useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../../assets/meichuhackathon.png'
import MobileNavMenu from './MobileNavMenu'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <header className="fixed top-0 left-0 z-50 flex w-full items-center justify-between px-6 py-4">
        {/* Faded/blurred (not literally layered under the drawer — `fixed`
            elements always open their own stacking context, so nesting these
            under a lower z-index header would trap them there too) to look
            covered by the glass panel while it's open, per the reference
            screenshot. The hamburger itself fades along with the rest of the
            header when open — closing then goes through the drawer's
            click-outside backdrop instead, so it doesn't need to stay live. */}
        <Link
          to="/"
          className={`transition duration-300 ${menuOpen ? 'pointer-events-none opacity-30 blur-[2px]' : ''}`}
        >
          <img src={logo} alt="梅竹黑客松" className="h-12 w-auto" />
        </Link>
        <div className="flex items-center gap-4">
          <Link
            to="/registration"
            className={`rounded-full border border-white/20 bg-white/10 px-5 py-1.5 text-sm text-white backdrop-blur transition duration-300 hover:bg-white/20 ${menuOpen ? 'pointer-events-none opacity-30 blur-[2px]' : ''}`}
          >
            點我報名
          </Link>
          <button
            type="button"
            aria-label={menuOpen ? '關閉選單' : '選單'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className={`text-white transition duration-300 hover:opacity-70 ${menuOpen ? 'pointer-events-none opacity-30 blur-[2px]' : ''}`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-6 w-6"
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
