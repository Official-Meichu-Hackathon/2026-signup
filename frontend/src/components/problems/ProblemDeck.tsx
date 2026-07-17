import { useEffect, useRef, useState } from 'react'
import { PROBLEMS, PROBLEMS_PUBLISHED, type Problem } from '../../data/problems'
import cardBack from '../../assets/Problems/card-back.png'
import cardDecor from '../../assets/Problems/card-decor.svg'
import zoomDivider from '../../assets/Problems/zoom-divider.svg'
import logo14th from '../../assets/Problems/logo-14th.svg'

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

// 放大卡（zoomin1–7）。設計稿為母卡的 2.7324 倍，此處放大到 3.1 倍。
// 注意：設計稿裡放大卡的內文是「絕對的 20px」（與收合卡上的提示同級），
// 並非隨卡寬縮放，照設計稿換算只有 13px。故放大卡內部一律改用 zpx —
// 相當於把設計稿的放大卡整張等比放大，字級才會跟著變大（內文 ≈15px）。
const ZOOM = 3.1
const ZOOM_W = CARD_W * ZOOM // 503.4
const ZOOM_H = CARD_H * ZOOM // 901.8
const zpx = (n: number) => n * S * (ZOOM / 2.7324)
const ZOOM_RADIUS = zpx(15.671) // 11.9

// 放大卡與卡列之間的間距
const ROW_GAP = px(94) // 63
// 放大卡往「上」長：卡列的位置完全不動，放大卡以負偏移浮在上方的空白區。
// 若改成往下長，卡列會被推走近千 px，收合時就變成從畫面外飛回來而非平移。
const ZOOM_RISE = ZOOM_H + ROW_GAP

// 尚未公開面板（資產 4 1 / 664:2640，未公開版的 Variant3）。設計稿裡它是
// 一張透明、只做裁切的圓角面板，浮在卡列上方；七張卡全部留在原地不動。
// 座標換算：變體裡卡列在 y=153，面板在 y=-892，故相對卡列為 -1045。
const PANEL_W = px(1502) // 1006.3
const PANEL_H = px(840) // 562.8
const PANEL_RISE = px(1045) // 700.2
// 圓角刻意不對稱：右下角幾乎是直角（與創客交流組 CTA 同一種造型）
const PANEL_RADIUS = `${cq(px(169))} ${cq(px(169))} ${cq(px(11))} ${cq(px(169))}`
// 星座光暈：0 0 20px / 0 4px 40px / 0 4px 50px，白色 50%
const STAR_GLOW = [
  `0 0 ${cq(px(20))} rgba(255,255,255,0.5)`,
  `0 ${cq(px(4))} ${cq(px(40))} rgba(255,255,255,0.5)`,
  `0 ${cq(px(4))} ${cq(px(50))} rgba(255,255,255,0.5)`,
].join(', ')

// 白卡光暈（390:377）：0 4px 50px / 0 4px 40px / 0 0 20px，白色 50%
const PANEL_GLOW = [
  `0 ${cq(px(4))} ${cq(px(50))} rgba(255,255,255,0.5)`,
  `0 ${cq(px(4))} ${cq(px(40))} rgba(255,255,255,0.5)`,
  `0 0 ${cq(px(20))} rgba(255,255,255,0.5)`,
].join(', ')

// 題目卡廠商背景電腦版（390:437）：白卡 + 星星裝飾，於卡片內佔
// left 3.3% / top 17.81% / 92.97%×64.55%。收合狀態依設計稿不放 logo。
function CardFace({ problem }: { problem?: Problem }) {
  return (
    <div className="pointer-events-none absolute top-[17.81%] left-[3.3%] h-[64.55%] w-[92.97%]">
      {/* 白卡（390:377） */}
      <div
        className="absolute inset-[22.12%_7.52%_31.14%_10.4%] flex flex-col items-center justify-center gap-[4%] bg-white p-[5%]"
        style={{ borderRadius: cq(px(14)), boxShadow: PANEL_GLOW }}
      >
        {problem?.logos.map((logo) => (
          <img
            key={logo}
            src={logo}
            alt={problem.sponsor}
            className="min-h-0 max-w-[85%] flex-1 object-contain"
          />
        ))}
      </div>
      {/* 星星裝飾（390:380 等 7 個向量合成的單一素材）。素材 viewBox 外擴
          以容納光暈，故負偏移 + 超過 100% 的尺寸為預期值 */}
      <img
        src={cardDecor}
        alt=""
        className="absolute top-[-22.69%] left-[-31.81%] h-[148.81%] w-[164%] max-w-none"
      />
    </div>
  )
}

