import { useEffect, useRef, useState } from 'react'
import { PROBLEMS } from '../../data/problems'
import cardBack from '../../assets/Problems/card-back.png'
import cardDecor from '../../assets/Problems/card-decor.svg'
import { ProblemCardFace, ZoomedFace } from './ProblemDeck'

const ZOOM_RATIO = 794.9 / 503.4
const REVEAL_DELAY_MS = 120

const CARD_POSITIONS = [
  { left: '18.46%', top: '0%' },
  { left: '42.82%', top: '0%' },
  { left: '67.18%', top: '0%' },
  { left: '7.69%', top: '59%' },
  { left: '31.79%', top: '59%' },
  { left: '55.9%', top: '59%' },
  { left: '80%', top: '59%' },
]

function MobileZoomOverlay({
  index,
  onClose,
}: {
  index: number
  onClose: () => void
}) {
  const [viewport, setViewport] = useState(() => ({
    width: window.innerWidth,
    height: window.innerHeight,
  }))

  useEffect(() => {
    const onResize = () =>
      setViewport({ width: window.innerWidth, height: window.innerHeight })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const width = Math.min(503.4, Math.max(0, viewport.width - 32))
  const aspectHeight = width * ZOOM_RATIO
  const height = Math.min(aspectHeight, Math.max(0, viewport.height - 32))
  const contentScale =
    aspectHeight === 0 ? 1 : Math.min(1, height / aspectHeight)

  return (
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
          contentScale={contentScale}
        />
      </div>
    </div>
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
              className="@container absolute w-[14.42%] cursor-pointer rounded-[6px] shadow-[0_0_16px_rgba(255,255,255,0.6)] transition-transform duration-200 [perspective:700px] hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-default disabled:hover:translate-y-0"
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
        <p className="font-noto text-ink pointer-events-none absolute top-[40%] left-1/2 -translate-x-1/2 text-center text-[12px] font-semibold">
          Hack group
        </p>
      </section>
      {selected !== null && (
        <MobileZoomOverlay index={selected} onClose={() => setSelected(null)} />
      )}
    </>
  )
}
