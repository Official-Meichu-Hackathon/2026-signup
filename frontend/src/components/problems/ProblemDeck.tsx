import { useState } from 'react'
import { PROBLEMS, type Problem } from '../../data/problems'
import cardBack from '../../assets/Problems/card-back.png'

// 卡面中央的白色小卡（題目卡廠商背景電腦版 390:437）。
// 收合狀態依設計稿不放 logo，展開後才顯示企業 logo。
function CardFace({ problem }: { problem?: Problem }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="flex h-[47%] w-[76%] flex-col items-center justify-center gap-[6%] rounded-[14px] bg-white p-[4%] shadow-[0px_4px_50px_rgba(255,255,255,0.5),0px_4px_40px_rgba(255,255,255,0.5),0px_0px_20px_rgba(255,255,255,0.5)]">
        {problem?.logos.map((logo) => (
          <img
            key={logo}
            src={logo}
            alt={problem.sponsor}
            className="max-h-[48%] max-w-[85%] object-contain"
          />
        ))}
      </div>
    </div>
  )
}

// 題目內文（zoomin1–7 變體）：白卡置中、企業 logo、題目段落、閱讀完畢。
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

// 收合牌堆的尺寸（Property 1=close）：卡片 242×434、每張右移 27px。
const CARD_CLOSED = 242
const CARD_OPEN = 152
const STACK_OFFSET = 27

export default function ProblemDeck() {
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState<Problem | null>(null)

  return (
    <>
      <div className="relative h-[434px] w-full max-w-[1262px]">
        {/* 收合時牌堆後方的光暈 */}
        <div
          className="absolute top-0 h-[434px] rounded-full bg-white/50 blur-3xl transition-opacity duration-700"
          style={{
            width: CARD_CLOSED + STACK_OFFSET * (PROBLEMS.length - 1),
            opacity: isOpen ? 0 : 1,
          }}
        />
        {PROBLEMS.map((problem, index) => (
          <button
            key={problem.sponsor}
            type="button"
            onClick={() => (isOpen ? setSelected(problem) : setIsOpen(true))}
            className="ease-out-strong absolute top-0 aspect-[242/434] overflow-hidden rounded-3xl transition-all duration-700 hover:-translate-y-2"
            style={{
              width: isOpen ? CARD_OPEN : CARD_CLOSED,
              left: isOpen
                ? `calc(${index} * (100% - ${CARD_OPEN}px) / ${PROBLEMS.length - 1})`
                : index * STACK_OFFSET,
              zIndex: isOpen ? index + 1 : PROBLEMS.length - index,
              transitionDelay: `${index * 50}ms`,
            }}
            aria-label={
              isOpen ? `${problem.sponsor} 題目` : '點擊展開黑客組題目牌組'
            }
          >
            <img
              src={cardBack}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            <CardFace problem={isOpen ? problem : undefined} />
          </button>
        ))}
        <span
          className="font-noto text-periwinkle pointer-events-none absolute top-[calc(50%-12px)] left-0 -translate-y-1/2 text-center text-xl leading-[26px] font-semibold transition-opacity duration-300"
          style={{
            width: CARD_CLOSED,
            zIndex: PROBLEMS.length + 1,
            opacity: isOpen ? 0 : 1,
          }}
        >
          請點擊展開牌組
        </span>
      </div>
      {selected && (
        <ProblemModal problem={selected} onClose={() => setSelected(null)} />
      )}
    </>
  )
}
