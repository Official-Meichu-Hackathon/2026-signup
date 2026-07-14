import { Link } from 'react-router-dom'
import logo from '../../assets/meichuhackathon.png'

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 z-50 flex h-20 w-full items-start justify-between pt-5 pr-[3.125rem] pl-[2.9375rem]">
      <Link to="/" className="-mt-2">
        <img src={logo} alt="梅竹黑客松" className="h-16 w-auto" />
      </Link>
      <div className="flex items-center gap-9">
        <Link
          to="/registration"
          className="flex h-[2.875rem] w-[8.75rem] items-center justify-center rounded-full border border-[#d3e4fc]/80 bg-white/20 text-xl text-white/80 backdrop-blur transition hover:bg-white/30"
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
            className="h-[1.875rem] w-[1.875rem]"
          >
            <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </div>
    </header>
  )
}
