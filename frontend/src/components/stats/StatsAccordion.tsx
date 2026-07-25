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

// 參賽者感言 — 設計稿目前僅一則示意文字，之後換成歷屆參賽者真實回饋。
const TESTIMONIALS: Record<'hacker' | 'maker', string[]> = {
  hacker: [
    '“參加梅竹黑客松讓我們非常有成就感！我們花了很多時間鑽研自己未曾涉足的領域，通過團隊討論與協作嘗試新技術，也從中收穫不少知識和經驗，並且也順利在比賽中取得佳績，這讓大家都很滿足。”',
  ],
  maker: [
    '“參加梅竹黑客松讓我們非常有成就感！我們花了很多時間鑽研自己未曾涉足的領域，通過團隊討論與協作嘗試新技術，也從中收穫不少知識和經驗，並且也順利在比賽中取得佳績，這讓大家都很滿足。”',
  ],
}

// 圓餅圖面板（Frame 39 378:422）：941×673.79 的深色圓角面板，四張圓餅並非
// 整齊的 2×2，下排整體往左偏約半格，是設計稿刻意的錯落排列。座標與尺寸都
// 換算成面板自身的百分比，面板縮放時才會整體等比跟著動。
const PIE_PANEL_W = 940.998
const PIE_PANEL_H = 673.792
const PIE_BOX = 239.467

const px = (n: number) => `${((n / PIE_PANEL_W) * 100).toFixed(4)}%`
const py = (n: number) => `${((n / PIE_PANEL_H) * 100).toFixed(4)}%`

// 圓餅素材的 viewBox 是 478.935 見方，圓本身只占中間約一半，四周留白是給
// 光暈用的，所以整張圖照 239.4674 見方擺就會與設計稿一致。
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
    <div
      className="glass-dark relative mx-auto"
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
              left: px(pie.left),
              top: py(pie.top),
              width: px(PIE_BOX),
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

function TestimonialCarousel({ quotes }: { quotes: string[] }) {
  const [index, setIndex] = useState(0)
  const step = (delta: number) =>
    setIndex((index + delta + quotes.length) % quotes.length)

  return (
    <div
      className="mx-auto flex items-center justify-center"
      style={{ width: pctW(843.45), gap: cq(24) }}
    >
      <button
        type="button"
        onClick={() => step(-1)}
        aria-label="上一則感言"
        className="shrink-0 cursor-pointer transition hover:scale-110"
      >
        <img
          src={carouselArrow}
          alt=""
          className="-rotate-90"
          style={{ width: cq(46), ...ratio(273.366, 257.025) }}
        />
      </button>
      {/* 感言卡（黑客組感言電腦 570:1405）：設計稿是深色圓角卡，不是亮面玻璃 */}
      <div
        className="glass-dark flex flex-1 items-center justify-center"
        style={{
          borderRadius: cq(40),
          paddingInline: cq(56),
          paddingBlock: cq(48),
          minHeight: cq(300),
        }}
      >
        <p
          className="font-noto text-ink text-center font-semibold"
          style={{
            fontSize: cq(PIE_LABEL_SIZE),
            lineHeight: cq(PIE_LABEL_LEADING),
          }}
        >
          {quotes[index]}
        </p>
      </div>
      <button
        type="button"
        onClick={() => step(1)}
        aria-label="下一則感言"
        className="shrink-0 cursor-pointer transition hover:scale-110"
      >
        <img
          src={carouselArrow}
          alt=""
          className="rotate-90"
          style={{ width: cq(46), ...ratio(273.366, 257.025) }}
        />
      </button>
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
        {/* TODO: 成果平台上線後補上正式網址 */}
        <a
          href="#"
          onClick={(event) => event.preventDefault()}
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
