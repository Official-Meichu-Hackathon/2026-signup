import { useState } from 'react'
import barStats from '../../assets/Stats/m-bar-stats.svg'
import barQuotes from '../../assets/Stats/m-bar-quotes.svg'
import cardLink from '../../assets/Stats/m-card-link.svg'
import iconPlus from '../../assets/Stats/m-icon-plus.svg'
import iconMinus from '../../assets/Stats/m-icon-minus.svg'
import pieGrade from '../../assets/Stats/pie-grade.svg'
import pieSchool from '../../assets/Stats/pie-school.svg'
import pieDeptHacker from '../../assets/Stats/pie-dept-hacker.svg'
import pieDeptMaker from '../../assets/Stats/pie-dept-maker.svg'
import carouselArrow from '../../assets/Stats/carousel-arrow.svg'
import { TESTIMONIALS } from './testimonials'
import { RESULT_PLATFORM_URL } from './resultPlatform'

// 參賽數據(手機) 165:1219。設計稿是一個 393 寬的元件，四個 variant 分別是
// 兩條手風琴的開合組合（Frame 61 全收 / 62 開數據 / 63 開感言 / 60 全開）。
// 一律以 393 為基準用 mq() 換成 cqw，整組才會隨容器等比縮放。
const M_W = 393
const mq = (n: number) => `${((n / M_W) * 100).toFixed(4)}cqw`
const pct = (n: number) => `${((n / M_W) * 100).toFixed(4)}%`

// 這些 SVG 是 Figma 匯出的「填滿容器」版本，本身沒有內建長寬比，當成 <img>
// 又只給寬度時瀏覽器會退回 300×150，故每張都要自己補 aspect-ratio。
const ratio = (w: number, h: number) => ({ aspectRatio: `${w} / ${h}` })

const H_BAR_STATS = 80
const H_BAR_QUOTES = 71
const H_CARD_LINK = 210

// 收合時三塊面板的頂端每隔 50px 排一塊（Frame 61 的 y = 0 / 50 / 100），
// 面板本身比這個間距高，所以會互相重疊、疊成一落卡片。
const STACK_STEP = 50

// 副標題(手機版)：Zen Antique 14 / 行高 15.6，帶星座光暈。
const BAR_TITLE_SIZE = 14
const BAR_TITLE_LEADING = 15.6

// 標題在橫幅內的垂直位置：與電腦版同理，素材上半部才是亮面，設計稿把字排在
// 亮面而非整塊面板正中央。設計稿的文字框是靠上對齊，故「第一行中心」= 框頂
// + 行高的一半，不要改成置中。
const BAR_TITLE_CENTER = {
  stats: 23 + BAR_TITLE_LEADING / 2,
  quotes: 25 + BAR_TITLE_LEADING / 2,
  link: 24 + BAR_TITLE_LEADING / 2,
}

// 小標題(手機版)：Noto Sans Medium 11 / 行高 13
const LINK_SUB_SIZE = 11
const LINK_SUB_LEADING = 13
const LINK_SUB_CENTER = 46 + LINK_SUB_LEADING / 2

// +/− 按鈕（Frame 64/65）：節點框 14×14，擺在 x=360、距橫幅頂端 20。素材
// 外擴到 24 寬以容納光暈，故照 24 擺、左右各推回 5；「＋」是 24×24（上下也
// 各推 5），「－」只有 24×14（上下不外擴）。
const ICON_BOX = 14
const ICON_LEFT = 360
const ICON_TOP = 20
const ICON_SVG_W = 24
const ICON_PLUS_SVG_H = 24
const ICON_MINUS_SVG_H = 14
const ICON_PAD = (ICON_SVG_W - ICON_BOX) / 2

const barTitleGlow = [
  '0 0 20px rgba(255,255,255,0.5)',
  '0 4px 40px rgba(255,255,255,0.5)',
  '0 4px 50px rgba(255,255,255,0.5)',
].join(', ')

