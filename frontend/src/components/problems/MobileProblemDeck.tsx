import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useLayoutViewport } from '../../lib/useLayoutViewport'
import { PROBLEMS } from '../../data/problems'
import cardBack from '../../assets/Problems/card-back.png'
import cardDecor from '../../assets/Problems/card-decor.svg'
import logo14th from '../../assets/Problems/logo-14th.svg'
import {
  ProblemCardFace,
  ZOOM_CARD_HEIGHT_PER_WIDTH,
  ZoomedFace,
} from './ProblemDeck'

const REVEAL_DELAY_MS = 120

// 手機版黑客組題目牌組（1608:87833 實際 instance，390 寬畫布座標系）。
// 設計稿裡 7 張卡不是整齊的兩排，而是每張各自微調過的扇形散開（中間那張
// 上排卡明顯高一點、下排四張也左右交錯），故逐張量測、不能假設對稱。
const CARD_POSITIONS = [
  { left: '18.72%', top: '-4.27%' },
  { left: '42.65%', top: '-10.03%' },
  { left: '66.58%', top: '-4.27%' },
  { left: '8.72%', top: '71.33%' },
  { left: '32.05%', top: '62.13%' },
  { left: '54.45%', top: '62.13%' },
  { left: '78.38%', top: '71.33%' },
]

function MobileZoomOverlay({
  index,
  onClose,
}: {
  index: number
  onClose: () => void
}) {
  // 讀版面視窗而非 window.innerWidth／innerHeight：後者在 iOS 上會跟著雙指縮放
  // 變動，放大檢視的卡片會在縮放途中一直改尺寸。見 useLayoutViewport。
  const viewport = useLayoutViewport()

  const width = Math.max(
    0,
    Math.min(
      viewport.width - 32,
      (viewport.height - 32) / ZOOM_CARD_HEIGHT_PER_WIDTH,
    ),
  )
  const height = width * ZOOM_CARD_HEIGHT_PER_WIDTH

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div
        className="@container relative overflow-hidden"
        style={{ width, height, borderRadius: (11.9 / 503.4) * width }}
      >
        <img
          src={cardBack}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <ZoomedFace
          problem={PROBLEMS[index]}
          onClose={onClose}
          contentScale={1}
        />
      </div>
    </div>,
    document.body,
  )
}

export default function MobileProblemDeck() {
  const [selected, setSelected] = useState<number | null>(null)
  const [phase, setPhase] = useState<'faceDown' | 'revealing' | 'revealed'>(
    'faceDown',
  )
  const [revealedCount, setRevealedCount] = useState(0)
  const revealTimers = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(
    () => () => {
      revealTimers.current.forEach((timer) => window.clearTimeout(timer))
    },
    [],
  )

  const revealDeck = () => {
    if (phase !== 'faceDown') return

    setPhase('revealing')
    PROBLEMS.forEach((_, index) => {
      revealTimers.current.push(
        window.setTimeout(() => {
          setRevealedCount(index + 1)
        }, index * REVEAL_DELAY_MS),
      )
    })
    revealTimers.current.push(
      window.setTimeout(
        () => setPhase('revealed'),
        (PROBLEMS.length - 1) * REVEAL_DELAY_MS + 500,
      ),
    )
  }

  return (
    <>
      <section
        className="relative h-full w-full"
        aria-label="Hack group problems"
      >
        {CARD_POSITIONS.map((position, index) => (
          <div
            key={`glow-${index}`}
            aria-hidden
            className="pointer-events-none absolute w-[14.42%] rounded-full bg-white/50 blur-2xl"
            style={{
              left: position.left,
              top: position.top,
              aspectRatio: '56.228 / 100.718',
            }}
          />
        ))}
        {PROBLEMS.map((problem, index) => {
          const position = CARD_POSITIONS[index]
          const isRevealed = index < revealedCount
          return (
            <button
              key={problem.sponsor}
              type="button"
              onClick={() => {
                if (phase === 'faceDown') revealDeck()
                if (phase === 'revealed') setSelected(index)
              }}
              disabled={phase === 'revealing'}
              className="@container absolute w-[14.42%] cursor-pointer rounded-[6px] shadow-[0_0_36px_8px_rgba(255,255,255,0.72)] transition-transform duration-200 [perspective:700px] hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-default disabled:hover:translate-y-0"
              style={{
                left: position.left,
                top: position.top,
                aspectRatio: '56.228 / 100.718',
              }}
              aria-label={
                phase === 'faceDown'
                  ? 'Reveal all problem cards'
                  : `Open ${problem.sponsor} problem`
              }
            >
              <div
                className="relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d]"
                style={{ transform: `rotateY(${isRevealed ? 180 : 0}deg)` }}
              >
                <div className="absolute inset-0 overflow-hidden rounded-[inherit] [backface-visibility:hidden]">
                  <img
                    src={cardBack}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <img
                    src={cardDecor}
                    alt=""
                    className="pointer-events-none absolute -top-[18%] -left-[25%] h-[145%] w-[155%] max-w-none opacity-90"
                  />
                  {/* 「梅竹黑客松 14th」書法字（與 MakerCta 同一份素材），牌面覆蓋
                      （未翻開）時就要顯示，設計稿裡疊在星星裝飾之上 */}
                  <img
                    src={logo14th}
                    alt="梅竹黑客松 14th"
                    className="pointer-events-none absolute top-1/2 left-1/2 w-[75%] -translate-x-1/2 -translate-y-1/2"
                  />
                </div>
                <div className="absolute inset-0 [transform:rotateY(180deg)] overflow-hidden rounded-[inherit] [backface-visibility:hidden]">
                  <img
                    src={cardBack}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <ProblemCardFace problem={problem} index={index} />
                </div>
              </div>
            </button>
          )
        })}
        <p
          className="font-zen pointer-events-none absolute top-[40%] left-1/2 flex h-[54px] w-[170px] -translate-x-1/2 items-center justify-center text-center text-[14px] leading-[15.6px] font-normal text-[#f6f6f6]"
          style={{
            textShadow:
              '0 0 20px rgba(255, 255, 255, 0.35), 0 4px 40px rgba(255, 255, 255, 0.2)',
          }}
        >
          黑客組
        </p>
      </section>
      {selected !== null && (
        <MobileZoomOverlay index={selected} onClose={() => setSelected(null)} />
      )}
    </>
  )
}
