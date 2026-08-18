import { Fragment, useState } from 'react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import ExpandableItem from '../components/registration/ExpandableItem'

// Dates from design/報名方式(電腦版).png — confirm row 2 with organizers:
// the mock shows 08.11–08.24 but in 2025 公布 happened after 報名 closed.
const SCHEDULE_ROWS = [
  {
    start: '08.11',
    startDay: 'Mon',
    end: '08.24',
    endDay: 'Sun',
    label: '開始報名',
  },
  {
    start: '08.11',
    startDay: 'Mon',
    end: '08.24',
    endDay: 'Sun',
    label: '正取隊伍與所屬企業公布',
  },
  {
    start: '08.25',
    startDay: 'Mon',
    end: '08.28',
    endDay: 'Thu',
    label: '繳費期間',
  },
  {
    start: '08.29',
    startDay: 'Fri',
    end: '08.30',
    endDay: 'Sat',
    label: '備取遞補期間',
  },
]

function DayBadge({ day }: { day: string }) {
  return (
    <span className="font-zen inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/70 text-xs">
      {day}
    </span>
  )
}

// Left side of the divider: date range with day badges
function ScheduleDates({
  start,
  startDay,
  end,
  endDay,
}: {
  start: string
  startDay: string
  end: string
  endDay: string
}) {
  return (
    <div className="font-zen flex items-center gap-1 text-2xl md:text-3xl">
      {/* fixed-width date cells so the day badges line up across rows */}
      <span className="w-[4.6ch]">{start}</span>
      <DayBadge day={startDay} />
      <span className="inline-block h-px w-6 bg-white/70" />
      <span className="w-[4.6ch]">{end}</span>
      <DayBadge day={endDay} />
    </div>
  )
}

// Right side of the divider: Chinese event label
function ScheduleLabel({ label }: { label: string }) {
  return <p className="text-xl font-bold md:text-2xl">{label}</p>
}

