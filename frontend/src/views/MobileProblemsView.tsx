import { useEffect, useState } from 'react'
import MobileFooter from '../components/layout/MobileFooter'
import Navbar from '../components/layout/Navbar'
import MakerCta from '../components/problems/MakerCta'
import MobileProblemDeck from '../components/problems/MobileProblemDeck'
import bgGradient from '../assets/Problems/bg-gradient.png'
import titleStar1 from '../assets/Problems/mobile-title-star-1.svg'
import titleStar2 from '../assets/Problems/mobile-title-star-2.svg'
import titleStar3 from '../assets/Problems/mobile-title-star-3.svg'
import figmaStar1 from '../assets/Problems/mobile-figma-star-1.svg'
import figmaStar2 from '../assets/Problems/mobile-figma-star-2.svg'
import figmaStar3 from '../assets/Problems/mobile-figma-star-3.svg'
import figmaStar4 from '../assets/Problems/mobile-figma-star-4.svg'
import figmaStar5 from '../assets/Problems/mobile-figma-star-5.svg'
import figmaStar6 from '../assets/Problems/mobile-figma-star-6.svg'
import figmaStar7 from '../assets/Problems/mobile-figma-star-7.svg'

const DESIGN_WIDTH = 390
const DESIGN_HEIGHT = 1816

// 題目說明手機版_星星閃爍（664:1558）：標題區塊周圍的 3 顆大星，素材本身
// 外擴以容納光暈，故沿用 ProblemStars.tsx 同一套「inset 換算 left/top/
// width/height，img 再用負 inset 撐出光暈」的量測結果。容器本身比 390 寬的
// 畫布更大（424px）且往左超出 12px，故用設計稿原始 px 定位，不轉換成 %。
interface TitleStar {
  src: string
  left: number
  top: number
  width: number
  height: number
  rotate: number
  imgLeft: number
  imgTop: number
  imgW: number
  imgH: number
}

const TITLE_STARS: TitleStar[] = [
  {
    src: titleStar1,
    left: 0,
    top: 82.42,
    width: 56.16,
    height: 17.58,
    rotate: 167.31,
    imgLeft: -48.19,
    imgTop: -20.84,
    imgW: 196.38,
    imgH: 145.3,
  },
  {
    src: titleStar2,
    left: 63.97,
    top: 0,
    width: 36.03,
    height: 11.99,
    rotate: 167.31,
    imgLeft: -68.39,
    imgTop: -32.83,
    imgW: 236.78,
    imgH: 171.37,
  },
  {
    src: titleStar3,
    left: 33.73,
    top: 89.11,
    width: 21.49,
    height: 7.51,
    rotate: 167.31,
    imgLeft: -106.65,
    imgTop: -55.51,
    imgW: 313.3,
    imgH: 220.68,
  },
]

