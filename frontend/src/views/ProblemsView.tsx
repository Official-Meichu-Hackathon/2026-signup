import { useEffect, useState } from 'react'
import Footer from '../components/layout/Footer'
import Navbar from '../components/layout/Navbar'
import CursorTrail from '../components/layout/CursorTrail'
import ProblemDeck from '../components/problems/ProblemDeck'
import MobileProblemsView from './MobileProblemsView'
import ProblemStars from '../components/problems/ProblemStars'
import MakerCta from '../components/problems/MakerCta'
import MakerCtaStars from '../components/problems/MakerCtaStars'
import bgGradient from '../assets/Problems/bg-gradient.png'

export default function ProblemsView() {
  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia('(max-width: 767px)').matches,
  )

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)')
    const onChange = (event: MediaQueryListEvent) => setIsMobile(event.matches)
    mediaQuery.addEventListener('change', onChange)
    return () => mediaQuery.removeEventListener('change', onChange)
  }, [])

  if (isMobile) return <MobileProblemsView />

  return (
    <div className="relative min-h-svh overflow-hidden bg-black">
      <Navbar />
      {/* 背景漸層（360:309 / 360:310）：同一張素材，下半部那張旋轉 180°。
          設計稿把它拉寬到 1576/1440 並壓成 1064 高，故此處不維持原比例。 */}
      <img
        data-trail-bg="problems"
        src={bgGradient}
        alt=""
        className="page-glow pointer-events-none absolute top-0 left-[-9.44%] h-[1064px] w-[109.44%] max-w-none select-none"
      />
      <img
        data-trail-bg="problems"
        src={bgGradient}
        alt=""
        className="page-glow pointer-events-none absolute bottom-0 left-[-9.44%] h-[1064px] w-[109.44%] max-w-none rotate-180 select-none"
      />
      {/* 小星點（共用元件）鋪底，設計稿的 5 顆大星疊在其上 */}
      <ProblemStars />

      {/* 滑鼠拖尾（與比賽時程頁同一個元件）。跟 ScheduleView 一樣不能用負的
          z-index —— 上面兩張背景漸層是 z-index:auto 的兄弟節點，負值會讓拖尾
          沉到它們底下。z-5 夾在背景（auto）與內容（z-10）之間，剛好蓋過背景
          又壓在文字下面。元件本身在觸控裝置與 prefers-reduced-motion 下會自己
          停用，故手機版（MobileProblemsView）不需要另外掛。 */}
      <div className="relative z-[5]">
        <CursorTrail bgSelector="[data-trail-bg='problems']" />
      </div>

      {/* 左上角梅竹黑客松 logo（1366:61503：x47 y13 148×67）。設計稿以
          object-cover 貼齊底部，故頂端星芒被裁切。navbar 其餘元件（報名
          按鈕、選單）屬他人負責範圍，此處不實作。 */}
      <main className="relative z-10 flex flex-col items-center px-6 pt-28 pb-16">
        <h1 className="glow-text font-zen text-ink text-center text-6xl md:text-8xl">
          題目説明
        </h1>

        {/* 保密聲明（1097:61399）在設計稿中為隱藏狀態（opacity 0），
            待設計確認顯示時機後再開放；其預留高度反映在下方留白，
            讓頁面維持設計稿 1440×2550 的長捲動比例。 */}

        {/* 黑客組牌堆 — 設計稿中收合牌堆靠頁面左側（664:8019 於 x≈88）。
            上方留白除了設計稿的保密聲明預留空間（48rem）外，另外加寬到
            63rem，讓題目卡放大時能往上升起而不壓到「題目説明」標題
            （放大卡需要 ProblemDeck 的 ZOOM_RISE ≈ 965px）。 */}
        <section className="mt-[28rem] flex w-full max-w-[1262px] flex-col md:mt-[63rem]">
          <ProblemDeck />
          <div
            aria-hidden
            className="mt-28 h-[100px] w-[183px] self-start md:mt-52"
          />
        </section>

        {/* 創客交流組（810:3525 元件組）。點擊會播設計稿的過場並帶出說明文字
            與題目 PDF 連結；未公開時是靜態的「尚未公開」。 */}
        <section className="mt-10 flex w-full max-w-[961px] flex-col items-center">
          <div aria-hidden className="h-[100px] w-[183px] self-end md:mr-2" />
          {/* relative 讓 MakerCtaStars 能錨在面板的框上。三顆大星原本在
              ProblemStars 裡，但那層的高度由視窗寬度決定、面板卻是排版流決定的，
              視窗一變寬星星就會滑到 footer 旁邊，故改成跟著面板走。 */}
          <div className="relative mt-6 w-full">
            <MakerCtaStars />
            <MakerCta />
          </div>
        </section>
      </main>

      {/* footer 灰底（1366:61600）：設計稿在 footer 後方鋪同一組玻璃材質。
          Footer 本身是共用元件，故灰底以外層包裹的方式加上，避免動到它。 */}
      <div className="glass-dark relative z-10">
        <Footer />
      </div>
    </div>
  )
}
