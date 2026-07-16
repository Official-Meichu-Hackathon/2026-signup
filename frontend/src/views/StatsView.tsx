import Footer from '../components/layout/Footer'
import StarField from '../components/layout/StarField'
import StatsAccordion from '../components/stats/StatsAccordion'
import bgGradient from '../assets/Problems/bg-gradient.png'

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
      <StarField count={28} seed={2027} />

      <main className="relative z-10 flex flex-col items-center px-6 pt-32 pb-24">
        <h1 className="glow-text font-zen text-ink text-center text-6xl md:text-8xl">
          參賽數據
        </h1>
        <div className="mt-20 flex w-full justify-center">
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