// 放大卡內容（zoomin1–7）：白卡佔 86.19%×93.05%，其上依序為企業 logo、
// 企業名、分隔線、題目內文、詳細題目說明、閱讀完畢。百分比皆由設計稿的
// 卡片座標系（662.4×1186.4）換算而來。
function ZoomedFace({
  problem,
  onClose,
}: {
  problem: Problem
  onClose: () => void
}) {
  return (
    <div className="animate-fade-in absolute inset-0">
      {/* 白卡（360:377） */}
      <div
        className="absolute top-[3.57%] left-[6.86%] h-[93.05%] w-[86.19%] bg-white"
        style={{ borderRadius: cq(zpx(13.059)) }}
      />

      <div className="absolute top-[14.27%] left-1/2 flex h-[6.07%] w-[44.38%] -translate-x-1/2 items-center justify-center gap-[4%]">
        {problem.logos.map((logo) => (
          <img
            key={logo}
            src={logo}
            alt={problem.sponsor}
            className="h-full max-w-[48%] flex-1 object-contain"
          />
        ))}
      </div>

      {/* 企業名（三級標題：Noto Sans SemiBold 30/44）。設計稿此區塊為
          中心點定位（-translate-y-1/2），故 top 是中心而非上緣 */}
      <p
        className="font-noto text-periwinkle absolute top-[24.38%] left-1/2 flex h-[8.09%] w-[41.97%] -translate-x-1/2 -translate-y-1/2 items-center justify-center text-center font-semibold"
        style={{ fontSize: cq(zpx(30)), lineHeight: cq(zpx(44)) }}
      >
        {problem.sponsor}
      </p>

      {/* 分隔線（Line 33，#A5BDE2 2px） */}
      <img
        src={zoomDivider}
        alt=""
        className="absolute top-[28.43%] left-1/2 w-[67.18%] -translate-x-1/2"
        style={{ height: cq(zpx(2)) }}
      />

      {/* 內文（內文：Noto Sans SemiBold 20/26，主色 #2D3E63），上緣定位。
          設計稿只有 zoomin1 的精確排版，故高度上限取到「詳細題目說明」之前，
          題目較長的變體以捲動處理，避免壓到下方元素 */}
      <div
        className="font-noto text-darkblue absolute top-[35.02%] left-1/2 flex max-h-[15%] w-[72.46%] -translate-x-1/2 flex-col gap-[2%] overflow-y-auto text-center font-semibold"
        style={{ fontSize: cq(zpx(20)), lineHeight: cq(zpx(26)) }}
      >
        {problem.paragraphs.length > 0 ? (
          problem.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))
        ) : (
          <p className="text-darkblue/60">題目內容即將公開，敬請期待！</p>
        )}
      </div>

      {/* TODO: 詳細題目說明的連結目的地待設計/主辦確認 */}
      <a
        href="#"
        onClick={(event) => event.preventDefault()}
        className="font-noto text-periwinkle absolute top-[52.03%] left-1/2 flex h-[8.09%] w-[41.97%] -translate-x-1/2 -translate-y-1/2 items-center justify-center text-center font-semibold hover:underline"
        style={{ fontSize: cq(zpx(20)), lineHeight: cq(zpx(26)) }}
      >
        詳細題目說明&gt;&gt;
      </a>

      <button
        type="button"
        onClick={onClose}
        className="font-noto text-periwinkle absolute top-[85.58%] left-1/2 flex h-[8.09%] w-[41.97%] -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center text-center font-semibold transition hover:opacity-70"
        style={{ fontSize: cq(zpx(30)), lineHeight: cq(zpx(44)) }}
      >
        閱讀完畢
      </button>
    </div>
  )
}

