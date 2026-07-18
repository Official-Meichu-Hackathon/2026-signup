import star1 from '../../assets/Problems/star-1.svg'
import star2 from '../../assets/Problems/star-2.svg'
import star3 from '../../assets/Problems/star-3.svg'
import star4 from '../../assets/Problems/star-4.svg'
import star5 from '../../assets/Problems/star-5.svg'
import figmaStar1 from '../../assets/Problems/figma-star-1.svg'
import figmaStar2 from '../../assets/Problems/figma-star-2.svg'
import figmaStar3 from '../../assets/Problems/figma-star-3.svg'
import figmaStar4 from '../../assets/Problems/figma-star-4.svg'
import figmaStar5 from '../../assets/Problems/figma-star-5.svg'
import figmaStar6 from '../../assets/Problems/figma-star-6.svg'
import figmaStar7 from '../../assets/Problems/figma-star-7.svg'
import figmaStar8 from '../../assets/Problems/figma-star-8.svg'

interface Star {
  src: string
  left: number
  top: number
  width: number
  height: number
  rotate: number
  skew: number
  delay: number
}

interface OverflowStar extends Star {
  innerW: number
  innerH: number
  imgLeft: number
  imgTop: number
  imgW: number
  imgH: number
}

const LEGACY_STARS: OverflowStar[] = [
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

const FIGMA_STARS: OverflowStar[] = [
  {
    src: figmaStar1,
    left: 67.88,
    top: 6.92,
    width: 6.25,
    height: 6.84,
    rotate: 62.36,
    skew: 0,
    innerW: 100,
    innerH: 100,
    imgLeft: -76.26,
    imgTop: -75.17,
    imgW: 252.52,
    imgH: 263.41,
    delay: 0,
  },
  {
    src: figmaStar2,
    left: 74.28,
    top: 9.78,
    width: 21.35,
    height: 13.15,
    rotate: 78.58,
    skew: 0,
    innerW: 100,
    innerH: 100,
    imgLeft: -43.6,
    imgTop: -16.93,
    imgW: 187.2,
    imgH: 136.81,
    delay: 1.2,
  },
  {
    src: figmaStar3,
    left: 0,
    top: 20.45,
    width: 4.93,
    height: 7.25,
    rotate: -148.94,
    skew: 6.22,
    innerW: 100,
    innerH: 100,
    imgLeft: -126.88,
    imgTop: -58.51,
    imgW: 353.76,
    imgH: 227.19,
    delay: 2.4,
  },
  {
    src: figmaStar4,
    left: 24,
    top: 38.21,
    width: 3.78,
    height: 5.65,
    rotate: -98.23,
    skew: 7.71,
    innerW: 100,
    innerH: 100,
    imgLeft: -83.44,
    imgTop: -103.73,
    imgW: 266.88,
    imgH: 325.51,
    delay: 0.6,
  },
  {
    src: figmaStar5,
    left: 96.7,
    top: 79.43,
    width: 3.3,
    height: 3.7,
    rotate: -97.79,
    skew: 0,
    innerW: 100,
    innerH: 100,
    imgLeft: -119.5,
    imgTop: -116.98,
    imgW: 339,
    imgH: 354.31,
    delay: 1.8,
  },
  {
    src: figmaStar6,
    left: 82.45,
    top: 54.5,
    width: 16.31,
    height: 16.16,
    rotate: 33.13,
    skew: 0,
    innerW: 100,
    innerH: 100,
    imgLeft: -27.47,
    imgTop: -36.74,
    imgW: 154.94,
    imgH: 179.87,
    delay: 3,
  },
  {
    src: figmaStar7,
    left: 19.8,
    top: 66.5,
    width: 7.8,
    height: 8.34,
    rotate: 77.93,
    skew: 0,
    innerW: 100,
    innerH: 100,
    imgLeft: -56.33,
    imgTop: -51.66,
    imgW: 212.66,
    imgH: 212.31,
    delay: 0.9,
  },
  {
    src: figmaStar8,
    left: 92.79,
    top: 0,
    width: 3.31,
    height: 3.47,
    rotate: 33.13,
    skew: 0,
    innerW: 100,
    innerH: 100,
    imgLeft: -149.08,
    imgTop: -150.96,
    imgW: 398.16,
    imgH: 428.17,
    delay: 2.1,
  },
]

const STAR_GLOW = [
  'drop-shadow(0 0 20px rgba(255,255,255,0.5))',
  'drop-shadow(0 4px 40px rgba(255,255,255,0.5))',
  'drop-shadow(0 4px 50px rgba(255,255,255,0.5))',
].join(' ')
const FIGMA_STAR_SCALE = 0.55

export default function ProblemStars() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute top-[4.08%] left-[2.22%] h-[79.24%] w-[95.58%]"
    >
      {LEGACY_STARS.map((star) => (
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
      {FIGMA_STARS.map((star) => (
        <div
          key={star.src}
          className="absolute"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: `${star.width * FIGMA_STAR_SCALE}%`,
            height: `${star.height * FIGMA_STAR_SCALE}%`,
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
                filter: STAR_GLOW,
                animationDelay: `${star.delay}s`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