export default function RegistrationView() {
  // one accordion item open at a time (same behavior as the 2025 site)
  const [openItem, setOpenItem] = useState<string | null>(null)
  const toggle = (title: string) =>
    setOpenItem((current) => (current === title ? null : title))
  const itemProps = (title: string) => ({
    title,
    expanded: openItem === title,
    onToggle: () => toggle(title),
  })

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      {/* black backdrop, behind the -z-10 bg-2 layer */}
      <div className="fixed inset-0 -z-20 bg-black" />

      {/* bg-2 — starts partway into the hero, at its natural aspect ratio */}
      <div
        className="absolute inset-x-0 -z-10 bg-top bg-no-repeat"
        style={{
          backgroundImage: 'url(/bg-2.png)',
          backgroundSize: '100% auto',
          top: '55vh',
          bottom: 0,
        }}
      />

      <Navbar />

      {/* Hero — bg-1 overlays the top viewport, fading into bg-2 below */}
      <section className="relative flex h-screen items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(/bg-1.png)',
            maskImage:
              'linear-gradient(to bottom, black 55%, transparent 100%)',
            WebkitMaskImage:
              'linear-gradient(to bottom, black 55%, transparent 100%)',
          }}
        />
        <h1 className="glow-text-subtle font-zen relative z-10 text-6xl tracking-widest md:text-9xl">
          報名方式
        </h1>
      </section>

      {/* Content — schedule + collapsibles sit on top of bg-2 */}
      <div className="relative">
        <main className="relative z-10 mx-auto max-w-4xl px-6 pt-24">
          {/* Schedule card */}
          <section className="mx-auto max-w-[720px] rounded-[100px] border border-white/20 bg-white/10 px-3 py-20 shadow-[0_0_60px_rgba(122,144,226,0.15)] backdrop-blur-md md:px-4">
            <div className="grid gap-y-8 md:grid-cols-[auto_1px_auto] md:items-center md:justify-center md:gap-x-10">
              {/* single vertical divider spanning all rows */}
              <div
                className="hidden self-stretch bg-white/60 md:col-start-2 md:block md:w-px"
                style={{ gridRow: `1 / span ${SCHEDULE_ROWS.length}` }}
              />
              {SCHEDULE_ROWS.map((row) => (
                <Fragment key={row.label}>
                  <div className="md:col-start-1">
                    <ScheduleDates
                      start={row.start}
                      startDay={row.startDay}
                      end={row.end}
                      endDay={row.endDay}
                    />
                  </div>
                  <div className="md:col-start-3">
                    <ScheduleLabel label={row.label} />
                  </div>
                </Fragment>
              ))}
            </div>
          </section>

          {/* Expandable info sections */}
          <section className="mx-auto mt-24 flex max-w-3xl flex-col gap-6">
            <ExpandableItem {...itemProps('報名費用')}>
              <p className="font-bold">＄900／人（含保證金 ＄200）</p>
              <ul className="mt-2 list-disc space-y-1 pl-6">
                <li>
                  跨域組隊：隊伍成員每人減免＄100
                  <ul className="mt-1 list-[circle] space-y-1 pl-6">
                    <li>報名隊伍內有三個（含）以上不同科系</li>
                    <li>
                      限創客交流組：該組內含高中職、大專院校生或碩博生、社會人士兩種（含）以上身份別之參賽者
                    </li>
                  </ul>
                </li>
                <li>
                  收費含餐食與娛樂活動、場地清潔、保險、文宣品、紀念 T 恤等
                </li>
              </ul>
            </ExpandableItem>

            <ExpandableItem {...itemProps('保證金制度')}>
              <p>若有以下情事，主辦單位將酌情不予退還個人之保證金：</p>
              <ul className="mt-2 list-disc space-y-1 pl-6">
                <li>
                  未有特殊理由之隊伍，隊內無人參加錄取企業或新竹市府所辦理之賽前工作坊（若企業有開放線上參與，則隊內須至少一人參與線上或實體之賽前工作坊）
                </li>
                <li>
                  未確實完成本活動之開、閉幕式或無故遲到超過 20
                  分鐘者（以簽到、簽退手續為準）
                </li>
                <li>在活動場地違規飲食者，經工作人員勸導超過 3 次</li>
                <li>
                  於活動期間，破壞任何活動場地內的設備，且必要時需負理賠責任
                </li>
                <li>未於組別 Demo 規定時間報到、登記、上傳簡報檔者</li>
                <li>
                  未遵守現場工作人員指示使用娛樂交流區相關設施者，且必要時需自負賠償責任
                </li>
                <li>擅自進入本活動場域內非開放之管制空間者</li>
              </ul>
            </ExpandableItem>

            <ExpandableItem {...itemProps('報名資格')}>
              <p>
                黑客組：全台大專院校生以及碩博士生，每隊至少需有一人員具備使用企業提供之資源的能力，黑客組全面不允許影片
                Demo。
              </p>
              <p className="mt-2">
                創客交流組：高中職、大專院校及碩博士、社會人士皆可報名，參賽者需於比賽
                Demo
                時讓評審實際操作作品。（參考工具：figma、Miro、Webflow、Sketch）
              </p>
            </ExpandableItem>

            <ExpandableItem {...itemProps('報名方式')}>
              <p>採自行報名組隊，梅竹黑客松提供 臉書媒合社群 供大家找隊友</p>
              <p className="mt-1">黑客組：每隊 3~5 人</p>
              <p>創客交流組：每隊 3~5 人</p>
              <ul className="mt-2 list-disc space-y-1 pl-6">
                <li>
                  分為兩種報名渠道：黑客創客混合報名、創客交流組獨立報名
                  <ul className="mt-1 list-[circle] space-y-1 pl-6">
                    <li>黑客組報名採志願排序制，須將創客交流組加入排序中</li>
                  </ul>
                </li>
                <li>若黑客組之單一企業超額，將採亂數分發</li>
                <li>
                  創客交流組另需提交一頁式企劃方案，方完成報名手續
                  <ul className="mt-1 list-[circle] space-y-1 pl-6">
                    <li>
                      黑客創客混合報名之志願序排列，若將創客交流組志願序排至前三（含），亦需繳交一頁式企劃方案
                    </li>
                    <li>
                      一頁式企劃方案僅供新竹市政府了解貴隊伍之初步構思，無篩選之用意
                    </li>
                  </ul>
                </li>
              </ul>
            </ExpandableItem>

            <ExpandableItem {...itemProps('其他注意事項')}>
              <ul className="list-disc space-y-1 pl-6">
                <li>
                  報名之隊伍需在報名手續最末同意「智慧財產權聲明暨肖像授權」相關條款。
                </li>
                <li>
                  報名錄取的隊伍在繳費成功後請務必仔細閱讀正取信內容，依照信件內容完成所有報名流程；同時，一併於信件提供之表單內回傳隊伍中「每一位」參賽者簽署之「個人資料蒐集聲明同意書」。
                </li>
                <li>
                  2026
                  梅竹黑客松並不包含過夜的活動，請參賽者在離開會場後自行處理住宿問題。
                </li>
                <li>
                  若報名人數超過活動最大人數上限，將綜合考量報名先後順序及參賽者經歷（自介、參加動機、專案、競賽經歷）進行錄取。
                </li>
                <li>
                  為保護梅竹黑客松協辦企業之權益，參賽者必須配合參賽之企業組別所提出比賽程之保密協定簽署，若無法配合企業之保密協定，將取消參賽資格。
                </li>
                <li>得獎同學需將作品上傳至 梅竹黑客松成果存放平台。</li>
              </ul>
            </ExpandableItem>
          </section>
          {/* blank space before footer */}
          <div className="h-40" />
        </main>
      </div>

      <Footer />
    </div>
  )
}
