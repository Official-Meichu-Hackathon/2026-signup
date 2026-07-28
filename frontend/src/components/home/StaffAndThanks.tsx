import { useState } from 'react'
import staffAdmin from '../../assets/home/staff-admin.webp'
import staffMarketing from '../../assets/home/staff-marketing.webp'
import staffPr from '../../assets/home/staff-pr.webp'
import staffEvents from '../../assets/home/staff-events.webp'
import staffFinance from '../../assets/home/staff-finance.webp'
import staffDesign from '../../assets/home/staff-design.webp'
import staffDev from '../../assets/home/staff-dev.webp'
import staffShape from '../../assets/home/staff-shape.svg'
import staffGlowAdmin from '../../assets/home/staff-tabs-bg.svg'
import staffGlowMarketing from '../../assets/home/staff-tabs-bg-marketing.svg'
import staffGlowPr from '../../assets/home/staff-tabs-bg-pr.svg'
import staffGlowEvents from '../../assets/home/staff-tabs-bg-events.svg'
import staffGlowFinance from '../../assets/home/staff-tabs-bg-finance.svg'
import staffGlowDesign from '../../assets/home/staff-tabs-bg-design.svg'
import staffGlowDev from '../../assets/home/staff-tabs-bg-dev.svg'

const DEPARTMENTS = [
  '行政部',
  '行銷部',
  '公關部',
  '活動部',
  '財務部',
  '設計部',
  '開發部',
] as const

const STAFF_MOBILE_ROW_TOPS = [0, 33, 63, 94, 125, 156, 186] as const
const STAFF_MOBILE_EXPANDED_OFFSET = 53

const STAFF_GLOWS: Record<(typeof DEPARTMENTS)[number], string> = {
  行政部: staffGlowAdmin,
  行銷部: staffGlowMarketing,
  公關部: staffGlowPr,
  活動部: staffGlowEvents,
  財務部: staffGlowFinance,
  設計部: staffGlowDesign,
  開發部: staffGlowDev,
}

const STAFF: Record<
  (typeof DEPARTMENTS)[number],
  { photo: string; members: string[] }
> = {
  行政部: {
    photo: staffAdmin,
    members: ['溫沛晨', '李若榆', '王傑宇'],
  },
  行銷部: {
    photo: staffMarketing,
    members: [
      '趙家亨 / 張芯綾 / 顏姿姍',
      '凌沛瀅 / 王菩嫻 / 呂欣晏 / 林益賢',
      '趙之安 / 莊喬宇',
    ],
  },
  公關部: {
    photo: staffPr,
    members: [
      '羅翊嘉 / 許家綺 / 吳季瑾',
      '吳沛蓁 / 吳沛恩 / 李芷俞 / 黃翊婷',
      '鄭皓云 / 楊予喬 / 洪維鎂',
    ],
  },
  活動部: {
    photo: staffEvents,
    members: [
      '劉子筠 / 歐蕙綸 / 吳欣諭',
      '紀晏甄 / 陳泓叡 / 潘顗涵 / 黃宥芯',
      '張君泠 / 羅浚齊',
    ],
  },
  財務部: {
    photo: staffFinance,
    members: ['黃嬿方 / 呂崧立', '劉姵均 / 賴玥宇 / 鄭家怡 / 薛楚蓁'],
  },
  設計部: {
    photo: staffDesign,
    members: ['陳琦青 / 許禕庭', '雲郁婷 / 嚴䒩閩 / 劉佳貞', '曾羽薇 / 陳皙倩'],
  },
  開發部: {
    photo: staffDev,
    members: ['陳芷妍 / 李聿宸', '江善有 / 黃新勝 / 陳芃錡 / 呂向荷'],
  },
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="staff-section-title text-center font-['Zen_Antique'] text-2xl text-[#b1a2ca] [text-shadow:0px_0px_20px_rgba(255,255,255,0.5),0px_4px_40px_rgba(255,255,255,0.5),0px_4px_50px_rgba(255,255,255,0.5)] md:text-[35px] md:leading-[44px]">
      {children}
    </p>
  )
}

