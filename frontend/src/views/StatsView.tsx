import { useEffect, useState } from 'react'
import Footer from '../components/layout/Footer'
import Navbar from '../components/layout/Navbar'
import CursorTrail from '../components/layout/CursorTrail'
import StatsAccordion from '../components/stats/StatsAccordion'
import StatsStars from '../components/stats/StatsStars'
import MobileStatsView from './MobileStatsView'
import bgGradient from '../assets/Problems/bg-gradient.png'

// 參賽數據電腦版（378:298）是 1440×4096 的固定頁框，內容只佔上面約 1594（標題
// 220、手風琴 494 起算 1100 高），footer 落在 3882..4096，中間那 2288 是設計稿刻意
// 留白給背景光暈（參賽數據背景電腦 378:351 裡的 Rectangle 231 就佔 1213..3185）。
//
// 故整頁高度改成照設計稿比例鎖死（高 = 寬 × 4096/1440），不再跟著內容長。這樣
// 展開／收合手風琴時頁面高度不變，背景與星星就完全不會被拉伸也不會位移 ——
// 之前背景會變是因為下半張漸層錨在 bottom-0，頁面一長高它就跟著往下跑。
const DESIGN_W = 1440
const DESIGN_H = 4096

// 上下兩張漸層各自的高度（原本寫死 1064px，寬螢幕不會跟著長）。改成頁高的百分
// 比，因為頁高已由寬度決定，等於整組背景都跟寬度等比縮放。
const GLOW_H = `${((1064 / DESIGN_H) * 100).toFixed(4)}%`

// footer 電腦版（1366:61578）在設計稿裡貼齊頁框底部（3882..4096）。頁面高度鎖死
// 之後內容不再撐滿整頁，故 footer 改成絕對定位貼底，不能留在文件流裡。
export default function StatsView() {
  // 與題目說明頁及 Tailwind 的 md 斷點一致：768px 以下改用手機版版面。
  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia('(max-width: 767px)').matches,
  )

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)')
    const onChange = (event: MediaQueryListEvent) => setIsMobile(event.matches)
    mediaQuery.addEventListener('change', onChange)
    return () => mediaQuery.removeEventListener('change', onChange)
  }, [])

  if (isMobile) return <MobileStatsView />

  return (
    <div
      className="relative overflow-hidden bg-black"
      style={{ aspectRatio: `${DESIGN_W} / ${DESIGN_H}`, minHeight: '100svh' }}
    >
      <Navbar />
      {/* 背景漸層（參賽數據背景電腦 378:351）：與題目說明頁共用同一組素材。 */}
      <img
        data-trail-bg="stats"
        src={bgGradient}
        alt=""
        className="page-glow pointer-events-none absolute top-0 left-[-9.44%] w-[109.44%] max-w-none select-none"
        style={{ height: GLOW_H }}
      />
      <img
        data-trail-bg="stats"
        src={bgGradient}
        alt=""
        className="page-glow pointer-events-none absolute bottom-0 left-[-9.44%] w-[109.44%] max-w-none rotate-180 select-none"
        style={{ height: GLOW_H }}
      />
      {/* 參賽數據電腦_星星閃爍（570:1341）：7 顆帶光暈的星，各自不同的閃爍
          相位差。鋪在背景漸層之上、內容之下。 */}
      <StatsStars />

      {/* 滑鼠拖尾（與比賽時程頁同一個元件）。跟 ScheduleView 一樣不能用負的
          z-index —— 上面兩張背景漸層是 z-index:auto 的兄弟節點，負值會讓拖尾
          沉到它們底下。z-5 夾在背景（auto）與內容（z-10）之間，剛好蓋過背景
          又壓在文字下面。元件是 position:fixed，外層的 overflow-hidden 不會裁
          到它（固定定位的包含塊是視窗，除非祖先有 transform/filter）。觸控裝置
          與 prefers-reduced-motion 下元件會自己停用，故手機版不需要另外掛。 */}
      <div className="relative z-[5]">
        <CursorTrail bgSelector="[data-trail-bg='stats']" />
      </div>

      {/* 左上角梅竹黑客松 logo（1366:61551），與題目說明頁同一組素材。navbar
          其餘元件（報名按鈕、選單）屬他人負責範圍，此處不實作。 */}
      <main className="absolute inset-x-0 top-0 z-10 flex flex-col items-center px-6 pt-32 pb-24 md:pt-[220px]">
        {/* 主標題(電腦版)：Zen Antique 100 / 行高 64（378:306） */}
        <h1 className="glow-text font-zen text-ink text-center text-6xl leading-[64px] md:text-[100px]">
          參賽數據
        </h1>
        <div className="mt-20 flex w-full justify-center md:mt-[210px]">
          <StatsAccordion />
        </div>
      </main>

      {/* footer 灰底（1366:61578）：同題目說明頁，以外層包裹加上玻璃材質。 */}
      <div className="glass-dark stats-layer absolute inset-x-0 bottom-0 z-10">
        <Footer />
      </div>
    </div>
  )
}
