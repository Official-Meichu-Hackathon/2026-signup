import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { SIGNUP_OPEN } from '../../lib/signupOpen'

type LightTransitionRange = {
  start: number
  end: number
} | null

type Rgba = [number, number, number, number]

const CARD_FADE_START = 0.58
const CARD_FADE_END = 0.82

function mixRgba(from: Rgba, to: Rgba, progress: number) {
  const mixed = from.map(
    (value, index) => value + (to[index] - value) * progress,
  ) as Rgba

  return `rgba(${Math.round(mixed[0])}, ${Math.round(mixed[1])}, ${Math.round(mixed[2])}, ${mixed[3].toFixed(3)})`
}

function cardStyle(progress: number): CSSProperties {
  const eased = progress * progress * (3 - 2 * progress)
  const top = mixRgba([211, 228, 252, 0.5], [163, 177, 200, 1], eased)
  const bottom = mixRgba([211, 228, 252, 0.1], [224, 229, 237, 1], eased)

  return {
    backgroundImage: `linear-gradient(106.086deg, ${top} 12.571%, ${bottom} 101.37%)`,
  }
}

function AwardCard({
  variant,
  title,
  note,
  children,
  cardRef,
  lightProgress,
}: {
  variant: 'hacker' | 'maker' | 'grand'
  title: string
  note?: string
  children: React.ReactNode
  cardRef: (element: HTMLDivElement | null) => void
  lightProgress: number
}) {
  const titleClass = {
    hacker:
      'md:absolute md:top-[51px] md:left-[8.64%] md:w-[85.87%] md:font-noto md:text-[30px] md:leading-[44px]',
    maker:
      'md:absolute md:top-[64px] md:left-[9.17%] md:w-[84.63%] md:font-noto md:text-[30px] md:leading-[44px]',
    grand:
      'md:absolute md:top-[33.5px] md:left-[7.13%] md:w-[85.74%] md:font-chiron md:text-[32px] md:leading-[40px] md:font-extrabold',
  }[variant]

  const noteClass = {
    hacker: 'md:absolute md:top-[95px] md:left-[8.64%] md:w-[85.87%]',
    maker: '',
    grand: 'md:absolute md:top-[73.5px] md:left-[7.13%] md:w-[85.74%]',
  }[variant]

  const copyClass = {
    hacker:
      'md:absolute md:top-[135px] md:left-[8.64%] md:mt-0 md:w-[85.87%] md:font-noto md:text-[20px] md:leading-[36px]',
    maker:
      'md:absolute md:top-[130px] md:left-[9.17%] md:mt-0 md:w-[84.63%] md:font-noto md:text-[20px] md:leading-[36px]',
    grand:
      'md:absolute md:top-[121.5px] md:left-[7.13%] md:mt-0 md:w-[57.06%] md:font-chiron md:text-[20px] md:leading-[40px] md:font-bold',
  }[variant]

  return (
    <div
      ref={cardRef}
      className="award-card relative w-full rounded-[30px] border border-[#d3e4fc] p-8 shadow-[0px_4px_25px_-5px_#1c1b1f] md:h-[315px] md:p-0"
      style={cardStyle(lightProgress)}
    >
      <p className={`text-2xl font-semibold text-white ${titleClass}`}>
        {title}
      </p>
      {note && (
        <p
          className={`award-card-note md:font-noto-tc mb-2 text-sm font-medium whitespace-nowrap text-[#f6ff7b] md:mb-0 md:text-[14px] md:leading-[40px] ${
            variant === 'grand' ? 'award-card-note-grand' : ''
          } ${noteClass}`}
        >
          {note}
        </p>
      )}
      <div
        className={`mt-3 text-base leading-[1.8] font-semibold text-white ${copyClass}`}
      >
        {children}
      </div>
    </div>
  )
}

