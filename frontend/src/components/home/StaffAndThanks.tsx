import { useState } from 'react'
import staffAdmin from '../../assets/home/staff-admin.jpg'
import staffMarketing from '../../assets/home/staff-marketing.jpg'
import staffPr from '../../assets/home/staff-pr.jpg'
import staffEvents from '../../assets/home/staff-events.jpg'
import staffFinance from '../../assets/home/staff-finance.jpg'
import staffDesign from '../../assets/home/staff-design.jpg'
import staffDev from '../../assets/home/staff-dev.jpg'
import tabsGlow from '../../assets/home/staff-tabs-bg.svg'

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
    <p className="text-center font-['Zen_Antique'] text-2xl text-[#b1a2ca] [text-shadow:0px_0px_20px_rgba(255,255,255,0.35),0px_4px_40px_rgba(255,255,255,0.2)] md:text-[35px]">
      {children}
    </p>
  )
}

export default function StaffAndThanks() {
  const [dept, setDept] = useState<(typeof DEPARTMENTS)[number]>('行政部')
  const { photo, members } = STAFF[dept]

  return (
    <div className="mx-auto flex w-full max-w-[1113px] flex-col items-center gap-16 px-6 py-16 md:gap-[80px]">
      <div className="flex flex-col items-center gap-8 text-center md:gap-[48px]">
        <p className="font-['Zen_Antique'] text-2xl text-[#b1a2ca] [text-shadow:0px_0px_20px_rgba(255,255,255,0.5),0px_4px_40px_rgba(255,255,255,0.5)] md:text-[35px]">
          協辦單位
        </p>
        <div className="flex flex-col gap-2 text-xl text-[#b1a2ca] md:text-[40px]">
          <p>國立陽明交通大學資訊工程學系</p>
          <p>財團法人交大思源基金會</p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-8 text-center md:gap-[48px]">
        <p className="font-['Zen_Antique'] text-2xl text-[#b1a2ca] [text-shadow:0px_0px_20px_rgba(255,255,255,0.5),0px_4px_40px_rgba(255,255,255,0.5)] md:text-[35px]">
          特別感謝
        </p>
        <div className="flex flex-col gap-2 text-xl text-[#b1a2ca] md:text-[40px]">
          <p>國立陽明交通大學產學運籌中心</p>
          <p>國立陽明交通大學電機工程學系</p>
          <p>Colde Garage</p>
        </div>
      </div>

      <div className="flex w-full max-w-[917px] flex-col items-center gap-8 md:gap-[49px]">
        <SectionTitle>企業廣告</SectionTitle>
        <div className="h-[300px] w-full bg-[#f4f5f5] md:h-[491px]" />
      </div>

      <div className="flex w-full max-w-[917px] flex-col items-center gap-8 md:gap-[49px]">
        <SectionTitle>YouTube影片</SectionTitle>
        <div className="h-[300px] w-full bg-[#f4f5f5] md:h-[491px]" />
      </div>

      <div
        id="staff"
        className="flex w-full flex-col items-center gap-8 md:gap-[48px]"
      >
        <SectionTitle>工作人員名單</SectionTitle>
        <div className="relative w-full">
          <img
            src={tabsGlow}
            alt=""
            className="pointer-events-none absolute inset-0 -z-10 h-full w-full"
          />
          <div className="flex flex-wrap">
            {DEPARTMENTS.map((d) => (
              <button
                key={d}
                onClick={() => setDept(d)}
                className={`cursor-pointer rounded-t-2xl px-5 py-3 font-semibold text-white transition-colors ${
                  dept === d ? 'bg-[#b1a2ca]' : 'bg-[#b1a2ca]/50'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
          <div className="flex flex-col items-start gap-8 rounded-tr-[30px] rounded-b-[30px] bg-[#b1a2ca] p-8 sm:flex-row sm:items-center md:p-12">
            <img
              src={photo}
              alt={`${dept}合照`}
              className="h-[150px] w-full max-w-[260px] shrink-0 rounded-[30px] object-cover"
            />
            <div className="flex flex-col gap-1 text-lg font-semibold text-[#4664ac]">
              {members.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
