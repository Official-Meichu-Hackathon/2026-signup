import StarField from '../components/layout/StarField'
import ProblemDeck from '../components/problems/ProblemDeck'
import logo from '../assets/meichuhackathon.png'
import buoyArrow from '../assets/Problems/buoy-arrow.svg'
import bgTop from '../assets/Schedule/bg-top.png'
import bgBottom from '../assets/Schedule/bg-bottom.png'

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
      className={`pointer-events-none relative flex h-[100px] w-[183px] items-center justify-center rounded-t-[40px] rounded-br-[40px] rounded-bl-[2px] shadow-[0px_10px_30px_rgba(0,0,0,0.25),inset_0px_1px_8px_rgba(255,255,255,0.5)] backdrop-blur-[35px] ${className}`}
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
    <div className="bg-ink relative min-h-svh overflow-hidden bg-[#0a0505]">
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
      <StarField count={28} seed={2026} />

      <main className="relative z-10 flex flex-col items-center px-6 pt-28 pb-16">
        <h1 className="glow-text font-zen text-ink text-center text-6xl md:text-8xl">
          題目説明
        </h1>

        {/* 保密聲明（1097:61399） */}
        <div className="font-noto mt-16 flex max-w-4xl flex-col gap-1 text-center text-xl leading-relaxed font-semibold text-white">
          <p>
            為保護梅竹黑客松協辦企業之權益，關於合作企業所提供之專屬技術或資源，
          </p>
          <p>若有需要參賽者簽署技術保密協定，參賽者必須配合簽署。</p>
          <p>無法配合者，主辦方有權取消參賽資格，感謝您的理解！</p>
        </div>

        {/* 黑客組牌堆 */}
        <section className="mt-24 flex w-full flex-col items-center">
          <Buoy label="黑客組" className="self-start md:ml-2" />
          <div className="mt-6 flex w-full flex-col items-center">
            <ProblemDeck />
          </div>
        </section>

        {/* 創客交流組 CTA（810:15346）— 設計稿為書法字向量組合，改以
            現有 logo 圖 + 文字重組，視覺對齊設計稿。 */}
        <section className="mt-28 flex w-full max-w-[961px] flex-col items-center">
          <Buoy label="創客組" className="self-end md:mr-2" />
          {/* TODO: 創客交流組詳細頁/報名連結確定後補上 href */}
          <a
            href="#"
            className="from-darkblue/80 group relative mt-6 block w-full overflow-hidden rounded-[40px] bg-gradient-to-br via-[#10131f] to-[#050308] px-12 py-14 shadow-[0px_10px_50px_rgba(70,100,172,0.35)] transition hover:shadow-[0px_10px_70px_rgba(165,189,226,0.45)]"
          >
            <div className="flex items-end gap-6">
              <img
                src={logo}
                alt="梅竹黑客松"
                className="h-16 w-auto md:h-20"
              />
              <span className="font-zen glow-text-subtle text-ink text-3xl italic md:text-4xl">
                14 th
              </span>
            </div>
            <p className="glow-text font-zen text-ink mt-8 text-center text-5xl md:text-6xl">
              創客交流組
            </p>
            <p className="font-zen text-periwinkle mt-4 text-center text-2xl tracking-widest">
              CLICK！
            </p>
          </a>
        </section>
      </main>
    </div>
  )
}