// 尚未公開面板（664:2640 + 664:3521）：書法字 logo 與創客交流組 CTA 共用同一
// 份藝術字（此處為 1.562 倍，SVG 可直接縮放），下方是 Zen Antique 100px 的
// 「尚未公開」。面板本身無填色，設計稿的背景直接透出。
function UnpublishedPanel({ onDismiss }: { onDismiss: () => void }) {
  return (
    <button
      type="button"
      onClick={onDismiss}
      aria-label="關閉尚未公開說明"
      className="animate-fade-in ease-out-strong absolute -translate-x-1/2 cursor-pointer overflow-hidden transition-all duration-700"
      style={{
        left: '50%',
        top: `calc(-1 * ${cq(PANEL_RISE)})`,
        width: cq(PANEL_W),
        height: cq(PANEL_H),
        borderRadius: PANEL_RADIUS,
        zIndex: PROBLEMS.length + 1,
      }}
    >
      {/* 書法字 logo（664:2641：面板內 left 7.39% / top 2.98% / 63.85%） */}
      <img
        src={logo14th}
        alt="梅竹黑客松 14th"
        className="absolute top-[2.98%] left-[7.39%] w-[63.85%]"
      />
      {/* 尚未公開（664:3521：中心 52.5%，Zen Antique 100/64，主要文字色） */}
      <p
        className="font-zen text-ink absolute top-[52.5%] left-1/2 flex h-[28.1%] w-[47.87%] -translate-x-1/2 -translate-y-1/2 items-center justify-center text-center"
        style={{
          fontSize: cq(px(100)),
          lineHeight: cq(px(64)),
          textShadow: STAR_GLOW,
        }}
      >
        尚未公開
      </p>
    </button>
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
  const deckRef = useRef<HTMLDivElement>(null)
  const prevZoomed = useRef<number | null>(null)

  // 卡列的位置固定不動，放大卡／尚未公開面板都是往「上」長的（見
  // placement），所以展開時往上捲到它、收合時往下捲回卡列。升起的高度隨
  // 容器寬度縮放，故要依實際寬度換算，不能用固定 px。
  useEffect(() => {
    const previous = prevZoomed.current
    prevZoomed.current = zoomed
    // 初次掛載與尚未展開過時不捲動
    if (zoomed === null && previous === null) return
    const deck = deckRef.current
    if (!deck) return
    const box = deck.getBoundingClientRect()
    const deckTop = box.top + window.scrollY
    const risen = PROBLEMS_PUBLISHED ? ZOOM_RISE : PANEL_RISE
    const rise = (risen / DECK_W) * box.width
    const target = zoomed === null ? deckTop : deckTop - rise
    window.scrollTo({ top: Math.max(0, target - 32), behavior: 'smooth' })
  }, [zoomed])

  // 一列共 7 格、首尾切齊容器；第 slot 格的左緣
  const rowCard = (slot: number): Placement => ({
    left: `calc(${slot} * (100% - ${cq(CARD_W)}) / ${PROBLEMS.length - 1})`,
    top: '0px',
    width: cq(CARD_W),
    height: cq(CARD_H),
    radius: cq(CARD_RADIUS),
    zIndex: slot + 1,
  })

  const placement = (index: number): Placement => {
    // 放大：被點的卡從自己的格子往上浮起放大，其餘六張完全不動（原本的
    // 格子就空著）；收合時再原路縮回同一格。未公開版沒有這段——七張卡
    // 全部留在原地，改由 UnpublishedPanel 浮在上方（設計稿 Variant3）。
    if (PROBLEMS_PUBLISHED && zoomed === index) {
      return {
        left: `calc(50% - ${cq(ZOOM_W / 2)})`,
        top: `calc(-1 * ${cq(ZOOM_RISE)})`,
        width: cq(ZOOM_W),
        height: cq(ZOOM_H),
        radius: cq(ZOOM_RADIUS),
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
        {!PROBLEMS_PUBLISHED && zoomed !== null && (
          <UnpublishedPanel onDismiss={() => setZoomed(null)} />
        )}
        {PROBLEMS.map((problem, index) => {
          const spot = placement(index)
          const isZoomed = PROBLEMS_PUBLISHED && zoomed === index
          return (
            // 卡片本身是 div，未放大時才鋪一層透明按鈕接點擊。放大卡裡有自己的
            // 按鈕與連結，若外層也是 button 會變成巢狀 button（無效的 HTML），
            // 且外層一旦 disabled 會連子元素的點擊一起吃掉。
            <div
              key={problem.sponsor}
              className={`ease-out-strong absolute overflow-hidden transition-all duration-700 ${
                isZoomed ? '' : 'hover:-translate-y-2'
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
                <ZoomedFace problem={problem} onClose={() => setZoomed(null)} />
              ) : (
                <>
                  <CardFace problem={isOpen ? problem : undefined} />
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
        {/* 未公開版的收合牌堆在設計稿裡沒有這行提示（白卡是空的） */}
        {PROBLEMS_PUBLISHED && (
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
        )}
      </div>
    </div>
  )
}
