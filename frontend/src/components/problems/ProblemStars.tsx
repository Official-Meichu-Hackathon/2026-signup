import star1 from '../../assets/Problems/star-1.svg'
import star2 from '../../assets/Problems/star-2.svg'
import star3 from '../../assets/Problems/star-3.svg'
import star4 from '../../assets/Problems/star-4.svg'
import star5 from '../../assets/Problems/star-5.svg'

// 星星閃爍（570:1281，1376.367×2020.722）。設計稿把每顆星拆成一個定位框、
// 一個旋轉／傾斜的內層，內層再放往外擴的 SVG 以容納光暈。下列數值即該幾何
// 換算後的百分比，皆相對於各自的父層，因此整層可隨頁面等比縮放。
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
    left: 0,
    top: 0,
    width: 14.17,
    height: 9.01,
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
    left: 73.67,
    top: 86.19,
    width: 26.3,
    height: 10.29,
    innerW: 48.31,
    innerH: 118.54,
    rotate: 140.87,
    skew: 27.55,
    imgLeft: -28.6,
    imgTop: -18.67,
    imgW: 157.2,
    imgH: 140.58,
    delay: 1.2,
  },
  {
    src: star3,
    left: 15.25,
    top: 8.66,
    width: 7.28,
    height: 4.26,
    innerW: 87.88,
    innerH: 81.34,
    rotate: -11.44,
    skew: 0,
    imgLeft: -56.82,
    imgTop: -65.71,
    imgW: 213.64,
    imgH: 242.85,
    delay: 2.4,
  },
  {
    src: star4,
    left: 74.69,
    top: 92,
    width: 14.74,
    height: 5.7,
    innerW: 68.45,
    innerH: 87.41,
    rotate: 40.77,
    skew: -35.07,
    imgLeft: -35.99,
    imgTop: -45.69,
    imgW: 171.98,
    imgH: 199.33,
    delay: 0.6,
  },
  {
    src: star5,
    left: 93.87,
    top: 92.39,
    width: 6.13,
    height: 7.61,
    innerW: 114.87,
    innerH: 57.2,
    rotate: -78.77,
    skew: -30.65,
    imgLeft: -51.58,
    imgTop: -52.29,
    imgW: 203.16,
    imgH: 213.68,
    delay: 1.8,
  },
]

export default function ProblemStars() {
  return (
    // 星星閃爍 instance 於頁面的位置（570:1298：x32 y104 / 1440×2550）
    <div
      aria-hidden
      className="pointer-events-none absolute top-[4.08%] left-[2.22%] h-[79.24%] w-[95.58%]"
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
            {/* 閃爍套在 img 上，避免 keyframe 的 scale 覆寫外層的 rotate/skew */}
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