export default function StaffAndThanks() {
  const [dept, setDept] = useState<(typeof DEPARTMENTS)[number]>('行政部')
  const [mobileDept, setMobileDept] = useState<
    (typeof DEPARTMENTS)[number] | null
  >(null)
  const { photo, members } = STAFF[dept]
  const mobileExpandedOffset =
    mobileDept === null
      ? 0
      : STAFF_MOBILE_EXPANDED_OFFSET -
        (3 - STAFF[mobileDept].members.length) * 14

  return (
    <div className="staff-and-thanks mx-auto flex w-full flex-col items-center gap-16 px-[clamp(48px,8vw,96px)] py-16 md:gap-[125px] md:py-0">
      <div className="thanks-block flex flex-col items-center gap-8 text-center md:w-[570px] md:gap-[50px]">
        <p className="font-['Zen_Antique'] text-2xl text-[#b1a2ca] md:text-[35px] md:leading-[44px]">
          協辦單位
        </p>
        <div className="flex flex-col gap-2 font-['Zen_Antique'] text-xl text-[#4664AC] md:text-[40px] md:leading-[44px]">
          <p>國立陽明交通大學資訊工程學系</p>
          <p>財團法人交大思源基金會</p>
        </div>
      </div>

      <div className="thanks-block flex flex-col items-center gap-8 text-center md:w-[570px] md:gap-[50px]">
        <p className="font-['Zen_Antique'] text-2xl text-[#b1a2ca] md:text-[35px] md:leading-[44px]">
          特別感謝
        </p>
        <div className="flex flex-col gap-2 font-['Zen_Antique'] text-xl text-[#4664AC] md:text-[40px] md:leading-[44px]">
          <p>國立陽明交通大學產學運籌中心</p>
          <p>國立陽明交通大學電機工程學系</p>
          <p>Colde Garage</p>
        </div>
      </div>

      <div className="media-block flex w-full max-w-[917px] flex-col items-center gap-8 md:gap-[50px]">
        <SectionTitle>YouTube影片</SectionTitle>
        <div className="h-[300px] w-full bg-[#f4f5f5] md:h-[491px]" />
      </div>

      <div
        id="staff"
        className="flex w-full max-w-[1177px] flex-col items-center"
      >
        <div className="staff-desktop flex w-full flex-col items-center gap-8 md:gap-[50px]">
          <SectionTitle>工作人員名單</SectionTitle>
          <div className="relative min-h-[407px] w-full">
            <img
              src={staffShape}
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 h-full w-full select-none"
            />

            {DEPARTMENTS.map((d) => (
              <img
                key={d}
                src={STAFF_GLOWS[d]}
                alt=""
                aria-hidden="true"
                className={`pointer-events-none absolute top-[-11.302%] left-[-4.46%] z-10 h-[122.604%] w-[108.207%] max-w-none transition-opacity duration-300 select-none ${
                  dept === d ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ))}

            <div
              className="absolute top-0 left-0 z-30 grid h-[63px] w-[87.51%] grid-cols-7"
              role="tablist"
              aria-label="工作人員部門"
            >
              {DEPARTMENTS.map((d) => (
                <button
                  key={d}
                  type="button"
                  role="tab"
                  aria-selected={dept === d}
                  onClick={() => setDept(d)}
                  className={`flex min-w-0 cursor-pointer items-center justify-center rounded-t-[30px] px-1 font-['Chiron_Hei_HK'] text-[24px] leading-none font-extrabold whitespace-nowrap text-white [text-shadow:0_1px_4px_rgba(255,255,255,0.35)] focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-white/90 ${
                    dept === d
                      ? 'bg-[linear-gradient(180deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0.07)_60%,rgba(255,255,255,0)_100%)] shadow-[inset_0_10px_20px_rgba(255,255,255,0.12)]'
                      : ''
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            <div className="relative z-20 flex min-h-[407px] w-[99.29%] items-center gap-[clamp(24px,5.84%,65px)] pt-[63px] pr-[clamp(24px,4vw,48px)] pb-2">
              <img
                src={photo}
                alt={`${dept}合照`}
                loading="lazy"
                decoding="async"
                className="ml-[clamp(24px,5.84%,65px)] h-[251px] w-[clamp(230px,36.48%,406px)] shrink-0 rounded-[30px] object-cover"
              />
              <div className="flex min-w-0 flex-1 flex-col text-[25px] leading-[40px] font-semibold text-[#4664ac]">
                {members.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="staff-mobile">
          <SectionTitle>工作人員名單</SectionTitle>
          <div
            className={`staff-mobile-list ${
              mobileDept === null ? '' : 'has-expanded'
            }`}
            style={
              mobileDept === null
                ? undefined
                : { height: 221 + mobileExpandedOffset }
            }
          >
            {DEPARTMENTS.map((department, index) => {
              const expanded = mobileDept === department
              const expandedIndex =
                mobileDept === null ? -1 : DEPARTMENTS.indexOf(mobileDept)
              const rowTop =
                STAFF_MOBILE_ROW_TOPS[index] +
                (expandedIndex >= 0 && index > expandedIndex
                  ? mobileExpandedOffset
                  : 0)

              return (
                <div
                  key={department}
                  className={`staff-mobile-row ${expanded ? 'is-expanded' : ''}`}
                  style={{ top: rowTop }}
                >
                  <button
                    type="button"
                    aria-expanded={expanded}
                    onClick={() => setMobileDept(expanded ? null : department)}
                  >
                    <span>{department}</span>
                    <span aria-hidden>{expanded ? '−' : '+'}</span>
                  </button>
                  {expanded && (
                    <div className="staff-mobile-members">
                      {STAFF[department].members.map((line) => (
                        <p key={line}>{line}</p>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
