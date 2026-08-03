import { useEffect, useState } from 'react'
import { useGlassSuspend } from './useGlassSuspend'
import barStats from '../../assets/Stats/m-bar-stats.svg'
import barQuotes from '../../assets/Stats/m-bar-quotes.svg'
import cardLink from '../../assets/Stats/m-card-link.svg'
import iconPlus from '../../assets/Stats/m-icon-plus.svg'
import iconMinus from '../../assets/Stats/m-icon-minus.svg'
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

const OPEN_GAP_TOP = 75 - H_BAR_STATS
const OPEN_GAP_BOTTOM = 35

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

// 與電腦版同一套收合動畫：用 grid-template-rows 1fr↔0fr 撐開／收起（純 CSS 就能
// 對未知高度做動畫），並在動畫期間暫停玻璃材質的 backdrop-filter，否則每一幀都要
// 重算模糊，收合會卡頓。useGlassSuspend 與電腦版共用同一份，見該檔註解。
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

// 圓餅圖素材是 343×715：可見的深色面板是 283×655（Frame 39，x30 y20、圓角 20），
// 四周各留 30／20 給投影與光暈。先前用 w-full 貼滿 393 的容器，面板會被放大成 324
// 寬 —— 比設計稿寬 41px，也比正下方同一組的感言卡（QUOTE_CARD_W 283）寬一截。
const PIE_SVG_W = 343
const PIE_SVG_H = 715
const PIE_PANEL_W = 283
const PIE_PANEL_H = 655
const PIE_PANEL_X = 30
const PIE_PANEL_Y = 20
const PIE_PANEL_RADIUS = 20

const svgPctX = (n: number) => `${((n / PIE_SVG_W) * 100).toFixed(4)}%`
const svgPctY = (n: number) => `${((n / PIE_SVG_H) * 100).toFixed(4)}%`

function PiePanel() {
  // 素材有 422KB，靜態 import 會被併進主 JS chunk，連首頁訪客都得下載。改成動態
  // 載入切出獨立 chunk。PiePanel 在收合狀態下也是掛著的（Collapsible 只是把高度
  // 收到 0），所以進頁面就會開始抓，使用者展開手風琴時通常早就好了。
  const [markup, setMarkup] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    import('./statsChartMobileMarkup').then((module) => {
      if (!cancelled) setMarkup(module.default)
    })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div
      className="relative mx-auto"
      style={{ width: pct(PIE_SVG_W), ...ratio(PIE_SVG_W, PIE_SVG_H) }}
    >
      {/* 玻璃面板必須是圓餅圖的「背景」而不是「祖先」：backdrop-filter 會另建合成
          層，把圖包進去等於又走回當初讓字變糊的那條路。素材還沒到的時候，這塊
          先撐住版面，不會有空洞。 */}
      <div
        className="glass-dark absolute"
        style={{
          left: svgPctX(PIE_PANEL_X),
          top: svgPctY(PIE_PANEL_Y),
          width: svgPctX(PIE_PANEL_W),
          height: svgPctY(PIE_PANEL_H),
          borderRadius: mq(PIE_PANEL_RADIUS),
        }}
      />
      {/* 內嵌 <svg> 而不是 <img>：WebKit 對 <img> 載入的 SVG 走 SVGImage 那條路，
          點陣化解析度跟一般繪製管線不同，是 iOS 上向量圖變糊的常見成因。內容是
          建置時就固定的自家素材，沒有外部輸入。 */}
      {markup && (
        <div
          className="stats-chart-inline absolute inset-0"
          role="img"
          aria-label="參賽者年級、黑客組科系、學校與創客組科系分布統計"
          dangerouslySetInnerHTML={{ __html: markup }}
        />
      )}
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
        {attribution && (
          <p
            className="font-noto absolute right-0 bottom-0 font-medium"
            style={{
              right: mq(21),
              bottom: mq(9),
              color: '#D8D8D8',
              fontSize: mq(10),
              lineHeight: mq(13),
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
  //
  // 這個負 margin 必須跟 Collapsible 的高度動畫「同時、同曲線」漸變。若讓它瞬間
  // 切換，一按收合 marginBottom 會立刻從 0 跳到負值、下面的內容瞬移上去，接著高度
  // 才慢慢收 —— 電腦版先前就是這個抖動。故下面兩塊都加上
  // transition-[margin-bottom] duration-500，與 Collapsible 用同一組緩動。
  const overlap = (height: number, isOpen: boolean) =>
    isOpen ? '0px' : mq(STACK_STEP - height)

  return (
    <div className="@container w-full">
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
            <TestimonialCarousel
              quotes={TESTIMONIALS.hacker}
              attribution="-來自2024黑客組參賽者"
            />
          </div>
          <div
            className="flex flex-col"
            style={{ gap: mq(QUOTES_HEADING_GAP) }}
          >
            <GroupHeading>【創客交流組】</GroupHeading>
            <TestimonialCarousel
              quotes={TESTIMONIALS.maker}
              attribution="-來自2024創客組參賽者"
            />
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
