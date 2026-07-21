import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import HeroDecorations from '../components/layout/HeroDecorations'

const BG_MASK = 'linear-gradient(to bottom, black 55%, transparent 100%)'
// Mobile bottom nebula fade — tighter than the form's 85% to shrink the black gap.
const BG2_MASK = 'linear-gradient(to bottom, transparent 0%, black 70%)'

export default function SuccessView() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden text-white">
      {/* black backdrop behind everything */}
      <div className="fixed inset-0 -z-20 bg-black" />
      {/* Desktop nebula — bg-top shows more of bg-1's top than bg-center */}
      <div
        className="absolute inset-0 -z-10 hidden bg-cover bg-top md:block"
        style={{
          backgroundImage: 'url(/bg-1.png)',
          maskImage: BG_MASK,
          WebkitMaskImage: BG_MASK,
        }}
      />
      {/* Mobile nebula — form-style bg-1 top + bg-2 bottom, reduced centre gap */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden md:hidden">
        <img
          src="/bg-1.png"
          alt=""
          draggable={false}
          className="absolute inset-x-0 top-0 block h-auto w-full max-w-none select-none"
          style={{ maskImage: BG_MASK, WebkitMaskImage: BG_MASK }}
        />
        <img
          src="/bg-2.png"
          alt=""
          draggable={false}
          className="absolute inset-x-0 bottom-0 block h-auto w-full max-w-none select-none"
          style={{ maskImage: BG2_MASK, WebkitMaskImage: BG2_MASK }}
        />
      </div>

      <Navbar />

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 text-center">
        {/* Full-width hero so HeroDecorations anchors to page edges like /signup */}
        <section className="relative flex w-full translate-y-[0.5rem] items-center justify-center md:translate-y-[4rem]">
          <HeroDecorations variant="success" />
          {/* Font sizes scale fluidly with the viewport via clamp() (40→100px
              title, 11→25px subtitle) rather than a single md: breakpoint jump. */}
          <div className="relative z-10 flex flex-col gap-2 md:gap-8">
            <h1 className="font-zen -translate-y-4 text-center text-[clamp(2.5rem,1.1rem+5.71vw,6.25rem)] leading-[clamp(2.75rem,2.29rem+1.9vw,4rem)] tracking-widest text-[#F6F6F6] [text-shadow:0_4px_40px_rgba(255,255,255,0.20),0_0_20px_rgba(255,255,255,0.35)]">
              報名成功!
            </h1>
            <p className="text-[clamp(0.6875rem,0.36rem+1.33vw,1.5625rem)] leading-tight font-medium whitespace-nowrap text-white/80 md:font-semibold">
              我們已收到您的報名資料，請留意後續的 email 通知。
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
