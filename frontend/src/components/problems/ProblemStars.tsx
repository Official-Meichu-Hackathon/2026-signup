import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
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
import meteorLine from '../../assets/Problems/meteor-line.svg'
import meteorLine2 from '../../assets/Problems/meteor-line-2.svg'
import meteorLine3 from '../../assets/Problems/meteor-line-3.svg'

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
    top: 64.5,
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
    top: 76.5,
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

const FIGMA_STAR_SCALE = 0.55

// 流星線：連接兩顆星星的裝飾曲線（1577:63535、63527、63529）。
// 星星的 left/top 是「頁面高度」的百分比、卡片與其他元件卻是各自寬度的
// cqw，兩套縮放基準不同，導致視窗寬度一變，星星之間的實際像素距離跟
// 「用百分比撐開的線框」就會兜不起來（線被拉成細長的 V，見對話中的截圖）。
// 故改用 JS 在掛載/resize 時量測兩顆星星的實際像素中心，再用「等比縮放
// ＋旋轉」把線的原始外框（保留設計稿真實長寬比，不被拉伸變形）貼到兩點
// 之間，頭尾各留一點空隙不直接碰到星芒本體。
interface MeteorLineDef {
  src: string
  viewBoxWidth: number
  viewBoxHeight: number
  startX: number
  startY: number
  endX: number
  endY: number
  startSrc: string
  endSrc: string
  gap: number
  horizontalOffset: number
  verticalOffset: number
}

const METEOR_LINES: MeteorLineDef[] = [
  {
    // 1577:63535，連接 黑客組 標籤旁的 figmaStar7 與右上方的 figmaStar6
    src: meteorLine,
    viewBoxWidth: 763.404,
    viewBoxHeight: 114.873,
    startX: 16.4114,
    startY: 16.6224,
    endX: 747.085,
    endY: 72.1443,
    startSrc: figmaStar7,
    endSrc: figmaStar6,
    gap: 0.0575,
    horizontalOffset: 0,
    verticalOffset: 0.015,
  },
  {
    // 1577:63527，題目説明標題下方，figmaStar3 → figmaStar4
    src: meteorLine3,
    viewBoxWidth: 282,
    viewBoxHeight: 224,
    startX: 16.6289,
    startY: 16.3672,
    endX: 265.687,
    endY: 204.399,
    startSrc: figmaStar3,
    endSrc: figmaStar4,
    gap: 0.057,
    horizontalOffset: -0.015,
    verticalOffset: 0.015,
  },
  {
    // 1577:63529，跟上面那條幾乎重疊，設計稿本來就是雙線效果
    src: meteorLine2,
    viewBoxWidth: 251,
    viewBoxHeight: 226,
    startX: 16.6338,
    startY: 16.3496,
    endX: 233.802,
    endY: 206.059,
    startSrc: figmaStar3,
    endSrc: figmaStar4,
    gap: 0.057,
    horizontalOffset: -0.015,
    verticalOffset: 0.015,
  },
]

export default function ProblemStars() {
  const containerRef = useRef<HTMLDivElement>(null)
  const starRefs = useRef(new Map<string, HTMLDivElement>())
  const [lineStyles, setLineStyles] = useState<(CSSProperties | null)[]>(() =>
    METEOR_LINES.map(() => null),
  )

  useLayoutEffect(() => {
    const recompute = () => {
      const container = containerRef.current
      if (!container) return
      const containerRect = container.getBoundingClientRect()
      const centerOf = (src: string) => {
        const el = starRefs.current.get(src)
        if (!el) return null
        const r = el.getBoundingClientRect()
        return {
          x: r.left + r.width / 2 - containerRect.left,
          y: r.top + r.height / 2 - containerRect.top,
        }
      }

      setLineStyles(
        METEOR_LINES.map((line) => {
          const start = centerOf(line.startSrc)
          const end = centerOf(line.endSrc)
          if (!start || !end) return null

          const fullDx = end.x - start.x
          const fullDy = end.y - start.y
          const fullDist = Math.hypot(fullDx, fullDy)
          if (fullDist === 0) return null
          const ux = fullDx / fullDist
          const uy = fullDy / fullDist
          const gapPx = fullDist * line.gap
          const pStart = { x: start.x + ux * gapPx, y: start.y + uy * gapPx }
          const pEnd = { x: end.x - ux * gapPx, y: end.y - uy * gapPx }

          const vx = pEnd.x - pStart.x
          const vy = pEnd.y - pStart.y
          const targetDist = Math.hypot(vx, vy)

          const localVx = line.endX - line.startX
          const localVy = line.endY - line.startY
          const localDist = Math.hypot(localVx, localVy)

          const scale = targetDist / localDist
          const angle = Math.atan2(vy, vx) - Math.atan2(localVy, localVx)
          const cos = Math.cos(angle)
          const sin = Math.sin(angle)
          const localStartX = scale * (line.startX * cos - line.startY * sin)
          const localStartY = scale * (line.startX * sin + line.startY * cos)

          return {
            position: 'absolute',
            left:
              pStart.x -
              localStartX +
              containerRect.width * line.horizontalOffset,
            top:
              pStart.y -
              localStartY +
              containerRect.height * line.verticalOffset,
            width: line.viewBoxWidth * scale,
            height: line.viewBoxHeight * scale,
            transformOrigin: '0 0',
            transform: `rotate(${angle}rad)`,
            pointerEvents: 'none',
          }
        }),
      )
    }

    recompute()
    window.addEventListener('resize', recompute)
    return () => window.removeEventListener('resize', recompute)
  }, [])

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="pointer-events-none absolute top-[7.222vw] left-[2.22%] aspect-[1376.367/2020.722] w-[95.58%]"
    >
      {METEOR_LINES.map((line, index) => (
        <div key={line.src} className="absolute inset-0">
          <div className="absolute" style={lineStyles[index] ?? { opacity: 0 }}>
            <img src={line.src} alt="" className="block size-full max-w-none" />
          </div>
        </div>
      ))}
      {LEGACY_STARS.map((star) => (
        <div
          key={star.src}
          ref={(el) => {
            if (el) starRefs.current.set(star.src, el)
          }}
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
          ref={(el) => {
            if (el) starRefs.current.set(star.src, el)
          }}
          className={`absolute ${
            star.src === figmaStar6 || star.src === figmaStar7
              ? 'problem-meteor-endpoint'
              : ''
          }`}
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
                animationDelay: `${star.delay}s`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