export default function Awards({
  lightTransitionRange,
}: {
  lightTransitionRange: LightTransitionRange
}) {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const [lightProgress, setLightProgress] = useState([0, 0, 0])

  useEffect(() => {
    let frame = 0

    function measure() {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        if (!lightTransitionRange) {
          setLightProgress([0, 0, 0])
          return
        }

        const transitionHeight = Math.max(
          1,
          lightTransitionRange.end - lightTransitionRange.start,
        )
        const next = cardRefs.current.map((card) => {
          if (!card) return 0

          const rect = card.getBoundingClientRect()
          const cardCenter = rect.top + window.scrollY + rect.height / 2
          const layerProgress =
            (cardCenter - lightTransitionRange.start) / transitionHeight

          return Math.min(
            1,
            Math.max(
              0,
              (layerProgress - CARD_FADE_START) /
                (CARD_FADE_END - CARD_FADE_START),
            ),
          )
        })

        setLightProgress(next.length === 3 ? next : [0, 0, 0])
      })
    }

    measure()
    window.addEventListener('resize', measure)

    const observer = new ResizeObserver(measure)
    cardRefs.current.forEach((card) => {
      if (card) observer.observe(card)
    })

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', measure)
      observer.disconnect()
    }
  }, [lightTransitionRange])

  return (
    <div className="home-awards mx-auto flex w-full max-w-[730px] flex-col items-center gap-16 px-6 py-16 md:mt-[130px] md:max-w-[733.5px] md:gap-[90px] md:px-[2.25px] md:py-0">
      <div>
        <p className="home-awards-title text-center font-['Zen_Antique'] text-2xl text-[#f6f6f6] [text-shadow:0px_0px_20px_rgba(255,255,255,0.35),0px_4px_40px_rgba(255,255,255,0.2)] md:text-[35px] md:leading-[44px]">
          獎項資訊
        </p>
      </div>

      <div className="home-award-list flex w-full flex-col gap-10 md:gap-[70px]">
        <AwardCard
          variant="hacker"
          title="黑客組"
          note="每間企業獨立評選"
          lightProgress={lightProgress[0]}
          cardRef={(element) => {
            cardRefs.current[0] = element
          }}
        >
          <p>第一名：新台幣 25,000 元整、企業實體獎品、實習或實習面試機會</p>
          <p>第二名：新台幣 20,000 元整、企業實體獎品</p>
          <p>第三名：新台幣 15,000 元整、企業實體獎品</p>
          <p className="md:font-noto-tc mt-2 text-sm font-medium text-[#f6ff7b] md:mt-[5px] md:text-[14px] md:leading-[40px]">
            *實習機會主要依據企業本身而定
          </p>
        </AwardCard>

        <AwardCard
          variant="maker"
          title="創客交流組"
          lightProgress={lightProgress[1]}
          cardRef={(element) => {
            cardRefs.current[1] = element
          }}
        >
          <div className="grid grid-cols-1 gap-x-16 gap-y-1 sm:grid-cols-2 md:grid-cols-[minmax(0,250fr)_minmax(0,274fr)] md:gap-x-[12.32%]">
            <div>
              <p>第一名：新台幣 50,000 元整</p>
              <p>第二名：新台幣 40,000 元整</p>
              <p>第三名：新台幣 30,000 元整</p>
            </div>
            <div>
              <p>創意獎一：新台幣 12,000 元整</p>
              <p>創意獎二：新台幣 10,000 元整</p>
              <p>創意獎三：新台幣 8,000 元整</p>
            </div>
          </div>
        </AwardCard>

        <AwardCard
          variant="grand"
          title="梅竹大獎"
          note="為黑客組複賽，由各間企業之第一名獲獎組別共同角逐"
          lightProgress={lightProgress[2]}
          cardRef={(element) => {
            cardRefs.current[2] = element
          }}
        >
          <p>第一名：新台幣 30,000 元整</p>
          <p>第二名：新台幣 16,000 元整</p>
          <p>第三名：新台幣 8,000 元整</p>
          <p>最佳人氣獎：新台幣 3,000 元整</p>
        </AwardCard>
      </div>

      {SIGNUP_OPEN ? (
        <a
          href="/signup"
          className="home-awards-signup md:font-chiron flex h-[70px] w-full max-w-[358px] items-center justify-center rounded-[30px] border border-[rgba(211,228,252,0.8)] bg-[rgba(138,153,174,0.15)] text-2xl font-black text-[#b1a2ca] shadow-[0px_4px_20px_-1px_rgba(28,27,31,0.6)] transition-colors hover:bg-[rgba(138,153,174,0.3)] md:mt-[10px] md:h-[93px] md:text-[32px] md:leading-[40px] md:font-extrabold"
        >
          點我報名
        </a>
      ) : (
        <button
          type="button"
          disabled
          className="home-awards-signup md:font-chiron flex h-[70px] w-full max-w-[358px] cursor-not-allowed items-center justify-center rounded-[30px] border border-[rgba(211,228,252,0.8)] bg-[rgba(138,153,174,0.15)] text-2xl font-black text-[#b1a2ca] opacity-50 shadow-[0px_4px_20px_-1px_rgba(28,27,31,0.6)] md:mt-[10px] md:h-[93px] md:text-[32px] md:leading-[40px] md:font-extrabold"
        >
          報名結束
        </button>
      )}
    </div>
  )
}