function TitleStars() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute overflow-hidden"
      style={{ left: -12, top: 45, width: 424, height: 851.724 }}
    >
      {TITLE_STARS.map((star) => (
        <div
          key={star.src}
          className="absolute flex items-center justify-center"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: `${star.width}%`,
            height: `${star.height}%`,
          }}
        >
          <div
            className="relative size-full"
            style={{
              transform: `rotate(${star.rotate}deg)`,
              filter:
                'drop-shadow(0 0 20px rgba(255,255,255,0.5)) drop-shadow(0 4px 40px rgba(255,255,255,0.5)) drop-shadow(0 4px 50px rgba(255,255,255,0.5))',
            }}
          >
            <img
              src={star.src}
              alt=""
              className="animate-star-twinkle absolute max-w-none"
              style={{
                left: `${star.imgLeft}%`,
                top: `${star.imgTop}%`,
                width: `${star.imgW}%`,
                height: `${star.imgH}%`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

const MOBILE_BACKGROUND_STARS = [
  {
    src: figmaStar1,
    left: 3.86,
    top: 0,
    width: 13.7,
    height: 4.44,
    imgLeft: -25.64,
    imgTop: -25.27,
    imgWidth: 151.28,
    imgHeight: 154.94,
    delay: 0,
  },
  {
    src: figmaStar2,
    left: 83.74,
    top: 6.96,
    width: 13.26,
    height: 4.52,
    imgLeft: -38.76,
    imgTop: -32.62,
    imgWidth: 177.52,
    imgHeight: 170.92,
    rotate: 56.62,
    delay: 1.2,
  },
  {
    src: figmaStar3,
    left: 74.54,
    top: 80.07,
    width: 25.43,
    height: 5.08,
    imgLeft: -28.6,
    imgTop: -18.67,
    imgWidth: 157.2,
    imgHeight: 140.58,
    rotate: 140.87,
    skew: 27.55,
    delay: 2.1,
  },
  {
    src: figmaStar4,
    left: 6.18,
    top: 59.88,
    width: 12.51,
    height: 5.94,
    imgLeft: -25.03,
    imgTop: -30.35,
    imgWidth: 150.06,
    imgHeight: 165.98,
    rotate: -152.68,
    skew: 27.55,
    delay: 0.6,
  },
  {
    src: figmaStar5,
    left: 18.61,
    top: 4.27,
    width: 7.04,
    height: 2.1,
    imgLeft: -56.82,
    imgTop: -65.71,
    imgWidth: 213.64,
    imgHeight: 242.85,
    rotate: -11.44,
    delay: 1.8,
  },
  {
    src: figmaStar6,
    left: 0,
    top: 95.6,
    width: 21.4,
    height: 4.4,
    imgLeft: -35.99,
    imgTop: -20.53,
    imgWidth: 171.98,
    imgHeight: 144.63,
    rotate: 14.24,
    skew: -35.07,
    delay: 2.7,
  },
  {
    src: figmaStar7,
    left: 94.07,
    top: 83.13,
    width: 5.93,
    height: 3.76,
    imgLeft: -51.58,
    imgTop: -52.29,
    imgWidth: 203.16,
    imgHeight: 213.9,
    rotate: -78.77,
    skew: -30.65,
    delay: 3.3,
  },
]

function MobileStars() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute top-[280px] left-0 h-[1146.491px] w-full overflow-hidden"
    >
      {MOBILE_BACKGROUND_STARS.map((star) => (
        <div
          key={star.src}
          className="absolute"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: `${star.width}%`,
            height: `${star.height}%`,
            transform: `rotate(${star.rotate ?? 0}deg) skewX(${star.skew ?? 0}deg)`,
          }}
        >
          <img
            src={star.src}
            alt=""
            className="animate-star-twinkle absolute max-w-none"
            style={{
              left: `${star.imgLeft}%`,
              top: `${star.imgTop}%`,
              width: `${star.imgWidth}%`,
              height: `${star.imgHeight}%`,
              animationDelay: `${star.delay}s`,
            }}
          />
        </div>
      ))}
    </div>
  )
}

export default function MobileProblemsView({
  forcePreview = false,
}: {
  forcePreview?: boolean
}) {
  const [viewportWidth, setViewportWidth] = useState(() => window.innerWidth)

  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const canvasWidth = forcePreview
    ? Math.min(viewportWidth, DESIGN_WIDTH)
    : viewportWidth
  const scale = canvasWidth / DESIGN_WIDTH

  return (
    <main className="min-h-svh bg-black">
      <Navbar />
      <div
        className="relative mx-auto overflow-hidden"
        style={{ width: canvasWidth, height: DESIGN_HEIGHT * scale }}
      >
        <div
          className="relative h-[1816px] w-[390px] origin-top-left overflow-hidden bg-black"
          style={{ transform: `scale(${scale})` }}
        >
          <img
            src={bgGradient}
            alt=""
            className="page-glow pointer-events-none absolute top-0 left-0 h-[52%] w-full object-cover"
          />
          <img
            src={bgGradient}
            alt=""
            className="page-glow pointer-events-none absolute bottom-[3%] left-0 h-[34%] w-full rotate-180 object-cover"
          />
          <MobileStars />
          <TitleStars />

          <h1 className="glow-text font-zen text-ink absolute top-[7.76%] left-1/2 -translate-x-1/2 text-[32px] leading-[54px] whitespace-nowrap">
            題目說明
          </h1>

          <div className="absolute top-[23%] left-0 h-[250px] w-full">
            <MobileProblemDeck />
          </div>

          <section className="absolute top-[58.43%] left-[3.33%] w-[92.43%]">
            <MakerCta />
          </section>

          <div className="absolute right-0 bottom-0 left-0 h-[60px]">
            <MobileFooter />
          </div>
        </div>
      </div>
    </main>
  )
}
