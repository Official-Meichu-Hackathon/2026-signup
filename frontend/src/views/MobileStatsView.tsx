import { useEffect, useState } from 'react'
import MobileFooter from '../components/layout/MobileFooter'
import MobileStatsAccordion from '../components/stats/MobileStatsAccordion'
import bgGradient from '../assets/Problems/bg-gradient.png'
import logoNav from '../assets/Problems/logo-nav.png'

// 參賽數據(手機) 165:1219 只涵蓋手風琴本身（393 寬），頁面外框（logo、主標
// 題、背景漸層、footer）設計稿沒有另開節點，故沿用題目說明手機版的同一套
// 版面比例。MobileFooter 是既有共用元件、寬度寫死 390，這裡按視窗寬度等比
// 放大以貼齊 393 的版面。
const FOOTER_DESIGN_WIDTH = 390
const FOOTER_DESIGN_HEIGHT = 60
const DESIGN_WIDTH = 393

export default function MobileStatsView({
  forcePreview = false,
}: {
  forcePreview?: boolean
}) {
  const [viewportWidth, setViewportWidth] = useState(() => window.innerWidth)

  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const canvasWidth = forcePreview
    ? Math.min(viewportWidth, DESIGN_WIDTH)
    : viewportWidth
  const footerScale = canvasWidth / FOOTER_DESIGN_WIDTH

  return (
    <main className="min-h-svh bg-black">
      <div
        className="relative mx-auto flex min-h-svh flex-col overflow-hidden bg-black"
        style={{ width: canvasWidth }}
      >
        {/* 背景漸層：與題目說明手機版共用同一組素材 */}
        <img
          src={bgGradient}
          alt=""
          className="pointer-events-none absolute top-0 left-0 h-[52%] w-full object-cover select-none"
        />
        <img
          src={bgGradient}
          alt=""
          className="pointer-events-none absolute bottom-[3%] left-0 h-[34%] w-full rotate-180 object-cover select-none"
        />

        <header className="relative z-10 flex h-[55px] w-full shrink-0 items-center px-[14px]">
          <img
            src={logoNav}
            alt="2026 Meichu Hackathon"
            className="h-[31px] w-[64px] object-cover object-bottom"
          />
        </header>

        <h1 className="glow-text font-zen text-ink relative z-10 mt-[86px] text-center text-[32px] leading-[54px] whitespace-nowrap">
          參賽數據
        </h1>

        <div className="relative z-10 mt-[60px] w-full flex-1">
          <MobileStatsAccordion />
        </div>

        <div
          className="relative z-10 mt-[60px] w-full shrink-0 overflow-hidden"
          style={{ height: FOOTER_DESIGN_HEIGHT * footerScale }}
        >
          <div
            className="origin-top-left"
            style={{ transform: `scale(${footerScale})` }}
          >
            <MobileFooter />
          </div>
        </div>
      </div>
    </main>
  )
}
