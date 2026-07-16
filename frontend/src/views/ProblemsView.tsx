import Footer from '../components/layout/Footer'
import StarField from '../components/layout/StarField'
import ProblemDeck from '../components/problems/ProblemDeck'
import buoyArrow from '../assets/Problems/buoy-arrow.svg'
import bgGradient from '../assets/Problems/bg-gradient.png'
import logo14th from '../assets/Problems/logo-14th.svg'
import ctaSparkle from '../assets/Problems/cta-sparkle.svg'

// 浮標（題目說明_浮標 838:19509 / 838:27446）：玻璃質感導引標籤。
function Buoy({
  label,
  className = '',
}: {
  label: string
  className?: string
}) {
  return (
    <div
      className={`glass-dark pointer-events-none relative flex h-[100px] w-[183px] items-center justify-center rounded-t-[40px] rounded-br-[40px] rounded-bl-[2px] ${className}`}
    >
      <span className="font-noto text-xl font-semibold text-white">
        {label}
      </span>
      <img
        src={buoyArrow}
        alt=""
        className="absolute right-[36px] bottom-[26px] w-[24px] rotate-90"
      />
    </div>
  )
}

export default function ProblemsView() {
  return (
    <div className="relative min-h-svh overflow-hidden bg-black">
      {/* 背景漸層（360:309 / 360:310）：同一張素材，下半部那張旋轉 180°。
          設計稿把它拉寬到 1576/1440 並壓成 1064 高，故此處不維持原比例。 */}
      <img
        src={bgGradient}
        alt=""
        className="pointer-events-none absolute top-0 left-[-9.44%] h-[1064px] w-[109.44%] max-w-none select-none"
      />
      <img
        src={bgGradient}
        alt=""
        className="pointer-events-none absolute bottom-0 left-[-9.44%] h-[1064px] w-[109.44%] max-w-none rotate-180 select-none"
      />
      <StarField count={28} seed={2026} />

      <main className="relative z-10 flex flex-col items-center px-6 pt-28 pb-16">
        <h1 className="glow-text font-zen text-ink text-center text-6xl md:text-8xl">
          題目説明
        </h1>

        {/* 保密聲明（1097:61399）在設計稿中為隱藏狀態（opacity 0），
            待設計確認顯示時機後再開放；其預留高度反映在下方留白，
            讓頁面維持設計稿 1440×2550 的長捲動比例。 */}

        {/* 黑客組牌堆 — 設計稿中收合牌堆靠頁面左側（664:8019 於 x≈88） */}
        <section className="mt-[48rem] flex w-full max-w-[1262px] flex-col">
          <ProblemDeck />
          <Buoy label="黑客組" className="mt-52 self-start" />
        </section>

        {/* 創客交流組 CTA（810:15346）— 設計稿為書法字向量組合，改以
            現有 logo 圖 + 文字重組，視覺對齊設計稿。卡片本身無填色，
            背景漸層直接透出。點擊功能待後續實作。 */}
        <section className="mt-10 flex w-full max-w-[961px] flex-col items-center">
          <Buoy label="創客組" className="self-end md:mr-2" />
          <div className="glass-dark @container relative mt-6 aspect-[961/538] w-full overflow-hidden rounded-[40px]">
            {/* 書法字 logo + 流星 + 14 th：由 Figma 節點 810:2643 的向量碎片
                組回的單一素材（x71 y16 w614 h166 / 961×538） */}
            <img
              src={logo14th}
              alt="梅竹黑客松 14th"
              className="absolute top-[3%] left-[7.4%] w-[63.9%]"
            />
            {/* 裝飾星（810:4413：中心 76.8%/41.3%，素材含光暈外擴 2.11 倍） */}
            <img
              src={ctaSparkle}
              alt=""
              className="absolute top-[41.3%] left-[76.8%] w-[12.65%] -translate-x-1/2 -translate-y-1/2"
            />
            {/* 創客交流組（810:3523：中心 y 55.1%、100px/961 ≈ 10.4cqw） */}
            <p className="glow-text font-zen text-ink absolute top-[55.1%] w-full -translate-y-1/2 text-center text-[10.4cqw]">
              創客交流組
            </p>
            {/* CLICK！（810:8908：中心 y 73.1%、35px ≈ 3.6cqw） */}
            <p className="glow-text-subtle font-zen text-periwinkle absolute top-[73.1%] w-full -translate-y-1/2 text-center text-[3.6cqw]">
              CLICK！
            </p>
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