// 圓餅圖面板（Frame 39 165:1284）：283×655 的深色圓角面板，四張圓餅在手機版
// 改成直向排列（電腦版是 2×2 錯落），每張標題都在自己的圓餅上方。
const PIE_PANEL_W = 283
const PIE_PANEL_H = 655
const PIE_PANEL_RADIUS = 20
// 面板頂端在橫幅頂端下方 75，而橫幅本身高 80，故內容區要往上收 5。
const OPEN_GAP_TOP = 75 - H_BAR_STATS
const OPEN_GAP_BOTTOM = 35

const px = (n: number) => `${((n / PIE_PANEL_W) * 100).toFixed(4)}%`
const py = (n: number) => `${((n / PIE_PANEL_H) * 100).toFixed(4)}%`

// 與電腦版同一個坑：素材 viewBox 是圓的兩倍（設計稿的 img inset 是
// -50%/-46%/-50%/-54%，即整張圖佔節點框的 200%），四周留白是光暈用的。
// 直接照 100 擺會讓圓只剩設計稿的一半大。
const PIE_BOX = 100
const PIE_SVG = PIE_BOX * 2
const PIE_PAD_X = PIE_BOX * 0.5
// 陰影 dy 讓匯出範圍往下擴，圓相對整張圖偏上，故上下留白不等寬。
const PIE_PAD_Y = PIE_BOX * 0.46

// 三級標題(手機版)：Noto Sans Medium 12 / 行高 12
const PIE_LABEL_SIZE = 12
const PIE_LABEL_LEADING = 12

const PIES = [
  {
    src: pieGrade,
    label: '參賽者年級比',
    tag: '',
    top: 60,
    labelCenter: 40,
    labelWidth: 81,
  },
  {
    src: pieSchool,
    label: '參賽者學校分佈',
    tag: '',
    top: 202,
    labelCenter: 181,
    labelWidth: 90,
  },
  {
    src: pieDeptHacker,
    label: '參賽者科系分佈',
    tag: '【黑客組】',
    top: 361,
    labelCenter: 332.5,
    labelWidth: 90,
  },
  {
    src: pieDeptMaker,
    label: '參賽者科系分佈',
    tag: '【創客交流組】',
    top: 520,
    labelCenter: 484,
    labelWidth: 90,
  },
]
const PIE_LEFT = 92

// 感言區塊（黑客組感言手機 366:306）：元件框 370×345，卡片只占其中 y=75 起
// 的 283×195，上下留白是設計稿拿來讓【黑客組】標題壓上去的。這裡只實作看得見
// 的那一列，標題間距交給外層 flex。
const QUOTE_ROW_W = 370
const QUOTE_CARD_W = 283
const QUOTE_CARD_H = 195
const QUOTE_CARD_LEFT = 42
const QUOTE_CARD_RADIUS = 30
const QUOTE_TEXT_W = 234
// 內文(手機版)：Noto Sans Medium 10 / 行高 14
const QUOTE_TEXT_SIZE = 10
const QUOTE_TEXT_LEADING = 14

// 箭頭沿用電腦版的 carousel-arrow.svg。手機版的節點框是 23×17，正好是電腦版
// 52.431×38.753 的 0.4387 倍，故素材尺寸與光暈留白照同一個比例縮。
const QUOTE_ARROW_W = 23
const QUOTE_ARROW_H = 17
const ARROW_SCALE = QUOTE_ARROW_W / 52.431
const QUOTE_ARROW_SVG_W = 273.366 * ARROW_SCALE
const QUOTE_ARROW_SVG_H = 257.025 * ARROW_SCALE
const QUOTE_ARROW_PAD_X = 110.4675 * ARROW_SCALE
const QUOTE_ARROW_PAD_Y = 104.862 * ARROW_SCALE
const QUOTE_ARROW_LEFT = 16
const QUOTE_ARROW_RIGHT_LEFT = 334

// 感言區塊的垂直節奏（Frame 94 165:1331，座標換算成「距橫幅底端」）
const QUOTES_PAD_TOP = 22
const QUOTES_HEADING_GAP = 29
const QUOTES_GROUP_GAP = 55
const QUOTES_PAD_BOTTOM = 79

