import { useEffect, useRef, useState } from 'react'
import { PROBLEMS, HASHTAG_NOTE, type Problem } from '../../data/problems'
import cardBack from '../../assets/Problems/card-back.png'
import cardDecor from '../../assets/Problems/card-decor.svg'
import zoomCardDecor from '../../assets/Problems/zoom-card-decor.svg'
import zoomDivider from '../../assets/Problems/zoom-divider.svg'

// 設計稿的題目卡母元件為 242.414×434.223。頁面上的 instance（664:8019）是
// 母元件的 0.5644 倍，但那個尺寸下內文只有 11px、難以閱讀，故放大到 0.67 —
// 這是「七張一列還排得下 1262px 容器」的上限（7×242.414×0.67 ≈ 1137）。
// 圓角與字級在設計稿裡是絕對值（不隨卡片放大而變），故先換算成 px。
const S = 0.67
const px = (n: number) => n * S

// 牌組容器在設計稿的寬度（instance 664:8019）。下面的 px 值都是「容器
// 1262px 寬」時的尺寸，再由 cq() 換成容器寬度的百分比，整個牌組才會隨容器
// 等比縮放（RWD）——容器變窄時七張卡才不會疊在一起。
const DECK_W = 1262
const cq = (n: number) => `${((n / DECK_W) * 100).toFixed(4)}cqw`

const CARD_W = px(242.414) // 162.4
const CARD_H = px(434.223) // 290.9
const STACK_OFFSET = px(27) // 18.1
const CARD_RADIUS = px(24.486) // 16.4

// 放大卡（zoomin1–7）。使用設計稿的母卡放大比例。
// 注意：設計稿裡放大卡的內文是「絕對的 20px」（與收合卡上的提示同級），
// 並非隨卡寬縮放，照設計稿換算只有 13px。故放大卡內部一律改用 zpx —
// 相當於把設計稿的放大卡整張等比放大，字級才會跟著變大（內文 ≈15px）。
const ZOOM = 2.7324
const ZOOM_W = CARD_W * ZOOM // 503.4
const ZOOM_H = CARD_H * ZOOM
const zpx = (n: number) => n * S * (ZOOM / 2.7324)
const zoomCq = (n: number) => `${((n / ZOOM_W) * 100).toFixed(4)}cqw`
const ZOOM_RADIUS = zpx(15.671) // 11.9

// 放大卡與卡列之間的間距
const ROW_GAP = px(94) // 63
const MOBILE_BREAKPOINT = 768
const MOBILE_GUTTER = 48

const getResponsiveZoomWidth = (deckWidth: number, viewportWidth: number) =>
  viewportWidth < MOBILE_BREAKPOINT
    ? Math.max(0, viewportWidth - MOBILE_GUTTER)
    : (ZOOM_W / DECK_W) * deckWidth

const getResponsiveZoomHeight = (zoomWidth: number, viewportHeight: number) =>
  Math.min(zoomWidth * (ZOOM_H / ZOOM_W), Math.max(0, viewportHeight - 48))

const getResponsiveZoomRise = (
  deckWidth: number,
  viewportWidth: number,
  viewportHeight: number,
) => {
  const zoomWidth = getResponsiveZoomWidth(deckWidth, viewportWidth)
  return (
    getResponsiveZoomHeight(zoomWidth, viewportHeight) +
    (ROW_GAP / DECK_W) * deckWidth
  )
}

// 白卡光暈（390:377）：0 4px 50px / 0 4px 40px / 0 0 20px，白色 50%
const PANEL_GLOW = [
  `0 ${cq(px(4))} ${cq(px(50))} rgba(255,255,255,0.5)`,
  `0 ${cq(px(4))} ${cq(px(40))} rgba(255,255,255,0.5)`,
  `0 0 ${cq(px(20))} rgba(255,255,255,0.5)`,
].join(', ')

