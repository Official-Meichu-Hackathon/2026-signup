import { useState } from 'react'
import barStats from '../../assets/Stats/bar-collapsed-1.svg'
import barQuotes from '../../assets/Stats/bar-collapsed-2.svg'
import cardLink from '../../assets/Stats/card-link.svg'
import iconPlus from '../../assets/Stats/icon-plus.svg'
import iconMinus from '../../assets/Stats/icon-minus.svg'
import pieGrade from '../../assets/Stats/pie-grade.svg'
import pieSchool from '../../assets/Stats/pie-school.svg'
import pieDeptHacker from '../../assets/Stats/pie-dept-hacker.svg'
import pieDeptMaker from '../../assets/Stats/pie-dept-maker.svg'
import carouselArrow from '../../assets/Stats/carousel-arrow.svg'
import { TESTIMONIALS } from './testimonials'
import { RESULT_PLATFORM_URL } from './resultPlatform'

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

// 圓餅圖面板（Frame 39 378:422）：941×673.79 的深色圓角面板，四張圓餅並非
// 整齊的 2×2，下排整體往左偏約半格，是設計稿刻意的錯落排列。座標與尺寸都
// 換算成面板自身的百分比，面板縮放時才會整體等比跟著動。
const PIE_PANEL_W = 940.998
const PIE_PANEL_H = 673.792

// 圓的直徑 = 設計稿 Frame 90–93（378:423 等）的邊長。
const PIE_BOX = 239.467

const px = (n: number) => `${((n / PIE_PANEL_W) * 100).toFixed(4)}%`
const py = (n: number) => `${((n / PIE_PANEL_H) * 100).toFixed(4)}%`

// 圓餅素材的 viewBox 是 478.935 見方，圓本身只占正中央的 239.467，四周留白是
// 給 filter0_ddd 光暈用的。故整張圖要照 478.935 擺（= 圓的兩倍），再把左上角
// 往回推一整圈留白，圓才會落在設計稿標定的位置與大小；直接照 239.467 擺會讓
// 圓只剩設計稿的一半大。
const PIE_SVG = 478.935

// 圓心在 viewBox 裡是 (239.467, 229.889)：水平置中，垂直則因為兩層陰影的
// dy=9.5787 讓 Figma 把匯出範圍往下擴，圓相對整張圖偏上，故上下留白不等寬。
const PIE_PAD_X = 239.467 - PIE_BOX / 2
const PIE_PAD_Y = 229.889 - PIE_BOX / 2
const PIES = [
  {
    src: pieGrade,
    label: '參賽者年級比',
    tag: '',
    left: 250.265,
    top: 92.406,
    // 標題（378:439–442）：上排在圓餅上方、下排在圓餅下方
    labelLeft: 175.571,
    labelTop: 63.914,
    labelWidth: 193.969,
  },
  {
    src: pieDeptHacker,
    label: '參賽者科系分佈',
    tag: '【黑客組】',
    left: 604.487,
    top: 97.796,
    labelLeft: 542.883,
    labelTop: 57.754,
    labelWidth: 160.94,
  },
  {
    src: pieSchool,
    label: '參賽者學校分佈',
    tag: '',
    left: 87.015,
    top: 352.682,
    labelLeft: 198.672,
    labelTop: 599.867,
    labelWidth: 215.521,
  },
  {
    src: pieDeptMaker,
    label: '參賽者科系分佈',
    tag: '【創客交流組】',
    left: 434.307,
    top: 352.682,
    labelLeft: 616.808,
    labelTop: 592.167,
    labelWidth: 157.09,
  },
]

const PIE_LABEL_SIZE = 20.021
const PIE_LABEL_LEADING = 30.802

// 感言區塊（黑客組感言電腦 570:1405、創客組感言電腦 570:1413，同一個元件）。
// 元件框是 843.452×786.462，但卡片只占其中 y=166.258 起的 444.522——上下那
// 兩段透明留白是設計稿拿來讓【黑客組】標題壓上去的，兩個 instance 因此在設計
// 稿裡是互相重疊的。這裡只實作看得見的這一列，標題間距仍交給外層的 flex gap。
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
  return (
    <div
      className="grid transition-[grid-template-rows] duration-500"
      style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
    >
      <div className="overflow-hidden">{children}</div>
    </div>
  )
}

function PiePanel() {
  return (
    // 圓餅素材放大到 478.935 後，光暈會溢出面板 12–47px；設計稿的 Frame 39
    // 本身會裁切內容，故這裡也要 overflow-hidden，讓光暈收在圓角面板內。
    <div
      className="glass-dark relative mx-auto overflow-hidden"
      style={{
        width: pctW(PIE_PANEL_W),
        ...ratio(PIE_PANEL_W, PIE_PANEL_H),
        borderRadius: cq(40),
      }}
    >
      {PIES.map((pie) => (
        <div key={pie.label + pie.tag}>
          <img
            src={pie.src}
            alt={pie.label + pie.tag}
            className="absolute"
            style={{
              left: px(pie.left - PIE_PAD_X),
              top: py(pie.top - PIE_PAD_Y),
              width: px(PIE_SVG),
              aspectRatio: '1 / 1',
            }}
          />
          <p
            className="font-noto text-ink absolute text-center font-semibold"
            style={{
              left: px(pie.labelLeft),
              top: py(pie.labelTop),
              width: px(pie.labelWidth),
              fontSize: cq(PIE_LABEL_SIZE),
              lineHeight: cq(PIE_LABEL_LEADING),
            }}
          >
            <span className="block">{pie.label}</span>
            {pie.tag && (
              <span className="text-periwinkle block">{pie.tag}</span>
            )}
          </p>
        </div>
      ))}
    </div>
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

function TestimonialCarousel({ quotes }: { quotes: string[] }) {
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
  const overlap = (height: number, isOpen: boolean) =>
    isOpen ? '0px' : cq(STACK_STEP - height)

  return (
    <div className="@container w-full max-w-[1394px]">
      {/* 後面的面板要疊在前一塊之上，故 z-index 遞增 */}
      <div
        className="relative z-[1]"
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
        className="relative z-[2]"
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
          <TestimonialCarousel quotes={TESTIMONIALS.hacker} />
          <GroupHeading>【創客交流組】</GroupHeading>
          <TestimonialCarousel quotes={TESTIMONIALS.maker} />
        </div>
      </Collapsible>

      {/* 成果平台網址（Frame 54）：常駐展開的高面板，用的是 card-link 素材，
          不是上面兩條矮橫幅 */}
      <div className="relative z-[3]">
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
