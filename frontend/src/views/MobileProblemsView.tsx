import Footer from '../components/layout/Footer'
import MakerCta from '../components/problems/MakerCta'
import MobileProblemDeck from '../components/problems/MobileProblemDeck'
import bgGradient from '../assets/Problems/bg-gradient.png'
import logoNav from '../assets/Problems/logo-nav.png'
import star1 from '../assets/Problems/star-1.svg'
import star2 from '../assets/Problems/star-2.svg'
import star3 from '../assets/Problems/star-3.svg'
import star4 from '../assets/Problems/star-4.svg'

function MobileStars() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <img
        src={star1}
        alt=""
        className="animate-star-twinkle absolute -top-[1%] -right-[16%] w-[44%]"
      />
      <img
        src={star3}
        alt=""
        className="animate-star-twinkle absolute top-[13%] left-[7%] w-[18%]"
        style={{ animationDelay: '1.2s' }}
      />
      <img
        src={star4}
        alt=""
        className="animate-star-twinkle absolute top-[29%] right-[1%] w-[24%]"
        style={{ animationDelay: '2.1s' }}
      />
      <img
        src={star2}
        alt=""
        className="animate-star-twinkle absolute top-[77%] right-[-14%] w-[52%]"
        style={{ animationDelay: '0.6s' }}
      />
    </div>
  )
}

export default function MobileProblemsView() {
  return (
    <main className="min-h-svh bg-black py-0 sm:px-4 sm:py-6">
      <div
        className="relative mx-auto w-full max-w-[390px] overflow-hidden bg-black"
        style={{ minHeight: 'min(1816px, 465.64vw)' }}
      >
        <img
          src={bgGradient}
          alt=""
          className="pointer-events-none absolute top-0 left-0 h-[52%] w-full object-cover"
        />
        <img
          src={bgGradient}
          alt=""
          className="pointer-events-none absolute bottom-[3%] left-0 h-[34%] w-full rotate-180 object-cover"
        />
        <MobileStars />

        <header className="absolute top-0 left-0 z-10 flex h-[55px] w-full items-center justify-between px-[14px]">
          <img
            src={logoNav}
            alt="2026 Meichu Hackathon"
            className="h-[31px] w-[64px] object-cover object-bottom"
          />
          <div className="flex items-center gap-[10px]">
            <button
              type="button"
              aria-label="點我報名"
              className="font-zen h-[31px] rounded-full border border-[#d3e4fc]/80 bg-[#f4f5f5]/20 px-[13px] text-[12px] leading-[12px] text-white shadow-[0_4px_10px_-2px_rgba(28,27,31,0.2)]"
            >
              點我報名
            </button>
            <button
              type="button"
              aria-label="開啟選單"
              className="flex h-[31px] w-[27px] flex-col items-center justify-center gap-[3px]"
            >
              <span className="h-px w-[17px] bg-white" />
              <span className="h-px w-[17px] bg-white" />
              <span className="h-px w-[17px] bg-white" />
            </button>
          </div>
        </header>

        <h1 className="glow-text font-zen text-ink absolute top-[7.76%] left-1/2 -translate-x-1/2 text-[32px] leading-[54px] whitespace-nowrap">
          題目說明
        </h1>

        <div className="absolute top-[23%] left-0 h-[250px] w-full">
          <MobileProblemDeck />
        </div>

        <section className="absolute top-[58.43%] left-[3.33%] w-[92.43%]">
          <MakerCta />
        </section>

        <div className="glass-dark absolute right-0 bottom-0 left-0 h-[60px] overflow-hidden">
          <div className="origin-top scale-[0.5]" style={{ width: '200%' }}>
            <Footer />
          </div>
        </div>
      </div>
    </main>
  )
}
