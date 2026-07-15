import { Link } from 'react-router-dom'
import logo from '../../assets/meichuhackathon.png'

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 z-50 flex w-full items-center justify-between px-6 py-4">
      <Link to="/">
        <img src={logo} alt="梅竹黑客松" className="h-12 w-auto" />
      </Link>
      <div className="flex items-center gap-4">
        <Link
          to="/signup"
          className="rounded-full border border-white/20 bg-white/10 px-5 py-1.5 text-sm text-white backdrop-blur transition hover:bg-white/20"
        >
          點我報名
        </Link>
        <button
          type="button"
          aria-label="選單"
          className="text-white transition hover:opacity-70"
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
  )
}
