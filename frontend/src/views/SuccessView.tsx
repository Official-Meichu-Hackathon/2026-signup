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

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 text-center">
        {/* Full-width hero so HeroDecorations anchors to page edges like /signup */}
        <section className="relative flex w-full items-center justify-center">
          <HeroDecorations variant="success" />
          {/* p uses w-0 min-w-full so the column width comes from the title */}
          <div className="relative z-10 flex flex-col gap-6">
            <h1 className="font-zen text-center text-[3rem] leading-[3.25rem] tracking-widest text-[#F6F6F6] [text-shadow:0_4px_40px_rgba(255,255,255,0.20),0_0_20px_rgba(255,255,255,0.35)] md:text-8xl md:leading-none md:text-white md:[text-shadow:0_0_12px_rgba(255,255,255,0.8),0_0_40px_rgba(255,255,255,0.45),0_0_80px_rgba(160,180,255,0.35)]">
              報名成功！
            </h1>
            <p className="w-0 min-w-full text-lg text-white/80 md:text-[1.3rem] md:whitespace-nowrap">
              我們已收到您的報名資料，請留意後續的 email 通知。
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
