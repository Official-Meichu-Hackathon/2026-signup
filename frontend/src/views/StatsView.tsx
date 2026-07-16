import StarField from '../components/layout/StarField'
import StatsAccordion from '../components/stats/StatsAccordion'
import bgTop from '../assets/Schedule/bg-top.png'
import bgBottom from '../assets/Schedule/bg-bottom.png'

export default function StatsView() {
  return (
    <div className="relative min-h-svh overflow-hidden bg-[#0a0505]">
      <img
        src={bgTop}
        alt=""
        className="pointer-events-none absolute top-0 left-0 w-full select-none"
      />
      <img
        src={bgBottom}
        alt=""
        className="pointer-events-none absolute bottom-0 left-0 w-full select-none"
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
    </div>
  )
}