const GROUP_HEADING_SIZE = 12
const GROUP_HEADING_LEADING = 12

// 手風琴橫幅：金屬漸層 SVG 作底、標題排在亮面、右上角 +/− 按鈕。
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
      className="relative block w-full cursor-pointer"
      aria-expanded={isOpen}
    >
      <img
        src={src}
        alt=""
        className="block w-full"
        style={ratio(M_W, height)}
      />
      <span
        className="font-zen text-ink absolute left-1/2 w-full -translate-x-1/2 -translate-y-1/2 text-center"
        style={{
          top: `${((titleCenter / height) * 100).toFixed(4)}%`,
          fontSize: mq(BAR_TITLE_SIZE),
          lineHeight: mq(BAR_TITLE_LEADING),
          textShadow: barTitleGlow,
        }}
      >
        {title}
      </span>
      <span
        className="absolute block"
        style={{
          left: pct(ICON_LEFT - ICON_PAD),
          top: `${((ICON_TOP - (isOpen ? 0 : ICON_PAD)) / height) * 100}%`,
          width: pct(ICON_SVG_W),
        }}
      >
        <img
          src={isOpen ? iconMinus : iconPlus}
          alt={isOpen ? '收合' : '展開'}
          className="block w-full"
          style={ratio(ICON_SVG_W, isOpen ? ICON_MINUS_SVG_H : ICON_PLUS_SVG_H)}
        />
      </span>
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
    <div className={isOpen ? 'block' : 'hidden'}>
      <div className="overflow-hidden">{children}</div>
    </div>
  )
}

function PiePanel() {
  return (
    <div
      className="glass-dark relative mx-auto overflow-hidden"
      style={{
        width: pct(PIE_PANEL_W),
        ...ratio(PIE_PANEL_W, PIE_PANEL_H),
        borderRadius: mq(PIE_PANEL_RADIUS),
      }}
    >
      {PIES.map((pie) => (
        <div key={pie.label + pie.tag}>
          <img
            src={pie.src}
            alt={pie.label + pie.tag}
            className="absolute max-w-none"
            style={{
              left: px(PIE_LEFT - PIE_PAD_X),
              top: py(pie.top - PIE_PAD_Y),
              width: px(PIE_SVG),
              aspectRatio: '1 / 1',
            }}
          />
          <p
            className="font-noto text-ink absolute left-1/2 -translate-x-1/2 -translate-y-1/2 text-center font-medium"
            style={{
              top: py(pie.labelCenter),
              width: px(pie.labelWidth),
              fontSize: mq(PIE_LABEL_SIZE),
              lineHeight: mq(PIE_LABEL_LEADING),
            }}
          >
            <span>{pie.label}</span>
            {pie.tag && <span className="text-periwinkle">{pie.tag}</span>}
          </p>
        </div>
      ))}
    </div>
  )
}

