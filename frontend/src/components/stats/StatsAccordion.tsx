import { useState } from 'react'
import { useGlassSuspend } from './useGlassSuspend'
import barStats from '../../assets/Stats/bar-collapsed-1.svg'
import barQuotes from '../../assets/Stats/bar-collapsed-2.svg'
import cardLink from '../../assets/Stats/card-link.svg'
import iconPlus from '../../assets/Stats/icon-plus.svg'
import iconMinus from '../../assets/Stats/icon-minus.svg'
import carouselArrow from '../../assets/Stats/carousel-arrow.svg'
import { TESTIMONIALS } from './testimonials'
import { RESULT_PLATFORM_URL } from './resultPlatform'
import statsChart from '../../assets/Stats/stats_chart.svg'

// 參賽數據(電腦) 378:362。設計稿元件寬 1222.14，頁面上的 instance（378:632）
// 放大到 1394（1440 版面左右各留 23）。故一律以元件座標系為基準，用 cq()
// 換成 cqw，整組手風琴才會隨容器等比縮放。
const DECK_W = 1222.141
const cq = (n: number) => `${((n / DECK_W) * 100).toFixed(4)}cqw`
const pctW = (n: number) => `${((n / DECK_W) * 100).toFixed(4)}%`

// 三塊面板的原始高度（= 各自 SVG 的 viewBox 高，比例務必保住，見下方註解）
const H_BAR_STATS = 248.782
const H_BAR_QUOTES = 220.794
const H_CARD = 653.053

// 收合時三塊面板的垂直節奏：面板頂端每隔 155.489 排一塊，但面板本身比這個
// 間距高，所以會互相重疊、疊成一落卡片（設計稿 378:404 的 y = 0 / 155.489 /
// 310.977）。重疊量就用負的 margin-bottom 做。
const STACK_STEP = 155.489

// 展開時：內容區與上方橫幅之間留 67.2、與下一條橫幅之間留 42.2
const OPEN_GAP_TOP = 67.218
const OPEN_GAP_BOTTOM = 42.21

// 這些 SVG 是 Figma 匯出的「填滿容器」版本（preserveAspectRatio="none" 加上
// width/height 100%），本身沒有內建長寬比。當成 <img> 又只給寬度時，瀏覽器
// 會退回預設的 300×150 替換元素比例，橫幅會被壓扁、圓餅圖會變成橢圓——所以
// 每張圖都必須自己補上 aspect-ratio。
const ratio = (w: number, h: number) => ({ aspectRatio: `${w} / ${h}` })

// +/− 按鈕（Frame 64/65）：74.6346 見方的素材，擺在 x=1119.52、距橫幅頂端
// 62.196 處，實際顯示 43.537 見方。
const ICON_SIZE = 43.537
const ICON_LEFT = 1119.519
const ICON_TOP = 62.196

// 橫幅標題（378:410）：Zen Antique 43.537 / 行高 32.959，帶星座光暈。
const BAR_TITLE_SIZE = 43.537
const BAR_TITLE_LEADING = 32.959

// 標題在橫幅內的垂直位置：素材上半部才是亮面，設計稿把字排在亮面中央而非
// 整塊面板的正中央，故用設計稿量到的「第一行中心」位置，不要改成置中。
const BAR_TITLE_CENTER = { stats: 84.479, quotes: 94.224, card: 91.111 }
const CARD_LINK_CENTER = 163.264

const barTitleGlow = [
  `0 0 ${cq(62.195)} rgba(255,255,255,0.5)`,
  `0 ${cq(12.439)} ${cq(124.391)} rgba(255,255,255,0.5)`,
  `0 ${cq(12.439)} ${cq(155.489)} rgba(255,255,255,0.5)`,
].join(', ')

const QUOTE_ROW_W = 843.452
const QUOTE_CARD_W = 645.127
const QUOTE_CARD_H = 444.522
const QUOTE_CARD_LEFT = 95.742
const QUOTE_CARD_RADIUS = 93.293

// 箭頭（Polygon 1/2）：節點框未旋轉時是 52.431×38.753，設計稿把它轉 ∓90°，
// 故實際占 38.753 寬、52.431 高。素材的 viewBox 是 273.366×257.025，三角形
// （45.406×29.064）只占正中央一小塊，其餘全是光暈留白——與圓餅同一個坑：
// 素材要照原尺寸擺、再把左上角推回一整圈留白，直接照節點框尺寸擺會讓箭頭
// 縮成幾個 px 的小點。
const QUOTE_ARROW_W = 52.431
const QUOTE_ARROW_H = 38.753
const QUOTE_ARROW_SVG_W = 273.366
const QUOTE_ARROW_SVG_H = 257.025
const QUOTE_ARROW_PAD_X = (QUOTE_ARROW_SVG_W - QUOTE_ARROW_W) / 2
// 三角形頂端貼齊節點框頂端，且陰影往下擴，故上下留白不等寬、不能用 /2。
const QUOTE_ARROW_PAD_Y = 104.862
const QUOTE_ARROW_LEFT = 36.473
const QUOTE_ARROW_RIGHT_LEFT = 761.386

