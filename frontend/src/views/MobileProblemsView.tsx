import { useEffect, useState } from 'react'
import MobileFooter from '../components/layout/MobileFooter'
import Navbar from '../components/layout/Navbar'
import MakerCta from '../components/problems/MakerCta'
import MobileProblemDeck from '../components/problems/MobileProblemDeck'
import bgGradient from '../assets/Problems/bg-gradient.png'
import star1 from '../assets/Problems/star-1.svg'
import star2 from '../assets/Problems/star-2.svg'
import star3 from '../assets/Problems/star-3.svg'
import star4 from '../assets/Problems/star-4.svg'
import mobileStar1 from '../assets/Problems/mobile-star-1.svg'
import mobileStar3 from '../assets/Problems/mobile-star-3.svg'

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
    src: mobileStar1,
    left: 0,
    top: 82.42,
    width: 56.16,
    height: 17.58,
    rotate: 77.31,
    imgLeft: -48.19,
    imgTop: -20.84,
    imgW: 196.38,
    imgH: 145.3,
  },
  {
    src: mobileStar3,
    left: 33.73,
    top: 89.11,
    width: 21.49,
    height: 7.51,
    rotate: 77.31,
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
            style={{ transform: `rotate(${star.rotate}deg)` }}
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

function MobileStars() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <img
        src={star1}
        alt=""
        className="animate-star-twinkle absolute -top-[1%] -right-[16%] w-[44%]"
      />
      <img
        src={star3}
        alt=""
        className="animate-star-twinkle absolute top-[13%] left-[7%] w-[18%]"
        style={{ animationDelay: '1.2s' }}
      />
      <img
        src={star4}
        alt=""
        className="animate-star-twinkle absolute top-[29%] right-[1%] w-[24%]"
        style={{ animationDelay: '2.1s' }}
      />
      <img
        src={star2}
        alt=""
        className="animate-star-twinkle absolute top-[77%] right-[-14%] w-[52%]"
        style={{ animationDelay: '0.6s' }}
      />
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
            className="pointer-events-none absolute top-0 left-0 h-[52%] w-full object-cover"
          />
          <img
            src={bgGradient}
            alt=""
            className="pointer-events-none absolute bottom-[3%] left-0 h-[34%] w-full rotate-180 object-cover"
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