// 左右切換鈕。外層是旋轉後的節點框（17 寬 23 高），內層是未旋轉的 23×17，
// img 則照素材原尺寸擺、再往回推一圈光暈留白。
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
      className="absolute top-1/2 -translate-y-1/2 cursor-pointer"
      style={{
        left: mq(isPrev ? QUOTE_ARROW_LEFT : QUOTE_ARROW_RIGHT_LEFT),
        width: mq(QUOTE_ARROW_H),
        height: mq(QUOTE_ARROW_W),
      }}
    >
      <span
        className="absolute top-1/2 left-1/2 block"
        style={{
          width: mq(QUOTE_ARROW_W),
          height: mq(QUOTE_ARROW_H),
          transform: `translate(-50%, -50%) rotate(${isPrev ? -90 : 90}deg)`,
        }}
      >
        <img
          src={carouselArrow}
          alt=""
          className="absolute max-w-none"
          style={{
            left: mq(-QUOTE_ARROW_PAD_X),
            top: mq(-QUOTE_ARROW_PAD_Y),
            width: mq(QUOTE_ARROW_SVG_W),
            height: mq(QUOTE_ARROW_SVG_H),
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
      style={{ width: pct(QUOTE_ROW_W), height: mq(QUOTE_CARD_H) }}
    >
      <QuoteArrow side="prev" onClick={() => step(-1)} />
      {/* 感言卡（感言背景手機 1991:4181）：深色玻璃 + 30 圓角 */}
      <div
        className="glass-dark absolute top-0"
        style={{
          left: `${((QUOTE_CARD_LEFT / QUOTE_ROW_W) * 100).toFixed(4)}%`,
          width: `${((QUOTE_CARD_W / QUOTE_ROW_W) * 100).toFixed(4)}%`,
          height: mq(QUOTE_CARD_H),
          borderRadius: mq(QUOTE_CARD_RADIUS),
        }}
      >
        <p
          className="font-noto text-periwinkle absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-medium [word-break:break-word]"
          style={{
            width: mq(QUOTE_TEXT_W),
            fontSize: mq(QUOTE_TEXT_SIZE),
            lineHeight: mq(QUOTE_TEXT_LEADING),
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
      className="font-noto text-periwinkle text-center font-medium"
      style={{
        fontSize: mq(GROUP_HEADING_SIZE),
        lineHeight: mq(GROUP_HEADING_LEADING),
      }}
    >
      {children}
    </h3>
  )
}

export default function MobileStatsAccordion() {
  const [openStats, setOpenStats] = useState(false)
  const [openQuotes, setOpenQuotes] = useState(false)

  // 收合時面板要互相重疊（見 STACK_STEP）；展開時讓出完整高度，內容才不會被
  // 下一塊面板蓋住。
  const overlap = (height: number, isOpen: boolean) =>
    isOpen ? '0px' : mq(STACK_STEP - height)

  return (
    <div className="@container w-full">
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
            // OPEN_GAP_TOP 是負的（面板要往上壓進橫幅 5px），padding 不吃負值，
            // 必須用 margin。
            marginTop: mq(OPEN_GAP_TOP),
            paddingBottom: mq(OPEN_GAP_BOTTOM),
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
            paddingTop: mq(QUOTES_PAD_TOP),
            paddingBottom: mq(QUOTES_PAD_BOTTOM),
            gap: mq(QUOTES_GROUP_GAP),
          }}
        >
          <div
            className="flex flex-col"
            style={{ gap: mq(QUOTES_HEADING_GAP) }}
          >
            <GroupHeading>【黑客組】</GroupHeading>
            <TestimonialCarousel quotes={TESTIMONIALS.hacker} />
          </div>
          <div
            className="flex flex-col"
            style={{ gap: mq(QUOTES_HEADING_GAP) }}
          >
            <GroupHeading>【創客交流組】</GroupHeading>
            <TestimonialCarousel quotes={TESTIMONIALS.maker} />
          </div>
        </div>
      </Collapsible>

      {/* 成果平台網址（Frame 54）：常駐展開的高面板，用的是 card-link 素材 */}
      <div className="relative z-[3]">
        <img
          src={cardLink}
          alt=""
          className="block w-full"
          style={ratio(M_W, H_CARD_LINK)}
        />
        <span
          className="font-zen text-ink absolute left-1/2 w-full -translate-x-1/2 -translate-y-1/2 text-center"
          style={{
            top: `${((BAR_TITLE_CENTER.link / H_CARD_LINK) * 100).toFixed(4)}%`,
            fontSize: mq(BAR_TITLE_SIZE),
            lineHeight: mq(BAR_TITLE_LEADING),
            textShadow: barTitleGlow,
          }}
        >
          成果平台網址
        </span>
        <a
          href={RESULT_PLATFORM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-noto text-periwinkle absolute left-1/2 w-full -translate-x-1/2 -translate-y-1/2 text-center font-medium underline-offset-4"
          style={{
            top: `${((LINK_SUB_CENTER / H_CARD_LINK) * 100).toFixed(4)}%`,
            fontSize: mq(LINK_SUB_SIZE),
            lineHeight: mq(LINK_SUB_LEADING),
          }}
        >
          點擊文字即可進入
        </a>
      </div>
    </div>
  )
}
