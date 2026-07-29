import star1 from '../../assets/Stats/mobile-stars/star-1.svg'
import star2 from '../../assets/Stats/mobile-stars/star-2.svg'
import star3 from '../../assets/Stats/mobile-stars/star-3.svg'
import star4 from '../../assets/Stats/mobile-stars/star-4.svg'
import star5 from '../../assets/Stats/mobile-stars/star-5.svg'
import star6 from '../../assets/Stats/mobile-stars/star-6.svg'
import star7 from '../../assets/Stats/mobile-stars/star-7.svg'

const DESIGN_WIDTH = 398.385
const DESIGN_HEIGHT = 1146.491

// 星層在設計稿頁框（165:1204，390×1816）裡是擺在 (-4, 53) 的，先前寫死 top-0
// left-0 等於整層往左上偏了。位置一律換算成頁框寬度的百分比：高度由 aspect-ratio
// 從寬度推導，故整層只跟寬度連動，不會被頁面高度拉伸。
const PAGE_W = 390
const PAGE_H = 1816
const LAYER_X = -4
const LAYER_Y = 53

interface Star {
  src: string
  left: number
  top: number
  width: number
  height: number
  innerW: number
  innerH: number
  rotate: number
  skew: number
  imgLeft: number
  imgTop: number
  imgW: number
  imgH: number
  delay: number
}

const STARS: Star[] = [
  {
    src: star1,
    left: 3.86,
    top: 0,
    width: 13.7,
    height: 4.44,
    innerW: 100,
    innerH: 100,
    rotate: 0,
    skew: 0,
    imgLeft: -25.64,
    imgTop: -25.27,
    imgW: 151.28,
    imgH: 154.94,
    delay: 0,
  },
  {
    src: star2,
    left: 83.74,
    top: 6.96,
    width: 13.26,
    height: 4.52,
    innerW: 68.36,
    innerH: 76.1,
    rotate: 56.62,
    skew: 0,
    imgLeft: -38.76,
    imgTop: -32.62,
    imgW: 177.52,
    imgH: 170.92,
    delay: 1.7,
  },
  {
    src: star3,
    left: 74.54,
    top: 80.07,
    width: 25.43,
    height: 5.08,
    innerW: 48.31,
    innerH: 118.54,
    rotate: 140.87,
    skew: 27.55,
    imgLeft: -28.6,
    imgTop: -18.67,
    imgW: 157.2,
    imgH: 140.58,
    delay: 0.8,
  },
  {
    src: star4,
    left: 6.18,
    top: 59.88,
    width: 12.51,
    height: 5.94,
    innerW: 112.19,
    innerH: 62.3,
    rotate: -152.68,
    skew: 27.55,
    imgLeft: -25.03,
    imgTop: -30.35,
    imgW: 150.06,
    imgH: 165.98,
    delay: 2.9,
  },
  {
    src: star5,
    left: 18.61,
    top: 4.27,
    width: 7.04,
    height: 2.1,
    innerW: 87.88,
    innerH: 81.33,
    rotate: -11.44,
    skew: 0,
    imgLeft: -56.82,
    imgTop: -65.71,
    imgW: 213.64,
    imgH: 242.85,
    delay: 1.2,
  },
  {
    src: star6,
    left: 0,
    top: 95.6,
    width: 21.4,
    height: 4.4,
    innerW: 45.61,
    innerH: 124.3,
    rotate: 14.24,
    skew: -35.07,
    imgLeft: -35.99,
    imgTop: -20.53,
    imgW: 171.98,
    imgH: 144.63,
    delay: 3.4,
  },
  {
    src: star7,
    left: 94.07,
    top: 83.13,
    width: 5.93,
    height: 3.76,
    innerW: 114.9,
    innerH: 57.19,
    rotate: -78.77,
    skew: -30.65,
    imgLeft: -51.58,
    imgTop: -52.29,
    imgW: 203.16,
    imgH: 213.68,
    delay: 2.1,
  },
]

export default function MobileStatsStars() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute z-0"
      style={{
        left: `${((LAYER_X / PAGE_W) * 100).toFixed(4)}%`,
        top: `${((LAYER_Y / PAGE_H) * 100).toFixed(4)}%`,
        width: `${((DESIGN_WIDTH / PAGE_W) * 100).toFixed(4)}%`,
        aspectRatio: `${DESIGN_WIDTH} / ${DESIGN_HEIGHT}`,
      }}
    >
      {STARS.map((star) => (
        <div
          key={star.src}
          className="absolute"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: `${star.width}%`,
            height: `${star.height}%`,
          }}
        >
          <div
            className="absolute"
            style={{
              left: `${(100 - star.innerW) / 2}%`,
              top: `${(100 - star.innerH) / 2}%`,
              width: `${star.innerW}%`,
              height: `${star.innerH}%`,
              transform: `rotate(${star.rotate}deg) skewX(${star.skew}deg)`,
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
                animationDelay: `${star.delay}s`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
