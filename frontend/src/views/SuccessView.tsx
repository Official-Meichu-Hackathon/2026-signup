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
        {/* Full-width hero (mirrors FormShell) so HeroDecorations' inset-0
            layer anchors to the page edges — star-03 lands far left (7%) and
            star-02 far right (7.5%), exactly like /signup. */}
        <section className="relative flex w-full items-center justify-center">
          <HeroDecorations />
          <h1 className="glow-text font-zen relative z-10 text-5xl tracking-widest md:text-7xl">
            報名成功！
          </h1>
        </section>
        <p className="text-lg text-white/80">
          我們已收到您的報名資料，請留意後續的 email 通知。
        </p>
      </main>

      <Footer />
    </div>
  )
}
