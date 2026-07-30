import { useState, type ReactNode } from 'react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import CursorTrail from '../components/layout/CursorTrail'
import bgHero from '../assets/RegistrationMethod/bg-hero.png'
import bgContent from '../assets/RegistrationMethod/bg-content.jpg'

// Fluid clamp(min, preferred, max) built from the mobile (390px, node
// 1221:61439) and desktop (1460px, node 104:327) Figma frames — same
// approach as Footer.tsx/MobileNavMenu.tsx — 注意事項.txt: "width height
// 盡量用 vw vh 來寫，不要寫死 (RWD 會出事)".
const fluid = (minPx: number, maxPx: number) => {
  const minVw = 390
  const maxVw = 1460
  const slope = (maxPx - minPx) / (maxVw - minVw)
  const intercept = minPx - slope * minVw
  return `clamp(${minPx}px, ${intercept.toFixed(2)}px + ${(slope * 100).toFixed(4)}vw, ${maxPx}px)`
}

const heroTitleSize = fluid(40, 100) // 主標題
const sectionTitleSize = fluid(12, 30) // 三級標題
const noteTextSize = fluid(11, 16) // 小標題 — used for the "20:00 前" note only
const faqBodyTextSize = fluid(12, 20) // FAQ accordion content — no desktop
// spec was given (only the 11px mobile 小標題 style), and that read as too
// small once expanded on a real screen, so this reads closer to body copy.
const dateTextSize = fluid(14, 35) // 副標題
const dayLabelSize = fluid(5, 20) // day-of-week text inside the circle badge
const circleSize = fluid(13, 54)
const cardRadius = fluid(27, 169)
const cardPadding = fluid(20, 48)
const cardGapX = fluid(8, 24) // gap either side of the divider
const cardGapY = fluid(8, 24) // gap between date rows

// Empirically measured (via rendered getBoundingClientRect, not derived from
// a formula) gap between the 08.06 and 08.19 circles at the 390/1460 Figma
// breakpoints — see DateBadge's circleOffset. Purely a visual nudge for the
// one badge whose column is heightened by the "20:00 前" note.
const endCircleOffset = fluid(9.25, 13)

// Toggle icon's own box — mobile stays close to its original small size,
// desktop scales up to match the Figma reference more closely. 17.5/20 and
// 24.5/28 both preserve the icon's native 31.5:36 aspect ratio.
const toggleIconHeight = fluid(20, 28)
const toggleIconWidth = fluid(17.5, 24.5)

// Same +/− glyph as MobileNavMenu's ToggleIcon, duplicated locally rather
// than exported/shared — this page's accordion opens by index instead of by
// group label, so the two components don't otherwise share state shape.
// Unlike MobileNavMenu's version, the vertical stroke animates out (scale-y)
// instead of unmounting, so + smoothly turns into − rather than popping.
function ToggleIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      viewBox="0 0 31.5 36"
      className="shrink-0 text-white"
      style={{ height: toggleIconHeight, width: toggleIconWidth }}
    >
      <line x1="0" y1="17.5" x2="31.5" y2="17.5" stroke="currentColor" />
      <line
        x1="16.25"
        y1="0"
        x2="16.25"
        y2="36"
        stroke="currentColor"
        className={`origin-center transition-transform duration-300 ease-out ${expanded ? 'scale-y-0' : 'scale-y-100'}`}
      />
    </svg>
  )
}

