import star1 from '../../assets/Stats/star-1.svg'
import star2 from '../../assets/Stats/star-2.svg'
import star3 from '../../assets/Stats/star-3.svg'
import star4 from '../../assets/Stats/star-4.svg'
import star5 from '../../assets/Stats/star-5.svg'
import star6 from '../../assets/Stats/star-6.svg'
import star7 from '../../assets/Stats/star-7.svg'

// 參賽數據電腦_星星閃爍（570:1341）：頁面底層的 7 顆星。設計稿裡這層是
// 1423.368×4096.23、擺在 1440×4096 頁框的 (6, 88)，故換算成頁面百分比是
// left 0.4167% / width 98.845% / top 2.1484% / height 100%（底部超出的
// 2% 由頁面的 overflow-hidden 裁掉）。
const LAYER_LEFT = (6 / 1440) * 100
const LAYER_WIDTH = (1423.368 / 1440) * 100
const LAYER_TOP = (88 / 4096) * 100

// 每顆星的三層結構與 ProblemStars 相同，原因也一樣：
//   1. 外層 = 設計稿量到的外框（旋轉後的 bounding box），用百分比定位；
//   2. 中層 = 未旋轉的原始框（innerW/innerH），旋轉與傾斜掛在這層；
//   3. img  = 素材本身。素材的 viewBox 為了容納「星座光暈」(白色 drop shadow
//      20/40/50) 而往外擴，所以要用負的 left/top 加上 >100% 的寬高把圖推回去，
//      否則星星會縮成中間一小點。
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
    // 570:1312 — 左上角，唯一沒有旋轉的一顆
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
    // 570:1313 — 右上角
    src: star2,
    left: 83.75,
    top: 6.96,
    width: 13.25,
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
    // 570:1314 — 右下，設計稿中最大的一顆
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
    // 570:1315 — 左側中段
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
    // 570:1316 — 標題左上方的小星
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
    // 570:1317 — 左下角，貼齊星層底部
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
    // 570:1318 — 右下角，設計稿裡有一半在頁面外
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

export default function StatsStars() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute h-full"
      style={{
        left: `${LAYER_LEFT}%`,
        top: `${LAYER_TOP}%`,
        width: `${LAYER_WIDTH}%`,
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
