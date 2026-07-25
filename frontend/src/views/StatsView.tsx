import Footer from '../components/layout/Footer'
import StatsAccordion from '../components/stats/StatsAccordion'
import bgGradient from '../assets/Problems/bg-gradient.png'
import logoNav from '../assets/Problems/logo-nav.png'

export default function StatsView() {
  return (
    <div className="relative min-h-svh overflow-hidden bg-black">
      {/* 背景漸層（參賽數據背景電腦 378:351）：與題目說明頁共用同一組素材。 */}
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
      {/* 左上角梅竹黑客松 logo（1366:61551），與題目說明頁同一組素材。navbar
          其餘元件（報名按鈕、選單）屬他人負責範圍，此處不實作。 */}
      <img
        src={logoNav}
        alt="梅竹黑客松"
        className="absolute top-[13px] left-[47px] z-10 h-[67px] w-[148px] object-cover object-bottom"
      />

      <main className="relative z-10 flex flex-col items-center px-6 pt-32 pb-24 md:pt-[220px]">
        {/* 主標題(電腦版)：Zen Antique 100 / 行高 64（378:306） */}
        <h1 className="glow-text font-zen text-ink text-center text-6xl leading-[64px] md:text-[100px]">
          參賽數據
        </h1>
        <div className="mt-20 flex w-full justify-center md:mt-[210px]">
          <StatsAccordion />
        </div>
      </main>

      {/* footer 灰底（1366:61578）：同題目說明頁，以外層包裹加上玻璃材質。 */}
      <div className="glass-dark relative z-10">
        <Footer />
      </div>
    </div>
  )
}