// 每張卡上企業 logo 的設計稿幾何（909:27702–27740，卡片座標 242.414×434.223，
// 換算成百分比）。設計稿是逐家手調的尺寸，不是統一縮進白卡，所以不能用
// 「塞滿白卡」的通用規則——先前那樣做就是被反映 logo 太小的原因。
// 順序對齊 PROBLEMS：CloudMosa、羅技、AMD、聚陽、恩智浦(+文曄)、愛德萬、Google。
const LOGO_BOXES: { left: number; top: number; w: number; h: number }[][] = [
  [{ left: 19.39, top: 43.07, w: 60.64, h: 8.29 }],
  [{ left: 15.67, top: 37.31, w: 70.95, h: 19.81 }],
  [{ left: 10.72, top: 37.31, w: 83.33, h: 20.27 }],
  [{ left: 28.05, top: 37.08, w: 43.31, h: 20.04 }],
  [
    { left: 13.2, top: 40.99, w: 46.2, h: 12.67 },
    { left: 34.65, top: 33.39, w: 70.13, h: 29.01 },
  ],
  [{ left: 20.63, top: 42.14, w: 58.58, h: 9.9 }],
  [{ left: 25.23, top: 42.24, w: 53.93, h: 9.82 }],
]

// 題目卡廠商背景電腦版（390:437）：白卡 + 星星裝飾，於卡片內佔
// left 3.3% / top 17.81% / 92.97%×64.55%。收合狀態依設計稿不放 logo。
function CardFace({ problem, index }: { problem?: Problem; index?: number }) {
  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute top-[17.81%] left-[3.3%] h-[64.55%] w-[92.97%]">
        {/* 白卡（390:377） */}
        <div
          className="absolute inset-[22.12%_7.52%_31.14%_10.4%] bg-white"
          style={{ borderRadius: cq(px(14)), boxShadow: PANEL_GLOW }}
        />
        {/* 星星裝飾（390:380 等 7 個向量合成的單一素材）。素材 viewBox 外擴
            以容納光暈，故負偏移 + 超過 100% 的尺寸為預期值 */}
        <img
          src={cardDecor}
          alt=""
          className="absolute top-[-22.69%] left-[-31.81%] h-[148.81%] w-[164%] max-w-none"
        />
      </div>
      {/* 企業 logo：設計稿逐家手調的位置與尺寸（卡片座標系） */}
      {problem &&
        index !== undefined &&
        problem.logos.map((logo, logoIndex) => {
          const box = LOGO_BOXES[index]?.[logoIndex]
          if (!box) return null
          return (
            <img
              key={logo}
              src={logo}
              alt={problem.sponsor}
              className="absolute object-contain"
              style={{
                left: `${box.left}%`,
                top: `${box.top}%`,
                width: `${box.w}%`,
                height: `${box.h}%`,
              }}
            />
          )
        })}
    </div>
  )
}

