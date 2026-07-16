import { useState } from 'react'
import { PROBLEMS, type Problem } from '../../data/problems'
import cardBack from '../../assets/Problems/card-back.png'

// 卡背上的白色小卡（題目卡廠商背景電腦版 390:437）— 星星裝飾以 CSS 光點
// 呈現，避免拉進 7 張幾乎相同的向量圖。
function CardFace({ problem }: { problem?: Problem }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <div className="flex h-[52%] w-[76%] flex-col items-center justify-center gap-2 rounded-[14px] bg-white p-2 shadow-[0px_4px_50px_rgba(255,255,255,0.5),0px_4px_40px_rgba(255,255,255,0.5),0px_0px_20px_rgba(255,255,255,0.5)]">
        {problem?.logos.map((logo) => (
          <img
            key={logo}
            src={logo}
            alt={problem.sponsor}
            className="max-h-[45%] max-w-[85%] object-contain"
          />
        ))}
      </div>
    </div>
  )
}

interface DeckCardProps {
  problem: Problem
  onClick?: () => void
  className?: string
  style?: React.CSSProperties
}

function DeckCard({ problem, onClick, className = '', style }: DeckCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={style}
      className={`relative aspect-[242/434] overflow-hidden rounded-3xl bg-cover bg-center transition-transform duration-300 hover:-translate-y-2 ${className}`}
      aria-label={`${problem.sponsor} 題目`}
    >
      <img
        src={cardBack}
        alt=""
        className="absolute inset-0 h-full w-full rounded-3xl object-cover"
      />
      <CardFace problem={problem} />
    </button>
  )
}

// 題目內文彈窗（zoomin1–7 變體）：白卡置中、企業 logo、題目段落、閱讀完畢。
function ProblemModal({
  problem,
  onClose,
}: {
  problem: Problem
  onClose: () => void
}) {
  return (
    <div
      className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[85svh] w-full max-w-2xl flex-col items-center gap-6 overflow-y-auto rounded-3xl bg-white px-10 py-12 shadow-[0px_4px_50px_rgba(255,255,255,0.5),0px_0px_20px_rgba(255,255,255,0.35)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex flex-wrap items-center justify-center gap-6">
          {problem.logos.map((logo) => (
            <img
              key={logo}
              src={logo}
              alt={problem.sponsor}
              className="max-h-20 max-w-56 object-contain"
            />
          ))}
        </div>
        <h3 className="font-noto text-darkblue text-3xl font-semibold">
          {problem.sponsor}
        </h3>
        {problem.paragraphs.length > 0 ? (
          <div className="font-noto text-darkblue flex flex-col gap-4 text-center text-xl leading-relaxed font-semibold">
            {problem.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>
        ) : (
          <p className="font-noto text-darkblue/70 text-center text-xl font-semibold">
            題目內容即將公開，敬請期待！
          </p>
        )}
        <button
          type="button"
          onClick={onClose}
          className="font-noto bg-darkblue mt-2 rounded-full px-8 py-2.5 text-lg font-semibold text-white transition hover:opacity-80"
        >
          閱讀完畢
        </button>
      </div>
    </div>
  )
}

export default function ProblemDeck() {
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState<Problem | null>(null)

  if (!isOpen) {
    // 收合牌堆（Property 1=close）：7 張卡右緣微錯位堆疊，整疊可點擊。
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="group relative block h-[434px] w-[406px] cursor-pointer transition-transform duration-300 hover:scale-105"
        aria-label="點擊展開黑客組題目牌組"
      >
        <div className="absolute inset-0 rounded-full bg-white/60 blur-3xl" />
        {PROBLEMS.map((problem, index) => (
          <div
            key={problem.sponsor}
            className="absolute top-0 aspect-[242/434] w-[242px] overflow-hidden rounded-3xl"
            style={{ left: index * 27 }}
          >
            <img
              src={cardBack}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            {index === 0 && <CardFace />}
          </div>
        ))}
        <span className="font-noto text-periwinkle absolute top-[calc(50%-12px)] left-[121px] w-[185px] -translate-y-1/2 text-center text-xl leading-[26px] font-semibold">
          請點擊展開牌組
        </span>
      </button>
    )
  }

  return (
    <>
      <div className="animate-fade-in flex max-w-[1262px] flex-wrap items-center justify-center gap-6 px-6">
        {PROBLEMS.map((problem) => (
          <DeckCard
            key={problem.sponsor}
            problem={problem}
            onClick={() => setSelected(problem)}
            className="w-[150px] xl:w-[160px]"
          />
        ))}
      </div>
      <button
        type="button"
        onClick={() => setIsOpen(false)}
        className="font-noto text-periwinkle mt-6 rounded-full border border-white/20 bg-white/10 px-6 py-2 text-lg font-semibold backdrop-blur transition hover:bg-white/20"
      >
        收合牌組
      </button>
      {selected && (
        <ProblemModal problem={selected} onClose={() => setSelected(null)} />
      )}
    </>
  )
}