// TODO: swap in the real document URLs once legal/organizers provide them.
function LegalLink({
  href = '#',
  children,
}: {
  href?: string
  children: ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[#a5bde2] underline decoration-from-font"
    >
      {children}
    </a>
  )
}

function List({ children }: { children: ReactNode }) {
  return <ul className="list-disc space-y-1 pl-5">{children}</ul>
}

interface FaqSection {
  title: string
  content: ReactNode
}

// Full text content pulled from the mobile accordion component (node
// 1211:61714), which is the only variant in the Figma file with every
// section's expanded copy — the desktop frame (104:327) only shows the
// collapsed row.
const FAQ_SECTIONS: FaqSection[] = [
  {
    title: '報名費用',
    content: (
      <div className="space-y-2">
        <p>$ 1000／人（另收取保證金 $ 200）</p>
        <List>
          <li>
            跨域組隊：隊伍成員每人減免 $ 100
            <List>
              <li>報名隊伍內有三個（含）以上不同科系</li>
              <li>
                限創客交流組：該組內含高中職、大專院校生或碩博生、社會人士兩種（含）以上身份別之參賽者
              </li>
            </List>
          </li>
          <li>收費含餐食與娛樂活動、場地清潔、保險、文宣品、紀念 T 恤等</li>
        </List>
      </div>
    ),
  },
  {
    title: '保證金制度',
    content: (
      <div className="space-y-2">
        <p>若有以下情事，主辦單位將酌情不予退還個人之保證金：</p>
        <List>
          <li>
            未有特殊理由之隊伍，隊內無人參加錄取企業或新竹市府所辦理之賽前工作坊（若企業有開放線上參與，則隊內須至少一人參與線上或實體之賽前工作坊）
          </li>
          <li>
            未確實完成本活動之開、閉幕式或無故遲到超過 20
            分鐘者（以簽到、簽退手續為準）
          </li>
          <li>在活動場地違規飲食者，經工作人員勸導超過 3 次</li>
          <li>於活動期間，破壞任何活動場地內的設備，且必要時需負理賠責任</li>
          <li>未於組別 Demo 規定時間報到、登記、上傳簡報檔者</li>
          <li>
            未遵守現場工作人員指示使用娛樂交流區相關設施者，且必要時需自負賠償責任
          </li>
          <li>擅自進入本活動場域內非開放之管制空間者</li>
        </List>
      </div>
    ),
  },
  {
    title: '報名資格',
    content: (
      <div className="space-y-2">
        <p>
          黑客組：全台大專院校生以及碩博士生，每隊至少需有一人員具備使用企業提供之資源的能力，黑客組全面不允許影片
          Demo。
        </p>
        <p>
          創客交流組：高中職、大專院校及碩博士、社會人士皆可報名，參賽者需於比賽
          Demo 時讓評審實際操作作品。
        </p>
        <p>（參考工具：figma、Miro、Webflow、Sketch）</p>
      </div>
    ),
  },
  {
    title: '報名方式',
    content: (
      <div className="space-y-2">
        <p>採自行報名組隊，梅竹黑客松提供臉書媒合社群供大家找隊友</p>
        <p>黑客組：每隊 3~5 人</p>
        <p>創客交流組：每隊 3~5 人</p>
        <List>
          <li>
            分為兩種報名渠道：黑客創客混合報名、創客交流組獨立報名
            <List>
              <li>黑客組報名採志願排序制，須將創客交流組加入排序中</li>
            </List>
          </li>
          <li>若黑客組之單一企業超額，將採亂數分發</li>
          <li>
            創客交流組需於工作坊後提交一頁式企劃方案，參賽者務必參加工作坊以完成選題程序。
            <List>
              <li>
                一頁式企劃方案僅供新竹市政府了解貴隊伍之初步構思，無需過多之用意
              </li>
            </List>
          </li>
        </List>
      </div>
    ),
  },
  {
    title: '其他注意事項',
    content: (
      <List>
        <li>
          報名之隊伍需在報名手續最末同意「
          <LegalLink href="https://drive.google.com/file/d/1QQjxcHVbZXQNqMOD6qqtrjNG3nGVG6Sj/view?pli=1">
            智慧財產權聲明暨肖像授權
          </LegalLink>
          」相關條款。
        </li>
        <li>
          報名錄取的隊伍在繳費成功後請務必仔細閱讀正取信內容，依照信件內容完成所有報名流程；同時，一併於信件提供之表單內回傳隊伍中「每一位」參賽者簽署之「
          <LegalLink href="https://drive.google.com/file/d/1QQjxcHVbZXQNqMOD6qqtrjNG3nGVG6Sj/view?pli=1">
            個人資料蒐集聲明同意書
          </LegalLink>
          」。
        </li>
        <li>
          2026
          梅竹黑客松並不包含過夜的活動，請參賽者在離開會場後自行處理住宿問題。
        </li>
        <li>若報名人數超過活動最大人數上限，將依照報名先後順序錄取。</li>
        <li>
          為保護梅竹黑客松協辦企業之權益，參賽者必須配合參賽之企業組別所提出比賽過程之保密協定簽署，若無法配合企業之保密協定，將取消參賽資格。
        </li>
        <li>
          得獎同學需將作品上傳至
          <LegalLink href="https://discordapp.com/channels/1458723060487028758/1519006739427623034/1532049671940472986">
            梅竹黑客松成果存放平台
          </LegalLink>
          。
        </li>
      </List>
    ),
  },
]

function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="animate-fade-in">
      {FAQ_SECTIONS.map((section, i) => {
        const expanded = openIndex === i
        return (
          <div
            key={section.title}
            className={`border-white/70 ${expanded ? '' : 'border-b'}`}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(expanded ? null : i)}
              aria-expanded={expanded}
              className="flex w-full items-center justify-between border-b border-white/70 px-3 py-2 text-left transition-opacity hover:opacity-70 md:py-5"
            >
              <span
                className="font-noto font-normal text-white"
                style={{ fontSize: sectionTitleSize }}
              >
                {section.title}
              </span>
              <ToggleIcon expanded={expanded} />
            </button>
            {/* grid-rows 0fr→1fr animates height without a measured pixel
                value — content stays mounted (never unmounts on collapse)
                so the row height it needs is always available to animate to. */}
            <div
              className="grid transition-[grid-template-rows] duration-300 ease-out"
              style={{ gridTemplateRows: expanded ? '1fr' : '0fr' }}
            >
              <div className="overflow-hidden">
                <div
                  className="font-noto px-3 pt-5 pb-5 leading-relaxed text-[#f6f6f6] md:pb-8"
                  style={{ fontSize: faqBodyTextSize }}
                >
                  {section.content}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// A date + weekday badge, e.g. "08.06 (Thu)" — mirrors the dotted-circle
// badges in the Figma timeline card (node 107:335 etc).
//
// circleOffset nudges ONLY the circle down via relative positioning (not
// the date text, not the row it sits in) — used to correct the 08.19
// badge, whose circle otherwise sits higher than 08.06's because the
// "20:00 前" note below it makes that column the tallest thing in its
// row, so the row's items-center has nothing to center it against.
function DateBadge({
  date,
  day,
  circleOffset,
}: {
  date: string
  day: string
  circleOffset?: string
}) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="font-zen text-white" style={{ fontSize: dateTextSize }}>
        {date}
      </span>
      <span
        className="font-zen relative flex items-center justify-center rounded-full border border-white text-white"
        style={{
          width: circleSize,
          height: circleSize,
          fontSize: dayLabelSize,
          top: circleOffset,
        }}
      >
        {day}
      </span>
    </span>
  )
}

interface DateItem {
  date: string
  day: string
  startNote?: string
  endDate?: string
  endDay?: string
  note?: string
  label: string
}

// Sequence matches the reference screenshots exactly, which turned out to be
// the SAME order at both breakpoints — this earlier draft wrongly assumed
// mobile interleaved four items that desktop paired into two columns.
const DATE_ITEMS: DateItem[] = [
  {
    date: '08.06',
    day: 'Thu',
    startNote: '12:00 起',
    endDate: '08.19',
    endDay: 'Wed',
    note: '20:00 前',
    label: '開始報名',
  },
  { date: '08.20', day: 'Mon', label: '正備取隊伍與所屬企業公布' },
  {
    date: '08.20',
    day: 'Thu',
    endDate: '08.23',
    endDay: 'Sun',
    label: '繳費期間',
  },
  { date: '08.25', day: 'Tue', label: '備取遞補日' },
]

// A short connecting line between the two ends of a date range (node
// 107:330/107:307 "分隔線") — a real stroke, not a dash character, so it
// reads as one continuous range rather than two unrelated dates.
//
// The note (e.g. "20:00 前") sits on its own fixed line directly under the
// END date specifically (matching the reference render), not centered
// under the whole row. It used to be inline via flex-wrap, which fit below
// 1460px viewport width (fluid text was still shrinking) but broke once
// sizing hit its max plateau past 1460px, widening the row just enough to
// force an unpredictable wrap — a fixed line doesn't shift.
//
// Single dates (08.24, 08.25) sit in the same horizontal slot a range's END
// date would occupy — closer to the divider, not flush left with
// 08.06/08.20 — matching the reference at both breakpoints (node 1221:61439
// confirmed mobile uses this same dates|divider|labels layout, just
// smaller, not a stacked single column). An invisible copy of a
// start-badge + connector reserves that width without hardcoding a pixel
// value that could drift from the real fluid badge size.
function DateRange({ item }: { item: DateItem }) {
  const hasRange = Boolean(item.endDate && item.endDay)
  return (
    <div className="flex flex-nowrap items-center gap-2">
      {hasRange ? (
        <>
          <div className="flex flex-col gap-0.5">
            <DateBadge
              date={item.date}
              day={item.day}
              circleOffset={
                item.startNote && !item.note ? endCircleOffset : undefined
              }
            />
            {item.startNote && (
              <span
                className="text-white/80"
                style={{ fontSize: noteTextSize }}
              >
                {item.startNote}
              </span>
            )}
          </div>
          <span className="h-px w-6 shrink-0 bg-white/50 md:w-9" />
          <div className="flex flex-col gap-0.5">
            <DateBadge
              date={item.endDate!}
              day={item.endDay!}
              circleOffset={
                item.note && !item.startNote ? endCircleOffset : undefined
              }
            />
            {item.note && (
              <span
                className="text-white/80"
                style={{ fontSize: noteTextSize }}
              >
                {item.note}
              </span>
            )}
          </div>
        </>
      ) : (
        <>
          <span
            aria-hidden="true"
            className="invisible flex flex-nowrap items-center gap-2"
          >
            <DateBadge date={item.date} day={item.day} />
            <span className="h-px w-6 shrink-0 md:w-9" />
          </span>
          <DateBadge date={item.date} day={item.day} />
          {item.note && (
            <span className="text-white/80" style={{ fontSize: noteTextSize }}>
              {item.note}
            </span>
          )}
        </>
      )}
    </div>
  )
}

function DateLabel({ children }: { children: ReactNode }) {
  return (
    <span
      className="font-noto font-semibold text-white"
      style={{ fontSize: sectionTitleSize }}
    >
      {children}
    </span>
  )
}

// The frosted-glass timeline card (node 105:2131 desktop / 136:73 mobile) —
// one dates|divider|labels grid at every size, not two different layouts
// swapped at a breakpoint. Mobile (node 1221:61439) turned out to use the
// exact same column structure as desktop, just at fluid-scaled sizes, not
// the stacked single-column layout this used to render below md.
function DateCard() {
  return (
    <div
      className="animate-fade-in relative mx-auto w-full max-w-[984px] overflow-hidden border border-white/20 shadow-[0px_10px_30px_0px_rgba(0,0,0,0.25)] backdrop-blur-[35px]"
      style={{ borderRadius: cardRadius }}
    >
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundColor: 'rgba(0,0,0,0.35)',
          backgroundImage:
            'linear-gradient(117deg, rgba(255,255,255,0.14) 7.5%, rgba(255,255,255,0.028) 93.1%)',
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 rounded-[inherit] shadow-[inset_0px_1px_8px_0px_rgba(255,255,255,0.5)]"
      />

      {/* Grid, not two independent flex columns — the first row's date is
          taller than its label (the "20:00 前" note adds a line only on
          the dates side), and two separate flex columns with
          justify-between size each column's gaps off its OWN total height,
          so that one taller row throws every later row out of alignment
          between the columns. A shared grid row per item can't drift like
          that — both cells in a row are always exactly as tall as the
          taller of the two.
          Dates and labels columns are equal (1fr each) so the divider
          between them sits at the card's true horizontal center, with each
          side's content justified toward it (dates right-aligned, labels
          already left-aligned by default) — hugging the divider without
          relying on an off-center auto-width column to pull it there. */}
      <div
        className="relative grid grid-cols-[1fr_auto_1fr] items-center"
        style={{
          padding: cardPadding,
          columnGap: cardGapX,
          rowGap: cardGapY,
        }}
      >
        {DATE_ITEMS.map((item, i) => (
          <div
            key={item.label}
            className="justify-self-end"
            style={{ gridColumn: 1, gridRow: i + 1 }}
          >
            <DateRange item={item} />
          </div>
        ))}
        {/* self-stretch overrides the grid's items-center — without it this
            item (empty, no intrinsic height) sizes to 0 and centers inside
            its 4-row span instead of filling it, rendering invisible. */}
        <div
          className="self-stretch bg-white/30"
          style={{
            gridColumn: 2,
            gridRow: `1 / span ${DATE_ITEMS.length}`,
            width: '1px',
          }}
        />
        {DATE_ITEMS.map((item, i) => (
          <div key={item.label} style={{ gridColumn: 3, gridRow: i + 1 }}>
            <DateLabel>{item.label}</DateLabel>
          </div>
        ))}
      </div>
    </div>
  )
}

// 報名方式 — registration method / FAQ page (node 104:327). Two anchor ids
// (報名時程 / 報名資訊) match the hash links MobileNavMenu's "報名方式" group
// already points at (/registration#報名時程, /registration#報名資訊).
export default function RegistrationMethodView() {
  return (
    <div className="relative bg-[#040000]">
      <Navbar />

      {/* One shared, overlapping background pair for both sections — not
          two images each confined to (and cut off at) their own section.
          Figma's own layering does the same: 背景 covers y 0–1024 and 背景2
          covers y 725–3027, a 300px overlap that blends the two together.
          Mask fades reproduce that cross-fade instead of a hard seam. */}
      <div className="relative isolate overflow-clip">
        <img
          data-trail-bg="registration"
          src={bgHero}
          alt=""
          className="absolute inset-x-0 top-0 -z-10 h-[100vh] w-full object-cover"
          style={{
            maskImage:
              'linear-gradient(to bottom, black 55%, transparent 100%)',
            WebkitMaskImage:
              'linear-gradient(to bottom, black 55%, transparent 100%)',
          }}
        />
        {/* top+bottom (no explicit height) instead of a fixed vh height —
            content length is dynamic (accordion state, footer), so a fixed
            height fell short and left the footer sitting on the plain
            bg-[#040000] fallback instead of the nebula backdrop. Anchoring
            to bottom-0 keeps it covering all the way down regardless, same
            fix as ScheduleView's footer-positioning bug. The <img> itself
            can't be the positioned element for this — a replaced element
            with top+bottom set but no explicit height uses its own
            intrinsic aspect ratio instead of stretching, silently ignoring
            `bottom`. Wrapping it in a <div> (not replaced, so it does
            stretch) and sizing the <img> to h-full/w-full inside fixes it. */}
        <div
          className="absolute inset-x-0 bottom-0 -z-10"
          style={{
            top: '45vh',
            maskImage:
              'linear-gradient(to bottom, transparent 0%, black 300px)',
            WebkitMaskImage:
              'linear-gradient(to bottom, transparent 0%, black 300px)',
          }}
        >
          <img
            data-trail-bg="registration"
            src={bgContent}
            alt=""
            className="sticky top-0 h-[100dvh] w-full object-cover"
          />
        </div>

        <div className="relative -z-10">
          <CursorTrail bgSelector="[data-trail-bg='registration']" />
        </div>

        <section
          id="報名時程"
          className="relative flex flex-col items-center px-6 pt-28 pb-16 md:pt-36 md:pb-20"
        >
          <h1
            className="glow-text font-zen animate-fade-in relative mb-10 text-center text-[#f6f6f6] md:mb-16"
            style={{ fontSize: heroTitleSize }}
          >
            報名方式
          </h1>
          <DateCard />
        </section>

        <section id="報名資訊" className="relative px-6 py-16 md:px-0 md:py-24">
          <div className="mx-auto max-w-[973px]">
            <FaqAccordion />
          </div>
        </section>

        <Footer />
      </div>
    </div>
  )
}
