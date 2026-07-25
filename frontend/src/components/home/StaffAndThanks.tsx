import { useState } from 'react'
import staffAdmin from '../../assets/home/staff-admin.jpg'
import staffMarketing from '../../assets/home/staff-marketing.jpg'
import staffPr from '../../assets/home/staff-pr.jpg'
import staffEvents from '../../assets/home/staff-events.jpg'
import staffFinance from '../../assets/home/staff-finance.jpg'
import staffDesign from '../../assets/home/staff-design.jpg'
import staffDev from '../../assets/home/staff-dev.jpg'

const DEPARTMENTS = [
  '行政部',
  '行銷部',
  '公關部',
  '活動部',
  '財務部',
  '設計部',
  '開發部',
] as const

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
    <p className="staff-section-title text-center font-['Zen_Antique'] text-2xl text-[#b1a2ca] [text-shadow:0px_0px_20px_rgba(255,255,255,0.35),0px_4px_40px_rgba(255,255,255,0.2)] md:text-[35px]">
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

  return (
    <div className="staff-and-thanks mx-auto flex w-full max-w-[1113px] flex-col items-center gap-16 px-6 py-16 md:gap-[80px]">
      <div className="thanks-block flex flex-col items-center gap-8 text-center md:gap-[48px]">
        <p className="font-['Zen_Antique'] text-2xl text-[#b1a2ca] [text-shadow:0px_0px_20px_rgba(255,255,255,0.5),0px_4px_40px_rgba(255,255,255,0.5)] md:text-[35px]">
          協辦單位
        </p>
        <div className="flex flex-col gap-2 text-xl text-[#4664AC] md:text-[40px]">
          <p>國立陽明交通大學資訊工程學系</p>
          <p>財團法人交大思源基金會</p>
        </div>
      </div>

      <div className="thanks-block flex flex-col items-center gap-8 text-center md:gap-[48px]">
        <p className="font-['Zen_Antique'] text-2xl text-[#b1a2ca] [text-shadow:0px_0px_20px_rgba(255,255,255,0.5),0px_4px_40px_rgba(255,255,255,0.5)] md:text-[35px]">
          特別感謝
        </p>
        <div className="flex flex-col gap-2 text-xl text-[#4664AC] md:text-[40px]">
          <p>國立陽明交通大學產學運籌中心</p>
          <p>國立陽明交通大學電機工程學系</p>
          <p>Colde Garage</p>
        </div>
      </div>

      <div className="media-block flex w-full max-w-[917px] flex-col items-center gap-8 md:gap-[49px]">
        <SectionTitle>企業廣告</SectionTitle>
        <div className="h-[300px] w-full bg-[#f4f5f5] md:h-[491px]" />
      </div>

      <div className="media-block flex w-full max-w-[917px] flex-col items-center gap-8 md:gap-[49px]">
        <SectionTitle>YouTube影片</SectionTitle>
        <div className="h-[300px] w-full bg-[#f4f5f5] md:h-[491px]" />
      </div>

      <div
        id="staff"
        className="staff-desktop flex w-full flex-col items-center gap-8 md:gap-[48px]"
      >
        <SectionTitle>工作人員名單</SectionTitle>
        <div className="relative w-full">
          <div className="relative z-20 flex w-full items-end">
            {DEPARTMENTS.map((d) => (
              <button
                key={d}
                onClick={() => setDept(d)}
                className={`relative flex h-[42px] min-w-0 flex-1 cursor-pointer items-center justify-center rounded-t-[18px] px-1 text-xs leading-none font-semibold text-white transition-all duration-300 sm:h-[48px] sm:rounded-t-[24px] sm:text-base md:h-[52px] md:rounded-t-[30px] md:text-[24px] md:leading-[40px] ${
                  dept === d
                    ? 'z-20 bg-[linear-gradient(to_bottom,#d9cfea_0%,#b1a2ca_100%)] shadow-[0_-8px_24px_rgba(255,255,255,1),-7px_0_18px_rgba(255,255,255,0.7),7px_0_18px_rgba(255,255,255,0.55),inset_0_3px_8px_rgba(255,255,255,0.85)]'
                    : 'z-0 bg-[#b1a2ca]/75 shadow-[inset_0_2px_5px_rgba(255,255,255,0.28)] hover:bg-[#b1a2ca]/90'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          <div className="relative z-10 -mt-px flex min-h-[300px] flex-col items-start gap-8 rounded-b-[30px] bg-[#b1a2ca] p-8 shadow-[0_0_24px_rgba(255,255,255,0.95),0_8px_0_rgba(151,135,180,0.72),0_14px_28px_rgba(0,0,0,0.3),inset_1px_0_rgba(255,255,255,0.75),inset_-1px_0_rgba(255,255,255,0.75),inset_0_-1px_rgba(255,255,255,0.75)] sm:flex-row sm:items-center md:min-h-[347px] md:gap-[65px] md:px-[65px] md:py-[48px]">
            <img
              src={photo}
              alt={`${dept}合照`}
              className="h-[180px] w-full shrink-0 rounded-[30px] object-cover sm:w-[42%] md:h-[251px] md:w-[406px]"
            />
            <div className="flex min-w-0 flex-1 flex-col text-lg leading-[1.6] font-semibold text-[#4664ac] md:text-[25px] md:leading-[40px]">
              {members.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="staff-mobile">
        <SectionTitle>工作人員名單</SectionTitle>
        <div className="staff-mobile-list">
          {DEPARTMENTS.map((department) => {
            const expanded = mobileDept === department
            return (
              <div
                key={department}
                className={`staff-mobile-row ${expanded ? 'is-expanded' : ''}`}
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
  )
}
