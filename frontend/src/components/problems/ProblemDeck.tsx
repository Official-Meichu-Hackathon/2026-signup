import { useEffect, useRef, useState } from 'react'
import { PROBLEMS, HASHTAG_NOTE, type Problem } from '../../data/problems'
import { useProblemsPublished } from '../../hooks/useProblemsPublished'
import cardBack from '../../assets/Problems/card-back.png'
import cardDecor from '../../assets/Problems/card-decor.svg'
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
// 企業名、分隔線、內文區、閱讀完畢。內文區依 published 分支：
//   已公開（810:15346 版）：題目全文 ＋「詳細題目說明」PDF 連結
//   未公開（1601:61961 版）：3 行 hashtag ＋「完整題目將於比賽當日公開」
// 百分比皆由設計稿的卡片座標系（662.4×1186.4）換算而來。
function ZoomedFace({
  problem,
  published,
  onClose,
}: {
  problem: Problem
  published: boolean
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

      {published ? (
        <>
          {/* 題目全文（內文：Noto Sans SemiBold 20/26，主色 #2D3E63），上緣
              定位。高度上限取到「詳細題目說明」之前，長題目以捲動處理 */}
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

          {/* TODO: 詳細題目說明的 PDF 網址待主辦提供 */}
          <a
            href="#"
            onClick={(event) => event.preventDefault()}
            className="font-noto text-periwinkle absolute top-[52.03%] left-1/2 flex h-[8.09%] w-[41.97%] -translate-x-1/2 -translate-y-1/2 items-center justify-center text-center font-semibold hover:underline"
            style={{ fontSize: cq(zpx(20)), lineHeight: cq(zpx(26)) }}
          >
            詳細題目說明&gt;&gt;
          </a>
        </>
      ) : (
        <>
          {/* hashtag（小標題：Noto Sans SemiBold 25/40，主色 #2D3E63）。
              設計稿為 3 行置中，上緣定位在題目全文的相同起點 */}
          <div
            className="font-noto text-darkblue absolute top-[35.02%] left-1/2 flex w-[72.46%] -translate-x-1/2 flex-col items-center text-center font-semibold"
            style={{ fontSize: cq(zpx(25)), lineHeight: cq(zpx(40)) }}
          >
            {problem.hashtags.map((tag, index) => (
              <p key={`${tag}-${index}`}>{tag}</p>
            ))}
          </div>

          {/* 完整題目將於比賽當日公開（內文 20/26，輔助文字色 #A5BDE2） */}
          <p
            className="font-noto text-periwinkle absolute top-[52.03%] left-1/2 w-[72.46%] -translate-x-1/2 -translate-y-1/2 text-center font-semibold"
            style={{ fontSize: cq(zpx(20)), lineHeight: cq(zpx(26)) }}
          >
            {HASHTAG_NOTE}
          </p>
        </>
      )}

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

interface Placement {
  left: string
  top: string
  width: string
  height: string
  radius: string
  zIndex: number
}

export default function ProblemDeck() {
  const published = useProblemsPublished()
  const [isOpen, setIsOpen] = useState(false)
  const [zoomed, setZoomed] = useState<number | null>(null)
  const deckRef = useRef<HTMLDivElement>(null)
  const prevZoomed = useRef<number | null>(null)

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
    const rise = (ZOOM_RISE / DECK_W) * box.width
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
    // 格子就空著）；收合時再原路縮回同一格。已公開／未公開流程相同。
    if (zoomed === index) {
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
        {PROBLEMS.map((problem, index) => {
          const spot = placement(index)
          const isZoomed = zoomed === index
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
                <ZoomedFace
                  problem={problem}
                  published={published}
                  onClose={() => setZoomed(null)}
                />
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
