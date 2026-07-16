import { useState, type ReactNode } from 'react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import StarField from '../components/layout/StarField'
import bgHero from '../assets/RegistrationMethod/bg-hero.jpg'
import bgContent from '../assets/RegistrationMethod/bg-content.jpg'

// Same +/− glyph as MobileNavMenu's ToggleIcon, duplicated locally rather
// than exported/shared — this page's accordion opens by index instead of by
// group label, so the two components don't otherwise share state shape.
function ToggleIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg viewBox="0 0 12 12" className="size-3 shrink-0 text-white">
      <path
        d="M1 6h10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {!expanded && (
        <path
          d="M6 1v10"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      )}
    </svg>
  )
}

// TODO: swap in the real document URLs once legal/organizers provide them.
function LegalLink({ children }: { children: ReactNode }) {
  return (
    <a href="#" className="text-[#a5bde2] underline decoration-from-font">
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
        <p>＄1000／人（另收取保證金 $100）</p>
        <List>
          <li>
            跨域組隊：隊伍成員每人減免＄100
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
          <LegalLink>智慧財產權聲明暨肖像授權</LegalLink>
          」相關條款。
        </li>
        <li>
          報名錄取的隊伍在繳費成功後請務必仔細閱讀正取信內容，依照信件內容完成所有報名流程；同時，一併於信件提供之表單內回傳隊伍中「每一位」參賽者簽署之「
          <LegalLink>個人資料蒐集聲明同意書</LegalLink>」。
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
          得獎同學需將作品上傳至<LegalLink>梅竹黑客松成果存放平台</LegalLink>。
        </li>
      </List>
    ),
  },
]

function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="divide-y divide-white/20 border-y border-white/20">
      {FAQ_SECTIONS.map((section, i) => {
        const expanded = openIndex === i
        return (
          <div key={section.title}>
            <button
              type="button"
              onClick={() => setOpenIndex(expanded ? null : i)}
              aria-expanded={expanded}
              className="flex w-full items-center justify-between py-4 text-left md:py-6"
            >
              <span className="font-noto text-lg font-semibold text-white md:text-2xl">
                {section.title}
              </span>
              <ToggleIcon expanded={expanded} />
            </button>
            {expanded && (
              <div className="font-noto pb-5 text-sm leading-relaxed text-[#f6f6f6] md:pb-8 md:text-base">
                {section.content}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// A date + weekday badge, e.g. "08.06 (Thu)" — mirrors the dotted-circle
// badges in the Figma timeline card (node 107:335 etc).
function DateBadge({ date, day }: { date: string; day: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="font-zen text-2xl text-white md:text-3xl">{date}</span>
      <span className="font-zen flex size-9 items-center justify-center rounded-full border border-white text-xs text-white md:size-11 md:text-sm">
        {day}
      </span>
    </span>
  )
}

function DateRow({
  date,
  day,
  endDate,
  endDay,
  note,
  label,
}: {
  date: string
  day: string
  endDate?: string
  endDay?: string
  note?: string
  label: string
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
      <div className="flex flex-wrap items-baseline gap-2">
        <DateBadge date={date} day={day} />
        {endDate && endDay && (
          <>
            <span className="text-white/60">—</span>
            <DateBadge date={endDate} day={endDay} />
          </>
        )}
        {note && <span className="text-sm text-white/80">{note}</span>}
      </div>
      <span className="font-noto text-lg font-semibold text-white md:text-2xl">
        {label}
      </span>
    </div>
  )
}

// The frosted-glass timeline card (node 105:2131) — split into two columns
// by a vertical divider on desktop, stacked on mobile.
function DateCard() {
  return (
    <div
      className="relative mx-auto flex w-full max-w-[984px] flex-col gap-6 rounded-[40px] border border-white/20 bg-gradient-to-br from-white/[0.14] to-white/[0.03] p-6 shadow-[0px_10px_30px_0px_rgba(0,0,0,0.25)] backdrop-blur-[35px] sm:p-8 md:flex-row md:gap-0 md:rounded-[169px] md:p-12"
      style={{
        boxShadow:
          'inset 0px 1px 8px 0px rgba(255,255,255,0.5), 0px 10px 30px 0px rgba(0,0,0,0.25)',
      }}
    >
      <div className="flex flex-1 flex-col justify-center gap-6">
        <DateRow
          date="08.06"
          day="Thu"
          endDate="08.19"
          endDay="Wed"
          note="20:00 前"
          label="開始報名"
        />
        <DateRow
          date="08.20"
          day="Thu"
          endDate="08.23"
          endDay="Sun"
          label="繳費期間"
        />
      </div>
      <div className="hidden w-px self-stretch bg-white/30 md:mx-10 md:block" />
      <div className="my-2 h-px w-full bg-white/30 md:hidden" />
      <div className="flex flex-1 flex-col justify-center gap-6">
        <DateRow date="08.24" day="Mon" label="正備取隊伍與所屬企業公布" />
        <DateRow date="08.25" day="Tue" label="備取遞補日" />
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

      <section
        id="報名時程"
        className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6 pt-32 pb-20"
      >
        <img
          src={bgHero}
          alt=""
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <StarField count={20} seed={1046} />
        <h1 className="glow-text font-zen relative mb-16 text-center text-6xl text-[#f6f6f6] md:mb-24 md:text-8xl">
          報名方式
        </h1>
        <DateCard />
      </section>

      <section
        id="報名資訊"
        className="relative overflow-hidden px-6 py-20 md:px-0"
      >
        <img
          src={bgContent}
          alt=""
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div className="mx-auto max-w-[973px]">
          <FaqAccordion />
        </div>
      </section>

      <Footer />
    </div>
  )
}