// 放大卡內容（1601:62032–62309）：白卡佔 86.19%×93.05%，其上由上而下依序為
// 企業 logo、企業名、（保密說明，部分企業才有）、分隔線、hashtag、「完整題目
// 將於比賽當日公開」，閱讀完畢固定在底部。內容區改用 flex 直排（非絕對定位），
// 因各企業有無保密說明、hashtag 數量不一，流式堆疊才能自動適應。
function ZoomedFace({
  problem,
  onClose,
  contentScale,
}: {
  problem: Problem
  onClose: () => void
  contentScale: number
}) {
  const isLogitech = problem.sponsor === '羅技'
  const isAmd = problem.sponsor === 'AMD'
  const isGoogle = problem.sponsor === 'Google'
  const logitechNoteLines = [
    '請務必簽署附件之保密協定，',
    '並於回傳組別繳費證明的郵件的同時，',
    '一併繳交個人的保密協定同意書，方為報名成功。',
  ]
  const logoBoxHeight = isLogitech ? 172 : isAmd ? 176 : isGoogle ? 85.263 : 120
  const logoImageWidth = isLogitech
    ? 344
    : isAmd
      ? 404
      : isGoogle
        ? 261.458
        : undefined
  const sponsorBoxStyle =
    isAmd || isGoogle
      ? {
          width: zoomCq(zpx(278)),
          height: zoomCq(zpx(96)),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }
      : undefined
  const isLargeHashtagCard = isLogitech || isAmd || isGoogle
  const hashtagBoxWidth = isAmd ? 572 : isGoogle ? 493 : undefined
  const contentTop = isGoogle ? '14%' : '9%'
  const contentGap = isLogitech || isGoogle ? 13 : 18
  const noticeBoxStyle = isGoogle
    ? {
        width: zoomCq(zpx(325)),
        height: zoomCq(zpx(96)),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }
    : undefined

  return (
    <div className="animate-fade-in absolute inset-0">
      {/* 白卡（360:377） */}
      <div
        className="absolute top-[3.57%] left-[6.86%] h-[93.05%] w-[86.19%] bg-white"
        style={{ borderRadius: zoomCq(zpx(13.059)) }}
      />

      {/* 內容直排，置中對齊，於白卡上緣起算 */}
      <div
        className="absolute inset-0"
        style={{
          transform: `scale(${contentScale})`,
          transformOrigin: 'top center',
        }}
      >
        <div
          className="absolute left-1/2 flex w-[72.46%] -translate-x-1/2 flex-col items-center"
          style={{ top: contentTop, gap: zoomCq(zpx(contentGap)) }}
        >
          {/* 企業 logo：以固定高度盒 + object-contain，寬 logo 受寬度上限、
            高 logo（聚陽、愛德萬）受高度上限，皆比先前放大許多 */}
          <div
            className="flex w-full items-center justify-center"
            style={{ height: zoomCq(zpx(logoBoxHeight)), gap: zoomCq(zpx(20)) }}
          >
            {problem.logos.map((logo) => (
              <img
                key={logo}
                src={logo}
                alt={problem.sponsor}
                className="max-h-full max-w-[46%] object-contain"
                style={
                  logoImageWidth
                    ? { width: zoomCq(zpx(logoImageWidth)), maxWidth: '100%' }
                    : undefined
                }
              />
            ))}
          </div>

          {/* 企業名（三級標題：Noto Sans SemiBold 30/44，輔助文字色 #A5BDE2） */}
          <p
            className="font-noto text-periwinkle text-center font-semibold"
            style={{
              ...sponsorBoxStyle,
              fontSize: zoomCq(zpx(30)),
              lineHeight: zoomCq(zpx(44)),
            }}
          >
            {problem.sponsor}
          </p>

          {/* 保密說明（內文 20/26，主色 #2D3E63），只有部分企業有 */}
          {problem.note && (
            <p
              className="font-noto text-darkblue text-center font-semibold"
              style={{
                width: isLogitech ? zoomCq(zpx(480)) : undefined,
                maxWidth: '100%',
                fontSize: zoomCq(zpx(20)),
                lineHeight: zoomCq(zpx(26)),
                overflowWrap: 'anywhere',
              }}
            >
              {isLogitech
                ? logitechNoteLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))
                : problem.note}
            </p>
          )}

          {/* 分隔線（Line 33，#A5BDE2 2px） */}
          <img
            src={zoomDivider}
            alt=""
            className="w-full"
            style={{ height: zoomCq(zpx(2)) }}
          />

          {/* hashtag（小標題：Noto Sans SemiBold 25/40，主色 #2D3E63） */}
          <div
            className={`text-darkblue flex flex-col items-center text-center ${
              isLargeHashtagCard
                ? 'font-zen font-normal'
                : 'font-noto font-semibold'
            }`}
            style={{
              width: hashtagBoxWidth ? zoomCq(zpx(hashtagBoxWidth)) : undefined,
              maxWidth: '100%',
              fontSize: zoomCq(zpx(isLargeHashtagCard ? 35 : 25)),
              lineHeight: zoomCq(zpx(isLargeHashtagCard ? 44 : 40)),
              overflowWrap: 'anywhere',
            }}
          >
            {problem.hashtags.map((tag, index) => (
              <p key={`${tag}-${index}`}>
                {isGoogle && index === 1 ? (
                  <>
                    #Multimodal Reasoning
                    <br />
                    （多模態推理）
                  </>
                ) : (
                  tag
                )}
              </p>
            ))}
          </div>

          {/* 完整題目將於比賽當日公開（內文 20/26，輔助文字色 #A5BDE2） */}
          <p
            className="font-noto text-periwinkle text-center font-semibold"
            style={{
              ...noticeBoxStyle,
              maxWidth: '100%',
              fontSize: zoomCq(zpx(isLargeHashtagCard ? 25 : 20)),
              lineHeight: zoomCq(zpx(isLargeHashtagCard ? 40 : 26)),
              overflowWrap: 'anywhere',
            }}
          >
            {isLogitech ? '完整題目將於當天公告' : HASHTAG_NOTE}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="font-noto text-periwinkle absolute top-[85.58%] left-1/2 flex h-[8.09%] w-[41.97%] -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center text-center font-semibold transition hover:opacity-70"
        style={{ fontSize: zoomCq(zpx(30)), lineHeight: zoomCq(zpx(44)) }}
      >
        閱讀完畢
      </button>

      {/* 牌面裝飾（1097:61437）：7 個星星向量合成的單一素材。渲染在最後、蓋在
          白卡與文字之上（設計稿裡星星本來就疊在卡面最上層），故用
          pointer-events-none 避免擋到閱讀完畢等互動元素 */}
      <img
        src={zoomCardDecor}
        alt=""
        className="pointer-events-none absolute max-w-none"
        style={{
          left: '-7.5468%',
          top: '-3.8912%',
          width: '118.398%',
          height: '110.0572%',
        }}
      />
    </div>
  )
}

