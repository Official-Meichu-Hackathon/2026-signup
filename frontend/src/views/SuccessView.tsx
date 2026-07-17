import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import HeroDecorations from '../components/layout/HeroDecorations'

const BG_MASK = 'linear-gradient(to bottom, black 55%, transparent 100%)'

export default function SuccessView() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden text-white">
      {/* black backdrop behind everything */}
      <div className="fixed inset-0 -z-20 bg-black" />
      {/* bg-1 nebula, faded at the bottom */}
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center"
        style={{
          backgroundImage: 'url(/bg-1.png)',
          maskImage: BG_MASK,
          WebkitMaskImage: BG_MASK,
        }}
      />

      <Navbar />

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
        {/* Far-side stars anchored to the full-width page (Figma 894:10448 /
            894:10449 in 報名頁面(電腦版)) — desktop only, like the other
            desktop hero stars. Shadow lives on the un-rotated wrapper so it
            drops straight down; the img alone carries the rotation. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 hidden overflow-visible select-none md:block"
        >
          {/* far-left star (Figma 894:10448, 星星元素03) */}
          <div className="absolute top-1/2 left-[8.5%] -translate-y-[18.25rem] drop-shadow-[0_10px_4px_rgba(0,0,0,0.25)]">
            <img
              src="/deco/star-03.png"
              alt=""
              draggable={false}
              className="twinkle w-[72.849px] rotate-[-10deg]"
              style={{ animation: 'twinkle 3s ease-in-out infinite' }}
            />
          </div>
          {/* far-right star (Figma 894:10449, 星星元素02) */}
          <div className="absolute top-1/2 right-[5%] translate-y-[15rem] drop-shadow-[0_10px_4px_rgba(0,0,0,0.25)]">
            <img
              src="/deco/star-02.png"
              alt=""
              draggable={false}
              className="twinkle w-[6.25rem] -rotate-[120deg]"
              style={{ animation: 'twinkle 3.6s ease-in-out infinite 0.7s' }}
            />
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <HeroDecorations />
          <h1 className="glow-text font-zen relative z-10 text-5xl tracking-widest md:text-7xl">
            報名成功！
          </h1>
        </div>
        <p className="text-lg text-white/80">
          我們已收到您的報名資料，請留意後續的 email 通知。
        </p>
      </main>

      <Footer />
    </div>
  )
}
