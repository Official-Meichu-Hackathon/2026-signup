import { useEffect, useState } from 'react'
import MobileFooter from '../components/layout/MobileFooter'
import Navbar from '../components/layout/Navbar'
import MobileStatsAccordion from '../components/stats/MobileStatsAccordion'
import MobileStatsStars from '../components/stats/MobileStatsStars'
import bgGradient from '../assets/Problems/bg-gradient.png'

// 參賽數據手機版頁框（165:1204）是 390×1816：navbar 0..55、主標題 y75、手風琴
// 從 y154 起算（實際內容只有 310 高 —— 三條橫幅 y=0/50/100，1670 是 instance 的
// 宣告框不是內容），footer 落在 1756..1816。中間那段是設計稿刻意留白給背景光暈。
//
// 比照電腦版（StatsView）把整頁高度照設計稿比例鎖死（高 = 寬 × 1816/390），不再
// 跟著內容長。這樣展開／收合手風琴時頁面高度不變，背景與星星就不會被拉伸也不會
// 位移 —— 先前兩張漸層的 h-[52%]／h-[34%] 都是對「頁面高度」取百分比，內容一長
// 背景就跟著抽長；頁高固定之後同一組百分比就變成純粹由寬度決定了。
const PAGE_W = 390
// 手機統計圖改用完整設計稿 SVG 後，展開內容比原本的動態圓餅圖高 164px。
// 保持所有既有定位不變，只延長背景畫布，避免成果平台卡片被裁切。
const PAGE_H = 1980

// 設計稿座標 → 頁框百分比。頁高已由寬度鎖死，故兩者都只跟寬度連動。
const pctX = (n: number) => `${((n / PAGE_W) * 100).toFixed(4)}%`
const pctY = (n: number) => `${((n / PAGE_H) * 100).toFixed(4)}%`

// MobileFooter 是既有共用元件、寬度寫死 390，這裡按畫布寬度等比放大。設計稿
// 的 footer 貼齊頁框底部（1756..1816），頁高鎖死後內容不再撐滿整頁，故改成絕對
// 定位貼底，不能留在文件流裡。
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
      <Navbar />
      <div
        className="relative mx-auto overflow-hidden bg-black"
        style={{
          width: canvasWidth,
          aspectRatio: `${PAGE_W} / ${PAGE_H}`,
          minHeight: '100svh',
        }}
      >
        {/* 背景漸層：與題目說明手機版共用同一組素材 */}
        <img
          src={bgGradient}
          alt=""
          className="page-glow pointer-events-none absolute top-0 left-0 h-[52%] w-full object-cover select-none"
        />
        <img
          src={bgGradient}
          alt=""
          className="page-glow pointer-events-none absolute bottom-[3%] left-0 h-[34%] w-full rotate-180 object-cover select-none"
        />
        <MobileStatsStars />

        {/* 主標題（165:1208：x11 y75 368×57）與手風琴（177:254：x0 y154 393 寬）
            都照設計稿座標絕對定位。先前是用 h-[55px]/mt-[86px]/mt-[60px] 疊出來的，
            手風琴會落在 y255、比設計稿低 101 —— 兩條都展開時內容就會超出頁框被裁掉
            100px。改回設計稿座標後，展開狀態剛好收在頁框內（設計稿 instance 宣告的
            1670 高就是展開後的高度：154+1670≈頁框底）。 */}
        <h1
          className="glow-text font-zen text-ink absolute z-10 text-center text-[32px] leading-[54px] whitespace-nowrap"
          style={{ left: pctX(11), top: pctY(75), width: pctX(368) }}
        >
          參賽數據
        </h1>

        <div
          className="absolute z-10"
          style={{ left: 0, top: pctY(154), width: pctX(393) }}
        >
          <MobileStatsAccordion />
        </div>

        <div
          className="absolute inset-x-0 bottom-0 z-10 w-full overflow-hidden"
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
