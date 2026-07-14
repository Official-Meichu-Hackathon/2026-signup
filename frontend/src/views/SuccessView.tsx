import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

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
          maskImage: 'linear-gradient(to bottom, black 55%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to bottom, black 55%, transparent 100%)',
        }}
      />

      <Navbar />

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
        <h1 className="glow-text font-zen text-5xl tracking-widest md:text-7xl">
          報名成功！
        </h1>
        <p className="text-lg text-white/80">
          我們已收到您的報名資料，請留意後續的 email 通知。
        </p>
      </main>

      <Footer />
    </div>
  )
}
