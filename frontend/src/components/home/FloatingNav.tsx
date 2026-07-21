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

const NAV_BOTTOM_OFFSET = 24
const NAV_HEIGHT = 76

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
    <nav className="group fixed bottom-6 left-6 z-50">
      <div
        className={`flex h-[76px] max-w-[180px] items-center gap-10 overflow-hidden rounded-full border border-white/10 px-[17px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-[max-width,background-color] duration-500 ease-out group-hover:max-w-[1200px] ${
          onLightBg
            ? 'bg-[rgba(70,100,172,0.4)]'
            : 'bg-[rgba(173,171,171,0.36)]'
        }`}
      >
        <img
          src={navLogo}
          alt="梅竹黑客松"
          className="h-16 w-auto shrink-0 object-contain object-left"
        />
        <ul className="flex shrink-0 items-center gap-8 whitespace-nowrap opacity-0 transition-opacity delay-150 duration-300 group-hover:opacity-100">
          {LINKS.map(({ label, href }) => (
            <li key={href}>
              <a
                href={href}
                className="text-lg text-white transition-colors hover:text-white/70"
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