interface Placement {
  left: string
  top: string
  width: string
  height: string
  radius: string
  zIndex: number
}

export default function ProblemDeck() {
  const [isOpen, setIsOpen] = useState(false)
  const [zoomed, setZoomed] = useState<number | null>(null)
  const [viewportWidth, setViewportWidth] = useState(() => window.innerWidth)
  const [viewportHeight, setViewportHeight] = useState(() => window.innerHeight)
  const deckRef = useRef<HTMLDivElement>(null)
  const [deckWidth, setDeckWidth] = useState(DECK_W)
  const prevZoomed = useRef<number | null>(null)

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth)
      setViewportHeight(window.innerHeight)
      const width = deckRef.current?.getBoundingClientRect().width
      if (width) setDeckWidth(width)
    }

    const width = deckRef.current?.getBoundingClientRect().width
    if (width) setDeckWidth(width)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // 卡列的位置固定不動，放大卡是往「上」長的（見 placement），所以放大時
  // 往上捲到放大卡、收合時往下捲回卡列。升起的高度隨容器寬度縮放，故要依
  // 實際寬度換算，不能用固定 px。
  useEffect(() => {
    const previous = prevZoomed.current
    prevZoomed.current = zoomed
    // 初次掛載與尚未展開過時不捲動
    if (zoomed === null && previous === null) return
    const deck = deckRef.current
    if (!deck) return
    const box = deck.getBoundingClientRect()
    const deckTop = box.top + window.scrollY
    const rise = getResponsiveZoomRise(box.width, viewportWidth, viewportHeight)
    const target = zoomed === null ? deckTop : deckTop - rise
    window.scrollTo({ top: Math.max(0, target - 32), behavior: 'smooth' })
  }, [zoomed, viewportWidth, viewportHeight])

  const responsiveZoomWidth = getResponsiveZoomWidth(deckWidth, viewportWidth)
  const responsiveZoomHeight = getResponsiveZoomHeight(
    responsiveZoomWidth,
    viewportHeight,
  )
  const responsiveZoomAspectHeight = responsiveZoomWidth * (ZOOM_H / ZOOM_W)
  const contentScale = Math.min(
    1,
    responsiveZoomHeight / responsiveZoomAspectHeight,
  )
  const responsiveZoomRise = getResponsiveZoomRise(
    deckWidth,
    viewportWidth,
    viewportHeight,
  )

  // 一列共 7 格、首尾切齊容器；第 slot 格的左緣
  const rowCard = (slot: number): Placement => ({
    left: `calc(${slot} * (100% - ${cq(CARD_W)}) / ${PROBLEMS.length - 1})`,
    top: '0px',
    width: cq(CARD_W),
    height: cq(CARD_H),
    radius: cq(CARD_RADIUS),
    zIndex: PROBLEMS.length - slot,
  })

  const placement = (index: number): Placement => {
    // 放大：被點的卡從自己的格子往上浮起放大，其餘六張完全不動（原本的
    // 格子就空著）；收合時再原路縮回同一格。已公開／未公開流程相同。
    if (zoomed === index) {
      return {
        left: `calc(50% - ${responsiveZoomWidth / 2}px)`,
        top: `-${responsiveZoomRise}px`,
        width: `${responsiveZoomWidth}px`,
        height: `${responsiveZoomHeight}px`,
        radius: `${(ZOOM_RADIUS / ZOOM_W) * responsiveZoomWidth}px`,
        zIndex: PROBLEMS.length + 1,
      }
    }
    // 展開：七張一字排開，不換行
    if (isOpen) return rowCard(index)
    // 收合（Property 1=close）：每張右移一個邊條的寬度
    return {
      left: `calc(${index} * ${cq(STACK_OFFSET)})`,
      top: '0px',
      width: cq(CARD_W),
      height: cq(CARD_H),
      radius: cq(CARD_RADIUS),
      zIndex: PROBLEMS.length - index,
    }
  }

  const handleClick = (index: number) => {
    if (!isOpen) return setIsOpen(true)
    setZoomed(index)
  }

  return (
    // @container 讓底下所有 cqw 都以這個寬度為基準。牌組本身不能是 container，
    // 否則它自己的高度用 cqw 會參照到外層而非自己。
    <div className="@container w-full max-w-[1262px]">
      {/* 高度固定為一張卡：放大卡是往上浮出容器的，容器不長高，卡列與頁面
          其餘區塊才不會被推動 */}
      <div ref={deckRef} className="relative" style={{ height: cq(CARD_H) }}>
        {/* 收合時牌堆後方的光暈 */}
        <div
          className="absolute top-0 rounded-full bg-white/50 blur-3xl transition-opacity duration-700"
          style={{
            width: cq(CARD_W + STACK_OFFSET * (PROBLEMS.length - 1)),
            height: cq(CARD_H),
            opacity: isOpen ? 0 : 1,
          }}
        />
        {PROBLEMS.map((problem, index) => {
          const spot = placement(index)
          const isZoomed = zoomed === index
          return (
            // 卡片本身是 div，未放大時才鋪一層透明按鈕接點擊。放大卡裡有自己的
            // 按鈕與連結，若外層也是 button 會變成巢狀 button（無效的 HTML），
            // 且外層一旦 disabled 會連子元素的點擊一起吃掉。
            <div
              key={problem.sponsor}
              className={`ease-out-strong absolute max-w-[calc(100vw-3rem)] overflow-hidden transition-all duration-700 ${
                isZoomed ? '@container' : 'hover:-translate-y-2'
              }`}
              style={{
                left: spot.left,
                top: spot.top,
                width: spot.width,
                height: spot.height,
                borderRadius: spot.radius,
                zIndex: spot.zIndex,
                transitionDelay: zoomed === null ? `${index * 50}ms` : '0ms',
              }}
            >
              <img
                src={cardBack}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
              {isZoomed ? (
                <ZoomedFace
                  problem={problem}
                  onClose={() => setZoomed(null)}
                  contentScale={contentScale}
                />
              ) : (
                <>
                  <CardFace
                    problem={isOpen ? problem : undefined}
                    index={index}
                  />
                  <button
                    type="button"
                    onClick={() => handleClick(index)}
                    className="absolute inset-0 cursor-pointer"
                    aria-label={
                      isOpen
                        ? `${problem.sponsor} 題目`
                        : '點擊展開黑客組題目牌組'
                    }
                  />
                </>
              )}
            </div>
          )
        })}
        {/* 收合牌堆的提示（未公開版 1601:61961 也有這行，白卡上顯示） */}
        <span
          className="font-noto text-periwinkle pointer-events-none absolute top-[calc(50%-12px)] left-0 text-center font-semibold transition-opacity duration-300"
          style={{
            width: cq(CARD_W),
            fontSize: cq(px(20)),
            lineHeight: cq(px(26)),
            zIndex: PROBLEMS.length + 2,
            opacity: isOpen ? 0 : 1,
          }}
        >
          請點擊展開牌組
        </span>
      </div>
    </div>
  )
}