// 內文（378:496）：Noto Sans 20 / 行高 26 / 輔助文字色02，靠左對齊。
const QUOTE_TEXT_W = 533.426
const QUOTE_TEXT_SIZE = 20
const QUOTE_TEXT_LEADING = 26

// 手風琴橫幅：金屬漸層 SVG 作為底、標題排在亮面、右側 +/− 按鈕。
function AccordionBar({
  src,
  height,
  title,
  titleCenter,
  isOpen,
  onToggle,
}: {
  src: string
  height: number
  title: string
  titleCenter: number
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="relative block w-full cursor-pointer transition hover:brightness-110"
      aria-expanded={isOpen}
    >
      <img
        src={src}
        alt=""
        className="block w-full"
        style={ratio(DECK_W, height)}
      />
      <span
        className="font-zen text-ink absolute left-1/2 w-full -translate-x-1/2 -translate-y-1/2 text-center"
        style={{
          top: `${((titleCenter / height) * 100).toFixed(4)}%`,
          fontSize: cq(BAR_TITLE_SIZE),
          lineHeight: cq(BAR_TITLE_LEADING),
          textShadow: barTitleGlow,
        }}
      >
        {title}
      </span>
      <img
        src={isOpen ? iconMinus : iconPlus}
        alt={isOpen ? '收合' : '展開'}
        className="absolute -translate-y-1/2"
        style={{
          left: pctW(ICON_LEFT),
          top: `${(((ICON_TOP + ICON_SIZE / 2) / height) * 100).toFixed(4)}%`,
          width: pctW(ICON_SIZE),
          aspectRatio: '1 / 1',
        }}
      />
    </button>
  )
}

function Collapsible({
  isOpen,
  children,
}: {
  isOpen: boolean
  children: React.ReactNode
}) {
  useGlassSuspend(isOpen)
  return (
    <div
      className="grid transition-[grid-template-rows] duration-500"
      style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
    >
      <div className="overflow-hidden">
        <div className="stats-layer">{children}</div>
      </div>
    </div>
  )
}

function PiePanel() {
  return (
    <img
      src={statsChart}
      alt="參賽者年級、黑客組科系、學校與創客組科系分布統計"
      className="mx-auto block w-full"
      style={{ aspectRatio: '1244 / 818' }}
    />
  )
}

// 左右切換鈕。外層 button 就是設計稿旋轉後的節點框（38.753×52.431），內層
// span 是未旋轉的節點框，img 則照素材原尺寸擺、往回推一圈光暈留白。
function QuoteArrow({
  side,
  onClick,
}: {
  side: 'prev' | 'next'
  onClick: () => void
}) {
  const isPrev = side === 'prev'
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isPrev ? '上一則感言' : '下一則感言'}
      className="absolute top-1/2 -translate-y-1/2 cursor-pointer transition hover:scale-110"
      style={{
        left: cq(isPrev ? QUOTE_ARROW_LEFT : QUOTE_ARROW_RIGHT_LEFT),
        width: cq(QUOTE_ARROW_H),
        height: cq(QUOTE_ARROW_W),
      }}
    >
      <span
        className="absolute top-1/2 left-1/2 block"
        style={{
          width: cq(QUOTE_ARROW_W),
          height: cq(QUOTE_ARROW_H),
          transform: `translate(-50%, -50%) rotate(${isPrev ? -90 : 90}deg)`,
        }}
      >
        <img
          src={carouselArrow}
          alt=""
          className="absolute max-w-none"
          style={{
            left: cq(-QUOTE_ARROW_PAD_X),
            top: cq(-QUOTE_ARROW_PAD_Y),
            width: cq(QUOTE_ARROW_SVG_W),
            height: cq(QUOTE_ARROW_SVG_H),
          }}
        />
      </span>
    </button>
  )
}

function TestimonialCarousel({
  quotes,
  attribution,
}: {
  quotes: string[]
  attribution?: string
}) {
  const [index, setIndex] = useState(0)
  const step = (delta: number) =>
    setIndex((index + delta + quotes.length) % quotes.length)

  return (
    <div
      className="relative mx-auto"
      style={{ width: pctW(QUOTE_ROW_W), height: cq(QUOTE_CARD_H) }}
    >
      <QuoteArrow side="prev" onClick={() => step(-1)} />
      {/* 感言卡（感言背景電腦 1991:77616）：深色玻璃 + 93.293 大圓角 */}
      <div
        className="glass-dark absolute top-0"
        style={{
          left: cq(QUOTE_CARD_LEFT),
          width: cq(QUOTE_CARD_W),
          height: cq(QUOTE_CARD_H),
          borderRadius: cq(QUOTE_CARD_RADIUS),
        }}
      >
        <p
          className="font-noto text-periwinkle absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-semibold [word-break:break-word]"
          style={{
            width: cq(QUOTE_TEXT_W),
            fontSize: cq(QUOTE_TEXT_SIZE),
            lineHeight: cq(QUOTE_TEXT_LEADING),
          }}
        >
          {quotes[index]}
        </p>
        {attribution && (
          <p
            className="font-noto absolute right-0 bottom-0 font-semibold"
            style={{
              right: cq(48),
              bottom: cq(20),
              color: '#D8D8D8',
              fontSize: cq(20),
              lineHeight: cq(26),
            }}
          >
            {attribution}
          </p>
        )}
      </div>
      <QuoteArrow side="next" onClick={() => step(1)} />
    </div>
  )
}

function GroupHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3
      className="font-zen text-periwinkle text-center"
      style={{
        fontSize: cq(BAR_TITLE_SIZE),
        lineHeight: cq(BAR_TITLE_LEADING * 1.6),
      }}
    >
      {children}
    </h3>
  )
}

export default function StatsAccordion() {
  const [openStats, setOpenStats] = useState(false)
  const [openQuotes, setOpenQuotes] = useState(false)

  // 收合時面板要互相重疊（見 STACK_STEP）；展開時讓出完整高度，內容才不會
  // 被下一塊面板蓋住。
  //
  // 這個負 margin 必須跟 Collapsible 的高度動畫「同時、同曲線」漸變。先前它是
  // 瞬間切換的：一按收合，marginBottom 立刻從 0 跳到負值，下面的內容瞬移上去
  // 一百多 px，接著高度才慢慢收 —— 那一下就是使用者看到的抖動。故下面兩塊
  // 都加上 transition-[margin-bottom] duration-500，與 Collapsible 的
  // duration-500 用同一組 Tailwind 預設緩動，兩段位移才會疊成一次平滑的收合。
  const overlap = (height: number, isOpen: boolean) =>
    isOpen ? '0px' : cq(STACK_STEP - height)

  return (
    <div className="@container w-full max-w-[1394px]">
      {/* 後面的面板要疊在前一塊之上，故 z-index 遞增 */}
      <div
        className="stats-layer relative z-[1] transition-[margin-bottom] duration-500"
        style={{ marginBottom: overlap(H_BAR_STATS, openStats) }}
      >
        <AccordionBar
          src={barStats}
          height={H_BAR_STATS}
          title="梅竹黑客松參賽數據"
          titleCenter={BAR_TITLE_CENTER.stats}
          isOpen={openStats}
          onToggle={() => setOpenStats(!openStats)}
        />
      </div>
      <Collapsible isOpen={openStats}>
        <div
          style={{
            paddingTop: cq(OPEN_GAP_TOP),
            paddingBottom: cq(OPEN_GAP_BOTTOM),
          }}
        >
          <PiePanel />
        </div>
      </Collapsible>

      <div
        className="stats-layer relative z-[2] transition-[margin-bottom] duration-500"
        style={{ marginBottom: overlap(H_BAR_QUOTES, openQuotes) }}
      >
        <AccordionBar
          src={barQuotes}
          height={H_BAR_QUOTES}
          title="參賽者感言"
          titleCenter={BAR_TITLE_CENTER.quotes}
          isOpen={openQuotes}
          onToggle={() => setOpenQuotes(!openQuotes)}
        />
      </div>
      <Collapsible isOpen={openQuotes}>
        <div
          className="flex flex-col"
          style={{
            paddingTop: cq(OPEN_GAP_TOP),
            paddingBottom: cq(OPEN_GAP_BOTTOM),
            gap: cq(48),
          }}
        >
          <GroupHeading>【黑客組】</GroupHeading>
          <TestimonialCarousel
            quotes={TESTIMONIALS.hacker}
            attribution="-來自2024黑客組參賽者"
          />
          <GroupHeading>【創客交流組】</GroupHeading>
          <TestimonialCarousel
            quotes={TESTIMONIALS.maker}
            attribution="-來自2024創客組參賽者"
          />
        </div>
      </Collapsible>

      {/* 成果平台網址（Frame 54）：常駐展開的高面板，用的是 card-link 素材，
          不是上面兩條矮橫幅 */}
      <div className="stats-layer relative z-[3]">
        <img
          src={cardLink}
          alt=""
          className="block w-full"
          style={ratio(DECK_W, H_CARD)}
        />
        <span
          className="font-zen text-ink absolute left-1/2 w-full -translate-x-1/2 -translate-y-1/2 text-center"
          style={{
            top: `${((BAR_TITLE_CENTER.card / H_CARD) * 100).toFixed(4)}%`,
            fontSize: cq(BAR_TITLE_SIZE),
            lineHeight: cq(BAR_TITLE_LEADING),
            textShadow: barTitleGlow,
          }}
        >
          成果平台網址
        </span>
        <a
          href={RESULT_PLATFORM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-zen text-periwinkle absolute left-1/2 w-full -translate-x-1/2 -translate-y-1/2 text-center underline-offset-4 transition hover:underline"
          style={{
            top: `${((CARD_LINK_CENTER / H_CARD) * 100).toFixed(4)}%`,
            fontSize: cq(34.208),
            lineHeight: cq(40.427),
          }}
        >
          點擊文字即可進入
        </a>
      </div>
    </div>
  )
}
